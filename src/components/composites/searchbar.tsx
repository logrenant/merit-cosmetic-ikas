import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { observer } from "mobx-react-lite";
import Router from "next/router";
import Filtermobile, { List, NumberList } from "../composites/filtermobile";

import {
  IkasBrandList,
  IkasCategoryList,
  IkasProductFilterDisplayType,
  IkasProductFilter,
  IkasProduct,
  IkasProductList,
  Image,
  Link,
  useStore,
  useTranslation,
  IkasImage,
} from "@ikas/storefront";
import Typewriter from "typewriter-effect";
import { useOnClickOutside } from "usehooks-ts";
import UIStore from "../../store/ui-store";
import { useDirection } from "../../utils/useDirection";
const SearchBar = ({
  products,
  slogans,
  popularBrands,
  popularProducts,
  popularCategories,

}: {
  products: IkasProductList;
  slogans: string[];
  popularBrands: IkasBrandList;
  popularProducts: IkasProductList;
  popularCategories: IkasCategoryList;

}) => {
  const store = useStore();
  const uiStore = UIStore.getInstance();
  const searchRef = useRef<HTMLDivElement>(null);


  const [searchedProducts, setSearchedProducts] = useState<IkasProduct[]>();
  const [searchedProductsNotFiltered, setSearchedProductsNotFiltered] =
    useState<IkasProduct[]>();
  const [placeholderOpen, setPlaceholderOpen] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string>();
  const [hoveredBrand, setHoveredBrand] = useState<string>();
  const [pageIsSearch, setPageIsSearch] = useState<boolean>(false);

  useEffect(() => {
    console.log("placeholderOpen", placeholderOpen);

  }, [placeholderOpen]);
  useEffect(() => {
    console.log("searchedProducts", searchedProducts?.length);

  }, [searchedProducts]);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      uiStore.searchKeyword = "";
      products.searchKeyword = "";
      setPlaceholderOpen(true);
      setSearchedProducts(undefined);
      setSearchedProductsNotFiltered(undefined);
      setHoveredCategory(undefined);
    });
    return () => {
      Router.events.off("routeChangeStart", () => {
        uiStore.searchKeyword = "";
        products.searchKeyword = "";
        setPlaceholderOpen(true);
        setSearchedProducts(undefined);
        setSearchedProductsNotFiltered(undefined);
        setHoveredCategory(undefined);
      });
    };
  }, []);
  useOnClickOutside(searchRef, () => {
    uiStore.searchKeyword = "";
    products.searchKeyword = "";
    setPlaceholderOpen(true);
    setSearchedProducts(undefined);
    setSearchedProductsNotFiltered(undefined);
    setHoveredCategory(undefined);
  });

  useEffect(() => {
    if (store?.router) {
      setPageIsSearch(store?.router?.pathname.includes("search"));
    }
  }, [store?.router]);

  useEffect(() => {
    setSearchedProducts(products.data);
    setSearchedProductsNotFiltered(products.data);
    setHoveredCategory(undefined);
  }, [products.data]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHoveredCategory(undefined);
    uiStore.searchKeyword = event.target.value;
    products.searchKeyword = uiStore.searchKeyword;
    setSearchedProducts(undefined);
    setSearchedProductsNotFiltered(undefined);
  };

  const onChangeHover = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHoveredCategory(undefined);
    uiStore.searchKeyword = event.target.value;
    products.searchKeyword = uiStore.searchKeyword;
    setSearchedProducts(undefined);
    setSearchedProductsNotFiltered(undefined);
  };
  const onClickEnterOrSearch = () => {
    store?.router?.push(`/search?s=${uiStore.searchKeyword}`);
  };

  const [productsOfCat, setProductsOfCat] = useState<any[]>([]);
  const [linkToCategory, setLinkToCategory] = useState('/');


  useEffect(() => {

    if (hoveredCategory) {

      const hoveredLink = hoveredCategory.toLowerCase().replaceAll(" ", "-");

      setLinkToCategory(hoveredLink)

    }


  }, [hoveredCategory]);

  const { t } = useTranslation();
  const productCategories: {
    name: string;
    href: string;
  }[] = [];
  const { direction } = useDirection();
  searchedProductsNotFiltered?.map((e) =>
    e.categories.map((k) => {
      productCategories.push({ name: k.name, href: k.href });
    })
  );

  const onHoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHoveredCategory(undefined);
    uiStore.searchKeyword = event.target.value;
    products.searchKeyword = uiStore.searchKeyword;
    setSearchedProducts(undefined);
    setSearchedProductsNotFiltered(undefined);
  };

  // console.log(!!onHoverChange, !!onChangeHover);



  const onHoverBrand = (br: string) => {
    const hoveredLink = br.toLowerCase().replaceAll(" ", "-");

    setLinkToCategory(hoveredLink)
    // setHoveredCategory(undefined);
    setHoveredCategory(hoveredLink);



    // uiStore.searchKeyword = br;
    products.searchKeyword = br;
    // setSearchedProducts(undefined);
    // setSearchedProductsNotFiltered(undefined);
    setPlaceholderOpen(false);

  };


  return (
    <div className="block lg:order-none order-last lg:col-span-1 col-span-2">
      <div
        ref={searchRef}
        className="flex relative lg:max-w-[700px] mx-auto items-center justify-center"
      >
        <button
          onClick={() => onClickEnterOrSearch()}
          className="absolute z-2 flex items-center justify-center h-full pl-2 pr-3 right-0 top-1/2 transform -translate-y-1/2"
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
          onKeyPress={(e) => {
            setPlaceholderOpen(false);
            if (e.key === "Enter") {
              onClickEnterOrSearch();
            }
          }}
          onFocus={() => setPlaceholderOpen(false)}
          value={uiStore.searchKeyword}
          type="text"
          className={`w-full ${searchedProducts && searchedProducts?.length > 0
            ? "border-[color:var(--color-six)]"
            : "border-[color:var(--input-color)]"
            } focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative z-1 pr-9 text-sm font-light h-[38px] border-[1px] rounded px-2.5`}
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
                  <div className="hidden lg:flex flex-col">
                    <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                      {t("relatedCategories")}
                    </h3>
                    <div className="flex flex-col self-start w-full xgrow border-r border-white bg-[color:var(--gray-bg)] p-4 grid-cols-1 gap-1.5">
                      {productCategories
                        .filter(
                          (v, i, a) =>
                            a.findIndex((v2) =>
                              ["name"].every(
                                (k) => (v2 as any)[k] === (v as any)[k]
                              )
                            ) === i
                        )
                        .map((el) => (
                          <Link key={el.name} href={el.href}>
                            <a
                              onMouseEnter={() => {
                                setHoveredCategory(el.name);
                                setSearchedProducts(() =>
                                  searchedProductsNotFiltered?.filter((p) =>
                                    p.categories.find((c) => c.name === el.name)
                                  )
                                );
                              }}
                              className="text-[13px] flex items-center justify-center rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)] font-normal"
                            >
                              {el.name}
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
                      {searchedProducts.slice(0, 8).map((product) => {
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
                                  alt={product.name}
                                  useBlur
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
                                  {product.selectedVariant.price.currencySymbol}
                                </span>
                              </div>
                            </a>
                          </Link>
                        );
                      })}


                      {searchedProducts.length > 8 && (
                        <div className="col-span-2 flex">
                          <Link href={'/' + linkToCategory}>
                            <a className="text-xs flex items-center ml-auto text-[color:var(--black-one)]">
                              <span>
                                <span className="font-bold text-slate-900">
                                  &quot;{hoveredCategory || uiStore.searchKeyword}&quot; {" "}
                                </span>
                                &nbsp;{t("seeAllResults")}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 stroke-[color:var(--color-one)]  h-4 ml-0.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                />
                              </svg>
                            </a>
                          </Link>
                        </div>
                      )}

                      <div className="col-span-2 rounded-sm overflow-hidden">
                        <img
                          src="https://cdn.myikas.com/images/theme-images/a0536cbf-b107-4cb9-a931-82e158c5f009/image_2560.webp"
                          alt=""
                        />
                      </div>

                    </div>
                  </div>
                </div>
              )}
            {(searchedProducts?.length === 0 || !searchedProducts) &&
              !uiStore.searchKeyword && (
                <div className="grid grid-cols-1 lg:grid-cols-[180px_auto]">
                  <div className="hidden lg:flex flex-col">
                    <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                      {t("popularCategories")}
                    </h3>
                    <div className="flex flex-col self-stretch w-full xgrow border-r border-white bg-[color:var(--gray-bg)] p-4 grid-cols-1 gap-1.5">
                      {popularCategories.data.map((el) => (
                        <Link key={el.name} href={el.href}>
                          <a
                            onMouseEnter={() => {
                              console.log("--> HoverCategory.value", el.name);
                              setHoveredBrand(el.name);

                              setHoveredCategory(el.name);
                              onHoverBrand(el.name);

                            }}
                            className="text-[13px] flex items-center justify-center rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)] font-normal"
                          >
                            {el.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                    <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white ">
                      {t("popularBrands")}
                    </h3>
                    <div className="flex flex-col self-start w-full xgrow border-r border-white bg-[color:var(--gray-bg)] p-4 grid-cols-1 gap-1.5">
                      {popularBrands.data.map((el) => (
                        <Link key={el.name} href={el.href}>
                          <a
                            onMouseEnter={() => {
                              console.log("--> HoverBrand.value", el.name);

                              setHoveredBrand(el.name);
                              onHoverBrand(el.name);
                            }}
                            className="text-[13px] flex items-center justify-center rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)] font-normal">
                            {el.name}
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


                      {popularProducts.data.filter((p) => {
                        // console.log('p.categories-0', p.categories[0].name, { hoveredCategory });

                        // p.categories.map((c) => console.log('popularProducts.category.name', c.name));

                        return hoveredCategory
                          ? p.categories.find(
                            (c) => c.name.toLowerCase() === hoveredCategory.toLowerCase()
                          )
                          : true
                      }
                      ).length > 0 ? (
                        popularProducts.data
                          .filter((p) => {
                            // console.log('p.categories-1', p.categories[0].name, { hoveredCategory });

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
                            }}
                          >
                            {t("noProductClearFilter")}
                          </button>
                        </div>
                      )}






                      <div className="col-span-2 rounded-sm overflow-hidden">
                        <img
                          src="https://cdn.myikas.com/images/theme-images/a0536cbf-b107-4cb9-a931-82e158c5f009/image_2560.webp"
                          alt=""
                        />
                      </div>




                    </div>
                  </div>
                </div>
              )}



            <article className="">



              {(searchedProducts && searchedProducts?.length > 0 && hoveredBrand) &&
                !uiStore.searchKeyword && (
                  <div className="grid grid-cols-1 lg:grid-cols-[180px_auto]">
                    <div className="hidden lg:flex flex-col">
                      <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                        {t("popularCategories")}
                      </h3>
                      <div className="flex flex-col self-start w-full xgrow border-r border-white bg-[color:var(--gray-bg)] p-4 grid-cols-1 gap-1.5 xpb-[9rem]">
                        {popularCategories.data.map((el) => (
                          <Link key={el.name} href={el.href}>
                            <a
                              onMouseEnter={() => {
                                // console.log("--> Hover.value", el.name);
                                // setHoveredBrand(undefined);
                                setHoveredBrand(el.name);


                                setHoveredCategory(el.name + " --");
                                onHoverBrand(el.name);

                              }}
                              className="text-[13px] flex items-center justify-center rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)] font-normal"
                            >
                              {el.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                      <h3 className="text-sm border-r border-white bg-[color:var(--color-one)] px-4 py-1.5 text-white">
                        {t("popularBrands")}
                      </h3>
                      <div className="flex flex-col self-start w-full xgrow border-r border-white bg-[color:var(--gray-bg)] p-4 grid-cols-1 gap-1.5">
                        {popularBrands.data.map((el) => (
                          <Link key={el.name} href={el.href}>
                            <a
                              onMouseEnter={() => {
                                console.log("--> HoverBrand.value", el.name);

                                setHoveredBrand(el.name);
                                onHoverBrand(el.name);
                              }}
                              className="text-[13px] flex items-center justify-center rtl:ml-auto ltr:mr-auto text-[color:var(--black-two)] font-normal">
                              {el.name}
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




          {/* <!--  --> 
          - searchbox kategori listesinin arkaplanini uzat
          */ }






                        {products.data.length > 0 ? (
                          products.data.slice(0, 8)

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
                        )}




                        {products.data.length > 8 && (
                          <div className="col-span-2 flex">
                            <Link href={"/" + linkToCategory}>
                              <a className="text-xs flex items-center ml-auto text-[color:var(--black-one)]">

                                <span>
                                  <span className="font-bold text-slate-900">
                                    &quot;{hoveredBrand || uiStore.searchKeyword}&quot; {" "}
                                  </span>
                                  &nbsp;{t("seeAllResults")}
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-4 stroke-[color:var(--color-one)]  h-4 ml-0.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                  />
                                </svg>
                              </a>
                            </Link>
                          </div>
                        )}




                        <div className="col-span-2 rounded-sm overflow-hidden">
                          <img
                            src="https://cdn.myikas.com/images/theme-images/a0536cbf-b107-4cb9-a931-82e158c5f009/image_2560.webp"
                            alt=""
                          />
                        </div>




                      </div>
                    </div>
                  </div>
                )}

            </article>

          </div>
        )}
      </div>
    </div>
  );
};

export default observer(SearchBar);
