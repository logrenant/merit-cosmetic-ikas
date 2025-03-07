import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { StorylinksProps } from "../__generated__/types";

const StoryLinks = ({ items }: StorylinksProps) => {
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
    },
    created(s) {
      setLoaded(true);
    },
    slides: {
      perView: "auto",
      spacing: 16,
    },
  });

  return (
    <div className="relative mt-6 layout flex flex-col items-center justify-between gap-2 lg:gap-6">

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

      {/* Navigation Arrows */}
      {loaded && slider.current && (
        <div className="flex flex-row w-full gap-2">
          <button
            onClick={() => slider.current?.prev()}
            className={`bg-[color:var(--color-two)] hover:bg-[color:var(--quick-color)] text-[color:var(--bg-color)] rounded-lg p-2 shadow-md transition-all duration-200`}
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
            className={`bg-[color:var(--color-two)] hover:bg-[color:var(--quick-color)] text-[color:var(--bg-color)] rounded-lg p-2 shadow-md transition-all duration-200`}
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

        </div>
      )}
    </div>
  );
};

export default observer(StoryLinks);