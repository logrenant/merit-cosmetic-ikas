import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";

import BagButton from "../composites/bagbutton";
import LocaleBar from "../composites/localebar";
import SearchBar from "../composites/searchbar";
import BellButton from "../composites/bellbutton";
import { NavbarProps } from "../__generated__/types";
import AccountButton from "../composites/accountbutton";
import { useDirection } from "../../utils/useDirection";
import NavbarCategories from "../composites/navbarcategories";
import MobileMenu, { CategoryWithChildrenType } from "../composites/mobilemenu";


const Navbar: React.FC<NavbarProps & { allCategories: CategoryWithChildrenType[], filter: CategoryWithChildrenType }> = ({
  categories,
  products,
  popularBrands,
  popularCategories,
  logo,
  sortItems,
  bannerSlogan,
  slogans,
  popularProducts,
}) => {
  const [open, setOpen] = useState(false);
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
      // console.log("parent", cat.name);

      const children: CategoryWithChildrenType[] = [];
      categories.data.map((child) => {
        // console.log('child.name', child.name);
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
  categoriesWithChildrens.sort(
    (a, b) =>
      sortItems.split(",").indexOf(a.name) -
      sortItems.split(",").indexOf(b.name)
  );
  const { direction } = useDirection();
  return (
    <header
      dir={direction}
      className="bg-[color:var(--bg-color)] lg:shadow-navbar"
    >
      <div className="w-full h-[44px] px-4 py-1.5 text-center font-medium text-[16px] text-white flex items-center justify-center bg-[color:var(--color-one)]">
        <span className="line-clamp-1 whis ">{bannerSlogan}</span>
      </div>

      <div className="bg-[color:var(--bg-color)]">

        <LocaleBar />
        <div className="grid layout gap-3 items-center lg:gap-8  lg:pb-1 pt-1 grid-cols-[180px_1fr] lg:grid-cols-[1fr_minmax(200px,700px)_1fr]">
          <div className="flex font-light text-[color:var(--black-two)] text-lg items-center justify-start">
            <Link href="/">
              <a className="relative aspect-square w-full max-w-[90px]">
                <Image image={logo} layout="fill" className="object-contain scale-1" />
                {/* <img src={'logo.png'} alt="logo" className="object-contain scale-1" /> */}
              </a>
            </Link>
          </div>
          <SearchBar
            products={products}
            popularBrands={popularBrands}
            popularCategories={popularCategories}
            slogans={slogans}
            popularProducts={popularProducts}
          />
          <div className="flex gap-1 items-center justify-end text-[color:var(--black-two)]">
            <AccountButton />
            <BellButton popularProducts={popularProducts.data} />
            <BagButton className="rtl:pr-2 ltr:pl-2" />
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden rtl:mr-3.5 ltr:ml-3.5 flex items-center justify-center w-6 h-6"
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
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <NavbarCategories categoriesWithChildrens={categoriesWithChildrens} />
      <MobileMenu
        open={open}
        setOpen={setOpen}
        data={categoriesWithChildrens}
      />
    </header>
  );
}

export default observer(Navbar);
