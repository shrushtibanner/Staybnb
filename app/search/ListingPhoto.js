"use client";

import { useState } from "react";

export default function ListingPhoto({ alt, primarySrc, fallbackSrc }) {
  const sources = [primarySrc, fallbackSrc].filter(Boolean);
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[sourceIndex];

  if (!src) {
    return <span className="listing-image-empty" aria-hidden="true" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((currentIndex) => currentIndex + 1);
          return;
        }

        event.currentTarget.closest(".listing-card")?.classList.add("is-hidden");
      }}
    />
  );
}
