import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";

export const metadata = {
  title: "Search stays | Staybnb",
  description: "Browse Staybnb listings from the Airbnb Firebase dataset."
};

const listingFile = join(process.cwd(), "Listing.csv");

function parseMoney(value) {
  const number = Number(String(value || "").replace(/[$,\s]/g, ""));
  return Number.isFinite(number) ? number : null;
}

function cleanText(value, fallback = "Not available") {
  const text = String(value || "").trim();
  return text || fallback;
}

function getListings(limit = 24) {
  if (!existsSync(listingFile)) return [];

  const lines = readFileSync(listingFile, "utf8").split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split("\t");
  const listings = [];

  for (const line of lines.slice(1)) {
    const values = line.split("\t");
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    const image = row.picture_url || row.medium_url || row.thumbnail_url || "/hero-stay-illustration.png";

    listings.push({
      id: row.id,
      name: cleanText(row.name, "Staybnb listing"),
      image,
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

    if (listings.length >= limit) break;
  }

  return listings;
}

export default function SearchPage() {
  const listings = getListings();

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
          <span>{listings.length} listings loaded with photos and details</span>
        </div>
      </header>

      <main className="search-main">
        <div className="listing-grid" aria-label="Stay listings">
          {listings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <a className="listing-image-link" href={listing.listingUrl} target="_blank" rel="noreferrer">
                <img src={listing.image} alt={listing.name} />
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
      </main>
    </div>
  );
}
