import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@ikas/storefront";

import Form from "./Form";
import Phone from "../svg/Phone";
import Envelope from "../svg/Envelope";
import Location from "../svg/Location";

import { useDirection } from "../../utils/useDirection";
import { ContactpageProps } from "../__generated__/types";

const ContactPage = (props: ContactpageProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { direction } = useDirection();
  const { t } = useTranslation();

  const { mail, phone, address } = props.contactProps;
  const { title, text } = props.formMessages;

  return (
    <div className="layout flex flex-row my-10" dir={direction}>
      <div className="flex flex-col gap-4">
        <h1 className="leading-none text-[color:var(--color-two)] text-xl lg:text-2xl">
          {t("contactUs")}
        </h1>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Phone />
            <div className="text-[color:var(--black-one)] text-base font-light">
              {phone}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Envelope />
            <div className="text-[color:var(--black-one)] text-base font-light">
              {mail}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Location />
            <div className="text-[color:var(--black-one)] text-base font-light">
              {address}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl grid gap-4 w-full grid-cols-1">
        <div className="flex flex-col gap-4">
          {/* form response */}
          {isSubmitted && (
            <div className=" flex items-start bg-[color:var(--auth-color)] text-[color:var(--black-two)] rounded-sm p-4">
              <div className="flex flex-col">
                <h2 className="font-normal text-lg">{title}</h2>
                <div className="mt-1">
                  <span className="text-base">{text}</span>
                </div>
              </div>
            </div>
          )}
          <Form onSuccess={() => setIsSubmitted(true)} />
        </div>
      </div>
    </div>
  );
};

export default observer(ContactPage);
