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

const SimpleSlider = ({
  items,
  keenOptions,
}: {
  items: ReactNode;
  keenOptions: KeenSliderOptions<{}, {}, KeenSliderHooks> | undefined;
}) => {
  const [created, setCreated] = useState(false);
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      ...keenOptions,
      created: () => {
        setCreated(true);
      },
    },
    [MutationPlugin]
  );

  return (
    <section className="relative">
      <div
        ref={sliderRef}
        style={{
          opacity: created ? 1 : 0,
        }}
        className="keen-slider w-full"
      >
        {items}
      </div>
      {/* {loaded && instanceRef.current && (
        <>
          <button
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.prev()
            }
            className="bg-[color:var(--bg-color)] shadow-shadow2 absolute top-1/2 transform -translate-y-1/2 left-4 rounded w-9 h-9 text-gray-700 flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <button
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.next()
            }
            className="bg-[color:var(--bg-color)] shadow-shadow2 absolute top-1/2 transform -translate-y-1/2 right-4 rounded w-9 h-9 text-gray-700 flex items-center justify-center"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </>
      )} */}
    </section>
  );
};

export default observer(SimpleSlider);
