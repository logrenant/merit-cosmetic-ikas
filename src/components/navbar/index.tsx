import { useState, useEffect } from "react";
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
  categorySort,
  products,
  popularBrands,
  popularCategories,
  logo,
  slogans,
  popularProducts,
  searchbarImage,
  categoriesImage,
  bannerSlogan,
  bannerSloganMobile,
  bannerSloganTablet
}) => {
  const [open, setOpen] = useState(false);
  const categoriesWithChildrens: CategoryWithChildrenType[] = [];

  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 620) {
        setDeviceType('mobile');
      } else if (width >= 620 && width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Get appropriate video source based on device type
  const getVideoSource = () => {
    switch (deviceType) {
      case 'mobile':
        return bannerSloganMobile?.videoSrc;
      case 'tablet':
        return bannerSloganTablet?.videoSrc;
      case 'desktop':
      default:
        return bannerSlogan?.videoSrc;
    }
  };

  const videoSrc = getVideoSource();


  if (categorySort?.data?.length) {
    categorySort.data.forEach((sortCat) => {
      const matchingCat = categories.data.find(cat =>
        cat.name.trim().toLowerCase() === sortCat.name.trim().toLowerCase() &&
        cat.parentId === null
      );

      if (matchingCat) {
        const baseCat: CategoryWithChildrenType = {
          id: matchingCat.id,
          name: matchingCat.name,
          href: matchingCat.href,
          parentId: matchingCat.parentId,
          childrens: [],
        };
        console.log("parent", matchingCat.name);

        const children: CategoryWithChildrenType[] = [];
        categories.data.map((child) => {
          console.log('child.name', child.name);
          if (child.parentId === matchingCat.id) {
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
  }

  const { direction } = useDirection();
  return (
    <header
      dir={direction}
      className="bg-[color:var(--bg-color)] lg:shadow-navbar"
    >
      <div className="w-full max-h-[28px] md:max-h-[60px] lg:max-h-[75px] text-center font-medium text-[16px] text-white flex items-center justify-center bg-[color:var(--color-one)] overflow-hidden">
        {videoSrc && (
          <video
            key={`banner-video-${deviceType}-${videoSrc}`}
            autoPlay
            playsInline
            controls={false}
            loop
            muted
            className="w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="bg-[color:var(--bg-color)]">

        <LocaleBar />
        <div className="grid layout gap-3 items-center lg:gap-8  lg:pb-1 pt-1 grid-cols-[180px_1fr] lg:grid-cols-[1fr_minmax(200px,700px)_1fr]">
          <div className="flex font-light text-[color:var(--black-two)] text-lg items-center justify-start">
            <Link href="/">
              <a className="relative aspect-square w-[48px] lg:min-w-[90px] max-w-[90px]">
                <Image image={logo} layout="fill" className="object-contain" />
              </a>
            </Link>
          </div>
          <SearchBar
            products={products}
            popularBrands={popularBrands}
            popularCategories={popularCategories}
            slogans={slogans}
            popularProducts={popularProducts}
            seachbarImage={searchbarImage}
          />
          <div className="flex gap-1 items-center justify-end text-[color:var(--black-two)]">
            <AccountButton />
            <BellButton popularProducts={popularProducts.data} />
            <BagButton />
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
      <NavbarCategories
        categoriesWithChildrens={categoriesWithChildrens}
        categoriesImage={categoriesImage}
      />
      <MobileMenu
        open={open}
        setOpen={setOpen}
        data={categoriesWithChildrens}
      />
    </header>
  );
}

export default observer(Navbar);