import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { KeenSliderInstance } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";

import breakpoints from "src/styles/breakpoints";
import { BannerProps } from "../__generated__/types";
import { useScreen } from "src/utils/hooks/useScreen";

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

export const imageSizes = `(max-width: ${breakpoints.xxl}) 100vw, ${breakpoints.xxl}`;

const Banner: React.FC<BannerProps> = ({ banners, col, slider }) => {
  const { isMobile } = useScreen();

  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop: true,
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 568px)": {
          slides: { perView: Number(col) === 3 ? 2 : Number(col), spacing: 16 },
        },
        "(min-width: 1024px)": {
          slides: {
            perView: Number(col),
            spacing: 16,
          },
        },
      },
      created: () => {
        setLoaded(true);
      },
    },
    [AutoPlay]
  );
  return (
    <div dir="ltr" className="mt-4 layout">
      {slider ? (
        <section className="relative">
          <div ref={sliderRef} className="keen-slider w-full">
            {banners?.map((item, i) => {
              if (Number(col) === 1)
                return (
                  <Link
                    href={item.link.href}
                    key={`${item.link.itemId}${col}${i}${item.link.href}`}
                  >
                    <a className="keen-slider__slide">
                      <div className="aspect-[608/186] relative overflow-hidden w-full">
                        <Image
                          image={item.image}
                          alt={item.image.altText || ""}
                          useBlur
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </a>
                  </Link>
                );
              if (Number(col) === 2)
                return (
                  <Link
                    href={item.link.href}
                    key={`${item.link.itemId}${col}${i}${item.link.href}`}
                  >
                    <a className="keen-slider__slide">
                      <div className="aspect-[608/316] relative overflow-hidden w-full">
                        <Image
                          image={item.image}
                          layout="fill"
                          alt={item.image.altText || ""}
                          useBlur
                          objectFit="cover"
                        />
                      </div>
                    </a>
                  </Link>
                );
              return (
                <Link
                  href={item.link.href}
                  key={`${item.link.itemId}${col}${i}${item.link.href}`}
                >
                  <a className="keen-slider__slide">
                    <div className="aspect-[608/310] relative overflow-hidden w-full">
                      <Image
                        image={item.image}
                        layout="fill"
                        alt={item.image.altText || ""}
                        useBlur
                        objectFit="cover"
                      />
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
          {loaded && instanceRef.current && (
            <>
              <button
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                className="shadow-shadow2 absolute top-1/2 transform -translate-y-1/2 left-2 text-[color:var(--color-one)] flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
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
                className="shadow-shadow2 absolute top-1/2 transform -translate-y-1/2 right-2 rounded text-[color:var(--color-one)] flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
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
      ) : Number(col) === 3 ? (
        <div className="grid md:grid-cols-3 gap-4">
          {banners?.map((item, i) => {
            return (
              <Link
                href={item.link.href}
                key={`${item.link.itemId}${col}${i}${item.link.href}`}
              >
                <a className="aspect-[608/380] relative overflow-hidden w-full">
                  <Image
                    image={item.image}
                    alt={item.image.altText || ""}
                    useBlur
                    layout="fill"
                    objectFit="cover"
                  />
                </a>
              </Link>
            );
          })}
        </div>
      ) : Number(col) === 2 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {banners?.map((item, i) => {
            return (
              <Link
                href={item.link.href}
                key={`${item.link.itemId}${col}${i}${item.link.href}`}
              >
                <a className="aspect-[608/316] relative overflow-hidden w-full">
                  <Image
                    image={item.image}
                    alt={item.image.altText || ""}
                    useBlur
                    layout="fill"
                    objectFit="cover"
                  />
                </a>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners?.map((item, i) => {
            return (
              <Link
                href={item.link.href}
                key={`${item.link.itemId}${col}${i}${item.link.href}`}
              >
                <a className="aspect-[608/186] relative overflow-hidden w-full">
                  <Image
                    image={item.image}
                    alt={item.image.altText || ""}
                    useBlur
                    layout="fill"
                    objectFit="cover"
                  />
                </a>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default observer(Banner);
