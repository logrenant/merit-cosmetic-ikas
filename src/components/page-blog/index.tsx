import React from "react";
import { observer } from "mobx-react-lite";
import { Image, Link } from "@ikas/storefront";

import { useDirection } from "src/utils/useDirection";
import { PageBlogProps } from "../__generated__/types";

const Blog = (props: PageBlogProps) => {
    const { direction } = useDirection();
    const { blog, blogList } = props;

    const categories = Array.from(
        new Map(
            (blogList.data ?? [])
                .map((item) => {
                    const cat = item.category;
                    if (!cat?.name || !cat.metadata?.slug) return null;
                    return [cat.metadata.slug, cat.name] as [string, string];
                })
                .filter((x): x is [string, string] => x !== null)
        )
    ).map(([slug, name]) => ({ slug, name }));

    if (categories.length === 0) {
        return null;
    }


    return (
        <div className="layout block my-8" dir={direction}>
            <BlogImage {...props} />
            <div className="flex flex-col gap-8">
                <h1 className="font-medium text-3xl xl:text-4xl text-[color:var(--color-one)]">
                    {blog.title}
                </h1>
                <div className="w-full flex flex-row gap-4">
                    <div className="flex-wrap w-1/5">
                        {categories.map(({ slug, name }) => (
                            <Link key={slug} href={`/blog/${slug}`}>
                                <a className="bg-[color:var(--color-three)] mr-2 text-white px-3 py-1 text-sm rounded-full hover:opacity-80">
                                    {name}
                                </a>
                            </Link>
                        ))}
                    </div>
                    <div
                        className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm w-4/5"
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