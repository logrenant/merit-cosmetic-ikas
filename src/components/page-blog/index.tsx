import React from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";

import { PageBlogProps } from "../__generated__/types";

const Blog = (props: PageBlogProps) => {
    const { blog } = props;

    const categories = Array.isArray(blog.category)
        ? blog.category
        : blog.category
            ? [blog.category]
            : [];


    return (
        <div className="layout block my-8">
            <BlogImage {...props} />
            <div className="flex flex-col gap-8">
                <h1 className="font-medium text-3xl xl:text-4xl text-[color:var(--color-one)]">
                    {blog.title}
                </h1>
                <div className="w-full flex flex-row gap-4">
                    <div className="flex flex-wrap gap-2 w-1/5">
                        {categories.map((cat) => (
                            <div className="inline-block bg-[color:var(--color-three)] text-white text-sm px-3 py-1 rounded-full transition">
                                {cat.name}
                            </div>
                        ))}
                    </div>
                    <div
                        className="text-[color:var(--black-two)] text-lg xl:text-2xl w-4/5"
                        dangerouslySetInnerHTML={{ __html: blog.blogContent.content }}
                    />
                </div>
            </div>
        </div>
    );
};

const BlogImage = observer(
    ({ showImage, blog }: PageBlogProps) => {
        if (!blog?.image?.id || !showImage) return null;

        return (
            <div className="relative block min-w-full mb-20">
                <Image
                    useBlur
                    image={blog.image}
                    layout="responsive"
                    width={5}
                    height={1}
                    objectFit="cover"
                    className="w-full h-auto"
                />
            </div>
        );
    }
);

export default observer(Blog);