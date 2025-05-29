import { observer } from "mobx-react-lite";
import { formatCurrency } from "@ikas/storefront";

import UIStore from "../../store/ui-store";
import useConvertedPrice from "../../utils/useConvertedPrice";

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
  return (
    <span
      className={`flex items-center gap-x-1.5 whitespace-nowrap 
        ${isTable ? "flex-row w-full" : "flex-wrap"}
        ${!isTable && center ? "justify-center" : ""}
        ${!isTable && left ? "flex-row-reverse justify-end" : ""}
        ${containerClassName}`}
    >
      <span className={`${isTable ? "w-[50%] text-end" : ""} ${priceClassName}`}>
        {formatCurrency(amount, currencyCode, currencySymbol)}
      </span>
      {uiStore.currency !== "USD" && (
        <span className={`text-xs ${isTable ? "w-[50%] text-end" : ""} md:text-sm text-[color:var(--color-four)] ${convertedPriceClassName}`}>
          ({formatPrice(amount)} )
        </span>
      )}
    </span>
  );
};

export default observer(Pricedisplay);
