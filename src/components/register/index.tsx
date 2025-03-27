import { observer } from "mobx-react-lite";
import { useState } from "react";
import useRegister from "../../utils/useRegister";
import { Image, Link, useTranslation } from "@ikas/storefront";
import { useDirection } from "../../utils/useDirection";
import { RegisterProps } from "../__generated__/types";

const Register = ({ details }: RegisterProps) => {
  const register = useRegister();
  const { isPending, onFormSubmit, status, form } = register;
  const [rule, setRule] = useState(false);
  const { t } = useTranslation();
  const { direction } = useDirection();
  return (
    <div dir={direction}>
      <div className="flex items-center mt-10 gap-4 border-b-[4px] border-[color:var(--color-five)] pb-6 justify-center">
        <Link href="/account/login">
          <a className="text-lg px-4 text-[color:var(--black-one)]">
            {t("login")}
          </a>
        </Link>
        <h1 className="text-lg px-4 relative font-medium text-[color:var(--color-one)] ">
          {t("register")}
          <span className="absolute left-0 bottom-[-28px] h-[4px] w-full bg-[color:var(--color-one)] "></span>
        </h1>
      </div>
      <div className="grid lg:grid-cols-2 my-10 px-5 max-w-4xl gap-5 mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit();
          }}
          className="flex w-full gap-3 flex-col"
        >
          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("firstName")}
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => {
                form.onFirstNameChange(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                );
              }}
              placeholder={t("firstName")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
            />

            {status.firstName && (
              <span className="text-red-500 mt-0.5 text-xs">
                {status.firstName}
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
              onChange={(e) => {
                form.onLastNameChange(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                );
              }}
              placeholder={t("lastName")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
            />

            {status.lastName && (
              <span className="text-red-500 mt-0.5 text-xs">
                {status.lastName}
              </span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("email")}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                form.onEmailChange(e.target.value);
              }}
              placeholder={t("email")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
            />

            {status.email && (
              <span className="text-red-500 mt-0.5 text-xs">
                {status.email}
              </span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label className="text-base text-[color:var(--black-one)] mb-0.5">
              {t("password")}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => {
                form.onPasswordChange(e.target.value);
              }}
              placeholder={t("password")}
              className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
            />

            {status.password && (
              <span className="text-red-500 mt-0.5 text-xs">
                {status.password}
              </span>
            )}
          </div>
          <div className="flex gap-2 border border-[color:var(--input-color)] rounded-sm mt-2 p-4 flex-col w-full">
            <div className="flex gap-2 w-full">
              <input
                id={"registerPolicy"}
                type="checkbox"
                checked={rule}
                onChange={(e) => {
                  setRule(e.target.checked);
                }}
                className="text-[color:var(--color-three)] rounded-xs focus:outline-hidden focus:ring-0 focus:ring-transparent mt-[3px]"
              />
              <label
                htmlFor={"registerPolicy"}
                className="text-sm text-[color:var(--black-one)]"
              >
                * {t("registerPolicy")}
              </label>
            </div>
            <div className="flex gap-2 w-full">
              <input
                id={"newsTellerPolicy"}
                type="checkbox"
                checked={!!form.isMarketingAccepted}
                onChange={(e) => {
                  form.isMarketingAccepted = e.target.checked;
                }}
                className="text-[color:var(--color-three)] rounded-xs focus:outline-hidden focus:ring-0 focus:ring-transparent mt-[3px]"
              />
              <label
                htmlFor={"newsTellerPolicy"}
                className="text-sm text-[color:var(--black-one)]"
              >
                {t("newsTellerPolicy")}
              </label>
            </div>
          </div>
          <button
            disabled={isPending || !rule}
            className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5"
            type="submit"
          >
            {isPending ? t("loading") : t("register")}
          </button>
        </form>
        <div>
          <div className="flex bg-[color:var(--auth-color)] text-[color:var(--black-two)] gap-3 mt-[25px] rounded-sm p-8 flex-col">
            {details.items.map((e) => (
              <div key={e.header}>
                <h2 className="font-normal text-lg">{e.header}</h2>
                {e.items.map((l) => (
                  <div
                    key={l.itemsdata.title}
                    className="flex mt-3.5 items-center gap-2"
                  >
                    <div className="w-10 h-10 relative">
                      <Image
                        image={l.itemsdata.icon}
                        alt={l.itemsdata.icon.altText || ""}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>

                    <span className="text-base">{l.itemsdata.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Register);
