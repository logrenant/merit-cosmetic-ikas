import React, { useState, useEffect } from "react";
import { useLockBodyScroll } from "../../utils/useLockBodyScroll";
import { observer } from "mobx-react-lite";
import { Link, useTranslation } from "@ikas/storefront";
import { Transition } from "@headlessui/react";
import Router from "next/router";

export type CategoryWithChildrenType = {
  name: string;
  id: string;
  parentId: string | null;
  href: string;
  childrens: CategoryWithChildrenType[] | undefined;
};
const MobileMenu = ({
  data,
  open,
  setOpen,
}: {
  data: CategoryWithChildrenType[];
  open: any;
  setOpen: any;
}) => {
  const [currentMenus, setCurrentMenus] = useState(data);
  const [previousStack, setPreviousStack] = useState<
    CategoryWithChildrenType[][]
  >([]);
  useLockBodyScroll(open);
  const { t } = useTranslation();

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setOpen(false);
    });
    return () => {
      Router.events.off("routeChangeStart", () => {
        setOpen(false);
      });
    };
  }, []);
  const renderMenuItems = (items: CategoryWithChildrenType[]) => {
    return (
      <div className="flex w-full flex-col">
        {items.map((item) =>
          item?.childrens && item?.childrens.length ? (
            <button
              key={item.id}
              className="flex rtl:pr-[26px] ltr:pl-[26px] py-4 border-b border-[color:var(--black-two)] items-center justify-between w-full"
              onClick={() => {
                const tempArray = [...previousStack];
                tempArray.push(items);
                setPreviousStack(tempArray);
                if (item.childrens) {
                  setCurrentMenus(item.childrens);
                }
              }}
            >
              <span>{item.name}</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 ltr:rotate-0 rtl:rotate-180 opacity-40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          ) : (
            <Link href={item.href} key={item.id}>
              <a className="flex  rtl:pr-[26px] ltr:pl-[26px] py-4 border-b border-[color:var(--black-two)] items-center justify-between w-full">
                {item.name}
              </a>
            </Link>
          )
        )}
      </div>
    );
  };
  return (
    <Transition
      className="fixed overflow-hidden z-99 inset-0"
      as="div"
      show={open}
    >
      <Transition.Child
        enter="transition-transform duration-200"
        enterFrom="translate-x-[-100%]"
        enterTo="translate-x-[0px]"
        leave="transition-transform duration-200"
        leaveFrom="translate-x-[0px]"
        leaveTo="translate-x-[-100%]"
        as="div"
        className="w-full flex p-5 flex-col min-h-screen left-0 absolute overflow-y-auto bg-[color:var(--bg-color)] h-full"
      >
        <div className="grid gap-3 lg:gap-8 pb-3.5 grid-cols-[180px_1fr]">
          <div className="flex items-center">
            <button
              onClick={(e) => setOpen(false)}
              className="flex items-center justify-center rtl:ml-2 ltr:mr-2 w-6 h-6"
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
            <Link href="/">
              <a className="flex font-light text-[color:var(--black-two)] text-lg items-center justify-start">
                <span className="text-nowrap">{t("popularCategories")}</span>
              </a>
            </Link>
          </div>

          <div className="flex gap-5 items-center justify-end text-[color:var(--black-two)]">
            <Link href={"/account"}>
              <a className="flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3119 20.2194C18.4579 19.0887 17.353 18.1717 16.0843 17.5407C14.8155 16.9097 13.4176 16.5819 12.0006 16.5832C10.5836 16.5819 9.18569 16.9097 7.91694 17.5407C6.6482 18.1717 5.54329 19.0887 4.68928 20.2194M19.3107 20.2194C20.9772 18.737 22.1537 16.7831 22.6843 14.6167C23.2148 12.4504 23.0743 10.1739 22.2813 8.08922C21.4883 6.00456 20.0804 4.21019 18.2442 2.9441C16.408 1.67801 14.2304 1 12 1C9.76964 1 7.59197 1.67801 5.75579 2.9441C3.91962 4.21019 2.51168 6.00456 1.71871 8.08922C0.92574 10.1739 0.785198 12.4504 1.31572 14.6167C1.84625 16.7831 3.02278 18.737 4.68928 20.2194M19.3107 20.2194C17.299 22.0139 14.6964 23.0038 12.0006 23C9.30442 23.0041 6.70134 22.0141 4.68928 20.2194M15.6673 9.24977C15.6673 10.2222 15.281 11.1549 14.5933 11.8425C13.9057 12.5302 12.9731 12.9165 12.0006 12.9165C11.0282 12.9165 10.0955 12.5302 9.40789 11.8425C8.72025 11.1549 8.33395 10.2222 8.33395 9.24977C8.33395 8.27729 8.72025 7.34465 9.40789 6.657C10.0955 5.96936 11.0282 5.58305 12.0006 5.58305C12.9731 5.58305 13.9057 5.96936 14.5933 6.657C15.281 7.34465 15.6673 8.27729 15.6673 9.24977V9.24977Z"
                    stroke="#212121"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs rtl:mr-2 ltr:ml-2">
                  {t("account")}
                </span>
              </a>
            </Link>
          </div>
        </div>
        <div className="w-full text-[color:var(--black-two)] flex flex-col items-start">
          {previousStack?.length ? (
            <div className="w-full border-y px-1 py-1.5 border-[color:var(--black-two)] grid grid-cols-[100px_1fr] items-center">
              <button
                className="flex rtl:border-l ltr:border-r border-[color:var(--black-two)] items-center w-full"
                onClick={(e) => {
                  const prevState = previousStack?.pop();
                  setPreviousStack(previousStack);
                  if (prevState) {
                    setCurrentMenus(prevState);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5  mr-0.5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                <span>{t("back")}</span>
              </button>
              <Link
                href={
                  previousStack[previousStack.length - 1].find((item) => {
                    return item?.id === currentMenus[0].parentId;
                  })?.href || "/"
                }
              >
                <a className="flex ltr:pl-3 items-center mr-auto">
                  {
                    previousStack[previousStack.length - 1].find((item) => {
                      return item?.id === currentMenus[0].parentId;
                    })?.name
                  }
                </a>
              </Link>
            </div>
          ) : null}
          {renderMenuItems(currentMenus)}
        </div>
      </Transition.Child>
    </Transition>
  );
};
export default observer(MobileMenu);
