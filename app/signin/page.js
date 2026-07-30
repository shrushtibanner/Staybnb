import Link from "next/link";

export const metadata = {
  title: "Sign in | Staybnb",
  description: "Sign in to Staybnb with your phone number."
};

export default function SignInPage() {
  return (
    <div className="signin-shell">
      <header className="signin-header">
        <Link className="brand" href="/" aria-label="Staybnb home">
          <img src="/staybnb-logo.png" alt="Staybnb" />
        </Link>
        <Link className="signin-back-link" href="/">
          Home
        </Link>
      </header>

      <main className="signin-main">
        <section className="signin-panel" aria-labelledby="signin-title">
          <div className="signin-heading">
            <p>Welcome to Staybnb</p>
            <h1 id="signin-title">Sign in by phone</h1>
          </div>

          <form className="phone-signin-form" action="/dashboard">
            <label>
              <span>Country code</span>
              <select name="countryCode" defaultValue="+91" aria-label="Country code">
                <option value="+91">India +91</option>
                <option value="+1">United States +1</option>
                <option value="+44">United Kingdom +44</option>
                <option value="+61">Australia +61</option>
              </select>
            </label>

            <label>
              <span>Phone number</span>
              <input name="phone" type="tel" inputMode="tel" placeholder="Enter phone number" required />
            </label>

            <button type="submit">Continue</button>
          </form>
        </section>
      </main>
    </div>
  );
}
