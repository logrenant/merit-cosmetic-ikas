import { observer } from "mobx-react-lite";
import { useTranslation } from "@ikas/storefront";

import Phone from "../svg/Phone";
import Envelope from "../svg/Envelope";
import Location from "../svg/Location";

import BackInStockRequestForm from "./Form";
import { useDirection } from "../../utils/useDirection";
import { BackInStockRequestProps } from "../__generated__/types";

const BackInStockRequestPage = (props: BackInStockRequestProps) => {
    const { direction } = useDirection();
    const { t } = useTranslation();

    const { mail, phone, address } = props.contactProps;

    return (
        <div className="layout flex flex-col xl:flex-row gap-8 my-10" dir={direction}>
            <div className="flex flex-col gap-4">
                <h1 className="leading-none text-[color:var(--color-two)] text-xl lg:text-2xl">
                    {t("contactUs")}
                </h1>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2 ">
                        <div>
                            <Phone />
                        </div>
                        <div className="text-[color:var(--black-one)] text-base font-light">
                            {phone}
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div>
                            <Envelope />
                        </div>
                        <div className="text-[color:var(--black-one)] text-base font-light">
                            {mail}
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div>
                            <Location />
                        </div>
                        <div className="text-[color:var(--black-one)] text-base font-light text-wrap">
                            {address}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <BackInStockRequestForm
                    contactProps={props.contactProps}
                    formMessages={props.formMessages}
                    formRule={props.formRule}
                    productName={props.productName}
                />
            </div>
        </div>
    );
};

export default observer(BackInStockRequestPage);
