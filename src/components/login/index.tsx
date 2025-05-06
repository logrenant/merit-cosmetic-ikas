import { observer } from "mobx-react-lite";
import useLogin from "../../utils/useLogin";
import { Image, Link, useTranslation } from "@ikas/storefront";
import { useDirection } from "../../utils/useDirection";
import { LoginProps } from "../__generated__/types";

const Login = ({ details }: LoginProps) => {
  const login = useLogin();
  const { onFormSubmit, form, isPending, status } = login;
  const { direction } = useDirection();
  const { t } = useTranslation();
  return (
    <div dir={direction}>
      <div className="flex items-center mt-10 gap-4 border-b-[4px] border-[color:var(--color-five)] pb-6 justify-center">
        <h1 className="text-lg px-4 relative font-medium text-[color:var(--color-one)] ">
          {t("login")}
          <span className="absolute left-0 bottom-[-28px] h-[4px] w-full bg-[color:var(--color-one)]"></span>
        </h1>
        <Link href="/account/register">
          <a className="text-lg px-4 text-[color:var(--black-one)]">
            {t("register")}
          </a>
        </Link>
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
          <button
            disabled={isPending}
            className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
            type="submit"
          >
            {isPending ? t("loading") : t("login")}
          </button>
          <Link href="/account/forgot-password">
            <a className="text-base text-[color:var(--black-one)]">
              {t("forgotPassword")}
            </a>
          </Link>
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

export default observer(Login);
