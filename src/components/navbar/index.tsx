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
  logo,
  mobileLogo,
  categories,
  categorySort,
  products,
  popularBrands,
  popularCategories,
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
      if (width < 580) {
        setDeviceType('mobile');
      } else if (width >= 580 && width < 1024) {
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

        const children: CategoryWithChildrenType[] = [];
        categories.data.forEach((child) => {
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
      <div className="w-full max-h-[28px] sm-end:max-h-[50px] md-end:max-h-[60px] lg-mid:max-h-[75px] text-center font-medium text-[16px] text-white flex items-center justify-center bg-[color:var(--color-one)] overflow-hidden">
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
        <div className="grid layout gap-2 items-center lg:gap-8  lg:pb-2 pt-2 grid-cols-[180px_1fr] lg:grid-cols-[1fr_minmax(200px,700px)_1fr]">
          <div className="flex font-light text-[color:var(--black-two)] text-lg items-center justify-start">
            <Link href="/">
              <a className="relative w-[120px] h-[33px] xs-mid:w-[130px] xs-mid:h-[36px] sm-start:w-[140px] sm-start:h-[39px] sm-mid:w-[150px] sm-mid:h-[42px] lg-start:aspect-square lg-start:w-[48px] lg-start:min-w-[90px] lg-start:max-w-[90px] lg-start:h-auto">
                {deviceType === 'mobile' || deviceType === 'tablet' ? (
                  mobileLogo ? (
                    <Image image={mobileLogo} layout="fill" className="object-contain" />
                  ) : (
                    <Image image={logo} layout="fill" className="object-contain" />
                  )
                ) : (
                  <Image image={logo} layout="fill" className="object-contain" />
                )}
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