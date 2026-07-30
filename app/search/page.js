import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import ListingPhoto from "./ListingPhoto";

export const metadata = {
  title: "Search stays | Staybnb",
  description: "Browse Staybnb listings from the Airbnb Firebase dataset."
};

const listingFile = join(process.cwd(), "Listing.csv");
const fallbackListingPhotos = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
];

function parseMoney(value) {
  const number = Number(String(value || "").replace(/[$,\s]/g, ""));
  return Number.isFinite(number) ? number : null;
}

function cleanText(value, fallback = "Not available") {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeImageUrl(value) {
  const rawUrl = String(value || "").trim();

  if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
    return null;
  }

  try {
    const url = new URL(rawUrl);

    if (url.hostname.endsWith("muscache.com")) {
      return null;
    }

    return rawUrl;
  } catch {
    return null;
  }
}

function getListingImage(row) {
  const candidates = [row.xl_picture_url, row.picture_url, row.medium_url, row.thumbnail_url];
  return candidates.map(normalizeImageUrl).find(Boolean) || null;
}

function getFallbackImage(row, index) {
  const seed = Number(row.id) || index;
  return fallbackListingPhotos[Math.abs(seed) % fallbackListingPhotos.length];
}

const pageSize = 60;

function getListings(page = 1) {
  if (!existsSync(listingFile)) {
    return {
      listings: [],
      totalListings: 0,
      totalPages: 1
    };
  }

  const lines = readFileSync(listingFile, "utf8").split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split("\t");
  const totalListings = Math.max(lines.length - 1, 0);
  const totalPages = Math.max(Math.ceil(totalListings / pageSize), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = 1 + (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const listings = [];

  for (const [index, line] of lines.slice(start, end).entries()) {
    const values = line.split("\t");
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    const image = getListingImage(row);
    const id = cleanText(row.id, `${currentPage}-${index}`);
    const fallbackImage = getFallbackImage(row, start + index);

    listings.push({
      key: `${currentPage}-${index}-${id}`,
      id,
      name: cleanText(row.name, "Staybnb listing"),
      image,
      fallbackImage,
      city: cleanText(row.city, "Seattle"),
      neighbourhood: cleanText(row.neighbourhood_cleansed || row.neighbourhood, "Neighbourhood"),
      propertyType: cleanText(row.property_type),
      roomType: cleanText(row.room_type),
      price: parseMoney(row.price),
      accommodates: cleanText(row.accommodates, "0"),
      bedrooms: cleanText(row.bedrooms, "0"),
      beds: cleanText(row.beds, "0"),
      rating: cleanText(row.review_scores_rating, "New"),
      reviews: cleanText(row.number_of_reviews, "0"),
      host: cleanText(row.host_name, "Host"),
      listingUrl: row.listing_url || "#"
    });
  }

  return {
    listings,
    totalListings,
    totalPages,
    currentPage
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const requestedPage = Number(params?.page || 1);
  const { listings, totalListings, totalPages, currentPage } = getListings(requestedPage);
  const previousPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, totalPages);

  return (
    <div className="search-shell">
      <header className="search-header">
        <nav className="search-nav" aria-label="Search navigation">
          <Link className="brand" href="/" aria-label="Staybnb home">
            <img src="/staybnb-logo.png" alt="Staybnb" />
          </Link>
          <div className="search-nav-actions">
            <Link href="/">Home</Link>
            <Link href="/dashboard">My dashboard</Link>
          </div>
        </nav>

        <div className="search-heading">
          <p>AirBNB Firebase project: airbnb-2395c</p>
          <h1>Search stays</h1>
          <span>
            Showing {listings.length} of {totalListings} listings with photos and details
          </span>
        </div>
      </header>

      <main className="search-main">
        <div className="search-pagination" aria-label="Listing pages">
          <Link className={currentPage === 1 ? "is-disabled" : ""} href={`/search?page=${previousPage}`}>
            Previous
          </Link>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Link className={currentPage === totalPages ? "is-disabled" : ""} href={`/search?page=${nextPage}`}>
            Next
          </Link>
        </div>

        <div className="listing-grid" aria-label="Stay listings">
          {listings.map((listing) => (
            <article className="listing-card" key={listing.key}>
              <a
                className="listing-image-link"
                href={listing.listingUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={listing.name}
              >
                <ListingPhoto alt={listing.name} primarySrc={listing.image} fallbackSrc={listing.fallbackImage} />
              </a>

              <div className="listing-card-body">
                <div className="listing-card-title">
                  <div>
                    <h2>{listing.name}</h2>
                    <p>
                      {listing.neighbourhood}, {listing.city}
                    </p>
                  </div>
                  <strong>{listing.price === null ? "N/A" : `$${listing.price}`}</strong>
                </div>

                <div className="listing-tags" aria-label="Listing details">
                  <span>{listing.propertyType}</span>
                  <span>{listing.roomType}</span>
                </div>

                <dl className="listing-facts">
                  <div>
                    <dt>Guests</dt>
                    <dd>{listing.accommodates}</dd>
                  </div>
                  <div>
                    <dt>Bedrooms</dt>
                    <dd>{listing.bedrooms}</dd>
                  </div>
                  <div>
                    <dt>Beds</dt>
                    <dd>{listing.beds}</dd>
                  </div>
                </dl>

                <div className="listing-footer">
                  <span>Hosted by {listing.host}</span>
                  <span>{listing.rating} rating</span>
                  <span>{listing.reviews} reviews</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="search-pagination" aria-label="Listing pages">
          <Link className={currentPage === 1 ? "is-disabled" : ""} href={`/search?page=${previousPage}`}>
            Previous
          </Link>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Link className={currentPage === totalPages ? "is-disabled" : ""} href={`/search?page=${nextPage}`}>
            Next
          </Link>
        </div>
      </main>
    </div>
  );
}
