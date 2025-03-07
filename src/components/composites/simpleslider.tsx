import React, { ReactNode, useState } from "react";
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
  showPagination = true
}) => {
  const [created, setCreated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      ...keenOptions,
      created: () => {
        setCreated(true);
      },
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
    },
    [MutationPlugin]
  );

  let perView = 1;
  const totalSlides =
    instanceRef.current && typeof perView === "number"
      ? Math.ceil(instanceRef.current.track.details.slides.length / perView) - 1
      : instanceRef.current?.track.details.slides.length || 0;

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
      {showPagination && created && instanceRef.current && (
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
    </section>
  );
};

export default observer(SimpleSlider);