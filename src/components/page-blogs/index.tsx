import React, { useRef } from "react";
import { observer } from "mobx-react-lite";

import BlogCard from "./blog-card";
import { PageBlogsProps } from "../__generated__/types";


const BlogList = ({ blogList, ...props }: PageBlogsProps) => {
    const blogsRef = useRef<HTMLDivElement>(null);

    return (
        <div className="layout" ref={blogsRef}>
            {/* Title */}
            <h1 className="text-3xl font-bold my-12">{props.title}</h1>
            {/* Grid List */}
            <ul className="grid grid-cols-12 gap-x-5 gap-y-10 mt-4 mb-8">
                {blogList.data.map((blog) => (
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
    );
};

export default observer(BlogList);