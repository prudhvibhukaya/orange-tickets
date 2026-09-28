"use client";

import { useState } from "react";

export default function BrandLogo() {
  const [imgSrc, setImgSrc] = useState("/logo.png");
  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <span className="h-[1em] w-[1em] flex items-center justify-center rounded-full bg-orange-600 font-extrabold text-white text-[10px] select-none p-0 m-0 mr-1">
        O
      </span>
    );
  }

  return (
    <img
      src={imgSrc}
      onError={() => {
        if (imgSrc === "/logo.png") {
          setImgSrc("/logo.png.png");
        } else {
          setShowFallback(true);
        }
      }}
      alt="Orange Tickets Logo"
      className="h-[1em] w-auto p-0 m-0 object-contain"
    />
  );
}
