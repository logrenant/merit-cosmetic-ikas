import React, { useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import BlogCard from "./blog-card";
import { useDirection } from "src/utils/useDirection";
import { PageBlogsProps } from "../__generated__/types";
import { useTranslation } from "@ikas/storefront";


const BlogList = ({ blogList, showFilter, ...props }: PageBlogsProps) => {
    const { t } = useTranslation();
    const { direction } = useDirection();
    const blogsRef = useRef<HTMLDivElement>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(true);

    const categories = useMemo(() => (
        Array.from(
            new Map(
                (blogList.data ?? [])
                    .map(item => {
                        const cat = item.category;
                        if (!cat?.name || !cat.metadata?.slug) return null;
                        return [cat.metadata.slug, cat.name] as [string, string];
                    })
                    .filter((x): x is [string, string] => x !== null)
            )
        )
    ).map(([slug, name]) => ({ slug, name }))
        , [blogList]);

    return (
        <div className="layout my-10" ref={blogsRef} dir={direction}>
            {/* Title */}
            <div className="flex flex-col gap-4 xl:flex-row justify-between xl:my-12 text-[color:var(--gray-five)]">
                <h1 className="text-3xl font-bold pb-4">{props.title}</h1>
                <h1 className="xl:text-3xl xl:font-bold text-2xl font-semibold">
                    {selectedCategory || (direction === 'rtl' ? "جميع المدونات" : "All Blogs")}
                </h1>
                <div />
            </div>
            <div className="flex xl:flex-row flex-col w-full gap-12">
                {showFilter && (
                    <div className="xl:w-1/5 flex flex-col gap-4">
                        <div className="mb-3">
                            <div className="flex w-full flex-col items-center">
                                <div
                                    onClick={() => setOpen(!open)}
                                    className="w-full cursor-pointer bg-[color:var(--color-two)] py-1.5 px-2 justify-between flex items-center gap-2"
                                >
                                    <div className="text-base text-white font-light">{props.filterTitle}</div>
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
                                                onClick={() => setSelectedCategory(slug)}
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
                                onClick={() => setSelectedCategory(null)}
                                className="disabled:opacity-60 whitespace-nowrap tracking-wide bg-[color:var(--color-three)] text-sm w-full rounded-sm py-1.5 text-white hover:opacity-90"
                            >
                                {t("categoryPage.clearFilters")}
                            </button>
                        )}
                    </div>
                )}
                {/* Grid List */}
                <ul className="xl:w-4/5 flex flex-col gap-12">
                    {(blogList.data
                        // Seçili kategori varsa, sadece o slug ile eşleşenleri göster
                        .filter(blog =>
                            !selectedCategory ||
                            blog.category?.metadata?.slug === selectedCategory
                        )
                    ).map(blog => (
                        <li
                            key={blog.id}
                            className=""
                        >
                            <BlogCard
                                data={blog}
                                showAuthor={!!props.showAuthor}
                                showDescription={!!props.showDescription}
                                showPublishedDate={!!props.showPublishedDate}
                                showCategory={props.showCategory}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default observer(BlogList);


