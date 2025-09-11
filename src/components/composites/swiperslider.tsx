import React, { ReactNode, useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperSliderProps {
    items: ReactNode[];
    showPagination?: boolean;
    showNavigation?: boolean;
    perView?: number;
    breakpoints?: Record<string, { slidesPerView: number; spaceBetween: number }>;
    initialSlide?: number;
}

const SwiperSlider: React.FC<SwiperSliderProps> = ({
    items,
    showPagination = true,
    showNavigation = false,
    perView = 2,
    breakpoints = {
        768: { slidesPerView: 3, spaceBetween: 8 },
        1024: { slidesPerView: 5, spaceBetween: 8 },
    },
    initialSlide,
}) => {
    let computedInitialSlide = 0;
    if (typeof initialSlide === 'number') {
        computedInitialSlide = initialSlide;
    } else {
        computedInitialSlide = items.findIndex(item => !!item);
        if (computedInitialSlide === -1) computedInitialSlide = 0;
    }

    const [sliderKey, setSliderKey] = useState(0);
    const swiperRef = useRef<any>(null);
    const [currentSlide, setCurrentSlide] = useState(computedInitialSlide);
    const [isDesktop, setIsDesktop] = useState(false);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState(perView);

    useEffect(() => {
        const checkDesktop = () => {
            const width = window.innerWidth;
            setIsDesktop(width >= 1024);

            if (width >= 1024 && breakpoints[1024]) {
                setCurrentSlidesPerView(breakpoints[1024].slidesPerView);
            } else if (width >= 768 && breakpoints[768]) {
                setCurrentSlidesPerView(breakpoints[768].slidesPerView);
            } else {
                setCurrentSlidesPerView(perView);
            }
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, [perView, breakpoints]);

    const totalDots = Math.max(1, items.length - currentSlidesPerView + 1);

    const activeDotIndex = Math.min(currentSlide, totalDots - 1);

    useEffect(() => {
        setSliderKey(prev => prev + 1);
        setCurrentSlide(computedInitialSlide);
    }, [items.length, computedInitialSlide, currentSlidesPerView]);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(computedInitialSlide, 0);
            setCurrentSlide(computedInitialSlide);
        }
    }, [sliderKey, computedInitialSlide, currentSlidesPerView]);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const currentActiveIndex = swiperRef.current.swiper.activeIndex;
            setCurrentSlide(currentActiveIndex);
        }
    }, [currentSlidesPerView]);

    const swiperOptions = {
        modules: [Navigation, Pagination],
        slidesPerView: perView,
        slidesPerGroup: 1,
        spaceBetween: 4,
        breakpoints,
        navigation: false,
        pagination: false,
        className: "w-full overflow-hidden keen-swiper",
        initialSlide: computedInitialSlide,
        onSlideChange: (swiper: any) => {
            setCurrentSlide(swiper.activeIndex);
        },
        onSwiper: (swiper: any) => {
            setCurrentSlide(swiper.activeIndex);
        },
    };

    return (
        <section className="relative keen-swiper-section">
            <Swiper key={sliderKey} ref={swiperRef} {...swiperOptions}>
                {items.map((item, idx) => (
                    <SwiperSlide key={idx} className="min-w-0 w-full flex justify-center">
                        <div className="w-full">{item}</div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {showNavigation && (
                <>
                    <button
                        onClick={() => swiperRef.current?.swiper.slidePrev()}
                        disabled={currentSlide === 0}
                        className={`xl:hidden absolute top-[30%] left-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer ${currentSlide === 0 ? "cursor-not-allowed" : ""}`}
                        aria-label="Previous"
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
                        onClick={() => swiperRef.current?.swiper.slideNext()}
                        disabled={currentSlide >= items.length - currentSlidesPerView}
                        className={`xl:hidden absolute top-[30%] right-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer  ${currentSlide >= items.length - currentSlidesPerView ? "cursor-not-allowed" : ""}`}
                        aria-label="Next"
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
            {showPagination && items.length > currentSlidesPerView && (
                <div className="dots flex justify-center mt-4">
                    {Array.from({ length: totalDots }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                swiperRef.current?.swiper.slideTo(idx);
                                setCurrentSlide(idx);
                            }}
                            className={`dot w-3 h-3 rounded-full mx-1 focus:outline-none cursor-pointer ${activeDotIndex === idx ? "bg-[color:var(--color-four)]" : "bg-[color:var(--color-one)]"}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SwiperSlider;
