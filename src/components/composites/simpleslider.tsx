import React, { ReactNode, useState, useEffect } from "react";
import { KeenSliderInstance, KeenSliderOptions, useKeenSlider } from "keen-slider/react";
import { observer } from "mobx-react-lite";

import "keen-slider/keen-slider.min.css";

interface SimpleSliderProps {
  keenOptions?: KeenSliderOptions;
  items: ReactNode[];
  showPagination?: boolean;
  showNavigation?: boolean;
}

const MutationPlugin = (slider: KeenSliderInstance) => {
  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(() => slider.update());
  });

  slider.on("created", () => {
    observer.observe(slider.container, { childList: true });
  });

  slider.on("destroyed", () => {
    observer.disconnect();
  });
};

const SimpleSlider: React.FC<SimpleSliderProps> = observer(({
  keenOptions,
  items,
  showPagination = true,
  showNavigation = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(2);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(5);
      } else {
        setItemsPerView(2);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalDots = Math.max(items.length - itemsPerView + 1, 1);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    ...keenOptions,
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      setLoaded(true);
    },
    slides: { perView: 2, spacing: 10 },
    breakpoints: {
      "(min-width: 1024px)": { slides: { perView: 5, spacing: 16 } },
    },
  },
    [MutationPlugin]
  );

  return (
    <section className="relative">
      <div
        ref={sliderRef}
        style={{ opacity: loaded ? 1 : 0 }}
        className="keen-slider w-full overflow-hidden"
      >
        {items}
      </div>

      {showNavigation && instanceRef && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className={`xl:hidden absolute top-[30%] left-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer ${currentSlide === 0 ? "cursor-not-allowed" : ""
              }`}
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
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === totalDots - 1}
            className={`xl:hidden absolute top-[30%] right-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer  ${currentSlide === totalDots - 1 ? "cursor-not-allowed" : ""
              }`}
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

      {showPagination && instanceRef && totalDots > 1 && (
        <div className="dots flex justify-center mt-4">
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`dot w-3 h-3 rounded-full mx-1 focus:outline-none cursor-pointer ${currentSlide === idx
                ? "bg-[color:var(--color-four)]"
                : "bg-[color:var(--color-one)]"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
});

export default SimpleSlider;
