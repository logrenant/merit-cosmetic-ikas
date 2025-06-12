import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "usehooks-ts";
import { useTranslation } from "@ikas/storefront";

interface BlogCategory {
    slug: string;
    name: string;
}

interface BlogFilterMobileProps {
    categories: BlogCategory[];
    selectedCategory: string | null;
    onCategorySelect: (slug: string | null) => void;
    filterTitle: string;
    pageTitle: string;
}

const BlogFilterMobile: React.FC<BlogFilterMobileProps> = observer(({
    categories,
    selectedCategory,
    onCategorySelect,
    filterTitle,
    pageTitle
}) => {
    const [openFilter, setOpenFilter] = useState(false);
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();
    const childRef = React.useRef<HTMLDivElement>(null);

    useOnClickOutside(childRef, () => setOpenFilter(false));

    return (
        <>
            <button
                onClick={() => setOpenFilter(!openFilter)}
                className="max-w-[120px] w-full h-[34px] xl:hidden flex items-center justify-center text-xs border border-[color:var(--gray-two)] rounded-sm"
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
                            <span className="flex leading-none pt-[2px] font-light text-[color:var(--black-two)] text-lg items-center justify-start">
                                {pageTitle}
                            </span>
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
                        <div className="mb-3">
                            <div className="flex w-full flex-col items-center">
                                <div
                                    onClick={() => setOpen(!open)}
                                    className="w-full cursor-pointer bg-[color:var(--color-two)] py-1.5 px-2 justify-between flex items-center gap-2"
                                >
                                    <div className="text-base text-white font-light">{filterTitle}</div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className={`w-[18px] transition-transform h-[18px] text-white ${open ? "transform rotate-90" : "transform -rotate-90"}`}
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
                                        {categories.map(({ slug, name }) => (
                                            <button
                                                key={slug}
                                                onClick={() => {
                                                    onCategorySelect(slug);
                                                    setOpenFilter(false);
                                                }}
                                                className="text-base gap-2 border last:border-b-0 border-t-0 border-[color:var(--gray-two)] px-2 py-1 w-full flex items-center justify-start text-[color:var(--gray-five)] cursor-pointer hover:bg-gray-50"
                                            >
                                                <input
                                                    className="hidden peer"
                                                    type="checkbox"
                                                    readOnly
                                                    checked={selectedCategory === slug}
                                                />
                                                <div className="w-[17px] h-[17px] border relative border-[color:var(--gray-two)] rounded-sm peer-checked:after:block after:hidden after:absolute after:left-[3.5px] after:top-[3.5px] after:rounded-xs after:bg-[color:var(--color-three)] after:w-2 after:h-2" />
                                                <span
                                                    className={`text-base ${selectedCategory === slug
                                                        ? "text-[color:var(--gray-three)] font-normal"
                                                        : "text-[color:var(--gray-five)] hover:font-normal hover:text-[color:var(--gray-three)] font-light"
                                                        }`}
                                                >
                                                    {name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedCategory && (
                            <button
                                onClick={() => {
                                    onCategorySelect(null);
                                    setOpenFilter(false);
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

export default BlogFilterMobile;
