import React from "react";
import {
  IkasDisplayedVariantType,
  IkasDisplayedVariantValue,
  IkasImage,
  IkasProduct,
  Image,
  useTranslation,
} from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { ProductdetailProps } from "../__generated__/types";
import { useDirection } from "src/utils/useDirection";
export const Variants = observer(
  ({
    product,
    onChange,
  }: {
    product: ProductdetailProps["product"];
    onChange: () => void;
  }) => {
    const justSelect =
      product.attributes.find(
        (e) => e.productAttribute?.name === "Varyantı Listeden Seç"
      )?.value === "true";
    return (
      <div className="gap-4 flex flex-col">
        {product.displayedVariantTypes.map((dVT) => (
          <VariantType
            onChange={() => onChange()}
            justSelect={justSelect}
            key={dVT.variantType.id + "vt"}
            product={product}
            dVT={dVT}
          />
        ))}
      </div>
    );
  }
);

Variants.displayName = "Variants";

type VariantTypeProps = {
  product: IkasProduct;
  dVT: IkasDisplayedVariantType;
  justSelect: boolean;
  onChange: () => void;
};

const VariantType = observer(
  ({ dVT, product, justSelect, onChange }: VariantTypeProps) => {
    return (
      <div>
        <div className="mb-2">{dVT.variantType.name}</div>
        <VariantValues
          onChange={() => {
            onChange();
          }}
          justSelect={justSelect}
          dVT={dVT}
          product={product}
        />
      </div>
    );
  }
);

type VariantValueType = {
  product: IkasProduct;
  dVT: IkasDisplayedVariantType;
  justSelect: boolean;
  onChange: () => void;
};

const VariantValues = observer(
  ({ dVT, justSelect, product, onChange }: VariantValueType) => {
    const onVariantValueChange = (dVV: IkasDisplayedVariantValue) => {
      product.selectVariantValue(dVV.variantValue);
      onChange();
    };

    if (dVT.variantType.isColorSelection && !justSelect) {
      return (
        <SwatchVariantValue
          dVT={dVT}
          onVariantValueChange={onVariantValueChange}
        />
      );
    }
    if (justSelect) {
      return (
        <SelectVariantValue
          product={product}
          dVT={dVT}
          onVariantValueChange={onVariantValueChange}
        />
      );
    }
    return (
      <SwatchVariantValueSimple
        dVT={dVT}
        onVariantValueChange={onVariantValueChange}
      />
    );
  }
);

type SelectVariantValueProps = {
  product: IkasProduct;
  dVT: IkasDisplayedVariantType;
  onVariantValueChange: (dVV: IkasDisplayedVariantValue) => void;
};



const SelectVariantValue = observer(
  ({ dVT, product, onVariantValueChange }: SelectVariantValueProps) => {
    const { t } = useTranslation();
    const { direction } = useDirection();

    const selectOptions = dVT.displayedVariantValues.map((dVV) => ({
      value: dVV.variantValue.id,
      label: dVV.variantValue.name,
    }));

    const selectValue = product.selectedVariantValues.find(
      (sVV) => sVV.variantTypeId === dVT.variantType.id
    )?.id;

    const onChange = (value: string) => {
      const dVV = dVT.displayedVariantValues.find(
        (dVV) => dVV.variantValue.id === value
      );
      dVV && onVariantValueChange(dVV);
    };

    // RTL/LTR padding and arrow positioning
    const isRTL = direction === 'rtl';

    return (
      <div className="mt-1 mb-2 relative bg-transparent rounded-sm">
        <select
          value={selectValue}
          dir={direction}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("country")}
          className={`w-full border-[color:var(--black-two)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-transparent relative text-base font-light border rounded-sm px-2.5 appearance-none ${isRTL ? 'text-right pr-2.5 pl-8' : 'text-left pl-2.5 pr-8'}`}
          style={{ background: 'none' }}
        >
          {selectOptions.map((e) => (
            <option key={e.value + "value"} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        {/* Custom arrow SVG */}
        <span
          className={`pointer-events-none absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-2' : 'right-2'}`}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8L10 12L14 8" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    );
  }
);

type SwatchVariantValueProps = {
  dVT: IkasDisplayedVariantType;
  onVariantValueChange: (dVV: IkasDisplayedVariantValue) => void;
};

const SwatchVariantValue = observer(
  ({ dVT, onVariantValueChange }: SwatchVariantValueProps) => {
    return (
      <div className="flex items-center flex-wrap gap-1">
        {dVT.displayedVariantValues.map((dVV) => (
          <Swatch
            key={dVV.variantValue.id + "sw"}
            title={dVV.variantValue.name}
            selected={dVV.isSelected}
            image={dVV.variantValue.thumbnailImage}
            colorCode={dVV.variantValue.colorCode}
            onClick={() => onVariantValueChange(dVV)}
          />
        ))}
      </div>
    );
  }
);

type SwatchProps = {
  selected: boolean;
  title: string;
  image?: IkasImage | null;
  colorCode?: string | null;
  onClick: () => void;
};

export const Swatch = ({
  title,
  selected,
  colorCode,
  image,
  onClick,
}: SwatchProps) => {
  if (image?.id) {
    return (
      <div
        onClick={onClick}
        className={`rounded relative w-20 aspect-293/372 border flex items-center justify-center ${selected
          ? "border-[color:var(--color-one)]"
          : "border-transparent hover:border-[color:var(--color-one)] cursor-pointer"
          }`}
      >
        <div className="relative max-w-[72px] aspect-293/372 w-full rounded-sm overflow-hidden">
          <Image image={image!} layout="fill" className="object-contain" />
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      className={`rounded-full w-[38px] border flex items-center justify-center h-[38px] ${selected
        ? "border-[color:var(--color-one)]"
        : "border-transparent hover:border-[color:var(--color-one)]"
        }`}
    >
      <button
        title={title}
        style={{
          background: colorCode as string,
        }}
        className={`"relative w-8 h-8 rounded-full overflow-hidden border`}
      />
    </div>
  );
};

type SwatchVariantValuePropsSimple = {
  dVT: IkasDisplayedVariantType;
  onVariantValueChange: (dVV: IkasDisplayedVariantValue) => void;
};

const SwatchVariantValueSimple = observer(
  ({ dVT, onVariantValueChange }: SwatchVariantValuePropsSimple) => {
    return (
      <div className="flex items-center flex-wrap gap-1">
        {dVT.displayedVariantValues.map((dVV) => (
          <SwatchSimple
            key={dVV.variantValue.id + "sws"}
            title={dVV.variantValue.name}
            selected={dVV.isSelected}
            onClick={() => onVariantValueChange(dVV)}
          />
        ))}
      </div>
    );
  }
);

type SwatchPropsSimple = {
  selected: boolean;
  title: string;
  onClick: () => void;
};

export const SwatchSimple = ({
  title,
  selected,
  onClick,
}: SwatchPropsSimple) => {
  return (
    <div
      onClick={onClick}
      className={`rounded px-3 py-2 border flex items-center text-sm justify-center ${selected
        ? "border-[color:var(--color-one)] text-white bg-[color:var(--color-two)]"
        : "border-transparent hover:border-[color:var(--color-one)] cursor-pointer"
        }`}
    >
      {title}
    </div>
  );
};
