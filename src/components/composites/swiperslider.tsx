
import React, { ReactNode, useEffect, useState } from "react";
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
    direction?: 'ltr' | 'rtl';
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
    direction = 'ltr',
    initialSlide = 0,
}) => {
    const [sliderKey, setSliderKey] = useState(0);
    useEffect(() => {
        setSliderKey(prev => prev + 1);
    }, [direction, items.length]);

    const swiperOptions = {
        modules: [Navigation, Pagination],
        slidesPerView: perView,
        spaceBetween: 4,
        breakpoints,
        navigation: showNavigation,
        pagination: showPagination ? { clickable: true } : false,
        className: "w-full overflow-hidden",
        style: { paddingBottom: showPagination ? 32 : 0 },
        dir: direction,
        initialSlide,
        ...(direction === 'rtl' ? {
            autoplay: false,
        } : {}),
    };

    return (
        <section className="relative" dir={direction}>
            <Swiper key={sliderKey} {...swiperOptions}>
                {items.map((item, idx) => (
                    <SwiperSlide key={idx} className="min-w-0 w-full flex justify-center">
                        <div className="w-full">{item}</div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default SwiperSlider;
