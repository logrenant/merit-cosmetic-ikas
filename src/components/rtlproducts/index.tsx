import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { IkasStorefrontConfig } from "@ikas/storefront-config";
import { Image } from "@ikas/storefront";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../composites/productcard";
import SwiperSlider from "../composites/swiperslider";
import { RtlproductsProps } from "../__generated__/types";
import { useScreen } from "src/utils/hooks/useScreen";
import { useUserLocation } from "src/utils/useUserLocation";
import { useDirection } from "src/utils/useDirection";



const HomeProducts = ({ products, showCategories, xlBanner, lgBanner, smBanner, soldOutButton, }: RtlproductsProps) => {
  const { isTurkishIP, filterProductsByLocation } = useUserLocation();
  const { direction } = useDirection();
  const { isSmall, isMobile, isDesktop } = useScreen();

  const currentLocale = IkasStorefrontConfig.getCurrentLocale();
  const isEnglish = currentLocale === 'en';

  if (isEnglish) {
    return null;
  }

  const ref = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState("");
  const [firstFiveCategories, setFirstFiveCategories] = useState(products ? products.slice(0, 5) : []);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (products) {
      const cats = products.slice(0, 5);
      setFirstFiveCategories(cats);
      // Son category'yi seçili yap (last index)
      if (cats.length > 0) {
        setSelectedProducts(cats[cats.length - 1]?.image?.id || "");
      }
    }
  }, [products]);



  const [isVisible, setIsVisible] = useState(true);
  const [pxValue, setPxValue] = useState('150px');
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const elementHeight = entry.contentRect.height;
        if (elementHeight < 300) {
          setIsVisible(false);
          setPxValue('75px');
        } else {
          setIsVisible(true);
          setPxValue('150px');
        }
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);


  return (
    <div dir="ltr" className="TEST-PARENT mb-4 mt-2 md:mt-4 layout relative" ref={ref} >

      {isDesktop && xlBanner && (
        <div className="aspect-1400/120 relative mb-4">
          <Image
            image={xlBanner}
            alt={xlBanner.altText || "Banner"}
            layout="fill"
            className="object-contain"
          />
        </div>
      )}
      {!isDesktop && isMobile && !isSmall && lgBanner && (
        <div className="aspect-704/64 relative mb-4">
          <Image
            image={lgBanner}
            alt={lgBanner.altText || "Banner"}
            layout="fill"
            className="object-contain"
          />
        </div>
      )}
      {isSmall && smBanner && (
        <div className="aspect-316/64 relative mb-4">
          <Image
            image={smBanner}
            alt={smBanner.altText || "Banner"}
            layout="fill"
            className="object-contain"
          />
        </div>
      )}

      {showCategories && firstFiveCategories.length > 0 && (
        <div className="w-full mb-4 relative">
          {(() => {
            const swiperRef = useRef<any>(null);
            // Başlangıçta son kategori slide'ı seçili olsun
            const initialSlideIndex = firstFiveCategories.length > 0 ? firstFiveCategories.length - 1 : 0;
            const [currentSlide, setCurrentSlide] = useState(initialSlideIndex);
            const totalDots = firstFiveCategories.length;

            // Swiper ilk renderda son slide'a gitsin
            useEffect(() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slideTo(initialSlideIndex, 0);
              }
            }, [initialSlideIndex]);

            return (
              <>
                <Swiper
                  ref={swiperRef}
                  modules={[Navigation]}
                  slidesPerView={2}
                  spaceBetween={10}
                  breakpoints={{
                    768: { slidesPerView: 4, spaceBetween: 16 },
                    1024: { slidesPerView: 5, spaceBetween: 16 },
                  }}
                  navigation={false}
                  className="w-full"
                  initialSlide={initialSlideIndex}
                  onSlideChange={(swiper: SwiperClass) => setCurrentSlide(swiper.activeIndex)}
                >
                  {firstFiveCategories.map((e) => (
                    <SwiperSlide key={e.image.id} className="min-w-0 w-full flex justify-center">
                      <div
                        onClick={() => setSelectedProducts(e.image.id)}
                        className={`aspect-648/270 cursor-pointer w-full relative overflow-hidden ${selectedProducts === e.image.id
                          ? "opacity-90 border-4 border-[color:var(--color-one)]"
                          : "hover:border-4 hover:border-[color:var(--color-one)] transition-all duration-300"
                          }`}
                      >
                        <Image
                          id={"test-id---" + e.image.id}
                          alt={e.image?.altText || ""}
                          useBlur
                          image={e.image}
                          layout="fill"
                          objectFit="cover"
                          className={`duration-300 ${selectedProducts === e.image.id
                            ? "scale-110"
                            : "hover:scale-110"
                            }`}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Custom Navigation Arrows */}
                <button
                  onClick={() => swiperRef.current?.swiper.slidePrev()}
                  disabled={currentSlide === 0}
                  className={`xl:hidden absolute top-[30%] left-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer z-10 ${currentSlide === 0 ? "cursor-not-allowed" : ""}`}
                  aria-label="Previous"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => swiperRef.current?.swiper.slideNext()}
                  disabled={currentSlide === totalDots - 1}
                  className={`xl:hidden absolute top-[30%] right-[-32px] text-[color:var(--color-two)] hover:text-[color:var(--color-four)] duration-150 cursor-pointer z-10 ${currentSlide === totalDots - 1 ? "cursor-not-allowed" : ""}`}
                  aria-label="Next"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            );
          })()}
        </div>
      )}
      {/* Product slider */}
      {(() => {
        const selectedCategory = products?.find((e) => e.image.id === selectedProducts);
        const categoryProducts = selectedCategory?.products.data || [];
        const filteredProducts = filterProductsByLocation(categoryProducts);
        const productSlides = filteredProducts.map((product) => (
          <ProductCard key={product.id + "product"} product={product} soldOutButtonText={soldOutButton} />
        ));

        // Her category için son slide'dan başlat
        const initialSlide = Math.max(0, productSlides.length - 1);

        return (
          <SwiperSlider
            key={`rtl-products-${selectedProducts}-${filteredProducts.length}`}
            showPagination={true}
            showNavigation={false}
            perView={2}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 8 },
              1024: { slidesPerView: 5, spaceBetween: 8 },
            }}
            items={productSlides}
            initialSlide={initialSlide}
          />
        );
      })()}
    </div>
  );
};
export default observer(HomeProducts);