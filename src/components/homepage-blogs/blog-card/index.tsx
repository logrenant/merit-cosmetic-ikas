import React, { useMemo } from "react";
import {
  Image,
  IkasBlog,
  IkasImage,
  Link,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import getMonthName from "src/utils/getMonthName";
import { useDirection } from "src/utils/useDirection";
import { PageBlogsProps } from "src/components/__generated__/types";

type Props = {
  data: IkasBlog;
} & Pick<
  PageBlogsProps,
  | "showAuthor"
  | "showCategory"
  | "showDescription"
  | "showPublishedDate"
>;

const BlogCard = (props: Props) => {
  const { direction } = useDirection();
  const publishedDate = useMemo(() => {
    const ts = props.data.createdAt;
    if (!ts) return "";
    const d = new Date(ts);
    return `${d.getDate()} ${getMonthName(d)}, ${d.getFullYear()}`;
  }, [props.data.createdAt]);

  if (!props.data) return null;

  const showPublishedDate = !!(props.showPublishedDate && props.data.createdAt);
  const showAuthor = !!props.showAuthor;
  const showTitle = !!props.data.title;
  const showDescription =
    !!props.showDescription && !!props.data.shortDescription;
  const showCategory = !!props.showCategory && !!props.data.category;

  return (
    <div className="relative flex flex-col rounded bg-[color:var(--color-one)] h-full text-white" dir={direction}>
      <Link href={props.data.href}>
        <a>
          {/* Image */}
          {props.data.image?.id && (
            <div className="relative block w-full overflow-hidden rounded border-4 border-[color:var(--color-one)]">
              <Image
                useBlur
                image={props.data.image as IkasImage}
                alt={props.data.title || ""}
                layout="responsive"
                width={3}
                height={2}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col gap-2 ">
            {/* Meta */}
            <div className="flex justify-between items-center text-[10px] lg:text-xs p-4 sm:p-2.5">
              {showPublishedDate && (
                <div className="inline-block">{publishedDate}</div>
              )}
              {showAuthor && (
                <div className="inline-block text-right">
                  "<span className="italic">{props.data.writer.firstName} {props.data.writer.lastName}</span>"
                </div>
              )}
            </div>

            {/* Title */}
            {showTitle && (
              <Link href={props.data.href}>
                <div className="block bg-[color:var(--color-four)] text-white">
                  <div className="font-bold text-base lg:text-lg p-4 sm:p-2.5">
                    {props.data.title}
                  </div>
                </div>
              </Link>
            )}

            {/* Description */}
            {showDescription && (
              <p className="p-4 sm:p-2.5">
                {props.data.shortDescription.length > 110
                  ? `${props.data.shortDescription.slice(0, 110)}...`
                  : props.data.shortDescription}
              </p>
            )}

            {/* Category Badge */}
            {showCategory && (
              <div className="absolute top-1 left-1 text-center cursor-pointer">
                <Link href={`/blog/${props.data.category.metadata?.slug}`}>
                  <div className="block px-3 py-1 text-[color:var(--bg-color)] bg-[color:var(--color-four)] text-xs">
                    {props.data.category.name}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </a>
      </Link>
    </div>
  );
};

export default observer(BlogCard);
