import Link from "next/link";

export default function Home() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="header-top">
          <a className="brand" href="#home" aria-label="Staybnb home">
            <img src="/staybnb-logo.png" alt="Staybnb" />
          </a>

          <div className="header-actions">
            <Link className="header-action" href="/dashboard">
              My dashboard
            </Link>
            <button className="header-action" type="button">
              Become a host
            </button>
            <button className="header-action sign-in-action" type="button">
              Sign in
            </button>
          </div>
        </div>

        <form className="header-search" aria-label="Search stays">
          <label className="header-search-field">
            <span className="field-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </span>
            <span className="field-copy">
              <span>Where</span>
              <strong>Search destinations</strong>
            </span>
          </label>
          <label className="header-search-field">
            <span className="field-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16" />
              </svg>
            </span>
            <span className="field-copy">
              <span>When</span>
              <strong>Add dates</strong>
            </span>
          </label>
          <label className="header-search-field">
            <span className="field-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
                <path d="M16 11a2.7 2.7 0 1 0 0-5.4" />
                <path d="M17 15.5a4.5 4.5 0 0 1 3.5 4.5" />
              </svg>
            </span>
            <span className="field-copy">
              <span>Who</span>
              <strong>Add guests</strong>
            </span>
          </label>
          <Link className="header-search-button" href="/search" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </Link>
        </form>
      </header>

      <main className="hero-panel" id="home">
        <div className="hero-art-wrap">
          <img className="hero-art" src="/hero-stay-illustration.png" alt="Vacation home with travel luggage" />

          <div className="signpost" aria-label="Travel categories">
            <Link href="/search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m3 10 9-7 9 7" />
                <path d="M5 9v11h14V9" />
                <path d="M9 20v-6h6v6" />
              </svg>
              Find Stays
            </Link>
            <a href="#places">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5v15l5-3 6 3 5-3V2l-5 3-6-3-5 3Z" />
                <path d="M9 2v15" />
                <path d="M15 5v15" />
              </svg>
              Explore Places
            </a>
            <a href="#experiences">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="7" width="16" height="13" rx="2" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                <path d="M8 13h8" />
              </svg>
              Live Experiences
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
