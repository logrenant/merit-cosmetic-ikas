import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@ikas/storefront";

import useContact from "./useContact";
import { useDirection } from "../../utils/useDirection";

const ContactPage = () => {
  const { direction } = useDirection();
  const { t } = useTranslation();
  const {
    isPending,
    status,
    form,
    onFormSubmit,
    formAlert,
    onFormAlertClose,
  } = useContact();

  useEffect(() => {
    if (formAlert) {
      toast[formAlert.status](formAlert.text);
      onFormAlertClose();
    }
  }, [formAlert, onFormAlertClose]);

  return (
    <div className="layout my-10" dir={direction}>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-0 leading-none text-[color:var(--black-two)] text-xl lg:text-2xl">
          {t("contactUs")}
        </h1>
      </div>
      <div className="lg:grid-cols-[280px,1fr] mx-auto max-w-4xl mt-8 grid gap-4 w-full grid-cols-1">
        {/* İletişim Bilgileri */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[20px,1fr] items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.3}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            <div className="text-[color:var(--black-one)] text-base font-light">
              +1 234 567 890
            </div>
          </div>
          <div className="grid grid-cols-[20px,1fr] items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.3}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <div className="text-[color:var(--black-one)] text-base font-light">
              contact@meletiorient.com
            </div>
          </div>
          <div className="grid grid-cols-[20px,1fr] items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.3}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <div className="text-[color:var(--black-one)] text-base font-light">
              Besiki Business Center, Besiki 4, 0108, Tbilisi / GEORGIA
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onFormSubmit();
          }}
          className="flex w-full flex-col gap-3"
        >
          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("firstName")}
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => form.onFirstNameChange(e.target.value)}
              placeholder={t("firstName")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
            />
            {status.firstname && (
              <span className="text-red-500 mt-0.5 text-xs">
                {form.firstNameErrorMessage}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("lastName")}
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => form.onLastNameChange(e.target.value)}
              placeholder={t("lastName")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
            />
            {status.lastname && (
              <span className="text-red-500 mt-0.5 text-xs">
                {form.lastNameErrorMessage}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("email")}
            </label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => form.onEmailChange(e.target.value)}
              placeholder={t("email")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
            />
            {status.email && (
              <span className="text-red-500 mt-0.5 text-xs">
                {form.emailErrorMessage}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("phoneNumber")}
            </label>
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) => form.onPhoneChange(e.target.value)}
              placeholder={t("phoneNumber")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
            />
            {status.phone && (
              <span className="text-red-500 mt-0.5 text-xs">
                {form.phoneErrorMessage}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("message")}
            </label>
            <textarea
              value={form.message}
              onChange={(e) => form.onMessageChange(e.target.value)}
              placeholder={t("message")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
            />
            {status.message && (
              <span className="text-red-500 mt-0.5 text-xs">
                {form.messageErrorMessage}
              </span>
            )}
          </div>

          <button
            disabled={isPending}
            className="disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded py-2.5 px-5"
            type="submit"
          >
            {isPending ? t("loading") : t("Submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default observer(ContactPage);
