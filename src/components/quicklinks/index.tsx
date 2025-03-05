import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { useKeenSlider } from "keen-slider/react";
import { QuicklinksProps } from "../__generated__/types";
import "keen-slider/keen-slider.min.css";

const QuickLinks = ({ links }: QuicklinksProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

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
    slides: {
      perView: "auto",
      spacing: 16,
    },
  });

  return (
    <div dir="ltr" className="pt-6 pb-2 layout relative flex flex-row items-center gap-4">

      {/* Left Navigation Arrow */}
      {loaded && slider.current && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className={`text-[color:var(--color-one)] ${currentSlide === 0 ? "opacity-0 cursor-not-allowed" : ""
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
        </>
      )}

      {/* Slider Container */}
      <div ref={sliderRef} className="keen-slider flex gap-2">
        {links.items.map((e, i) => (
          <div className="keen-slider__slide min-w-[160px]" key={i}>
            <Link href={e.link.href}>
              <a className="flex gap-1 items-end justify-center">
                <div className="w-[35px] h-[32px] relative">
                  <Image
                    alt={e.icon?.altText || ""}
                    useBlur
                    layout="fill"
                    objectFit="contain"
                    image={e.icon}
                  />
                </div>
                <span className="text-[color:var(--black-two)] w-[120px]">
                  {e.link.label}
                </span>
              </a>
            </Link>
          </div>
        ))}
      </div>

      {/* Right Navigation Arrow */}
      {loaded && slider.current && (
        <>
          <button
            onClick={() => slider.current?.next()}
            className={`text-[color:var(--color-one)] ${currentSlide === maxSlide ? "opacity-0 cursor-not-allowed" : ""
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
        </>
      )}
    </div>
  );
};

export default observer(QuickLinks);
