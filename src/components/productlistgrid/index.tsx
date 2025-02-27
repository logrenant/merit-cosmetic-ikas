import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import ProductCard from "../composites/productcard";
import { ProductlistgridProps } from "../__generated__/types";
import {
  IkasCategory,
  IkasProductFilterDisplayType,
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
> = ({ products, popular, categories, pageSpecificData }) => {
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
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 200);
  }, [pageSpecificData?.name]);
  return (
    <div dir={direction} className="my-10 layout">
      <div className="grid grid-cols-[100%] lg:grid-cols-[260px,calc(100%-284px)] gap-6">
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
            products?.filters?.map((filter) => (
              <div key={filter.id}>
                {filter.displayType === IkasProductFilterDisplayType.LIST && (
                  <List filter={filter} items={filter.displayedValues} />
                )}
                {filter.displayType ===
                  IkasProductFilterDisplayType.NUMBER_RANGE_LIST && (
                  <NumberList
                    filter={filter}
                    items={filter.numberRangeListOptions}
                  />
                )}
              </div>
            ))}

          {products.isFiltered && (
            <button
              disabled={products.isLoading}
              onClick={() => {
                if (products.isLoading) return;
                if (products.isFiltered) {
                  products.clearFilters();
                }
              }}
              className="disabled:opacity-60 whitespace-nowrap mx-auto tracking-wide border-[color:var(--color-one)] border text-[color:var(--color-one)] text-sm w-full rounded py-1.5 px-5"
            >
              {t("categoryPage.clearFilters")}
            </button>
          )}
        </div>
        <div>
          {show && popular.data.length > 0 && (
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
                  items={popular.data?.map((product) => (
                    <div key={product.id} className="keen-slider__slide">
                      <ProductCard product={product} />
                    </div>
                  ))}
                />
              </div>
            </>
          )}
          <div className="mb-8 flex items-center justify-between">
            <div className="text-[12px] lg:block hidden">
              {products.count} {t("categoryPage.product")}
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
                className="max-w-[350px] w-full text-xs border border-[color:var(--gray-two)] rounded"
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
          {products.data.length > 0 ? (
            <div
              id="listgrid"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
            >
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-lg">{t("categoryPage.empty")}</div>
          )}
          {products.hasNext && (
            <div className="flex mt-8">
              <button
                id="loadmore"
                onClick={() => {
                  products.getNext().then(() => {
                    const element = document.getElementById("loadmore");
                    if (element?.offsetTop) {
                      window.scrollTo({
                        top: element?.offsetTop! - 500 || 0,
                        behavior: "smooth",
                      });
                    }
                  });
                }}
                disabled={products.isLoading}
                className="flex items-center justify-center gap-2 disabled:opacity-60 px-20 text-lg py-10 bg-[color:var(--color-two)] rounded text-white"
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

                <span> {t("categoryPage.more")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(ProductListGrid);
