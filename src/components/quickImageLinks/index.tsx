import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";
import { KeenSliderInstance, KeenSliderPlugin, useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { QuickImageLinksProps } from "../__generated__/types";
import { sliderBreakpoints } from "src/styles/breakpoints";


const QuickLinks = ({ links }: QuickImageLinksProps) => {
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
        slides: { perView: 2, spacing: 16 },
        breakpoints: {
            [sliderBreakpoints.md]: { slides: { perView: 3, spacing: 16 } },
            [sliderBreakpoints.lg]: { slides: { perView: 6, spacing: 16 } },
            [sliderBreakpoints.xl]: { slides: { perView: 6, spacing: 24 } },
        },
    }, [MutationPlugin]);

    return (
        <div dir="ltr" className="pt-6 pb-2 layout relative items-center">

            {/* Slider Container */}
            <div ref={sliderRef} className="keen-slider flex flex-row">
                {links?.items.map((e, i) => (
                    <div className="keen-slider__slide" key={i}>
                        <Link href={e.link.href}>
                            <a>
                                <div className="aspect-648/270 relative hover:border-4 hover:border-[color:var(--color-one)] transition-all duration-300">
                                    <Image
                                        alt={e.icon?.altText || ""}
                                        useBlur
                                        layout="fill"
                                        objectFit="cover"
                                        image={e.icon}
                                        className="hover:scale-110 duration-300"
                                    />
                                </div>
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
                        className={`xl:hidden absolute top-[40%] left-0 lg:left-[16px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer ${currentSlide === 0 ? "cursor-not-allowed" : ""
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
                        className={`xl:hidden absolute top-[40%] right-0 lg:right-[16px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer ${currentSlide === maxSlide ? "cursor-not-allowed" : ""
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
