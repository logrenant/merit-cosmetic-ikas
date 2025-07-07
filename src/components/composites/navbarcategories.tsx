import { Link } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { CategoryWithChildrenType } from "./mobilemenu";
import { useState, useEffect } from "react";
import Router from "next/router";
const NavbarCategories = ({
  categoriesWithChildrens,
}: {
  categoriesWithChildrens: CategoryWithChildrenType[];
}) => {
  const [hoveredCategory, setHoveredCategory] =
    useState<CategoryWithChildrenType["id"]>();
  const [bagTimeOutId, setBagTimeOutId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setHoveredCategory(undefined);
    });
    return () => {
      Router.events.off("routeChangeStart", () => {
        setHoveredCategory(undefined);
      });
    };
  }, []);

  return (
    <div className="bg-[color:var(--color-two)] relative lg:block hidden">
      <nav
        className="layout overflow-x-auto overflow-y-visible"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .layout::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="flex gap-3 -mx-4 whitespace-nowrap justify-between items-center">
          {categoriesWithChildrens.map((e) => (
            <div
              key={e.id}
              onMouseOver={() => {
                if (e.childrens) {
                  setHoveredCategory(e.id);
                  clearTimeout(bagTimeOutId);
                }
              }}
              onMouseLeave={() => {
                setBagTimeOutId(
                  setTimeout(() => {
                    setHoveredCategory(undefined);
                  }, 300)
                );
              }}
              className="flex py-5 px-4 hover:bg-[color:var(--bg-color)]/10 items-center justify-center hover:cursor-pointer"
            >
              <Link href={e.href}>
                <a className="text-sm tracking-widest text-white">{e.name}</a>
              </Link>
              {hoveredCategory === e.id &&
                e.childrens &&
                e.childrens.length > 0 && (
                  <div
                    onMouseEnter={() => {
                      clearTimeout(bagTimeOutId);
                    }}
                    className="absolute left-0 w-full bg-[color:var(--bg-color)] shadow-sm top-[60px] z-50"
                  >
                    <div className="layout grid grid-cols-5 p-6!">
                      <div className="flex col-span-3 gap-20 flex-wrap">
                        {e.childrens.map((k) => (
                          <div key={k.id} className="flex gap-1.5 flex-col">
                            <Link href={k.href}>
                              <a className="text-[15px] uppercase w-min whitespace-nowrap text-[color:var(--black-two)] font-medium">
                                {k.name}
                              </a>
                            </Link>
                            {k.childrens && k.childrens.length > 0 && (
                              <div className="flex gap-0.5 flex-col">
                                {k.childrens.map((b) => (
                                  <Link key={b.id} href={b.href}>
                                    <a className="text-[14px] tracking-widest w-min whitespace-nowrap text-[color:var(--black-two)] font-normal">
                                      {b.name}
                                    </a>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* <div className="rounded-sm col-span-2 overflow-hidden">
                        <img
                          src="https://cdn.myikas.com/images/theme-images/a0536cbf-b107-4cb9-a931-82e158c5f009/image_2560.webp"
                          alt=""
                          className="aspect-16/6 w-full object-cover"
                        />
                      </div> */}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default observer(NavbarCategories);
