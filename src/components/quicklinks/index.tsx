import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { KeenSliderInstance, KeenSliderPlugin, useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { QuicklinksProps } from "../__generated__/types";
import { sliderBreakpoints } from "src/styles/breakpoints";


const QuickLinks = ({ links }: QuicklinksProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);


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
    slides: { perView: 2, spacing: 12 },
    breakpoints: {
      [sliderBreakpoints.md]: { slides: { perView: 3, spacing: 16 } },
      [sliderBreakpoints.lg]: { slides: { perView: 6, spacing: 16 } },
      [sliderBreakpoints.xl]: { slides: { perView: 8, spacing: 16 } },
    },
  }, [MutationPlugin]);

  return (
    <div dir="ltr" className="pt-6 pb-2 layout relative items-center">

      {/* Slider Container */}
      <div ref={sliderRef} className="keen-slider flex flex-row">
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
            className={`xl:hidden absolute top-[40%] left-0 text-[color:var(--color-two)] ${currentSlide === 0 ? "cursor-not-allowed" : ""
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
            onClick={() => slider.current?.next()}
            className={`xl:hidden absolute top-[40%] right-0 text-[color:var(--color-two)] ${currentSlide === maxSlide ? "cursor-not-allowed" : ""
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
    </div>
  );
};

export default observer(QuickLinks);
