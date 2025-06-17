import React, { useState, useEffect } from "react";
import {
  IkasProductList,
  Link,
  IkasProductFilterDisplayType,
  IkasProductFilter,
  useTranslation,
  useStore,
  IkasProductStockFilterValue,
  IkasProductFilterType,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "usehooks-ts";
import { CategoryWithChildrenType } from "./mobilemenu";
import { useUserLocation } from "../../utils/useUserLocation";
import { useFilterContext } from "./FilterContext";

export const NumberList = observer(
  ({
    filter,
    items,   // now always IkasProductFilterNumberRangeListOption[]
  }: {
    filter: IkasProductFilter;
    items: NonNullable<IkasProductFilter["numberRangeListOptions"]>;
  }) => {
    const [open, setOpen] = useState(true);

    return (
      <div className="mb-3">
        <div className="flex w-full flex-col items-center">
          <div
            onClick={() => setOpen(!open)}
            className="w-full cursor-pointer bg-[color:var(--color-two)] py-1.5 px-2 flex justify-between items-center gap-2"
          >
            <div className="text-base font-light text-white">
              {filter.name}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-[18px] h-[18px] text-white transition-transform ${open ? "rotate-90" : "-rotate-90"
                }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>

          {open && (
            <div className="flex w-full flex-col items-start text-left">
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    filter.onNumberRangeClick(item);
                    const el = document.getElementById("listgrid");
                    window.scrollTo({
                      top: (el?.offsetTop ?? 100) - 100,
                      behavior: "smooth",
                    });
                  }}
                  className="flex w-full items-center gap-2 px-2 py-1 border border-t-0 border-[color:var(--gray-two)] text-[color:var(--gray-five)] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={item.isSelected}
                    className="hidden peer"
                  />
                  <div className="relative w-[17px] h-[17px] border rounded-sm border-[color:var(--gray-two)] peer-checked:after:block after:absolute after:top-[3.5px] after:left-[3.5px] after:w-2 after:h-2 after:rounded-xs after:bg-[color:var(--color-three)] after:hidden" />
                  <span
                    className={`text-base ${item.isSelected
                      ? "text-[color:var(--gray-three)] font-normal"
                      : "text-[color:var(--gray-five)] hover:font-normal hover:text-[color:var(--gray-three)] font-light"
                      }`}
                  >
                    {item.from} – {item.to}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export const StockList = observer(
  ({
    items,
    filter,
  }: {
    filter: IkasProductFilter;
    items: IkasProductFilter["displayedValues"];
  }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(true);
    const { isTurkishIP } = useUserLocation();
    const { setIsOutOfStockSelected } = useFilterContext();

    React.useLayoutEffect(() => {
      if (isTurkishIP) {
        setIsOutOfStockSelected(false);
      }
    }, [isTurkishIP, setIsOutOfStockSelected]);

    if (isTurkishIP) {
      return null;
    }

    const stockItems = items.filter(
      (item) => {
        return item.name === IkasProductStockFilterValue.IN_STOCK ||
          item.name === IkasProductStockFilterValue.OUT_OF_STOCK;
      }
    );
    if (stockItems.length === 0) return null;

    return (
      <div className="mb-3">
        <div className="flex w-full flex-col items-center">
          <div
            onClick={() => setOpen(!open)}
            className="w-full cursor-pointer bg-[color:var(--color-two)] py-1.5 px-2 justify-between flex items-center gap-2"
          >
            <div className="text-base text-white font-light">{filter.name}</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-[18px] transition-transform h-[18px] text-white ${open ? "transform rotate-90" : "transform -rotate-90"
                }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
          {open && (
            <div className="flex overflow-y-auto max-h-[165px] border-b border-[color:var(--gray-two)] items-start text-left w-full flex-col">
              {stockItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    filter.onFilterValueClick(item);
                    const element = document.getElementById("listgrid");
                    window.scrollTo({
                      top: (element?.offsetTop || 100) - 100,
                      behavior: "smooth",
                    });
                  }}
                  className="text-base gap-2 border border-t-0 border-[color:var(--gray-two)] px-2 py-1 w-full flex items-center justify-start text-[color:var(--gray-five)] cursor-pointer"
                >
                  <input
                    className="hidden peer"
                    type="checkbox"
                    readOnly
                    checked={item.isSelected}
                  />
                  <div className="w-[17px] h-[17px] border relative border-[color:var(--gray-two)] rounded-sm peer-checked:after:block after:hidden after:absolute after:left-[3.5px] after:top-[3.5px] after:rounded-xs after:bg-[color:var(--color-three)] after:w-2 after:h-2" />
                  <span
                    className={`text-base ${item.isSelected
                      ? "text-[color:var(--gray-three)] font-normal"
                      : "text-[color:var(--gray-five)] hover:font-normal hover:text-[color:var(--gray-three)] font-light"
                      }`}
                  >
                    {item.name === IkasProductStockFilterValue.IN_STOCK ||
                      item.name === IkasProductStockFilterValue.OUT_OF_STOCK
                      ? t(item.name)
                      : item.name}{" "}
                    ({item.resultCount})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export const TypeList = observer(
  ({
    filter,
    items,
  }: {
    filter: IkasProductFilter;
    items: IkasProductFilter["displayedValues"];
  }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(true);
    const { isTurkishIP } = useUserLocation();
    const { isOutOfStockSelected } = useFilterContext();

    if (filter.type !== IkasProductFilterType.TAG) return null;
    if (!items || items.length === 0) return null;

    if (isTurkishIP && isOutOfStockSelected && filter.name.toLowerCase() === "marka") {
      return null;
    }

    return (
      <div className="mb-3">
        <div className="flex w-full flex-col items-center">
          <div
            onClick={() => setOpen(!open)}
            className="w-full cursor-pointer bg-[color:var(--color-two)] py-1.5 px-2 flex items-center justify-between gap-2"
          >
            <div className="text-base text-white font-light">{filter.name}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-[18px] h-[18px] text-white transition-transform ${open ? "transform rotate-90" : "transform -rotate-90"
                }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          {open && (
            <div className="flex flex-col items-start text-left w-full border-b border-[color:var(--gray-two)] overflow-y-auto max-h-[165px]">
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    filter.onFilterValueClick(item);
                    const element = document.getElementById("listgrid");
                    window.scrollTo({
                      top: (element?.offsetTop || 100) - 100,
                      behavior: "smooth",
                    });
                  }}
                  className="w-full flex items-center gap-2 border-t-0 border border-[color:var(--gray-two)] px-2 py-1 text-base text-[color:var(--gray-five)] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    readOnly
                    className="hidden peer"
                    checked={item.isSelected}
                  />
                  <div className="relative w-[17px] h-[17px] border border-[color:var(--gray-two)] rounded-sm peer-checked:after:block after:hidden after:absolute after:left-[3.5px] after:top-[3.5px] after:rounded-xs after:bg-[color:var(--color-three)] after:w-2 after:h-2" />
                  <span
                    className={`text-base ${item.isSelected
                      ? "text-[color:var(--gray-three)] font-normal"
                      : "text-[color:var(--gray-five)] hover:font-normal hover:text-[color:var(--gray-three)] font-light"
                      }`}
                  >
                    {item.name} ({item.resultCount})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export const List = observer(
  ({
    items,
    filter,
  }: {
    filter: IkasProductFilter;
    items: IkasProductFilter["displayedValues"];
  }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(true);
    const { isTurkishIP } = useUserLocation();
    const { isOutOfStockSelected } = useFilterContext();

    if (isTurkishIP && isOutOfStockSelected && filter.name.toLowerCase() === "marka") {
      return null;
    }

    const hasStockItems = items?.some(item => item.name === "in-stock" || item.name === "out-of-stock");
    if (isTurkishIP && hasStockItems) {
      return null;
    }

    return items.length > 0 ? (
      <div className="mb-3">
        <div className="flex w-full flex-col items-center">
          <div
            onClick={() => {
              setOpen(!open);
            }}
            className="w-full cursor-pointer bg-[color:var(--color-two)] py-1.5 px-2 justify-between flex items-center gap-2"
          >
            <div className="text-base text-white font-light">{filter.name}</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-[18px] transition-transform h-[18px] text-white ${open ? "transform rotate-90" : "transform -rotate-90"
                }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
          {open && (
            <div className="flex overflow-y-auto max-h-[165px] border-b border-[color:var(--gray-two)]  items-start text-left w-full flex-col">
              {items?.map((item) => (
                <button
                  onClick={() => {
                    filter.onFilterValueClick(item);
                    const element = document.getElementById("listgrid");
                    window.scrollTo({
                      top: (element?.offsetTop || 100) - 100,
                      behavior: "smooth",
                    });
                  }}
                  key={item.key}
                  className="text-base gap-2 border last:border-b-0 border-t-0 border-[color:var(--gray-two)] px-2 py-1 w-full flex items-center justify-start text-[color:var(--gray-five)] cursor-pointer"
                >
                  <input
                    className="hidden peer"
                    type="checkbox"
                    readOnly
                    checked={item.isSelected}
                  />
                  <div className="w-[17px] h-[17px] border relative border-[color:var(--gray-two)] rounded-sm peer-checked:after:block after:hidden after:absolute after:left-[3.5px] after:top-[3.5px] after:rounded-xs after:bg-[color:var(--color-three)] after:w-2 after:h-2" />
                  <span
                    className={`text-base ${item.isSelected
                      ? "text-[color:var(--gray-three)] font-normal"
                      : "text-[color:var(--gray-five)] hover:font-normal hover:text-[color:var(--gray-three)] font-light"
                      }`}
                  >
                    {item.name === "in-stock" || item.name === "out-of-stock"
                      ? t(item.name)
                      : item.name}{" "}
                    {!(isTurkishIP && item.name === "out-of-stock") && `(${item.resultCount})`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    ) : null;
  }
);

export const CategoryList = observer(
  ({
    filter,
    allCategories,
    last,
  }: {
    filter: CategoryWithChildrenType;
    allCategories: CategoryWithChildrenType[];
    last?: boolean;
  }) => {
    const store = useStore();
    const [openedCategories, setOpenedCategories] = useState<boolean>(false);
    useEffect(() => {
      const includesData =
        filter.childrens?.some((e) => e.href === store.router?.asPath) ||
        filter.href === store.router?.asPath ||
        allCategories?.find((item) => item.id === filter.parentId)?.href ===
        store.router?.asPath;
      if (includesData) {
        setOpenedCategories(true);
      } else {
        setOpenedCategories(false);
      }
    }, [store.router?.asPath]);
    return (
      <div className={openedCategories ? "" : "mb-[1px]"}>
        {filter?.childrens && filter?.childrens?.length > 0 ? (
          <div className="flex w-full flex-col items-center">
            <div
              onClick={() => {
                setOpenedCategories(!openedCategories);
              }}
              className="w-full cursor-pointer bg-[color:var(--color-two)] py-1.5 px-2 justify-between flex items-center gap-2"
            >
              <Link href={filter.href}>
                <a
                  className={`text-base text-white ${store.router?.asPath === filter.href
                    ? "font-normal"
                    : "font-light"
                    }`}
                >
                  {filter.name}
                </a>
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-[18px] transition-transform h-[18px] text-white ${!openedCategories
                  ? "transform rotate-90"
                  : "transform -rotate-90"
                  }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
            {openedCategories && (
              <div
                className={`flex items-start text-left w-full flex-col ${last ? "border-b border-[color:var(--gray-two)]" : ""
                  }`}
              >
                {filter?.childrens?.map((child) => (
                  <Link key={child.href} href={child.href}>
                    <a
                      className={`${store.router?.asPath === child.href
                        ? "text-[color:var(--gray-three)] font-normal"
                        : "text-[color:var(--gray-five)] hover:font-normal hover:text-[color:var(--gray-three)] font-light"
                        } text-base last:border-b-0 border border-t-0 border-[color:var(--gray-two)] px-2 py-1 w-full flex items-center justify-start`}
                    >
                      {child.name}
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link href={filter.href}>
            <a
              className={`mb-[1px] bg-[color:var(--color-two)] py-1.5 px-2 w-full justify-between flex items-center gap-2`}
            >
              <span
                className={`text-base text-white ${store.router?.asPath === filter.href
                  ? "font-normal"
                  : "font-light"
                  }`}
              >
                {filter.name}
              </span>
            </a>
          </Link>
        )}
      </div>
    );
  }
);

export const FilterMobileBrands: React.FC<{
  products: IkasProductList;
  pageSpecificData: string;
}> = observer(({ pageSpecificData, products }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const { t } = useTranslation();
  const childRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(childRef, () => setOpenFilter(false));
  const { adjustProductCount, isTurkishIP } = useUserLocation();

  return (
    <>
      <button
        onClick={() => setOpenFilter(!openFilter)}
        className="max-w-[120px] w-full h-[34px] lg:hidden flex items-center justify-center text-xs border border-[color:var(--gray-two)] rounded-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-4 mr-1 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
          />
        </svg>
        <span>{t("filter")}</span>
      </button>

      <Transition
        className="fixed bg-[color:var(--gray-five)] overflow-hidden z-99 inset-0"
        as="div"
        show={openFilter}
      >
        <Transition.Child
          enter="transition-transform duration-200"
          enterFrom="translate-x-[-100%]"
          enterTo="translate-x-[0px]"
          leave="transition-transform duration-200"
          leaveFrom="translate-x-[0px]"
          ref={childRef}
          leaveTo="translate-x-[-100%]"
          as="div"
          className="w-full shadow-navbar max-w-[300px] min-h-screen left-0 absolute overflow-y-auto bg-[color:var(--bg-color)] h-full"
        >
          <div className="z-20 shadow-lg shadow-black/5 px-5 py-4 sticky top-0 left-0 bg-[color:var(--bg-color)]">
            <div className="flex justify-between items-center">
              <Link href="/">
                <a className="flex leading-none pt-[2px] font-light text-[color:var(--black-two)] text-lg items-center justify-start">
                  <span>{pageSpecificData}</span>
                </a>
              </Link>
              <button
                onClick={() => setOpenFilter(false)}
                className="flex items-center justify-center -mr-[3px] w-6 h-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-5">
            {adjustProductCount(products.data, products.count) > 0 &&
              products?.filters?.map((filter) => {
                if (
                  isTurkishIP &&
                  filter.type === IkasProductFilterType.STOCK_STATUS
                ) {
                  return null;
                }

                if (
                  filter.type === IkasProductFilterType.STOCK_STATUS &&
                  filter.displayType === IkasProductFilterDisplayType.LIST
                ) {
                  return (
                    <div key={filter.id}>
                      <StockList filter={filter} items={filter.displayedValues} />
                    </div>
                  );
                }

                if (
                  filter.type === IkasProductFilterType.TAG &&
                  filter.displayType === IkasProductFilterDisplayType.LIST
                ) {
                  return (
                    <div key={filter.id}>
                      <TypeList filter={filter} items={filter.displayedValues} />
                    </div>
                  );
                }

                if (filter.displayType === IkasProductFilterDisplayType.NUMBER_RANGE_LIST) {
                  return (
                    <div key={filter.id}>
                      <NumberList filter={filter} items={filter.numberRangeListOptions || []} />
                    </div>
                  );
                }

                return null;
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
                className="disabled:opacity-60 whitespace-nowrap mx-auto tracking-wide border-[color:var(--color-one)] border text-[color:var(--color-one)] text-sm w-full rounded-sm py-1.5 px-5"
              >
                {t("categoryPage.clearFilters")}
              </button>
            )}
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
});

const FilterMobile: React.FC<{
  products: IkasProductList;
  pageSpecificData: string;
  categories: CategoryWithChildrenType | undefined;
  categoriesWithChildrens: CategoryWithChildrenType[] | undefined;
}> = ({ pageSpecificData, products, categories, categoriesWithChildrens }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const { t } = useTranslation();
  const childRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(childRef, () => setOpenFilter(false));
  const { adjustProductCount, isTurkishIP } = useUserLocation();

  return (
    <>
      <button
        onClick={() => setOpenFilter(!openFilter)}
        className="max-w-[120px] w-full h-[34px] lg:hidden flex items-center justify-center text-xs border border-[color:var(--gray-two)] rounded-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-4 mr-1 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
          />
        </svg>

        <span>{t("filter")}</span>
      </button>

      <Transition
        className="fixed bg-[color:var(--gray-five)] overflow-hidden z-99 inset-0"
        as="div"
        show={openFilter}
      >
        <Transition.Child
          enter="transition-transform duration-200"
          enterFrom="translate-x-[-100%]"
          enterTo="translate-x-[0px]"
          leave="transition-transform duration-200"
          leaveFrom="translate-x-[0px]"
          ref={childRef}
          leaveTo="translate-x-[-100%]"
          as="div"
          className="w-full shadow-navbar max-w-[300px] min-h-screen left-0 absolute overflow-y-auto bg-[color:var(--bg-color)] h-full"
        >
          <div className="z-20 shadow-lg shadow-black/5 px-5 py-4 sticky top-0 left-0 bg-[color:var(--bg-color)]">
            <div className="flex justify-between items-center">
              <Link href="/">
                <a className="flex leading-none pt-[2px] font-light text-[color:var(--black-two)] text-lg items-center justify-start">
                  <span>{pageSpecificData}</span>
                </a>
              </Link>
              <button
                onClick={() => setOpenFilter(false)}
                className="flex items-center justify-center -mr-[3px] w-6 h-6"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-5">
            {categoriesWithChildrens && categories && categories?.childrens && (
              <div className="mb-3">
                {categories?.childrens?.map((filter, i) => (
                  <div key={filter.id}>
                    <CategoryList
                      last={categories?.childrens?.length === i + 1}
                      allCategories={categoriesWithChildrens}
                      filter={filter}
                    />
                  </div>
                ))}
              </div>
            )}
            {adjustProductCount(products.data, products.count) > 0 &&
              products?.filters?.map((filter) => (
                <div key={filter.id}>
                  {filter.displayType === IkasProductFilterDisplayType.LIST && (
                    <List filter={filter} items={filter.displayedValues} />
                  )}
                  {filter.displayType ===
                    IkasProductFilterDisplayType.NUMBER_RANGE_LIST && (
                      <NumberList
                        filter={filter}
                        items={filter.numberRangeListOptions || []}
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
                className="disabled:opacity-60 whitespace-nowrap mx-auto tracking-wide border-[color:var(--color-one)] border text-[color:var(--color-one)] text-sm w-full rounded-sm py-1.5 px-5"
              >
                {t("categoryPage.clearFilters")}
              </button>
            )}
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default observer(FilterMobile);
