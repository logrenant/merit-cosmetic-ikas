import { Image, Link } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { StorylinksProps } from "../__generated__/types";

const StoryLinks = ({ items }: StorylinksProps) => {
  return (
    <div className="mt-6 flex justify-between layout">
      {items?.map((item, i) => (
        <Link href={item.link.href} key={item.link.href}>
          <a className="flex items-center flex-col" key={i}>
            <div className="w-24 md:w-[130px] aspect-square border-2 p-1 rounded-full border-[color:var(--color-one)]">
              <div className="relative rounded-full aspect-square w-full overflow-hidden">
                <Image
                  alt={item?.image?.altText || ""}
                  useBlur
                  image={item.image}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <h4 className="mt-1.5 text-xs md:text-sm text-[color:var(--black-two)]">
              {item.link.label}
            </h4>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default observer(StoryLinks);
