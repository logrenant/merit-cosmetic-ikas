import React, { useRef } from "react";
import { observer } from "mobx-react-lite";

import { useDirection } from "src/utils/useDirection";
import { HomepageBlogsProps } from "../__generated__/types";
import BlogCard from "../page-blogs/blog-card";


const BlogList = ({ blogList, ...props }: HomepageBlogsProps) => {
    const { direction } = useDirection();
    const blogsRef = useRef<HTMLDivElement>(null);

    return (
        <div className="layout" ref={blogsRef} dir={direction}>
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