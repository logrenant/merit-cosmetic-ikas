import React, { ReactNode, useState } from "react";
import {
  KeenSliderHooks,
  KeenSliderOptions,
  KeenSliderInstance,
  useKeenSlider,
} from "keen-slider/react";
import { observer } from "mobx-react-lite";
import "keen-slider/keen-slider.min.css";

const MutationPlugin = (slider: KeenSliderInstance) => {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      slider.update();
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

const AutoPlay = (slider: KeenSliderInstance) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;
  function clearNextTimeout() {
    clearTimeout(timeout);
  }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 2000);
  }
  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

const SimpleSliderAuto = ({
  items,
  keenOptions,
}: {
  items: ReactNode;
  keenOptions: KeenSliderOptions<{}, {}, KeenSliderHooks> | undefined;
}) => {
  const [loaded, setLoading] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      ...keenOptions,
      created: () => {
        setLoading(true);
      },
    },
    [MutationPlugin, AutoPlay]
  );

  return (
    <section className="relative">
      <div ref={sliderRef} className="keen-slider w-full">
        {items}
      </div>
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.prev()
            }
            className="bg-[color:var(--bg-color)] shadow-shadow2 absolute top-1/2 transform -translate-y-1/2 left-4 rounded-sm w-9 h-9 text-gray-700 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.next()
            }
            className="bg-[color:var(--bg-color)] shadow-shadow2 absolute top-1/2 transform -translate-y-1/2 right-4 rounded-sm w-9 h-9 text-gray-700 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default observer(SimpleSliderAuto);
