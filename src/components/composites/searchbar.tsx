import {
  IkasBrand,
  IkasBrandList,
  IkasCategoryList,
  IkasImage,
  IkasProduct,
  IkasProductList,
  Image,
  Link,
  useStore,
  useTranslation,
} from "@ikas/storefront";
import Router from "next/router";
import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect } from "react";

import UIStore from "../../store/ui-store";
import Typewriter from "typewriter-effect";
import { useOnClickOutside } from "usehooks-ts";
import React from "react";
import { useUserLocation } from "../../utils/useUserLocation";
import { useDirection } from "../../utils/useDirection";

const SearchBar = ({
  products,
  slogans,
  popularBrands,
  popularProducts,
  popularCategories,
  seachbarImage,
}: {
  products: IkasProductList;
  slogans: string[];
  popularBrands: IkasBrandList;
  popularProducts: IkasProductList;
  popularCategories: IkasCategoryList;
  seachbarImage?: IkasImage;
}) => {
  const store = useStore();
  const { t } = useTranslation();
  const uiStore = UIStore.getInstance();
  const searchRef = useRef<HTMLDivElement>(null);
  const { isTurkishIP, filterProductsByLocation } = useUserLocation();
  const { direction } = useDirection();

  // UI state
  const [placeholderOpen, setPlaceholderOpen] = useState(true);
  const [pageIsSearch, setPageIsSearch] = useState<boolean>(false);

  // Hover state
  const [hoveredCategory, setHoveredCategory] = useState<string>();
  const [hoveredBrand, setHoveredBrand] = useState<string>();
  const [hoveredBrandId, setHoveredBrandId] = useState<string>();
  const [selectedRelatedCategory, setSelectedRelatedCategory] = useState<string>();

  // See All Results link için state
  const [seeAllResultsHref, setSeeAllResultsHref] = useState<string>('/');

  // Derived state - expanded to store original category data and localized info
  const [productCategories, setProductCategories] = useState<{
    originalCategory: any;
    displayName: string;
    originalSlug: string;
    href: string;
    name: string
  }[]>([]);
  const [linkToCategory, setLinkToCategory] = useState('/');

  // Search state
  const [searchedProducts, setSearchedProducts] = useState<IkasProduct[]>();
  const [searchedProductsNotFiltered, setSearchedProductsNotFiltered] =
    useState<IkasProduct[]>();

  // Helper functions
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .replace(/&/g, '-')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Clean text by removing special characters like ®, ™, ©
  const cleanSearchText = (text: string) => {
    if (!text) return '';
    return text.replace(/[®™©]/g, '').trim();
  };

  // Clean brand name by removing special characters (alias for cleanSearchText for backward compatibility)
  const cleanBrandName = (brandName: string) => {
    return cleanSearchText(brandName);
  };

  // Check if text matches when special characters are removed
  const isTextMatch = (text1: string, text2: string) => {
    if (!text1 || !text2) return false;

    const clean1 = cleanSearchText(text1).toLowerCase();
    const clean2 = cleanSearchText(text2).toLowerCase();

    return clean1.includes(clean2) || clean2.includes(clean1);
  };

  // Check if two brands match, considering Arabic-English mapping and bidirectional checks
  const isBrandMatch = (brand1: string, brand2: string) => {
    if (!brand1 || !brand2) return false;

    const cleanBrand1 = cleanBrandName(brand1).toLowerCase();
    const cleanBrand2 = cleanBrandName(brand2).toLowerCase();

    // Direct match
    if (cleanBrand1 === cleanBrand2) return true;

    // Check if either brand contains the other (for partial matches)
    if (cleanBrand1.includes(cleanBrand2) || cleanBrand2.includes(cleanBrand1)) return true;

    return false;
  };

  // Filter out of stock products for all users
  const filterOutOfStockProducts = (products: IkasProduct[]) => {
    return products.filter(product => product.isAddToCartEnabled);
  };

  // Combined filter function that applies both location and stock filters
  const filterProducts = (products: IkasProduct[]) => {
    const locationFiltered = filterProductsByLocation(products);
    return filterOutOfStockProducts(locationFiltered);
  };

  const reset = () => {
    uiStore.searchKeyword = "";
    products.searchKeyword = "";
    setPlaceholderOpen(true);

    // Reset all filter states
    setHoveredCategory(undefined);
    setHoveredBrand(undefined);
    setHoveredBrandId(undefined);
    setSelectedRelatedCategory(undefined);
    setSeeAllResultsHref('/'); // See All Results linkini de resetle

    // Filter products to hide out-of-stock products for all users
    const filteredProducts = filterProducts(products.data);
    setSearchedProductsNotFiltered(filteredProducts);
    setSearchedProducts(filteredProducts.slice(0, 8));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoveredCategory(undefined);
    setHoveredBrand(undefined);
    setSelectedRelatedCategory(undefined);

    // Store original input value in uiStore
    uiStore.searchKeyword = e.target.value;

    // Clean search text for product search
    const cleanedSearchText = cleanSearchText(e.target.value);
    products.searchKeyword = cleanedSearchText;

    setPlaceholderOpen(false);
    setSearchedProductsNotFiltered(undefined!);
    setSearchedProducts(undefined!);
  };

  const onClickSearch = () => {
    // Use the cleaned version of the search keyword
    const cleanedKeyword = cleanSearchText(uiStore.searchKeyword);
    store?.router?.push(`/search?s=${encodeURIComponent(cleanedKeyword || uiStore.searchKeyword)}`);
  };

  const handleClearFilter = () => {
    setHoveredCategory(undefined);
    setHoveredBrand(undefined);
    setHoveredBrandId(undefined);
    setSelectedRelatedCategory(undefined);
    setSeeAllResultsHref('/'); // See All Results linkini de resetle

    const filteredProducts = filterProducts(products.data);
    setSearchedProducts(filteredProducts);
    setSearchedProductsNotFiltered(filteredProducts);
  };

  const onHoverCategory = (cat: {
    originalCategory: any;
    displayName: string;
    originalSlug: string;
    href: string;
    name: string
  }) => {
    // Eğer aynı kategori zaten seçili ise, tekrar işlem yapma
    if (hoveredCategory === cat.name) {
      return;
    }

    console.log("Hovering category:", cat);

    setHoveredCategory(cat.name);
    setHoveredBrand(undefined);
    setHoveredBrandId(undefined);
    setSelectedRelatedCategory(cat.name);

    const allProductsForCategory = products.data.filter(p =>
      p.categories?.some(c => c.name.toLowerCase() === cat.name.toLowerCase())
    );

    const filteredProducts = filterProducts(allProductsForCategory);

    setSearchedProductsNotFiltered(filteredProducts);
    setSearchedProducts(filteredProducts.slice(0, 8));

    const categoryFilter = products.filters?.find((f) => f.id === "category");
    if (categoryFilter) {
      const v = categoryFilter.displayedValues.find(
        (x) => x.name.toLowerCase() === cat.name.toLowerCase()
      );
      if (v) categoryFilter.onFilterValueClick(v);
    }
  };

  const onHoverBrand = (br: string) => {
    // Eğer aynı brand zaten seçili ise, tekrar işlem yapma
    if (hoveredBrand === br) {
      return;
    }

    setHoveredBrand(br);
    setHoveredCategory(undefined); // Brand hover edildiğinde category'i temizle
    // Clean the brand name before setting it as search keyword
    products.searchKeyword = cleanBrandName(br);
    setPlaceholderOpen(false);

    // Get all products for this brand using exact matching
    const allBrandProducts = products.data.filter(
      p => p.brand?.name && isBrandMatch(p.brand.name, br)
    );

    // Apply both location and stock filtering to hide out-of-stock products
    const filteredBrandProducts = filterProducts(allBrandProducts);

    setSearchedProductsNotFiltered(filteredBrandProducts);
    setSearchedProducts(filteredBrandProducts.slice(0, 8));
  };

  const onHoverPopularCategory = (categoryName: string) => {
    if (hoveredCategory === categoryName) {
      return;
    }

    setHoveredCategory(categoryName);
    setHoveredBrand(undefined);

    const categoryProducts = products.data.filter(
      p => p.categories?.some(c => c.name.toLowerCase() === categoryName.toLowerCase())
    );

    const filteredCategoryProducts = filterProducts(categoryProducts);

    setSearchedProductsNotFiltered(filteredCategoryProducts);
    setSearchedProducts(filteredCategoryProducts.slice(0, 8));

    products.searchKeyword = categoryName;
    setPlaceholderOpen(false);
  };

  const findBrandForCategory = (categoryName: string): IkasBrand | null => {
    const filteredProducts = filterProducts(products.data);

    const categoryProducts = filteredProducts.filter(product =>
      product.categories?.some(c => c.name === categoryName)
    );
    const brands = categoryProducts
      .map(p => p.brand)
      .filter((b): b is IkasBrand => !!b)
      .filter((v, i, a) => a.findIndex(b => b.id === v.id) === i);

    return brands.length === 1 ? brands[0] : null;
  };

  const getSearchResultsLink = () => {
    if (uiStore.searchKeyword && !hoveredCategory && !hoveredBrand) {
      // Use cleaned search keyword for the URL
      const cleanedKeyword = cleanSearchText(uiStore.searchKeyword);
      return `/search?s=${encodeURIComponent(cleanedKeyword || uiStore.searchKeyword)}`;
    }

    if (hoveredCategory) {
      const category = popularCategories.data.find(
        c => c.name === hoveredCategory
      );
      if (category) return category.href;

      const brandFromCategory = findBrandForCategory(hoveredCategory);
      if (brandFromCategory) return brandFromCategory.href;

      return `/${slugify(hoveredCategory)}`;
    }

    if (hoveredBrand) {
      const brand = popularBrands.data.find(
        b => b.name === hoveredBrand
      );
      return brand ? brand.href : `/${slugify(hoveredBrand)}`;
    }

    const directBrandMatch = popularBrands.data.find(
      b => b.name.toLowerCase() === uiStore.searchKeyword.trim().toLowerCase()
    );
    if (directBrandMatch) return directBrandMatch.href;

    if (searchedProducts?.[0]?.brand) {
      return searchedProducts[0].brand.href;
    }

    return `/search?s=${encodeURIComponent(uiStore.searchKeyword)}`;
  };

  const displayResults = React.useMemo(() => {
    let results = products.data;

    // Filter by search keyword if present
    if (uiStore.searchKeyword) {
      results = products.data.filter(p => {
        // Check product name
        if (isTextMatch(p.name, uiStore.searchKeyword)) return true;

        // Check brand name
        if (p.brand?.name && isTextMatch(p.brand.name, uiStore.searchKeyword)) return true;

        // Check categories
        if (p.categories?.some(c => isTextMatch(c.name, uiStore.searchKeyword))) return true;

        return false;
      });
    }

    // Filter by category if one is hovered
    if (hoveredCategory) {
      results = products.data.filter(p =>
        p.categories?.some(c => c.name.toLowerCase() === hoveredCategory.toLowerCase())
      );
    }

    // Apply both location and stock filtering to hide out-of-stock products
    return filterProducts(results);
  }, [products.data, hoveredCategory, uiStore.searchKeyword, filterProductsByLocation]);

  useEffect(() => {
    // Filter products to hide out-of-stock products for all users
    const filteredProducts = filterProducts(products.data);

    // Get unique categories from filtered products only
    const uniqueCategories = filteredProducts.reduce((acc: {
      originalCategory: any;
      displayName: string;
      originalSlug: string;
      href: string;
      name: string
    }[], product) => {
      product.categories?.forEach(category => {
        if (!acc.some(c => c.name === category.name)) {
          // Console log the original category data
          console.log("Original Category Data:", category);
          console.log("Category properties:", {
            name: category.name,
            href: category.href,
            translations: category.translations
          });

          // Create display name based on direction
          let displayName = category.name; // Default to original name
          if (direction === "rtl" && category.translations) {
            const arabicTranslation = category.translations.find((t: any) => t.locale === "ar");
            if (arabicTranslation && arabicTranslation.name) {
              displayName = arabicTranslation.name;
              console.log("Found Arabic translation:", arabicTranslation.name);
            }
          }

          // Always use original slug for href, add /ar prefix only for RTL
          // Extract slug from href if it exists, otherwise use slugified name
          let originalSlug = "";
          if (category.href && category.href.startsWith('/')) {
            // Extract slug from href (remove leading /)
            originalSlug = category.href.substring(1);
            // Remove /ar/ prefix if exists to get original slug
            if (originalSlug.startsWith('ar/')) {
              originalSlug = originalSlug.substring(3);
            }
          } else {
            originalSlug = slugify(category.name);
          }

          let href = `/${originalSlug}`;
          if (direction === "rtl") {
            href = `/ar/${originalSlug}`;
          }

          console.log("Generated href:", href, "for category:", category.name);

          acc.push({
            originalCategory: category,
            displayName: displayName,
            originalSlug: originalSlug,
            href: href,
            name: category.name // Keep original name for filtering/logic
          });
        }
      });
      return acc;
    }, []);

    console.log("Final productCategories:", uniqueCategories);
    setProductCategories(uniqueCategories);
    setSearchedProductsNotFiltered(filteredProducts);
    setSearchedProducts(filteredProducts.slice(0, 8));
  }, [products.data, filterProductsByLocation, direction]);


  useEffect(() => {
    Router.events.on("routeChangeStart", reset);
    return () => Router.events.off("routeChangeStart", reset);
  }, []);

  useOnClickOutside(searchRef, reset);

  useEffect(() => {
    if (hoveredCategory) {
      setLinkToCategory(slugify(hoveredCategory));
    }
  }, [hoveredCategory]);

  // Her hover değişiminde See All Results linkini güncelle
  useEffect(() => {
    let newHref = '/';

    if (hoveredCategory) {
      newHref = popularCategories.data.find(c => c.name === hoveredCategory)?.href || `/${slugify(hoveredCategory)}`;
    } else if (hoveredBrand) {
      newHref = popularBrands.data.find(b => b.name === hoveredBrand)?.href || `/${slugify(hoveredBrand)}`;
    } else {
      newHref = `/${slugify(linkToCategory)}`;
    }

    // RTL (Arapça) için /ar prefixi ekle
    if (direction === "rtl" && !newHref.startsWith('/ar')) {
      if (newHref.startsWith('/')) {
        newHref = `/ar${newHref}`;
      } else {
        newHref = `/ar/${newHref}`;
      }
    }

    setSeeAllResultsHref(newHref);
  }, [hoveredCategory, hoveredBrand, linkToCategory, popularCategories.data, popularBrands.data, direction]);

  // Update search results when brand is hovered
  useEffect(() => {
    if (hoveredBrand && !uiStore.searchKeyword) {
      const brandProducts = products.data.filter(p =>
        p.brand?.name && isBrandMatch(p.brand.name, hoveredBrand)
      );

      // Apply both location and stock filtering to hide out-of-stock products
      const filteredBrandProducts = filterProducts(brandProducts);

      if (filteredBrandProducts.length > 0) {
        setSearchedProductsNotFiltered(filteredBrandProducts);
        setSearchedProducts(filteredBrandProducts.slice(0, 8));
        setPlaceholderOpen(false);

        if (!searchedProducts || searchedProducts.length === 0) {
          products.searchKeyword = cleanBrandName(hoveredBrand);
        }
      }
    }
  }, [hoveredBrand, products.data, uiStore.searchKeyword, filterProducts]);

  // Update search results when uiStore.searchKeyword changes
  useEffect(() => {
    if (uiStore.searchKeyword) {
      // If search keyword contains special characters, we need to filter products here
      const filteredResults = displayResults;

      if (filteredResults && filteredResults.length > 0) {
        setSearchedProductsNotFiltered(filteredResults);
        setSearchedProducts(filteredResults.slice(0, 8));
      }
    }
  }, [uiStore.searchKeyword, displayResults]);

  // useEffect(() => {
  //   console.log("[SearchBar] Hovered Category:", hoveredCategory);
  //   console.log("[SearchBar] Filtrelenmiş Sonuçlar:", displayResults);
  // }, [hoveredCategory, displayResults]);


  return (
    <div className="block lg:order-none order-last lg:col-span-1 col-span-2">
      <div
        ref={searchRef}
        className="flex relative lg:max-w-[700px] mx-auto items-center justify-center"
      >
        <button
          onClick={onClickSearch}
          className="absolute cursor-pointer z-2 flex items-center justify-center h-full pl-2 pr-3 right-0 top-1/2 transform -translate-y-1/2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 17L12.3806 12.3806M12.3806 12.3806C13.6309 11.1304 14.3333 9.43473 14.3333 7.66663C14.3333 5.89853 13.6309 4.20285 12.3806 2.95261C11.1304 1.70237 9.43473 1 7.66663 1C5.89853 1 4.20285 1.70237 2.95261 2.95261C1.70237 4.20285 1 5.89853 1 7.66663C1 9.43473 1.70237 11.1304 2.95261 12.3806C4.20285 13.6309 5.89853 14.3333 7.66663 14.3333C9.43473 14.3333 11.1304 13.6309 12.3806 12.3806V12.3806Z"
              className="stroke-[color:var(--input-color)]"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          onChange={onChange}
          onKeyPress={e => e.key === "Enter" && onClickSearch()}
          onFocus={() => setPlaceholderOpen(false)}
          value={uiStore.searchKeyword}
          type="text"
          className={`w-full ${searchedProducts?.length ? "border-[color:var(--color-six)]" : "border-[color:var(--input-color)]"} focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative z-1 pr-9 text-sm font-light h-[38px] border-[1px] rounded px-2.5`}
        />

        {placeholderOpen && !pageIsSearch && (
          <span
            onClick={() => {
              setPlaceholderOpen(false);
            }}
            className="text-sm z-10 absolute left-[10px] top-[9.5px] font-light opacity-80"
          >
            <Typewriter
              options={{
                strings: slogans,
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        )}
        {!placeholderOpen && (
          <div className="absolute z-53 right-0 top-11 rounded-sm overflow-hidden bg-[color:var(--bg-color)] shadow-navbar w-full">
            {products.isLoading && uiStore.searchKeyword && (
              <div className="px-4 py-10 flex items-center justify-center">
                <div className="customloader" />
              </div>
            )}
            {!products.isLoading &&
              uiStore.searchKeyword &&
              searchedProducts &&
              searchedProducts.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-[180px_auto]">
                  <div className="hidden lg:flex flex-col bg-[color:var(--gray-bg)]">
                    <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                      {t("relatedCategories")}
                    </h3>
                    <div className="flex flex-col self-start w-full border-r border-white bg-[color:var(--gray-bg)] py-4 gap-1.5">
                      {productCategories.map(cat => (
                        <Link key={cat.name} href={cat.href}>
                          <a
                            onMouseEnter={() => onHoverCategory(cat)}
                            className={`
                              text-[13px] flex items-center justify-center
                              rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)]
                              font-normal hover:bg-[color:var(--color-one)]
                              hover:text-white w-full xl:justify-start px-4 transition duration-150
                              ${selectedRelatedCategory === cat.name ? 'bg-[color:var(--color-one)] text-white' : ''}
                            `}
                          >
                            {cat.displayName}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm  bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                      {t("searchResults")}
                    </h3>
                    <div className="grid p-4 grid-cols-2 gap-2">
                      {displayResults.slice(0, 8).map(product => {
                        const mainImages = product.attributes
                          ?.find(a => a.productAttribute?.name === "Ana Resim")
                          ?.images;
                        const showImage = mainImages?.length
                          ? mainImages[0]
                          : product.selectedVariant.mainImage?.image!;

                        return (
                          <Link key={product.id} href={product.href}>
                            <a className="grid border hover:bg-[color:var(--gray-four)] border-[color:var(--gray-one)] rounded-sm gap-1 p-1 grid-cols-[70px_1fr] w-full">
                              <div className="relative rounded-sm aspect-293/372 w-full overflow-hidden">
                                <Image image={showImage} alt={product.name} useBlur layout="fill" objectFit="cover" />
                              </div>
                              <div className="p-1 flex flex-col text-[color:var(--black-two)]">
                                <h3 className="text-xs line-clamp-2">{product.name}</h3>
                                <span className="text-sm font-medium">
                                  {product.selectedVariant.price.sellPrice}{" "}
                                  {product.selectedVariant.price.currencySymbol}
                                </span>
                              </div>
                            </a>
                          </Link>
                        );
                      })}

                      {searchedProducts.length > 0 && (
                        <div className="col-span-2 flex">
                          {hoveredCategory && (
                            <button
                              className="text-xs underline text-[color:var(--color-one)] cursor-pointer"
                              onClick={handleClearFilter}
                            >
                              {t("categoryPage.clearFilters")}
                            </button>
                          )}
                          <Link href={hoveredCategory
                            ? (productCategories.find(c => c.name === hoveredCategory)?.href ||
                              popularCategories.data.find(c => c.name === hoveredCategory)?.href ||
                              `/${slugify(hoveredCategory)}`)
                            : `/search?s=${encodeURIComponent(cleanSearchText(uiStore.searchKeyword) || uiStore.searchKeyword)}`
                          }>
                            <a className={`text-xs flex items-center text-[color:var(--black-one)] ${direction === "rtl" ? "mr-auto" : "ml-auto"}`}>
                              {direction === "rtl" ? (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 stroke-[color:var(--color-one)] h-4 mr-0.5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                  </svg>
                                  <span>
                                    <span className="font-bold">
                                      {hoveredCategory
                                        ? (productCategories.find(c => c.name === hoveredCategory)?.displayName || hoveredCategory)
                                        : uiStore.searchKeyword}
                                    </span>
                                    &nbsp;{t("seeAllResults")}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    <span className="font-bold">
                                      {hoveredCategory
                                        ? (productCategories.find(c => c.name === hoveredCategory)?.displayName || hoveredCategory)
                                        : uiStore.searchKeyword}
                                    </span>
                                    &nbsp;{t("seeAllResults")}
                                  </span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 stroke-[color:var(--color-one)] h-4 ml-0.5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                    />
                                  </svg>
                                </>
                              )}
                            </a>
                          </Link>
                        </div>
                      )}
                      <div className="rounded-sm col-span-2 overflow-hidden">
                        <div className="aspect-16/6 w-full relative">
                          {seachbarImage && (
                            <Image
                              image={seachbarImage}
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            {(searchedProducts?.length === 0 || !searchedProducts) &&
              !uiStore.searchKeyword && (
                <div className="grid grid-cols-1 lg:grid-cols-[180px_auto]">
                  <div className="hidden lg:flex flex-col bg-[color:var(--gray-bg)]">
                    <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                      {t("popularCategories")}
                    </h3>
                    <div className="flex flex-col self-stretch w-full xgrow border-r border-white bg-[color:var(--gray-bg)] py-4 grid-cols-1 gap-1.5">
                      {popularCategories.data.map((el) => (
                        <Link key={el.name} href={el.href}>
                          <a
                            onMouseEnter={() => {
                              // Eğer aynı kategori zaten seçili ise, tekrar işlem yapma
                              if (hoveredCategory === el.name) {
                                return;
                              }
                              onHoverPopularCategory(el.name);
                              setHoveredCategory(el.name);
                              setHoveredBrand(el.name);
                            }}
                            className={`
                                text-[13px] flex items-center justify-center
                                rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)]
                                font-normal hover:bg-[color:var(--color-one)]
                                hover:text-white w-full xl:justify-start px-4 transition duration-150
                                ${
                              // Selected only if hoveredCategory matches, or if no hoveredBrand and no hoveredCategory and search results match
                              hoveredCategory === el.name ||
                                (
                                  !hoveredCategory &&
                                  !hoveredBrand &&
                                  searchedProducts &&
                                  searchedProducts.length > 0 &&
                                  searchedProducts.some(p =>
                                    p.categories?.some(c => c.name === el.name)
                                  )
                                )
                                ? 'bg-[color:var(--color-one)] text-white'
                                : ''
                              }
                              `}
                          >
                            {el.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                    <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white ">
                      {t("popularBrands")}
                    </h3>
                    <div className="flex flex-col self-start w-full xgrow border-r border-white bg-[color:var(--gray-bg)] py-4 grid-cols-1 gap-1.5 ">
                      {popularBrands.data.map(brand => (
                        <Link key={brand.id} href={brand.href}>
                          <a
                            onMouseEnter={() => {
                              // Eğer aynı brand zaten seçili ise, tekrar işlem yapma
                              if (hoveredBrand === brand.name) {
                                return;
                              }

                              setHoveredBrand(brand.name);
                              setHoveredCategory(undefined);

                              // Filter products by brand using exact matching
                              const brandProducts = products.data.filter(p =>
                                p.brand?.name && isBrandMatch(p.brand.name, brand.name)
                              );

                              // Apply both location and stock filtering to hide out-of-stock products
                              const filteredBrandProducts = filterProducts(brandProducts);

                              // Update both filtered and unfiltered products
                              setSearchedProductsNotFiltered(filteredBrandProducts);
                              setSearchedProducts(filteredBrandProducts.slice(0, 8));

                              // Set keyword to match brand for consistency (clean version)
                              products.searchKeyword = cleanBrandName(brand.name);
                              setPlaceholderOpen(false);
                            }}
                            className={`
                            text-[13px] flex items-center justify-center
                            rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)]
                            font-normal bg-[color:var(--gray-bg)] hover:bg-[color:var(--color-one)] hover:text-white  w-full xl:justify-start transition duration-150 px-4
                            ${hoveredBrand === brand.name ? 'bg-[color:var(--color-one)] text-white' : ''}
                          `}
                          >
                            {brand.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm  bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                      {t("searchResults")}
                    </h3>

                    {/* SEARCH RESULTS */}

                    <div className="grid p-4 grid-cols-2 gap-2">

                      {filterProducts(popularProducts.data).filter((p) => {
                        // Filter products by category if a category is hovered
                        return hoveredCategory
                          ? p.categories.find(
                            (c) => c.name.toLowerCase() === hoveredCategory.toLowerCase()
                          )
                          : true
                      }
                      ).length > 0 ? (
                        filterProducts(popularProducts.data)
                          .filter((p) => {
                            // Filter products by category if a category is hovered
                            return hoveredCategory
                              ? p.categories.find(
                                (c) => c.name.toLowerCase() === hoveredCategory.toLowerCase()
                              )
                              : true
                          }
                          )
                          .map((product) => {
                            // console.log('product.name', product.name);

                            const mainImages = product?.attributes?.find(
                              (e) => e.productAttribute?.name === "Ana Resim"
                            )?.images;
                            const showImage =
                              mainImages && mainImages.length > 0
                                ? mainImages[0]
                                : product?.selectedVariant?.mainImage?.image!;
                            return (
                              <Link key={product.id} href={product.href}>
                                <a className="grid border hover:bg-[color:var(--gray-four)] border-[color:var(--gray-one)] rounded-sm gap-1 p-1 grid-cols-[70px_1fr] w-full">
                                  <div className="relative rounded-sm aspect-293/372 w-full overflow-hidden">
                                    <Image
                                      image={showImage}
                                      useBlur
                                      sizes="(max-width: 1280px) 180px, 180px"

                                      alt={product.name}
                                      layout="fill"
                                      objectFit="cover"
                                    />
                                  </div>
                                  <div className="p-1 flex flex-col text-[color:var(--black-two)]">
                                    <h3 className="text-xs line-clamp-2">
                                      {product.name}
                                    </h3>
                                    <span className="text-sm font-medium">
                                      {product.selectedVariant.price.sellPrice}{" "}
                                      {
                                        product.selectedVariant.price
                                          .currencySymbol
                                      }
                                    </span>
                                  </div>
                                </a>
                              </Link>
                            );
                          })
                      ) : (
                        <div className="col-span-2 text-sm pb-2">
                          <button
                            className="underline text-[color:var(--color-one)]"
                            onClick={() => {
                              setHoveredCategory(undefined);
                              setHoveredBrand(undefined);
                              products.searchKeyword = "";
                              uiStore.searchKeyword = "";
                              setSearchedProducts(undefined);
                              setSearchedProductsNotFiltered(undefined);
                            }}
                          >
                            {t("noProductClearFilter")}
                          </button>
                        </div>
                      )}
                      {/* {hoveredCategory && filterProducts(popularProducts.data).filter((p) => {
                        return p.categories.find((c) => c.name.toLowerCase() === hoveredCategory.toLowerCase())
                      }).length > 8 && (
                          <div className="col-span-2 flex">
                            <Link
                              href={popularCategories.data.find(c => c.name === hoveredCategory)?.href || `/${slugify(hoveredCategory)}`}
                            >
                              <div
                                className={`text-xs flex items-center text-[color:var(--black-one)] cursor-pointer ${direction === "rtl" ? "mr-auto" : "ml-auto"}`}
                              >
                                {direction === "rtl" ? (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      className="w-4 stroke-[color:var(--color-one)] h-4 mr-0.5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                      />
                                    </svg>
                                    <span>
                                      <span className="font-bold text-slate-900">
                                        &quot;{hoveredCategory}&quot; {" "}
                                      </span>
                                      &nbsp;{t("seeAllResults")}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span>
                                      <span className="font-bold text-slate-900">
                                        &quot;{hoveredCategory}&quot; {" "}
                                      </span>
                                      &nbsp;{t("seeAllResults")}
                                    </span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      className="w-4 stroke-[color:var(--color-one)] h-4 ml-0.5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                      />
                                    </svg>
                                  </>
                                )}
                              </div>
                            </Link>
                          </div>
                        )} */}

                      <div className="rounded-sm col-span-2 overflow-hidden">
                        <div className="aspect-16/6 w-full relative">
                          {seachbarImage && (
                            <Image
                              image={seachbarImage}
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            <article className="">
              {(searchedProducts && searchedProducts?.length > 0 && hoveredBrand) &&
                !uiStore.searchKeyword && (
                  <div className="grid grid-cols-1 lg:grid-cols-[180px_auto]">
                    <div className="hidden lg:flex flex-col bg-[color:var(--gray-bg)]">
                      <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                        {t("popularCategories")}
                      </h3>
                      <div className="flex flex-col self-stretch w-full border-r border-white bg-[color:var(--gray-bg)] py-4 grid-cols-1 gap-1.5">
                        {popularCategories.data.map((el) => (
                          <Link key={el.name} href={el.href}>
                            <a
                              onMouseEnter={() => {
                                // Eğer aynı kategori zaten seçili ise, tekrar işlem yapma
                                if (hoveredCategory === el.name) {
                                  return;
                                }
                                onHoverPopularCategory(el.name);
                                setHoveredCategory(el.name);
                                setHoveredBrand(el.name);
                              }}
                              className={`
                                text-[13px] flex items-center justify-center
                                rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)]
                                font-normal hover:bg-[color:var(--color-one)]
                                hover:text-white w-full xl:justify-start px-4 transition duration-150
                                ${
                                // Selected only if hoveredCategory matches, or if no hoveredBrand and no hoveredCategory and search results match
                                hoveredCategory === el.name ||
                                  (
                                    !hoveredCategory &&
                                    !hoveredBrand &&
                                    searchedProducts &&
                                    searchedProducts.length > 0 &&
                                    searchedProducts.some(p =>
                                      p.categories?.some(c => c.name === el.name)
                                    )
                                  )
                                  ? 'bg-[color:var(--color-one)] text-white'
                                  : ''
                                }
                              `}
                            >
                              {el.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                      <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                        {t("popularBrands")}
                      </h3>
                      <div className="flex flex-col self-start w-full border-r border-white bg-[color:var(--gray-bg)] py-4 grid-cols-1 gap-1.5">
                        {popularBrands.data.map((brand) => (
                          <Link key={brand.id} href={brand.href}>
                            <a
                              onMouseEnter={() => {
                                // Eğer aynı brand zaten seçili ise, tekrar işlem yapma
                                if (hoveredBrand === brand.name) {
                                  return;
                                }
                                setHoveredBrand(brand.name);
                                setHoveredCategory(undefined);
                                onHoverBrand(brand.name);
                              }}
                              className={`
                          text-[13px] flex items-center justify-center
                          rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)]
                          font-normal hover:bg-[color:var(--color-one)] hover:text-white
                          w-full xl:justify-start px-4 transition duration-150
                          ${hoveredBrand === brand.name ? 'bg-[color:var(--color-one)] text-white' : ''}
                          `}
                            >
                              {brand.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm  bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                        {t("searchResults")}
                      </h3>

                      {/* SEARCH RESULTS */}

                      <div className="grid p-4 grid-cols-2 gap-2">
                        {(() => {
                          // Filter products based on Turkish IP status
                          const displayProducts = isTurkishIP
                            ? products.data.filter(product => product.isAddToCartEnabled)
                            : products.data;

                          return displayProducts.length > 0 ? (
                            displayProducts.slice(0, 8)
                              .map((product) => {
                                // console.log('product.name', product.name);
                                const mainImages = product?.attributes?.find(
                                  (e) => e.productAttribute?.name === "Ana Resim"
                                )?.images;

                                const showImage =
                                  mainImages && mainImages.length > 0
                                    ? mainImages[0]
                                    : product?.selectedVariant?.mainImage?.image!;
                                return (
                                  <Link key={product.id} href={product.href}>
                                    <a className="grid border hover:bg-[color:var(--gray-four)] border-[color:var(--gray-one)] rounded-sm gap-1 p-1 grid-cols-[70px_1fr] w-full">
                                      <div className="relative rounded-sm aspect-293/372 w-full overflow-hidden">
                                        <Image
                                          image={showImage}
                                          useBlur
                                          alt={product.name}
                                          sizes="(max-width: 1280px) 180px, 180px"

                                          layout="fill"
                                          objectFit="cover"
                                        />
                                      </div>
                                      <div className="p-1 flex flex-col text-[color:var(--black-two)]">
                                        <h3 className="text-xs line-clamp-2">
                                          {product.name}
                                        </h3>
                                        <span className="text-sm font-medium">
                                          {product.selectedVariant.price.sellPrice}{" "}
                                          {
                                            product.selectedVariant.price
                                              .currencySymbol
                                          }
                                        </span>
                                      </div>
                                    </a>
                                  </Link>
                                );
                              })
                          ) : (
                            <div className="col-span-2 text-sm pb-2">
                              <button
                                className="underline text-[color:var(--color-one)]"
                                onClick={() => {
                                  setHoveredCategory(undefined);
                                }}
                              >
                                {t("noProductClearFilter")}
                              </button>
                            </div>
                          );
                        })()}
                        {(() => {
                          const displayProducts = isTurkishIP
                            ? products.data.filter(product => product.isAddToCartEnabled)
                            : products.data;
                          return displayProducts.length > 8;
                        })() && (
                            <div className="col-span-2 flex">
                              <Link
                                key={`see-all-brand-${hoveredBrand || hoveredCategory || 'default'}`}
                                href={seeAllResultsHref}
                              >
                                <a className={`text-xs flex items-center text-[color:var(--black-one)] ${direction === "rtl" ? "mr-auto" : "ml-auto"}`}>
                                  {direction === "rtl" ? (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-4 stroke-[color:var(--color-one)] h-4 mr-0.5"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M15.75 19.5L8.25 12l7.5-7.5"
                                        />
                                      </svg>
                                      <span>
                                        <span className="font-bold text-slate-900">
                                          &quot;{hoveredCategory || hoveredBrand || uiStore.searchKeyword}&quot; {" "}
                                        </span>
                                        &nbsp;{t("seeAllResults")}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span>
                                        <span className="font-bold text-slate-900">
                                          {hoveredCategory || hoveredBrand || uiStore.searchKeyword}
                                        </span>
                                        &nbsp;{t("seeAllResults")}
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-4 stroke-[color:var(--color-one)] h-4 ml-0.5"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                      </svg>
                                    </>
                                  )}
                                </a>
                              </Link>
                            </div>
                          )}
                        <div className="rounded-sm col-span-2 overflow-hidden">
                          <div className="aspect-16/6 w-full relative">
                            {seachbarImage && (
                              <Image
                                image={seachbarImage}
                                alt=""
                                layout="fill"
                                objectFit="cover"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

            </article>

          </div>
        )
        }
      </div >
    </div >
  );
};

export default observer(SearchBar);