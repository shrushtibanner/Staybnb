import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";
import { spawnSync } from "node:child_process";

const projectId = process.env.FIREBASE_PROJECT_ID || "staybnb-20260725";
const databaseId = process.env.FIRESTORE_DATABASE_ID || "(default)";
const collection = process.env.FIRESTORE_COLLECTION || "listings";
const inputFile = process.env.LISTINGS_CSV || "Listing.csv";
const batchSize = Number(process.env.FIRESTORE_BATCH_SIZE || 400);

const integerFields = new Set([
  "id",
  "scrape_id",
  "host_id",
  "host_listings_count",
  "host_total_listings_count",
  "accommodates",
  "bedrooms",
  "beds",
  "square_feet",
  "guests_included",
  "minimum_nights",
  "maximum_nights",
  "availability_30",
  "availability_60",
  "availability_90",
  "availability_365",
  "number_of_reviews",
  "review_scores_rating",
  "review_scores_accuracy",
  "review_scores_cleanliness",
  "review_scores_checkin",
  "review_scores_communication",
  "review_scores_location",
  "review_scores_value",
  "calculated_host_listings_count"
]);

const numberFields = new Set([
  "latitude",
  "longitude",
  "bathrooms",
  "reviews_per_month",
  "price",
  "weekly_price",
  "monthly_price",
  "security_deposit",
  "cleaning_fee",
  "extra_people",
  "host_response_rate",
  "host_acceptance_rate"
]);

const booleanFields = new Set([
  "host_is_superhost",
  "host_has_profile_pic",
  "host_identity_verified",
  "is_location_exact",
  "has_availability",
  "requires_license",
  "instant_bookable",
  "require_guest_profile_picture",
  "require_guest_phone_verification"
]);

const dateFields = new Set([
  "last_scraped",
  "host_since",
  "calendar_last_scraped",
  "first_review",
  "last_review"
]);

function getAccessToken() {
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) {
    return process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  }

  const result = spawnSync("firebase", ["login:list", "--json"], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });

  if (result.status !== 0) {
    throw new Error(`Could not read Firebase CLI login. ${result.stderr || result.stdout}`);
  }

  const parsed = JSON.parse(result.stdout);
  const token = parsed?.result?.[0]?.tokens?.access_token;
  if (!token) {
    throw new Error("Firebase CLI is not logged in. Run `firebase login` first.");
  }

  return token;
}

function parseDate(value) {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, month, day, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseMoneyOrNumber(value) {
  const normalized = value.replace(/[$,%\s,]/g, "");
  if (normalized === "") return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function normalizeValue(key, rawValue) {
  const value = rawValue.trim();
  if (value === "") return undefined;

  if (booleanFields.has(key)) {
    if (value === "t") return true;
    if (value === "f") return false;
  }

  if (dateFields.has(key)) {
    return parseDate(value) || value;
  }

  if (integerFields.has(key)) {
    const number = parseMoneyOrNumber(value);
    return number === null ? value : Math.trunc(number);
  }

  if (numberFields.has(key)) {
    const number = parseMoneyOrNumber(value);
    return number === null ? value : number;
  }

  if (key === "amenities" && value.startsWith("{") && value.endsWith("}")) {
    return value
      .slice(1, -1)
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((item) => item.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  }

  if (key === "host_verifications" && value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^'|'$/g, ""))
      .filter(Boolean);
  }

  return value;
}

function firestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(firestoreValue) } };
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return { timestampValue: value };
  }
  return { stringValue: String(value) };
}

function toFirestoreFields(document) {
  return Object.fromEntries(
    Object.entries(document).map(([key, value]) => [key, firestoreValue(value)])
  );
}

async function writeBatch(token, writes) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${encodeURIComponent(databaseId)}/documents:batchWrite`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ writes })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firestore batch write failed (${response.status}): ${text}`);
  }

  const payload = await response.json();
  const failures = payload.status?.filter((status) => status.code) || [];
  if (failures.length > 0) {
    throw new Error(`Firestore reported ${failures.length} failed writes: ${JSON.stringify(failures[0])}`);
  }
}

async function main() {
  const token = getAccessToken();
  const lines = createInterface({
    input: createReadStream(inputFile, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  let headers = null;
  let imported = 0;
  let skipped = 0;
  let batch = [];

  for await (const line of lines) {
    if (!headers) {
      headers = line.split("\t").map((header) => header.trim());
      continue;
    }

    if (line.trim() === "") continue;

    const values = line.split("\t");
    const row = {};

    headers.forEach((header, index) => {
      const value = normalizeValue(header, values[index] || "");
      if (value !== undefined) row[header] = value;
    });

    if (!row.id) {
      skipped += 1;
      continue;
    }

    const documentName = `projects/${projectId}/databases/${databaseId}/documents/${collection}/${encodeURIComponent(String(row.id))}`;
    batch.push({
      update: {
        name: documentName,
        fields: toFirestoreFields(row)
      }
    });

    if (batch.length >= batchSize) {
      await writeBatch(token, batch);
      imported += batch.length;
      console.log(`Imported ${imported} listings...`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await writeBatch(token, batch);
    imported += batch.length;
  }

  console.log(`Done. Imported ${imported} listings into ${projectId}/${collection}. Skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
