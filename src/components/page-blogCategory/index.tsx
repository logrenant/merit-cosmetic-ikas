import React from "react";
import { observer } from "mobx-react-lite";
import type { PageBlogCategoryProps } from "../__generated__/types";

const BlogCategoryList = ({ blogList }: PageBlogCategoryProps) => {
    const categories = Array.from(
        new Set(
            (blogList.data ?? [])
                .map(item => item.category?.name)
                .filter((name): name is string => Boolean(name))
        )
    );

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map(category => (
                <span
                    key={category}
                    className="bg-[color:var(--color-three)] text-white px-3 py-1 text-sm rounded-full"
                >
                    {category}
                </span>
            ))}
        </div>
    );
};

export default observer(BlogCategoryList);
