import React, { useRef } from "react";
import { observer } from "mobx-react-lite";
import { Image } from "@ikas/storefront";

import { useDirection } from "src/utils/useDirection";
import { HomepageBlogsProps } from "../__generated__/types";
import BlogCard from "./blog-card";
import { useScreen } from "src/utils/hooks/useScreen";


const BlogList = ({ blogList, ...props }: HomepageBlogsProps) => {
    const { direction } = useDirection();
    const blogsRef = useRef<HTMLDivElement>(null);
    const { isSmall, isMobile, isDesktop } = useScreen();

    return (
        <div className="layout my-6" ref={blogsRef} dir={direction}>
            {/* Banner */}
            {isDesktop && props.xlBanner && (
                <div className="aspect-1400/120 relative mb-6">
                    <Image
                        image={props.xlBanner}
                        alt={props.xlBanner.altText || "Banner"}
                        layout="fill"
                        className="object-contain"
                    />
                </div>
            )}
            {!isDesktop && isMobile && !isSmall && props.mdBanner && (
                <div className="aspect-704/64 relative mb-6">
                    <Image
                        image={props.mdBanner}
                        alt={props.mdBanner.altText || "Banner"}
                        layout="fill"
                        className="object-contain"
                    />
                </div>
            )}
            {isSmall && props.smBanner && (
                <div className="aspect-316/64 relative mb-6">
                    <Image
                        image={props.smBanner}
                        alt={props.smBanner.altText || "Banner"}
                        layout="fill"
                        className="object-contain"
                    />
                </div>
            )}

            <ul className="grid grid-cols-12 gap-x-5 gap-y-10 mt-4">
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