import React, { useMemo } from "react";
import {
  Image,
  IkasBlog,
  IkasImage,
  Link,
  useTranslation,
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

  return (
    <div className="flex flex-row" dir={direction}>
      <Link href={props.data.href}>
        <a className="flex flex-col gap-4 w-full">
          {/* Meta */}
          <div className="flex flex-col-reverse xl:flex-row-reverse justify-between w-full">
            <div className="flex justify-between items-center text-lg text-[color:var(--black-two)] ">
              {showPublishedDate && (
                <div className="inline-block">{publishedDate}</div>
              )}

            </div>
            {/* Title */}
            {showTitle && (
              <Link href={props.data.href}>
                <div className="block">
                  <div className="font-bold text-base lg:text-xl text-[color:var(--color-one)]">
                    {props.data.title}
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className="flex flex-col xl:flex-row">
            {/* Image */}
            {props.data.image?.id && (
              <div className="flex flex-col bg-[color:var(--color-one)] xl:w-[280px] border-4 border-[color:var(--color-one)] rounded">
                <Image
                  useBlur
                  image={props.data.image as IkasImage}
                  alt={props.data.title || ""}
                  layout="responsive"
                  width={3}
                  height={2}
                />
                {showAuthor && (
                  <div className="text-center py-2 text-white">
                    {props.data.writer.firstName} {props.data.writer.lastName}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col py-4 w-full justify-between">
              {/* Description */}
              {showDescription && (
                <p className="text-lg text-[color:var(--black-two)] xl:p-4 ">
                  {props.data.shortDescription.length > 400
                    ? `${props.data.shortDescription.slice(0, 400)}...`
                    : props.data.shortDescription}
                </p>
              )}

              <div className="w-full text-end">
                <Link href={props.data.href}>
                  <div className="xl:text-sm underline text-[color:var(--color-one)]">
                    {`${t("categoryPage.more")} >>`}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default observer(BlogCard);
