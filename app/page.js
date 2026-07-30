import Link from "next/link";
import HomeHeader from "./HomeHeader";
import HomeSearch from "./HomeSearch";

export default function Home() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <HomeHeader />
        <HomeSearch />
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
