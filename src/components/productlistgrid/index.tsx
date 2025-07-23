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
import Simpleslider from "../composites/simpleslider";
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
  const [displayedProductsCount, setDisplayedProductsCount] = useState(20); // Show 20 products initially

  // Filter products for Turkish IPs - only show products that can be purchased
  const filteredProducts = useMemo(() => {
    if (!isTurkishIP) {
      // For non-Turkish IPs, use normal product data
      if (!products.data) return [];
      return filterProductsByLocation(products.data);
    }

    // For Turkish IPs, use all loaded products if available, otherwise fallback to current products.data
    const sourceProducts = allProductsForTurkishIP.length > 0 ? allProductsForTurkishIP : (products.data || []);
    const allFiltered = filterProductsByLocation(sourceProducts);

    // Limit displayed products for pagination
    const displayedFiltered = allFiltered.slice(0, displayedProductsCount);

    // Debug: Log filtering results
    if (sourceProducts.length !== allFiltered.length) {
      console.log('Filtering products for Turkish IP:', {
        source: allProductsForTurkishIP.length > 0 ? 'allProducts' : 'currentProducts',
        original: sourceProducts.length,
        allFiltered: allFiltered.length,
        displayed: displayedFiltered.length,
        removed: sourceProducts.length - allFiltered.length
      });
    }

    return displayedFiltered;
  }, [products.data, allProductsForTurkishIP, filterProductsByLocation, isTurkishIP, displayedProductsCount]);

  // Adjust the product count for display
  const adjustedProductCount = useMemo(() => {
    if (!isTurkishIP) {
      return products.count;
    }

    // For Turkish IPs, count only in-stock products from all loaded products
    if (allProductsForTurkishIP.length > 0) {
      const inStockProducts = allProductsForTurkishIP.filter(product => product.isAddToCartEnabled);
      return inStockProducts.length;
    }

    // Fallback to filtered products count if all products not loaded yet
    return filteredProducts.length;
  }, [isTurkishIP, allProductsForTurkishIP, filteredProducts.length, products.count]);

  // Filter popular products for Turkish IPs
  const filteredPopularProducts = useMemo(() => {
    return popular.data ? filterProductsByLocation(popular.data) : [];
  }, [popular.data, filterProductsByLocation]);

  useEffect(() => {
    setShow(false);
    setDisplayedProductsCount(20); // Reset displayed count when category changes
    setTimeout(() => {
      setShow(true);
    }, 200);
  }, [pageSpecificData?.name]);

  // Load all products for Turkish IPs to get accurate count
  useEffect(() => {
    const loadAllProductsForTurkish = async () => {
      if (!isTurkishIP || isLoadingAllProducts) return;

      setIsLoadingAllProducts(true);
      const allProducts: any[] = [...(products.data || [])];

      try {
        // Keep fetching until we have all products
        while (products.hasNext) {
          await products.getNext();
          if (products.data) {
            // Add only new products that aren't already in our collection
            const currentIds = new Set(allProducts.map(p => p.id));
            const newProducts = products.data.filter(p => !currentIds.has(p.id));
            allProducts.push(...newProducts);
          }
        }

        setAllProductsForTurkishIP(allProducts);
      } catch (error) {
        console.error('Error loading all products for Turkish IP:', error);
      } finally {
        setIsLoadingAllProducts(false);
      }
    };

    if (isTurkishIP && products.data && products.data.length > 0) {
      loadAllProductsForTurkish();
    }
  }, [isTurkishIP, pageSpecificData?.id]); // Only run when category changes

  // Check if we should show load more button
  const shouldShowLoadMore = useMemo(() => {
    if (isTurkishIP) {
      // For Turkish IPs, check if we're still loading all products in background
      if (isLoadingAllProducts) {
        return false; // Hide button while loading all products
      }

      // If all products are loaded, check if there are more purchasable products to show
      if (allProductsForTurkishIP.length > 0) {
        const allInStockProducts = allProductsForTurkishIP.filter(product => product.isAddToCartEnabled);
        const currentlyDisplayed = filteredProducts.length;
        return currentlyDisplayed < allInStockProducts.length;
      }

      // Fallback to original logic if all products not loaded yet
      return products.hasNext && filteredProducts.length < (products.data?.length || 0);
    }

    return products.hasNext;
  }, [
    isTurkishIP,
    isLoadingAllProducts,
    allProductsForTurkishIP,
    filteredProducts.length,
    products.hasNext,
    products.data
  ]);

  // Auto-fetch more products if needed for Turkish IPs
  useEffect(() => {
    const autoFetchIfNeeded = async () => {
      if (isTurkishIP && products.data && !isAutoLoading && !products.isLoading) {
        const availableProducts = filterProductsByLocation(products.data);

        // If we have less than 20 available products and there are more pages
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
  }, [products.data, isTurkishIP, isAutoLoading, products.isLoading, products.hasNext, filterProductsByLocation, getNextBatchIfNeeded]);

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
              // Skip stock filter for Turkish IPs
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
                <Simpleslider
                  keenOptions={{
                    initial: 0,
                    slides: {
                      perView: 2,
                      spacing: 4,
                    },
                    breakpoints: {
                      "(min-width: 768px)": {
                        slides: { perView: 3, spacing: 8 },
                      },
                      "(min-width: 1024px)": {
                        slides: {
                          perView: 5,
                          spacing: 8,
                        },
                      },
                    },
                  }}
                  items={popular.data?.map((product, index) => (
                    <div key={`popular-${product.id}-${index}`} className="keen-slider__slide">
                      <ProductCard product={product} soldOutButtonText={soldOut?.soldOutButton} />
                    </div>
                  ))}
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
          {/* Load more button - show if there are more products from API */}
          {shouldShowLoadMore && (
            <div className="flex mt-8">
              <button
                id="loadmore"
                onClick={() => {
                  if (isTurkishIP && allProductsForTurkishIP.length > 0) {
                    // For Turkish IPs, just increase displayed count (no API call needed)
                    const currentProductCount = filteredProducts.length;
                    setDisplayedProductsCount(prev => prev + 20);

                    // Scroll to new products after state update
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
                    // For non-Turkish IPs or when all products not loaded yet, use normal API call
                    const currentProductCount = filteredProducts.length;

                    products.getNext().then(() => {
                      // Calculate which product index to scroll to (first product of new batch)
                      const newProductStartIndex = currentProductCount;

                      // Use setTimeout to ensure DOM is updated with new products
                      setTimeout(() => {
                        const productGrid = document.getElementById("listgrid");
                        if (productGrid) {
                          const productElements = productGrid.children;
                          const targetProductElement = productElements[newProductStartIndex];

                          if (targetProductElement) {
                            const targetTop = (targetProductElement as HTMLElement).offsetTop;
                            // Add some offset for better UX (show a bit of previous content)
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
                disabled={products.isLoading || (isTurkishIP && isLoadingAllProducts)}
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
