import React, { useMemo } from "react";
import { Image, Link, useTranslation } from "@ikas/storefront";
import { observer } from "mobx-react-lite";

import getMonthName from "src/utils/getMonthName";
import { useDirection } from "src/utils/useDirection";
import { PageBlogProps } from "../__generated__/types";
import CategorySvg from "../svg/Category";
import DateSvg from "../svg/DateSvg";
import WriterSvg from "../svg/WriterSvg";

const Blog = (props: PageBlogProps) => {
    const { direction } = useDirection();
    const { t } = useTranslation();
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
        <div className="layout block my-6" dir={direction}>
            {/* Breadcrumb */}
            <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[13px] mb-6">
                <li className="flex items-center gap-x-2">
                    <Link href="/">
                        <a className="text-[color:var(--color-one)]">{t("home")}</a>
                    </Link>
                </li>
                <li className="flex items-center gap-x-2">
                    <svg
                        className="h-3.5 w-3.5 rtl:rotate-180 ltr:rotate-0 shrink-0 stroke-[color:var(--gray-two)]"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                    >
                        <polyline
                            points="96 48 176 128 96 208"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="24"
                        />
                    </svg>
                    <Link href="/blog">
                        <a className="text-[color:var(--color-one)]">{buttonText}</a>
                    </Link>
                </li>
                <li className="flex items-center gap-x-2" aria-current="page">
                    <svg
                        className="h-3.5 w-3.5 rtl:rotate-180 ltr:rotate-0 shrink-0 stroke-[color:var(--gray-two)]"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                    >
                        <polyline
                            points="96 48 176 128 96 208"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="24"
                        />
                    </svg>
                    <span className="text-[color:var(--color-one)] line-clamp-1">
                        {blog.title}
                    </span>
                </li>
            </ul>

            {/* <BlogImage {...props} /> */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row justify-between border-b-1 pb-6 border-[color:var(--color-one)] gap-4 xl:gap-0 xl:items-center">
                    <h1 className="font-medium text-3xl xl:text-4xl text-[color:var(--color-one)]">
                        {blog.title}
                    </h1>
                    {showDate && (
                        <div className="flex flex-row items-center gap-2 text-sm text-nowrap">
                            <DateSvg /> {publishedDate}
                        </div>
                    )}
                </div>
                <div className="flex flex-row justify-between text-sm">
                    {currentCategory && (
                        <div className="flex flex-row items-center gap-2">
                            <CategorySvg /> {currentCategory.name}
                        </div>
                    )}
                    {showAuth && (
                        <div className="flex flex-row items-center gap-2">
                            <WriterSvg /><span className="italic">"{blog.writer.firstName} {blog.writer.lastName}"</span>
                        </div>
                    )}

                </div>
                <div
                    className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm"
                    dangerouslySetInnerHTML={{ __html: blog.blogContent.content }}
                />
            </div>
        </div>
    );
};




{/* <Link href="/blog">
        <a className="bg-[color:var(--color-one)] text-white rounded py-text-center">
        {buttonText}
        </a>
    </Link> 
*/}

// const BlogImage = observer(
//     ({ blog }: PageBlogProps) => {
//         if (!blog?.image?.id) return null;

//         return (
//             <div className="relative block min-w-full mb-20">
//                 <Image
//                     useBlur
//                     image={blog.image}
//                     layout="responsive"
//                     width={5}
//                     height={1}
//                     objectFit="cover"
//                     className="w-full h-auto"
//                 />
//             </div>
//         );
//     }
// );

export default observer(Blog);