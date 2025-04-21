import React from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@ikas/storefront";

import { PageBlogProps } from "../__generated__/types";

const Blog = (props: PageBlogProps) => {
    const { blog } = props;

    return (
        <div className="block my-8">
            <BlogImage {...props} />
            <div className="w-[calc(100%-20px)] mx-[10px] md:w-[calc(100%-32px)] lg:max-w-[1024px] lg:mx-auto">
                <h1 className="font-medium text-3xl mt-5 mb-8 xl:text-4xl text-[color:var(--color-one)]">
                    {blog.title}
                </h1>
                <div
                    className="text-[color:var(--black-two)] text-lg xl:text-2xl"
                    dangerouslySetInnerHTML={{ __html: blog.blogContent.content }}
                />
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
                    width={3}
                    height={1}
                    objectFit="cover"
                    className="w-full h-auto"
                />
            </div>
        );
    }
);

export default observer(Blog);