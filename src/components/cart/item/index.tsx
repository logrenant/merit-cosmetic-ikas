import { observer } from "mobx-react-lite"
import { IkasBaseStore, IkasOrderLineItem, Link, useStore, Image } from "@ikas/storefront";

import Cross from "src/components/svg/Cross";
import Pricedisplay from "src/components/composites/pricedisplay";
import { maxQuantityPerCartHandler } from "src/utils/useAddToCart";

const Item = ({ item }: { item: IkasOrderLineItem }) => {
    const store = useStore();

    return (
        <div className="flex xl:flex-row gap-3 py-5 justify-between items-start">
            <div className="min-w-[65%] max-w-[65%] xl:min-w-[70%] xl:max-w-[70%]">
                <ItemProductColumn item={item} store={store} />
            </div>
            <div className="flex flex-col-reverse items-end gap-4 xl:flex-row min-w-[35%] max-w-[35%] xl:min-w-[30%] xl:max-w-[30%] justify-between px-4">
                <ItemQuantityColumn item={item} store={store} />
                <ItemPriceColumn item={item} />
            </div>
        </div>
    )
}


export default observer(Item);

const ItemImage = observer(({ item }: { item: IkasOrderLineItem }) => {

    return (
        <div className={`aspect-4/5 max-w-[90px] w-full ${item.variant.mainImage?.id ? 'rounded-sm overflow-hidden border border-[color:var(--gray-two)]' : ''}`}>
            <Link href={item.variant.href || ""}>
                <a>
                    {!item.variant.mainImage?.id ? (
                        <img
                            src={"/noPhoto.png"}
                            alt="No image available"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="relative h-full w-full">
                            <Image
                                image={item.variant.mainImage!}
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    )}
                </a>
            </Link>
        </div>
    );
});

const ItemProductColumn = observer(
    ({ item, store }: { item: IkasOrderLineItem; store: IkasBaseStore }) => {
        const variantValuesText = item.variant.variantValues
            ?.map((vV) => vV.variantValueName)
            .join(", ");
        return (
            <div className="flex flex-row gap-3 items-start">
                <button
                    className="items-center flex justify-center cursor-pointer"
                    onClick={() => store.cartStore.removeItem(item)}
                >
                    <Cross />
                </button>
                <div className="flex flex-row gap-3">
                    <ItemImage item={item} />
                    <div>
                        <Link href={item.variant.href || ""}>
                            <a className="flex flex-col xl:text-xl text-[color:var(--black-two)]">
                                {item.variant.name}
                            </a>
                        </Link>
                        <div className="text-sm text-[color:var(--color-three)]">
                            <p>{variantValuesText}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    });


type QuantityButtonProps = {
    quantity: number;
    onChange: (value: number) => void;
};

const QuantityButton = ({ quantity, onChange }: QuantityButtonProps) => {
    const handleDecrease = () => {
        if (!(quantity > 1)) return;
        onChange(quantity - 1);
    };

    const handleIncrease = () => {
        onChange(quantity + 1);
    };

    return (
        <div className="flex items-center">
            <button
                className="flex disabled:opacity-40 disabled:animate-pulse items-center justify-center w-6 h-6 rounded-full border border-[color:var(--gray-two)] cursor-pointer"
                disabled={quantity <= 1}
                onClick={handleDecrease}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 12H4"
                    />
                </svg>
            </button>
            <div className="flex items-center justify-center w-6 h-6">
                {quantity}
            </div>
            <button
                className="flex disabled:opacity-40 disabled:animate-pulse items-center justify-center w-6 h-6 rounded-full border border-[color:var(--gray-two)] cursor-pointer"
                onClick={handleIncrease}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </button>
        </div>
    );
};

const ItemQuantityColumn = observer(
    ({ item, store }: { item: IkasOrderLineItem; store: IkasBaseStore }) => {
        const handleQuantityChange = async (value: number) => {
            const result = await store.cartStore.changeItemQuantity(item, value);
            if (result.response?.graphQLErrors) {
                maxQuantityPerCartHandler({
                    productName: item.variant.name,
                    //@ts-ignore
                    errors: result.response?.graphQLErrors,
                });
            }
        };
        return (
            <div className="flex gap-2 text-xs items-center">
                <QuantityButton
                    quantity={item.quantity}
                    onChange={handleQuantityChange}
                />
            </div>
        );
    }
);

const ItemPriceColumn = observer(({ item }: { item: IkasOrderLineItem }) => {
    return (
        <div className="flex flex-col items-end text-[color:var(--black-two)]">
            {!!item.discountPrice && (
                <span className="text-lg w-min whitespace-nowrap leading-none opacity-80 relative">
                    <span className="absolute rotate-6 w-full opacity-70 h-[2px] bg-[color:var(--color-three)] left-0 top-1/2 transform -translate-y-1/2" />
                    <Pricedisplay
                        amount={item.overridenPriceWithQuantity}
                        currencyCode={item.currencyCode || "USD"}
                        currencySymbol={item.currencySymbol || "$"}
                        center={false}
                        left={true}
                        isTable={true}
                    />
                </span>
            )}
            <div className="xl:text-xl leading-none text-[color:var(--color-four)] font-medium">
                <Pricedisplay
                    amount={item.finalPriceWithQuantity}
                    currencyCode={item.currencyCode || "USD"}
                    currencySymbol={item.currencySymbol || "$"}
                    center={false}
                    left={true}
                    isTable={true}
                />
            </div>
        </div>
    )
});



