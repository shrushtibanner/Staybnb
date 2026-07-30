"use client";

import { useState } from "react";
import Link from "next/link";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const dates = Array.from({ length: 31 }, (_, index) => index + 1);

export default function HomeSearch() {
  const [isWhenOpen, setIsWhenOpen] = useState(false);
  const [isWhoOpen, setIsWhoOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedDate, setSelectedDate] = useState(null);
  const [guest, setGuest] = useState({
    name: "",
    age: "",
    email: ""
  });

  return (
    <>
      <form className="header-search" aria-label="Search stays">
        <Link className="header-search-field" href="/search">
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
        </Link>

        <button className="header-search-field" type="button" onClick={() => setIsWhenOpen(true)}>
          <span className="field-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M8 3v4M16 3v4M4 10h16" />
            </svg>
          </span>
          <span className="field-copy">
            <span>When</span>
            <strong>{selectedDate ? `${selectedMonth} ${selectedDate}` : "Add dates"}</strong>
          </span>
        </button>

        <button className="header-search-field" type="button" onClick={() => setIsWhoOpen(true)}>
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
            <strong>{guest.name ? guest.name : "Add guests"}</strong>
          </span>
        </button>

        <Link className="header-search-button" href="/search" aria-label="Search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>
        </Link>
      </form>

      {isWhenOpen ? (
        <div className="date-modal-backdrop" role="presentation" onClick={() => setIsWhenOpen(false)}>
          <section
            className="date-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="date-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="date-modal-top">
              <h2 id="date-modal-title">Select dates</h2>
              <button type="button" aria-label="Close dates" onClick={() => setIsWhenOpen(false)}>
                x
              </button>
            </div>

            <div className="month-picker" aria-label="Months">
              {months.map((month) => (
                <button
                  className={selectedMonth === month ? "is-selected" : ""}
                  type="button"
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="date-picker" aria-label={`${selectedMonth} dates`}>
              {dates.map((date) => (
                <button
                  className={selectedDate === date ? "is-selected" : ""}
                  type="button"
                  key={date}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>

            <div className="date-modal-actions">
              <button type="button" onClick={() => setSelectedDate(null)}>
                Clear
              </button>
              <button type="button" onClick={() => setIsWhenOpen(false)}>
                Apply
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isWhoOpen ? (
        <div className="guest-modal-backdrop" role="presentation" onClick={() => setIsWhoOpen(false)}>
          <section
            className="guest-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guest-modal-top">
              <h2 id="guest-modal-title">Guest details</h2>
              <button type="button" aria-label="Close guest details" onClick={() => setIsWhoOpen(false)}>
                x
              </button>
            </div>

            <div className="guest-form">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={guest.name}
                  placeholder="Enter name"
                  onChange={(event) => setGuest((current) => ({ ...current, name: event.target.value }))}
                  autoFocus
                />
              </label>

              <label>
                <span>Age</span>
                <input
                  type="number"
                  min="1"
                  value={guest.age}
                  placeholder="Enter age"
                  onChange={(event) => setGuest((current) => ({ ...current, age: event.target.value }))}
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={guest.email}
                  placeholder="Enter email"
                  onChange={(event) => setGuest((current) => ({ ...current, email: event.target.value }))}
                />
              </label>
            </div>

            <div className="guest-modal-actions">
              <button type="button" onClick={() => setGuest({ name: "", age: "", email: "" })}>
                Clear
              </button>
              <button type="button" onClick={() => setIsWhoOpen(false)}>
                Apply
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
