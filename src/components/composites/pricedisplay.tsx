
import { observer } from "mobx-react-lite";
import { formatCurrency } from "@ikas/storefront";
import UIStore from "../../store/ui-store";
import useConvertedPrice from "../../utils/useConvertedPrice";
import { useDirection } from "../../utils/useDirection";

const Pricedisplay = ({
  amount,
  currencyCode,
  currencySymbol,
  center,
  left,
  isTable = false,
  containerClassName = "",
  priceClassName = "",
  convertedPriceClassName = ""
}: {
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  center: boolean;
  left?: boolean;
  isTable?: boolean;
  containerClassName?: string;
  priceClassName?: string;
  convertedPriceClassName?: string;
}) => {
  const { formatPrice } = useConvertedPrice();
  const uiStore = UIStore.getInstance();
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  return (
    <span
      className={`flex items-center gap-x-1.5 whitespace-nowrap 
        ${isTable ? "flex-row w-full" : "flex-row w-full"}
        ${!isTable && center ? "justify-center" : ""}
        ${!isTable && left ? "flex-row-reverse justify-end" : ""}
        ${containerClassName}`}
    >
      <span
        className={`
          ${isTable
            ? uiStore.currency === "USD"
              ? "w-full text-end"
              : `w-[50%] ${isRTL ? 'text-left' : 'text-end'} text-end`
            : ""}
          ${priceClassName}
        `}
      >
        {`${formatCurrency(amount, currencyCode, currencySymbol).replace(currencySymbol, '')} ${currencySymbol}`}
      </span>
      {uiStore.currency !== "USD" ? (
        <span className={`text-xs ${isTable ? `w-[50%] ${isRTL ? 'text-left' : 'text-end'}` : ""} md:text-sm text-[color:var(--color-four)] ${convertedPriceClassName}`}>
          ({formatPrice(amount)})
        </span>
      ) : null}
    </span>
  );
};

export default observer(Pricedisplay);