"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    src: "/dashboard-preview.png",
    alt: "부서별 퇴사율 대시보드",
    label: "대시보드",
  },
  {
    src: "/ai-Image.png",
    alt: "AI 리포트 화면",
    label: "AI 리포트",
  },
];

export default function LaptopPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border-[10px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden">
        <div className="h-3.5 bg-gray-800 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
        </div>

        <div className="relative bg-gray-100 aspect-[16/10]">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-contain object-center p-1"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto h-2 w-[94%] rounded-b-md bg-gray-300" />
      <div className="mx-auto h-3.5 w-full rounded-b-2xl bg-gradient-to-b from-gray-300 to-gray-400" />

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${slide.label} 미리보기`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-indigo-600" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-gray-400">{slides[index].label}</p>
    </div>
  );
}
