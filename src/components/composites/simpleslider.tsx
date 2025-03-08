import React, { ReactNode, useState, useEffect } from "react";
import {
  KeenSliderOptions,
  KeenSliderInstance,
  useKeenSlider,
} from "keen-slider/react";
import { observer } from "mobx-react-lite";

import "keen-slider/keen-slider.min.css";

interface SimpleSliderProps {
  keenOptions: KeenSliderOptions;
  items: ReactNode[];
  showPagination?: boolean;
  showNavigation?: boolean;
}

const MutationPlugin = (slider: KeenSliderInstance) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      window.requestAnimationFrame(() => {
        slider.update();
      });
    });
  });
  const config = { childList: true };

  slider.on("created", () => {
    observer.observe(slider.container, config);
  });
  slider.on("destroyed", () => {
    observer.disconnect();
  });
};

const SimpleSlider: React.FC<SimpleSliderProps> = ({
  keenOptions,
  items,
  showPagination = true,
  showNavigation = false,
}) => {
  const [created, setCreated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [arrowMaxSlide, setArrowMaxSlide] = useState(0);
  const [showDots, setShowDots] = useState(true);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      ...keenOptions,
      created: () => {
        setCreated(true);
      },
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
        setArrowMaxSlide(s.track.details.maxIdx);
      },
    },
    [MutationPlugin]
  );

  useEffect(() => {
    if (created && instanceRef.current) {
      const { slides } = instanceRef.current.track.details;
      const totalSlides = slides.length;

      const slidesOptions = instanceRef.current.options.slides;
      let slidesPerView = 2;

      if (typeof slidesOptions === "object" && !Array.isArray(slidesOptions)) {
        const perViewValue = slidesOptions?.perView;

        if (typeof perViewValue === "number") {
          slidesPerView = perViewValue;
        } else if (typeof perViewValue === "function") {
          const result = perViewValue();
          slidesPerView = typeof result === "number" ? result : 1;
        } else if (perViewValue === "auto") {
          slidesPerView = 1;
        }
      } else if (typeof slidesOptions === "number") {
        slidesPerView = slidesOptions;
      }

      setShowDots(totalSlides > slidesPerView);
    }
  }, [created, items]);

  const totalSlides = instanceRef.current?.track.details.slides.length || 0;

  return (
    <section className="relative">
      <div
        ref={sliderRef}
        style={{ opacity: created ? 1 : 0 }}
        className="keen-slider w-full overflow-hidden"
      >
        {items}
      </div>

      {/* Pagination Dots */}
      {showPagination && created && instanceRef.current && showDots && (
        <div className="dots flex justify-center mt-4">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`dot w-3 h-3 rounded-full mx-1 focus:outline-none ${currentSlide === idx
                ? "bg-[color:var(--color-one)]"
                : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {showNavigation && created && instanceRef.current && (
        <div className="flex flex-row w-full gap-2">
          <button
            onClick={() => instanceRef.current?.prev()}
            className={`bg-[color:var(--color-two)] hover:bg-[color:var(--quick-color)] text-[color:var(--bg-color)] rounded-lg p-2 shadow-md transition-all duration-200 ${currentSlide === 0 ? "opacity-0 cursor-not-allowed" : ""
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
            onClick={() => instanceRef.current?.next()}
            className={`bg-[color:var(--color-two)] hover:bg-[color:var(--quick-color)] text-[color:var(--bg-color)] rounded-lg p-2 shadow-md transition-all duration-200 ${currentSlide === arrowMaxSlide ? "opacity-0 cursor-not-allowed" : ""
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
        </div>
      )}
    </section>
  );
};

export default observer(SimpleSlider);
