import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import ProductCard from "../composites/productcard";
import { ProductlistgridProps } from "../__generated__/types";
import {
  IkasCategory,
  IkasProductFilterDisplayType,
  IkasProductFilterType,
  IkasProductListSortType,
  useTranslation,
} from "@ikas/storefront";
import { IkasStorefrontConfig } from "@ikas/storefront-config";
import SwiperSlider from "../composites/swiperslider";
import FilterMobile, {
  CategoryList,
  List,
  NumberList,
} from "../composites/filtermobile";
import { CategoryWithChildrenType } from "../composites/mobilemenu";
import { useDirection } from "../../utils/useDirection";
import { useUserLocation } from "../../utils/useUserLocation";

type Option = {
  value: string;
  labelKey: string;
};

const options: Option[] = [
  {
    value: IkasProductListSortType.FEATURED,
    labelKey: "featured",
  },
  {
    labelKey: "increasingPrice",
    value: IkasProductListSortType.INCREASING_PRICE,
  },
  {
    labelKey: "decreasingPrice",
    value: IkasProductListSortType.DECREASING_PRICE,
  },
  {
    labelKey: "increasingDiscount",
    value: IkasProductListSortType.INCREASING_DISCOUNT,
  },
  {
    labelKey: "decrasingDiscount",
    value: IkasProductListSortType.DECRASING_DISCOUNT,
  },
  {
    labelKey: "firstAdded",
    value: IkasProductListSortType.FIRST_ADDED,
  },
  {
    labelKey: "lastAdded",
    value: IkasProductListSortType.LAST_ADDED,
  },
];

const ProductListGrid: React.FC<
  ProductlistgridProps & { pageSpecificData: IkasCategory }
> = ({ products, popular, categories, pageSpecificData, soldOut }) => {
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (products.isLoading) return;
    products.setSortType(e.target.value as IkasProductListSortType);
  };
  const enabledOptions = options.filter((option) => {
    const isFeaturedSort = option.value === IkasProductListSortType.FEATURED;
    const isFeaturedSortEnabled =
      isFeaturedSort && !products.isFeaturedSortEnabled;

    return isFeaturedSort ? isFeaturedSortEnabled : true;
  });

  const categoriesWithChildrens: CategoryWithChildrenType[] = [];
  categories.data.map((cat) => {
    if (cat.parentId === null) {
      const baseCat: CategoryWithChildrenType = {
        id: cat.id,
        name: cat.name,
        href: cat.href,
        parentId: cat.parentId,
        childrens: [],
      };
      const children: CategoryWithChildrenType[] = [];
      categories.data.map((child) => {
        if (child.parentId === cat.id) {
          children.push({
            id: child.id,
            name: child.name,
            href: child.href,
            parentId: child.parentId,
            childrens: categories.data
              .filter((c) => c.parentId === child.id)
              .map((el) => {
                return {
                  id: el.id,
                  name: el.name,
                  href: el.href,
                  parentId: el.parentId,
                  childrens: [],
                };
              }),
          });
        }
      });
      baseCat.childrens = children;
      categoriesWithChildrens.push(baseCat);
    }
  });
  const currentCategory: CategoryWithChildrenType =
    categoriesWithChildrens.find(
      (cat) =>
        cat.id === pageSpecificData?.id ||
        cat.childrens?.find((el) => el.id === pageSpecificData?.id) ||
        cat.childrens?.find((el) =>
          el.childrens?.find((el) => el.id === pageSpecificData?.id)
        )
    )!;
  const { direction } = useDirection();
  const { t } = useTranslation();
  const { filterProductsByLocation, adjustProductCount, isTurkishIP, getNextBatchIfNeeded } = useUserLocation();
  const [show, setShow] = useState(false);
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [allProductsForTurkishIP, setAllProductsForTurkishIP] = useState<any[]>([]);
  const [isLoadingAllProducts, setIsLoadingAllProducts] = useState(false);
  const [displayedProductsCount, setDisplayedProductsCount] = useState(20);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    setCurrentLocale(IkasStorefrontConfig.getCurrentLocale());
  }, []);

  const filteredProducts = useMemo(() => {
    if (pageSpecificData?.href === "/otc" && isTurkishIP) {
      if (!products.data) return [];
      return filterProductsByLocation(products.data).slice(0, displayedProductsCount);
    }

    return products.data || [];
  }, [products.data, filterProductsByLocation, displayedProductsCount, pageSpecificData?.href, isTurkishIP]);

  const adjustedProductCount = useMemo(() => {
    if (pageSpecificData?.href === "/otc" && isTurkishIP) {
      if (!products.data) return 0;
      return filterProductsByLocation(products.data).length;
    }
    return products.count;
  }, [products.data, filterProductsByLocation, pageSpecificData?.href, products.count, isTurkishIP]);

  const filteredPopularProducts = useMemo(() => {
    return popular.data ? filterProductsByLocation(popular.data) : [];
  }, [popular.data, filterProductsByLocation]);

  useEffect(() => {
    setShow(false);
    setDisplayedProductsCount(20);

    const categoryChanged = currentCategoryId !== pageSpecificData?.id;

    if (categoryChanged) {
      setCurrentCategoryId(pageSpecificData?.id || null);

      if (isTurkishIP) {
        setAllProductsForTurkishIP([]);
        setIsLoadingAllProducts(false);
        setIsAutoLoading(false);
      }
    }

    setShow(true);
  }, [pageSpecificData?.id, isTurkishIP, currentCategoryId]);

  useEffect(() => {
    const loadAllProductsForTurkish = async () => {
      // Only for OTC category and Turkish IP
      if (pageSpecificData?.href !== "/otc" || !isTurkishIP || isLoadingAllProducts) return;

      const isSameCategory = currentCategoryId === pageSpecificData?.id;
      if (!isSameCategory) return;

      if (!products.data || products.data.length === 0) return;

      setIsLoadingAllProducts(true);
      const allProducts: any[] = [...(products.data || [])];

      try {
        while (products.hasNext) {
          await products.getNext();
          if (products.data) {
            const currentIds = new Set(allProducts.map(p => p.id));
            const newProducts = products.data.filter(p => !currentIds.has(p.id));
            allProducts.push(...newProducts);
          }
        }

        if (currentCategoryId === pageSpecificData?.id) {
          setAllProductsForTurkishIP(allProducts);
        }
      } catch (error) {
        console.error('Error loading all products for Turkish IP:', error);
      } finally {
        setIsLoadingAllProducts(false);
      }
    };

    if (pageSpecificData?.href === "/otc" && isTurkishIP &&
      products.data &&
      products.data.length > 0 &&
      !isLoadingAllProducts &&
      currentCategoryId === pageSpecificData?.id) {
      const timeoutId = setTimeout(() => {
        loadAllProductsForTurkish();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isTurkishIP, pageSpecificData?.id, pageSpecificData?.href, products.data?.length, currentCategoryId, isLoadingAllProducts, products.hasNext]);

  const shouldShowLoadMore = useMemo(() => {
    // Only apply Turkish IP logic for OTC category
    if (pageSpecificData?.href === "/otc" && isTurkishIP) {
      const isSameCategory = currentCategoryId === pageSpecificData?.id;
      if (!isSameCategory) {
        return products.hasNext;
      }

      if (isLoadingAllProducts) {
        return false;
      }

      if (allProductsForTurkishIP.length > 0) {
        const allInStockProducts = allProductsForTurkishIP.filter(product => product.isAddToCartEnabled);
        const currentlyDisplayed = filteredProducts.length;
        return currentlyDisplayed < allInStockProducts.length;
      }

      return products.hasNext && filteredProducts.length < (products.data?.length || 0);
    }

    // For all other cases (non-OTC or non-Turkish IP), show normal load more
    return products.hasNext;
  }, [
    isTurkishIP,
    isLoadingAllProducts,
    allProductsForTurkishIP,
    filteredProducts.length,
    products.hasNext,
    products.data,
    currentCategoryId,
    pageSpecificData?.id,
    pageSpecificData?.href
  ]);

  useEffect(() => {
    const autoFetchIfNeeded = async () => {
      // Only for OTC category and Turkish IP
      if (pageSpecificData?.href !== "/otc" || !isTurkishIP) return;

      if (products.data && !isAutoLoading && !products.isLoading) {
        const availableProducts = filterProductsByLocation(products.data);

        if (availableProducts.length < 20 && products.hasNext) {
          setIsAutoLoading(true);
          try {
            await getNextBatchIfNeeded(products.data, products, 20);
          } catch (error) {
            console.error('Auto-fetch failed:', error);
          } finally {
            setIsAutoLoading(false);
          }
        }
      }
    };

    autoFetchIfNeeded();
  }, [products.data, isTurkishIP, isAutoLoading, products.isLoading, products.hasNext, filterProductsByLocation, getNextBatchIfNeeded, pageSpecificData?.href]);

  return (
    <div dir={direction} className="my-10 layout">
      <div className="grid grid-cols-[100%] lg:grid-cols-[260px_calc(100%-284px)] gap-6">
        <div className="lg:block hidden">
          <div className="text-2xl text-[color:var(--color-two)] font-medium mb-4">
            {pageSpecificData?.name}
          </div>
          {currentCategory?.childrens && (
            <div className="mb-3 w-full">
              {currentCategory?.childrens?.map((filter, i) => (
                <div key={filter.id}>
                  <CategoryList
                    last={currentCategory?.childrens?.length === i + 1}
                    allCategories={categoriesWithChildrens}
                    filter={filter}
                  />
                </div>
              ))}
            </div>
          )}
          {products.count > 0 &&
            products?.filters?.map((filter) => {
              if (isTurkishIP && filter.type === IkasProductFilterType.STOCK_STATUS) {
                return null;
              }

              return (
                <div key={filter.id}>
                  {filter.displayType === IkasProductFilterDisplayType.LIST && (
                    <List filter={filter} items={filter.displayedValues} products={products} />
                  )}
                  {filter.displayType ===
                    IkasProductFilterDisplayType.NUMBER_RANGE_LIST && (
                      <NumberList
                        filter={filter}
                        items={filter.numberRangeListOptions || []}
                      />
                    )}
                </div>
              );
            })}

          {products.isFiltered && (
            <button
              disabled={products.isLoading}
              onClick={() => {
                if (products.isLoading) return;
                if (products.isFiltered) {
                  products.clearFilters();
                }
              }}
              className="disabled:opacity-60 whitespace-nowrap mx-auto tracking-wide border-[color:var(--color-one)] border text-[color:var(--color-one)] text-sm w-full rounded-sm py-1.5 px-5 cursor-pointer"
            >
              {t("categoryPage.clearFilters")}
            </button>
          )}
        </div>
        <div>
          {show && filteredPopularProducts.length > 0 && (
            <>
              <div className="text-2xl text-[color:var(--color-two)] font-medium mb-10 text-center tracking-widest">
                {t("categoryPage.mostPopular")}
              </div>
              <div dir="ltr" className="mb-8">
                <SwiperSlider
                  showPagination={true}
                  showNavigation={false}
                  perView={2}
                  breakpoints={{
                    768: { slidesPerView: 3, spaceBetween: 8 },
                    1024: { slidesPerView: 5, spaceBetween: 8 },
                  }}
                  initialSlide={(() => {
                    const isArabic = isClient && currentLocale === 'ar';
                    return isArabic ? Math.max(0, filteredPopularProducts.length - 1) : 0;
                  })()}
                  items={(() => {
                    const isArabic = isClient && currentLocale === 'ar';
                    const products = isArabic ? [...filteredPopularProducts].reverse() : filteredPopularProducts;

                    return products.map((product, index) => (
                      <ProductCard
                        key={`popular-${product.id}-${index}`}
                        product={product}
                        soldOutButtonText={soldOut?.soldOutButton}
                      />
                    ));
                  })()}
                />
              </div>
            </>
          )}
          <div className="mb-8 flex items-center justify-between">
            <div className="text-[14px] lg:block hidden">
              {adjustedProductCount} {t("categoryPage.product")}
            </div>

            <div className="flex w-full justify-end lg:w-[unset] items-center gap-2">
              <FilterMobile
                categoriesWithChildrens={categoriesWithChildrens}
                categories={currentCategory}
                pageSpecificData={pageSpecificData.name}
                products={products}
              />

              <div className="text-[12px] lg:block hidden">
                {t("categoryPage.sort")}:
              </div>
              <select
                className="max-w-[350px] w-full text-xs border border-[color:var(--gray-two)] rounded-sm"
                onChange={onSelectChange}
                disabled={products.isLoading}
              >
                {enabledOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`categoryPage.sortBy.${option.labelKey}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {filteredProducts.length > 0 ? (
            <div
              id="listgrid"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}-${product.isAddToCartEnabled}`}
                  product={product}
                  soldOutButtonText={soldOut?.soldOutButton}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-lg">{t("categoryPage.empty")}</div>
          )}
          {shouldShowLoadMore && (
            <div className="flex mt-8">
              <button
                id="loadmore"
                onClick={() => {
                  // Only use Turkish IP logic for OTC category
                  if (pageSpecificData?.href === "/otc" && isTurkishIP && allProductsForTurkishIP.length > 0) {
                    const currentProductCount = filteredProducts.length;
                    setDisplayedProductsCount(prev => prev + 20);

                    setTimeout(() => {
                      const productGrid = document.getElementById("listgrid");
                      if (productGrid) {
                        const productElements = productGrid.children;
                        const targetProductElement = productElements[currentProductCount];

                        if (targetProductElement) {
                          const targetTop = (targetProductElement as HTMLElement).offsetTop;
                          const scrollOffset = 0;

                          window.scrollTo({
                            top: targetTop - scrollOffset,
                            behavior: "smooth",
                          });
                        }
                      }
                    }, 100);
                  } else {
                    // Normal load more behavior for all other cases
                    const currentProductCount = filteredProducts.length;

                    products.getNext().then(() => {
                      const newProductStartIndex = currentProductCount;

                      setTimeout(() => {
                        const productGrid = document.getElementById("listgrid");
                        if (productGrid) {
                          const productElements = productGrid.children;
                          const targetProductElement = productElements[newProductStartIndex];

                          if (targetProductElement) {
                            const targetTop = (targetProductElement as HTMLElement).offsetTop;
                            const scrollOffset = 0;

                            window.scrollTo({
                              top: targetTop - scrollOffset,
                              behavior: "smooth",
                            });
                          }
                        }
                      }, 100);
                    });
                  }
                }}
                disabled={(() => {
                  // Only apply special logic for OTC category and Turkish IP
                  if (pageSpecificData?.href === "/otc" && isTurkishIP) {
                    return products.isLoading || isLoadingAllProducts;
                  }
                  // Normal behavior for all other cases
                  return products.isLoading;
                })()}
                className="flex items-center justify-center gap-2 disabled:opacity-60 px-20 text-lg py-10 bg-[color:var(--color-two)] rounded-sm text-white cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <span>{t("categoryPage.more")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(ProductListGrid);
