import { observer } from "mobx-react-lite";
import useAccountInfo from "../../utils/useAccountInfo";
import { useTranslation } from "@ikas/storefront";

const Account = () => {
  const { accountInfoForm, pending, status, onSubmit } = useAccountInfo();
  const { t } = useTranslation();
  if (!accountInfoForm) return null;
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex max-w-xl flex-col gap-3"
      >
        <div className="flex flex-col w-full">
          <label className="text-base text-[color:var(--black-one)] mb-0.5">
            {t("firstName")}
          </label>
          <input
            type="text"
            value={accountInfoForm.firstName}
            onChange={(e) => {
              accountInfoForm.onFirstNameChange(e.target.value);
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
            value={accountInfoForm.lastName}
            onChange={(e) => {
              accountInfoForm.onLastNameChange(e.target.value);
            }}
            placeholder={t("lastName")}
            className="w-full border-[color:var(--input-color)] focus:ring-transparent bg-[color:var(--tx-bg)] focus:border-[color:var(--color-six)] relative text-base font-light border rounded-sm px-2.5"
          />

          {status.lastName && (
            <span className="text-red-500 mt-0.5 text-xs">
              {status.lastName}
            </span>
          )}
        </div>
        <div className="flex flex-col w-full">
          <label className="text-base text-[color:var(--black-one)] mb-0.5">
            {t("phoneNumber")}
          </label>
          <input
            type="number"
            value={accountInfoForm.phone}
            onChange={(e) => {
              accountInfoForm.onPhoneChange(e.target.value);
            }}
            placeholder={t("phoneNumber")}
            className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
          />

          {status.phone && (
            <span className="text-red-500 mt-0.5 text-xs">{status.phone}</span>
          )}
        </div>
        {accountInfoForm.email && (
          <div className="flex flex-col w-full">
            <label className="text-base opacity-80 text-[color:var(--black-one)] mb-0.5">
              {t("email")}
            </label>
            <input
              disabled
              type="email"
              readOnly
              value={accountInfoForm.email}
              className="w-full disabled:opacity-50 border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded-sm px-2.5"
            />
          </div>
        )}
        <button
          disabled={pending}
          className="mt-2.5 disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded-sm py-2.5 px-5"
          type="submit"
        >
          {pending ? t("loading") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default observer(Account);
