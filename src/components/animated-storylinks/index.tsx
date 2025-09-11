import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { AnimatedStorylinksProps } from "../__generated__/types";


const StoryLinks = ({ items }: AnimatedStorylinksProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      setLoaded(true);
    },
    slides: { perView: 3, spacing: 8 },
    breakpoints: {
      "(min-width: 1024px)": { slides: { perView: 6, spacing: 16 } },
      "(min-width: 1280px)": { slides: { perView: 8, spacing: 16 } },
    },
  });

  return (
    <div className="relative mt-6 layout flex flex-row items-center w-full">
      {/* Slider Container */}
      <div ref={sliderRef} className="keen-slider">
        {items?.map((item, i) => (
          <div className="keen-slider__slide" style={{ minWidth: "fit-content" }} key={i}>
            <Link href={item.link.href}>
              <div
                className="relative w-24 h-24 md:w-40 md:h-40 lg:w-32 lg:h-32 xl:w-34 xl:h-34 2xl:w-40 2xl:h-40 mx-auto my-2 cursor-pointer perspective-100 group overflow-hidden rounded-full block"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <img
                    alt={item.circle?.altText || ""}
                    src={item.circle?.src}
                    className="w-full h-full object-contain shine-mask animate-shine-mask"
                  />
                </div>

                <div
                  className={`relative w-full h-full transition-transform duration-700 preserve-3d ${hoveredIndex === i ? "rotate-y-180" : ""}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center backface-hidden bg-white rounded-full overflow-hidden">
                    <img
                      alt={item.table?.altText || ""}
                      src={item.table.src}
                      className="w-20 h-20 md:w-[126px] md:h-[126px] lg:w-26 lg:h-26 xl:w-[116px] xl:h-[116px] 2xl:w-[126px] 2xl:h-[126px] bg-[color:var(--bg-color)] object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center backface-hidden bg-white rounded-full rotate-y-180 overflow-hidden">
                    <img
                      alt={item.table.altText || ""}
                      src={item.table.src}
                      className="w-20 h-20 md:w-[126px] md:h-[126px] lg:w-26 lg:h-26 xl:w-[116px] xl:h-[116px] 2xl:w-[126px] 2xl:h-[126px] bg-[color:var(--bg-color)] object-cover"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {loaded && slider && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className={`xl:hidden absolute top-[35%] left-0 lg:left-[16px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer`}
          >
            <svg
              className="w-8 h-8"
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
            className={`xl:hidden absolute top-[35%] right-0 lg:right-[16px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer`}
          >
            <svg
              className="w-8 h-8"
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

export default observer(StoryLinks);