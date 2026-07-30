"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomeHeader() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <>
      <div className="header-top">
        <a className="brand" href="#home" aria-label="Staybnb home">
          <img src="/staybnb-logo.png" alt="Staybnb" />
        </a>

        <div className="header-actions">
          <Link className="header-action" href="/dashboard">
            My dashboard
          </Link>
          <button className="header-action sign-in-action" type="button" onClick={() => setIsSignInOpen(true)}>
            Sign in
          </button>
        </div>
      </div>

      {isSignInOpen ? (
        <div className="signin-modal-backdrop" role="presentation" onClick={() => setIsSignInOpen(false)}>
          <section
            className="signin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="signin-modal-top">
              <h2 id="signin-modal-title">Sign in by phone</h2>
              <button type="button" aria-label="Close sign in" onClick={() => setIsSignInOpen(false)}>
                x
              </button>
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
                <input name="phone" type="tel" inputMode="tel" placeholder="Enter phone number" required autoFocus />
              </label>

              <button type="submit">Continue</button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
