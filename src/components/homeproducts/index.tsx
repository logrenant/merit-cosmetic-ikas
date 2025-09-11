import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@ikas/storefront";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../composites/productcard";
import SwiperSlider from "../composites/swiperslider";
import { HomeproductsProps } from "../__generated__/types";
import { useScreen } from "src/utils/hooks/useScreen";
import { useUserLocation } from "src/utils/useUserLocation";
import { IkasStorefrontConfig } from "@ikas/storefront-config";



const HomeProducts = ({ products, categories, xlBanner, lgBanner, smBanner, soldOut, }: HomeproductsProps) => {
  const { isTurkishIP, filterProductsByLocation } = useUserLocation();
  const { isSmall, isMobile, isDesktop } = useScreen();
  const currentLocale = IkasStorefrontConfig.getCurrentLocale();
  const isArabic = currentLocale === 'ar';
  const ref = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(products?.[0]?.image?.id || "");
  const [firstFiveCategories, setFirstFiveCategories] = useState(products ? products.slice(0, 5) : []);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (products) {
      const cats = products.slice(0, 5);
      setFirstFiveCategories(cats);
      if (!cats.some(cat => cat.image.id === selectedProducts)) {
        setSelectedProducts(cats[0]?.image?.id || "");
      }
    }
  }, [products, selectedProducts, isClient]);



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
    <div
      className={`TEST-PARENT my-4 layout relative${isArabic ? ' hidden' : ''}`}
      ref={ref}
    >

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

      {categories && firstFiveCategories.length > 0 && (
        <div className="w-full mb-4 relative">
          {(() => {
            const swiperRef = useRef<any>(null);
            const [currentSlide, setCurrentSlide] = useState(0);
            const totalDots = firstFiveCategories.length;
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
          <ProductCard key={product.id + "product"} product={product} soldOutButtonText={soldOut?.soldOutButton} />
        ));

        return (
          <SwiperSlider
            key={`home-products-${selectedProducts}-${filteredProducts.length}`}
            showPagination={true}
            showNavigation={false}
            perView={2}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 8 },
              1024: { slidesPerView: 5, spaceBetween: 8 },
            }}
            items={productSlides}
            initialSlide={0}
          />
        );
      })()}
    </div>
  );
};
export default observer(HomeProducts);