import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { QuicklinksProps } from "../__generated__/types";
import { sliderBreakpoints } from "src/styles/breakpoints";


const QuickLinks = ({ links }: QuicklinksProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
      setMaxSlide(s.track.details.maxIdx);
    },
    created(s) {
      setLoaded(true);
      setMaxSlide(s.track.details.maxIdx);
    },
    slides: { perView: 2, spacing: 10 },
    breakpoints: {
      [sliderBreakpoints.md]: { slides: { perView: 3, spacing: 16 } },
      [sliderBreakpoints.lg]: { slides: { perView: 5, spacing: 16 } },
    },
  });

  return (
    <div dir="ltr" className="pt-6 pb-2 layout relative items-center">

      {/* Slider Container */}
      <div ref={sliderRef} className="keen-slider flex flex-row justify-between">
        {links.items.map((e, i) => (
          <div className="keen-slider__slide max-w-fit" key={i}>
            <Link href={e.link.href}>
              <a className="flex gap-1 items-end">
                <div className="w-[35px] h-[32px] relative">
                  <Image
                    alt={e.icon?.altText || ""}
                    useBlur
                    layout="fill"
                    objectFit="contain"
                    image={e.icon}
                  />
                </div>
                <span className="text-[color:var(--black-two)] w-fit">
                  {e.link.label}
                </span>
              </a>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {loaded && slider.current && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className={`absolute top-1/2 xl:left-[-12px] left-[12px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] transition-all duration-200 ${currentSlide === 0 ? "cursor-not-allowed hidden" : ""
              }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => slider.current?.next()}
            className={`absolute top-1/2 xl:right-[-24px] right-[12px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] transition-all duration-200 ${currentSlide === maxSlide ? "cursor-not-allowed hidden" : ""
              }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default observer(QuickLinks);
