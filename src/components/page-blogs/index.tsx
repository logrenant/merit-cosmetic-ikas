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
        <div className="layout" ref={blogsRef} dir={direction}>
            {/* Title */}
            <h1 className="text-3xl font-bold my-12">{props.title}</h1>
            <div className="flex flex-row gap-12">
                {showFilter && (
                    <div className="w-1/5 flex flex-col gap-4">
                        <div className="flex-wrap">
                            {categories.map(({ slug, name }) => (
                                <button
                                    key={slug}
                                    onClick={() => setSelectedCategory(slug)}
                                    className={`
                                    bg-[color:var(--color-three)] mr-2 text-white px-3 py-1 text-sm rounded-sm hover:opacity-80
                                    ${selectedCategory === slug ? "ring-2 ring-[color:var(--color-one)]" : ""}
                                `}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                        {/* Clear Filter */}
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="disabled:opacity-60 whitespace-nowrap tracking-wide bg-[color:var(--color-three)] text-sm w-full rounded-sm py-1.5 text-white"
                        >
                            {t("categoryPage.clearFilters")}
                        </button>
                    </div>
                )}
                {/* Grid List */}
                <ul className="w-4/5 grid grid-cols-12 gap-x-5 gap-y-10 mt-4 mb-8">
                    {(blogList.data
                        // Seçili kategori varsa, sadece o slug ile eşleşenleri göster
                        .filter(blog =>
                            !selectedCategory ||
                            blog.category?.metadata?.slug === selectedCategory
                        )
                    ).map(blog => (
                        <li
                            key={blog.id}
                            className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4"
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