import { observer } from "mobx-react-lite";
import Simpleslider from "../composites/simpleslider";
import { QuicklinksProps } from "../__generated__/types";
import { Image, Link } from "@ikas/storefront";

const QuickLinks = ({ links }: QuicklinksProps) => {
  return (
    <div dir="ltr" className="pt-6 pb-2 layout">
      <Simpleslider
        keenOptions={{
          initial: 0,
          slides: {
            perView: 2,
            spacing: 10,
          },
          breakpoints: {
            "(min-width: 768px)": {
              slides: { perView: 4, spacing: 32 },
            },
            "(min-width: 1024px)": {
              slides: {
                perView: 6,
                spacing: 32,
              },
            },
          },
        }}
        items={links.items.map((e, i) => (
          <Link href={e.link.href} key={i}>
            <a className="keen-slider__slide">
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[32px] relative">
                  <Image
                    alt={e.icon?.altText || ""}
                    useBlur
                    layout="fill"
                    objectFit="contain"
                    image={e.icon}
                  />
                </div>

                <span className="text-[color:var(--black-two)] ml-3">
                  Mağazalarımız
                </span>
              </div>
            </a>
          </Link>
        ))}
      />
    </div>
  );
};

export default observer(QuickLinks);
