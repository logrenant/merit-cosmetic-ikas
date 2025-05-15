import React, { useMemo } from "react";
import { Image, Link } from "@ikas/storefront";
import { observer } from "mobx-react-lite";

import getMonthName from "src/utils/getMonthName";
import { useDirection } from "src/utils/useDirection";
import { PageBlogProps } from "../__generated__/types";
import CategorySvg from "../svg/Category";
import DateSvg from "../svg/DateSvg";
import WriterSvg from "../svg/WriterSvg";

const Blog = (props: PageBlogProps) => {
    const { direction } = useDirection();
    const {
        blog,
        showAuthor: propShowAuthor,
        showPublishedDate: propShowPublishedDate,
        buttonText
    } = props;

    const showDate = !!(propShowPublishedDate && blog.createdAt);
    const showAuth = !!(propShowAuthor && blog.writer);

    const publishedDate = useMemo(() => {
        const ts = blog.createdAt;
        if (!ts) return "";
        const d = new Date(ts);
        return `${d.getDate()} ${getMonthName(d)}, ${d.getFullYear()}`;
    }, [blog.createdAt]);

    if (!blog) return null;


    const currentCategory = blog.category?.metadata?.slug && blog.category.name
        ? { slug: blog.category.metadata.slug, name: blog.category.name }
        : null;



    return (
        <div className="layout block my-8" dir={direction}>
            <BlogImage {...props} />
            <div className="flex flex-col gap-8">
                <h1 className="font-medium text-3xl xl:text-4xl text-[color:var(--color-one)]">
                    {blog.title}
                </h1>
                <div className="w-full flex flex-col xl:flex-row gap-12">
                    <div className="flex flex-col gap-6 xl:w-1/5 lg:text-lg">
                        {currentCategory && (
                            <div className="flex flex-row items-end gap-2">
                                <CategorySvg /> {currentCategory.name}
                            </div>
                        )}
                        {showAuth && (
                            <div className="flex flex-row items-end gap-2">
                                <WriterSvg /> <span>{blog.writer.firstName} {blog.writer.lastName}</span>
                            </div>
                        )}
                        {showDate && (
                            <div className="flex flex-row items-end gap-2">
                                <DateSvg /> {publishedDate}
                            </div>
                        )}

                        <Link href="/blog">
                            <a className="bg-[color:var(--color-one)] text-white rounded py-1 text-center">
                                {buttonText}
                            </a>
                        </Link>
                    </div>
                    <div
                        className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm xl:w-4/5"
                        dangerouslySetInnerHTML={{ __html: blog.blogContent.content }}
                    />
                </div>
            </div>
        </div>
    );
};

const BlogImage = observer(
    ({ blog }: PageBlogProps) => {
        if (!blog?.image?.id) return null;

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