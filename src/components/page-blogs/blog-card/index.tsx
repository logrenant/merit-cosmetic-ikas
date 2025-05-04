import React, { useMemo } from "react";
import {
  Image,
  IkasBlog,
  IkasImage,
  useTranslation,
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
  const { t } = useTranslation();
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
    <div className="relative flex flex-col h-full rounded bg-[color:var(--bg-color)] shadow-lg" dir={direction}>
      {/* Image */}
      {props.data.image?.id && (
        <Link href={props.data.href}>
          <a className="relative block w-full overflow-hidden rounded">
            <Image
              useBlur
              image={props.data.image as IkasImage}
              alt={props.data.title || ""}
              layout="responsive"
              objectFit="cover"
              width={3}
              height={1}
              className="w-full h-auto"
            />
          </a>
        </Link>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2 p-4 sm:p-2.5">
        {/* Meta */}
        <div className="flex justify-between items-center text-[color:var(--black-one)] text-[10px] lg:text-xs">
          {showPublishedDate && (
            <div className="inline-block">{publishedDate}</div>
          )}
          {showAuthor && (
            <div className="inline-block text-right">
              {props.data.writer.firstName} {props.data.writer.lastName}
            </div>
          )}
        </div>

        {/* Title */}
        {showTitle && (
          <Link href={props.data.href}>
            <div className="block">
              <div className="text-[color:var(--black-two)] font-bold text-base lg:text-lg">
                {props.data.title}
              </div>
            </div>
          </Link>
        )}

        {/* Description */}
        {showDescription && (
          <p className="text-[color:var(--black-two)]">
            {props.data.shortDescription.length > 260
              ? `${props.data.shortDescription.slice(0, 260)}...`
              : props.data.shortDescription}
          </p>
        )}

        {/* Category Badge */}
        {showCategory && (
          <div className="absolute top-0 left-0 text-center cursor-pointer">
            <Link href={`/blog/${props.data.category.metadata?.slug}`}>
              <div className="block px-3 py-1 text-[color:var(--bg-color)] bg-[color:var(--input-color)] text-xs">
                {props.data.category.name}
              </div>
            </Link>
          </div>
        )}

        {/* Detail Link */}
        <Link href={props.data.href}>
          <a className="text-[color:var(--color-one)] cursor-pointer">
            {t("Go to Blog")}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default observer(BlogCard);
