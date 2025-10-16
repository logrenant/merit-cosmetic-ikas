import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { useKeenSlider } from "keen-slider/react";
import { IkasStorefrontConfig } from "@ikas/storefront-config";

import "keen-slider/keen-slider.min.css";
import { AnimatedStorylinksProps } from "../__generated__/types";


const StoryLinks = ({ items }: AnimatedStorylinksProps) => {
  const currentLocale = IkasStorefrontConfig.getCurrentLocale();
  const isArabic = currentLocale === 'ar';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Function to check if mouse is within circular area
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );

    if (distance <= radius) {
      setHoveredIndex(index);
    } else {
      setHoveredIndex(null);
    }
  };


  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: isArabic && items && items.length > 0 ? items.length - 1 : 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      setLoaded(true);
    },
    slides: { perView: 3, spacing: 2 },
    breakpoints: {
      "(min-width: 480px)": { slides: { perView: 4, spacing: 0 } },
      "(min-width: 520px)": { slides: { perView: 4, spacing: 4 } },
      "(min-width: 680px)": { slides: { perView: 4, spacing: 4 } },
      "(min-width: 870px)": { slides: { perView: 6, spacing: 4 } },
      "(min-width: 1024px)": { slides: { perView: 6, spacing: 4 } },
      "(min-width: 1280px)": { slides: { perView: 8, spacing: 2 } },
    },
  });

  return (
    <div className="relative mt-2 layout flex flex-row items-center w-full">
      {/* Slider Container */}
      <div ref={sliderRef} className="keen-slider">
        {items?.map((item, i) => (
          <div className="keen-slider__slide" style={{ minWidth: "fit-content" }} key={i}>
            <Link href={item.link.href}>
              <div
                className="relative w-24 h-24 xs-start:w-26 xs-start:h-26 xs-mid:w-30 xs-mid:h-30 xs-end:w-32 xs-end:h-32 sm-start:w-[100px] sm-start:h-[100px] sm-mid:w-28 sm-mid:h-28 sm-end:w-30 sm-end:h-30 md-start:w-34 md-start:h-34 md-mid:w-38 md-mid:h-38 md-end:w-42 md-end:h-42 lg-start:w-32 lg-start:h-32 lg-mid:w-38 lg-mid:h-38 lg-end:w-42 lg-end:h-42 xl-start:w-46 xl-start:h-46 xl-mid:w-[157px] xl-mid:h-[157px] xl-end:w-[165px] xl-end:h-[165px] mx-auto my-2 cursor-pointer perspective-100 group overflow-hidden rounded-full block"
                style={{
                  clipPath: 'circle(50% at 50% 50%)'
                }}
                onMouseMove={(e) => handleMouseMove(e, i)}
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
                  className={`relative w-full h-full transition-transform duration-700 preserve-3d  ${hoveredIndex === i ? "rotate-y-180" : ""}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center backface-hidden rounded-full overflow-hidden">
                    <img
                      alt={item.table?.altText || ""}
                      src={item.table.src}
                      className="w-[65%] h-[65%] bg-[color:var(--bg-color)] object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center backface-hidden rounded-full rotate-y-180 overflow-hidden">
                    <img
                      alt={item.table.altText || ""}
                      src={item.table.src}
                      className="w-[65%] h-[65%] bg-[color:var(--bg-color)] object-cover rounded-full"
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