import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { StorylinksProps } from "../__generated__/types";


const StoryLinks = ({ items }: StorylinksProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

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
              <a className="flex items-center flex-col">
                <div className="w-24 md:w-[130px] aspect-square border-2 p-1 rounded-full border-[color:var(--color-one)]">
                  <div className="relative rounded-full aspect-square w-full overflow-hidden">
                    <Image
                      alt={item?.image?.altText || ""}
                      useBlur
                      image={item.image}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <h4 className="mt-1.5 text-xs md:text-sm text-[color:var(--black-two)]">
                  {item.link.label}
                </h4>
              </a>
            </Link>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {loaded && slider && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className={`absolute top-[30%] xl:left-[-12px] left-0 text-[color:var(--color-two)] hover:text-[color:var(--color-four)] transition-all duration-200`}
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
            className={`absolute top-[30%] xl:right-[-12px] right-0 text-[color:var(--color-two)] hover:text-[color:var(--color-four)] transition-all duration-200`}
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