
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
    // initialSlide prop'u gelmezse, her zaman ilk üründen başla (index 0)
    let computedInitialSlide = 0;
    if (typeof initialSlide === 'number') {
        computedInitialSlide = initialSlide;
    } else {
        // Her iki yönde de ilk gerçek ürünün index'i (0)
        computedInitialSlide = items.findIndex(item => !!item);
        if (computedInitialSlide === -1) computedInitialSlide = 0;
    }

    const [sliderKey, setSliderKey] = useState(0);
    const swiperRef = useRef<any>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState(perView);

    useEffect(() => {
        const checkDesktop = () => {
            const width = window.innerWidth;
            setIsDesktop(width >= 1024);

            // Calculate current slides per view based on breakpoints
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

    // Calculate total pages based on items length and slides per view
    const totalDots = Math.max(1, Math.ceil(items.length / currentSlidesPerView));

    useEffect(() => {
        setSliderKey(prev => prev + 1);
    }, [items.length, computedInitialSlide, currentSlidesPerView]); // currentSlidesPerView dependency eklendi

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(computedInitialSlide, 0);
            // Calculate initial page based on initial slide
            const initialPage = Math.floor(computedInitialSlide / currentSlidesPerView);
            setCurrentSlide(initialPage);
        }
    }, [sliderKey, computedInitialSlide, currentSlidesPerView]);

    // Breakpoint değişikliklerinde pagination'ı güncelle
    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const currentActiveIndex = swiperRef.current.swiper.activeIndex;
            const newPage = Math.floor(currentActiveIndex / currentSlidesPerView);
            setCurrentSlide(newPage);
        }
    }, [currentSlidesPerView]);

    const swiperOptions = {
        modules: [Navigation, Pagination],
        slidesPerView: perView,
        slidesPerGroup: 1, // Her seferinde 1 slide kaydır, grup değil
        spaceBetween: 4,
        breakpoints,
        navigation: false,
        pagination: false,
        className: "w-full overflow-hidden keen-swiper",
        initialSlide: computedInitialSlide,
        onSlideChange: (swiper: any) => {
            // Calculate current page based on active index and slides per view
            const currentPage = Math.floor(swiper.activeIndex / currentSlidesPerView);
            setCurrentSlide(currentPage);
        },
        onSwiper: (swiper: any) => {
            // Initial slide ayarlaması
            const initialPage = Math.floor(swiper.activeIndex / currentSlidesPerView);
            setCurrentSlide(initialPage);
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
                        disabled={currentSlide === totalDots - 1}
                        className={`xl:hidden absolute top-[30%] right-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer  ${currentSlide === totalDots - 1 ? "cursor-not-allowed" : ""}`}
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
                                const targetSlide = Math.min(idx * currentSlidesPerView, items.length - 1);
                                swiperRef.current?.swiper.slideTo(targetSlide);
                                setCurrentSlide(idx); // Dot'u hemen güncelle
                            }}
                            className={`dot w-3 h-3 rounded-full mx-1 focus:outline-none cursor-pointer ${currentSlide === idx ? "bg-[color:var(--color-four)]" : "bg-[color:var(--color-one)]"}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SwiperSlider;
