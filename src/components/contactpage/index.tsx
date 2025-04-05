import { observer } from "mobx-react-lite";
import { useTranslation } from "@ikas/storefront";

import Form from "./Form";
import Phone from "../svg/Phone";
import Envelope from "../svg/Envelope";
import Location from "../svg/Location";

import { useDirection } from "../../utils/useDirection";
import { ContactpageProps } from "../__generated__/types";

const ContactPage = (props: ContactpageProps) => {
  const { direction } = useDirection();
  const { t } = useTranslation();

  const { mail, phone, address } = props.contactProps;

  return (
    <div className="layout my-10" dir={direction}>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-0 leading-none text-[color:var(--color-two)] text-xl lg:text-2xl">
          {t("contactUs")}
        </h1>
      </div>
      <div className="lg:grid-cols-[280px_1fr] mx-auto max-w-4xl mt-8 grid gap-4 w-full grid-cols-1">

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[20px_1fr] items-center gap-2">
            <Phone />
            <div className="text-[color:var(--black-one)] text-base font-light">
              {phone}
            </div>
          </div>
          <div className="grid grid-cols-[20px_1fr] items-center gap-2">
            <Envelope />
            <div className="text-[color:var(--black-one)] text-base font-light">
              {mail}
            </div>
          </div>
          <div className="grid grid-cols-[20px_1fr] items-center gap-2">
            <Location />
            <div className="text-[color:var(--black-one)] text-base font-light">
              {address}
            </div>
          </div>
        </div>
        <Form />
      </div>
    </div>
  );
};

export default observer(ContactPage);
