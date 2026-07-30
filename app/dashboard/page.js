"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const dashboardStats = [
  {
    label: "Total hosts",
    value: "128",
    note: "Active Staybnb hosts",
    icon: "hosts"
  },
  {
    label: "Total cities",
    value: "24",
    note: "Cities with listed stays",
    icon: "cities"
  },
  {
    label: "Avg per night",
    value: "$148",
    note: "Average nightly rate",
    icon: "nightly"
  },
  {
    label: "Total bookings",
    value: "1,284",
    note: "Confirmed reservations",
    icon: "bookings"
  },
  {
    label: "Total revenue",
    value: "$189K",
    note: "Revenue earned",
    icon: "revenue"
  }
];

const propertyListings = [
  { label: "Entire home", value: 142, color: "#ff385c" },
  { label: "Private room", value: 96, color: "#2563eb" },
  { label: "Apartment", value: 74, color: "#16a34a" },
  { label: "Villa", value: 30, color: "#f59e0b" }
];

const bookingStatus = [
  { label: "Confirmed", value: 860, color: "#16a34a" },
  { label: "Pending", value: 238, color: "#f59e0b" },
  { label: "Cancelled", value: 186, color: "#ef4444" }
];

const roomTypes = [
  { label: "Entire place", value: 184, color: "#ff385c" },
  { label: "Private room", value: 118, color: "#2563eb" },
  { label: "Shared room", value: 40, color: "#7c3aed" }
];

const monthlyBookings = [
  { month: "Jan", bookings: 72 },
  { month: "Feb", bookings: 88 },
  { month: "Mar", bookings: 96 },
  { month: "Apr", bookings: 104 },
  { month: "May", bookings: 121 },
  { month: "Jun", bookings: 138 },
  { month: "Jul", bookings: 156 }
];

function describePieSlice(startAngle, endAngle) {
  const center = 50;
  const radius = 38;
  const start = {
    x: center + radius * Math.cos(startAngle),
    y: center + radius * Math.sin(startAngle)
  };
  const end = {
    x: center + radius * Math.cos(endAngle),
    y: center + radius * Math.sin(endAngle)
  };
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${center} ${center}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z"
  ].join(" ");
}

function PieChart({ data, label }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2;

  return (
    <div className="pie-chart-card">
      <svg className="pie-chart" viewBox="0 0 100 100" role="img" aria-label={label}>
        {data.map((item) => {
          const sliceAngle = (item.value / total) * Math.PI * 2;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          currentAngle = endAngle;

          return <path d={describePieSlice(startAngle, endAngle)} fill={item.color} key={item.label} />;
        })}
        <circle cx="50" cy="50" r="22" />
        <text x="50" y="47">
          {total}
        </text>
        <text x="50" y="59">
          total
        </text>
      </svg>

      <div className="pie-legend">
        {data.map((item) => (
          <div className="pie-legend-item" key={item.label}>
            <span style={{ background: item.color }} />
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart() {
  const maxMonthlyBookings = Math.max(...monthlyBookings.map((item) => item.bookings));
  const points = monthlyBookings
    .map((item, index) => {
      const x = 32 + index * (336 / (monthlyBookings.length - 1));
      const y = 184 - (item.bookings / maxMonthlyBookings) * 128;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="line-chart-wrap">
      <svg className="line-chart" viewBox="0 0 400 220" role="img" aria-label="Monthly booking trend line graph">
        <path className="chart-grid-line" d="M32 56H368" />
        <path className="chart-grid-line" d="M32 120H368" />
        <path className="chart-grid-line" d="M32 184H368" />
        <polyline className="booking-trend-line" points={points} />
        {monthlyBookings.map((item, index) => {
          const x = 32 + index * (336 / (monthlyBookings.length - 1));
          const y = 184 - (item.bookings / maxMonthlyBookings) * 128;

          return (
            <g key={item.month}>
              <circle className="booking-trend-point" cx={x} cy={y} r="4" />
              <text className="line-chart-label" x={x} y="210">
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MetricIcon({ name }) {
  if (name === "hosts") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M16 11a2.7 2.7 0 1 0 0-5.4" />
        <path d="M17 15.5a4.5 4.5 0 0 1 3.5 4.5" />
      </svg>
    );
  }

  if (name === "cities") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  if (name === "nightly") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }

  if (name === "bookings") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
        <path d="m8 15 2.5 2.5L16 12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 3 5-7" />
      <path d="M16 7h3v3" />
    </svg>
  );
}

export default function DashboardPage() {
  const [selectedGraph, setSelectedGraph] = useState("");
  const graphConfig = useMemo(() => {
    if (selectedGraph === "property") {
      return {
        eyebrow: "Inventory",
        title: "Listings by property",
        value: "342",
        chart: <PieChart data={propertyListings} label="Listings by property pie chart" />
      };
    }

    if (selectedGraph === "status") {
      return {
        eyebrow: "Reservations",
        title: "Booking status",
        value: "1,284",
        chart: <PieChart data={bookingStatus} label="Booking status pie chart" />
      };
    }

    if (selectedGraph === "room") {
      return {
        eyebrow: "Rooms",
        title: "Room type distribution",
        value: "342",
        chart: <PieChart data={roomTypes} label="Room type distribution pie chart" />
      };
    }

    if (selectedGraph === "trend") {
      return {
        eyebrow: "Bookings",
        title: "Monthly booking trend",
        value: "+18%",
        chart: <LineChart />
      };
    }

    return null;
  }, [selectedGraph]);

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-nav">
          <Link className="brand" href="/" aria-label="Staybnb home">
            <img src="/staybnb-logo.png" alt="Staybnb" />
          </Link>

          <nav className="dashboard-menu" aria-label="Dashboard menu">
            <Link href="/">Home</Link>
            <Link href="/dashboard" aria-current="page">
              My dashboard
            </Link>
          </nav>
        </div>

        <div className="dashboard-heading">
          <div>
            <p>Host overview</p>
            <h1>My dashboard</h1>
            <label className="graph-sort-control">
              <span>View graph by</span>
              <select value={selectedGraph} onChange={(event) => setSelectedGraph(event.target.value)}>
                <option value="">Select category</option>
                <option value="property">Listings by property</option>
                <option value="status">Booking status</option>
                <option value="room">Room type distribution</option>
                <option value="trend">Monthly booking trend</option>
              </select>
            </label>
          </div>
        </div>

        <div className="dashboard-stat-grid" aria-label="Dashboard totals">
          {dashboardStats.map((stat) => (
            <article className="dashboard-stat-card" key={stat.label}>
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon">
                  <MetricIcon name={stat.icon} />
                </span>
                <span>{stat.label}</span>
              </div>
              <strong>{stat.value}</strong>
              <p>{stat.note}</p>
            </article>
          ))}
        </div>
      </header>

      <main className="dashboard-main">
        {graphConfig ? (
          <section className="dashboard-chart-panel" aria-labelledby="selected-graph-title">
            <div className="chart-panel-heading">
              <div>
                <p>{graphConfig.eyebrow}</p>
                <h2 id="selected-graph-title">{graphConfig.title}</h2>
              </div>
              <strong>{graphConfig.value}</strong>
            </div>
            {graphConfig.chart}
          </section>
        ) : (
          <section className="dashboard-empty-main" aria-label="Dashboard content" />
        )}
      </main>
    </div>
  );
}
