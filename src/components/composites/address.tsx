import { observer } from "mobx-react-lite";
import { useStore, useTranslation } from "@ikas/storefront";
import useAddress from "../../utils/useAddress";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "./modal";
const Address = () => {
  const store = useStore();
  const { t } = useTranslation();
  const {
    isAddressFormVisible,
    addressForm,
    hasAddress,
    onAddNewAddressClick,
    onAddressFormClose,
    onAddressSave,
    onAddresEdit,
    onAddressDelete,
  } = useAddress();
  const [pending, setPending] = useState(false);
  const createNewAddress = async () => {
    try {
      setPending(true);
      await onAddressSave();
      onAddressFormClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save address");
    } finally {
      setPending(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col">
        {!isAddressFormVisible && hasAddress && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {store.customerStore.customer?.addresses?.map(
                (address, index) => (
                  <div
                    key={address.id}
                    className="grid text-[color:var(--black-two)] grid-cols-[calc(100%-40px),24px] gap-4 border p-4 border-[color:var(--black-one)] rounded"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-lg">{address.title}</div>
                      <div className="text-sm">{address.addressText}</div>
                      <div className="text-sm">
                        {address.firstName} {address.lastName}, {address.phone}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          onAddresEdit(address, index);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.2}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      <Modal
                        trigger={(e) => (
                          <button
                            onClick={() => {
                              e();
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.2}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        )}
                        onConfirm={() => {
                          onAddressDelete(address, index);
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            <button
              onClick={onAddNewAddressClick}
              className="mt-4 flex items-center justify-center w-min whitespace-nowrap lg:ml-auto px-4 py-2 bg-[color:var(--color-one)] text-white rounded"
            >
              {t("createNewAddress")}
            </button>
          </>
        )}
        {isAddressFormVisible && addressForm && (
          <>
            {!addressForm.isLoaded && (
              <div className="flex items-center justify-center h-[411px]">
                <div className="customloader" />
              </div>
            )}
            {addressForm.isLoaded && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await createNewAddress();
                }}
                className="flex max-w-xl flex-col gap-3"
              >
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("title")}
                  </label>
                  <input
                    type="text"
                    required={!!addressForm.fieldSettings?.title.required}
                    value={addressForm.address.title}
                    onChange={(e) => {
                      addressForm.onTitleChange(e.target.value);
                    }}
                    placeholder={t("title")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {addressForm.validationResult?.title.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.title.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("addressLine1")}
                  </label>
                  <input
                    type="text"
                    required={
                      !!addressForm.fieldSettings?.addressLine1.required
                    }
                    value={addressForm.address.addressLine1}
                    onChange={(e) => {
                      addressForm.onAddressLine1Change(e.target.value);
                    }}
                    placeholder={t("addressLine1")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {addressForm.validationResult?.addressLine1.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.addressLine1.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("addressLine2")}
                  </label>
                  <input
                    type="text"
                    required={
                      !!addressForm.fieldSettings?.addressLine2.required
                    }
                    value={addressForm.address.addressLine2 as string}
                    onChange={(e) => {
                      addressForm.onAddressLine2Change(e.target.value);
                    }}
                    placeholder={t("addressLine2")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {addressForm.validationResult?.addressLine2.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.addressLine2.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("country")}
                  </label>
                  <select
                    disabled={addressForm.isCountriesPending}
                    required={!!addressForm.fieldSettings?.country.required}
                    value={addressForm.address.country?.id || ""}
                    onChange={(e) => {
                      addressForm.onCountryChange(e.target.value);
                    }}
                    placeholder={t("country")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  >
                    {addressForm.countryOptions.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                  {addressForm.validationResult?.country.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.country.message}
                    </span>
                  )}
                </div>

                {addressForm.hasState && (
                  <div className="flex flex-col w-full">
                    <label className="text-base text-[color:var(--black-one)] mb-0.5">
                      {t("state")}
                    </label>

                    <select
                      disabled={addressForm.isStatesPending}
                      required={!!addressForm.fieldSettings?.state.required}
                      value={addressForm.address.state?.id || ""}
                      onChange={(e) => {
                        addressForm.onStateChange(e.target.value);
                      }}
                      placeholder={t("state")}
                      className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                    >
                      <option selected>{t("selectAnOption")}</option>
                      {addressForm.stateOptions.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>

                    {addressForm.validationResult?.state.hasError && (
                      <span className="text-red-500 mt-0.5 text-xs">
                        {addressForm.validationResult?.state.message}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("city")}
                  </label>
                  {addressForm.isFreeTextCity && (
                    <input
                      type="text"
                      required={!!addressForm.fieldSettings?.city.required}
                      value={addressForm.address.city?.name as string}
                      onChange={(e) => {
                        addressForm.onCityInputChange(e.target.value);
                      }}
                      placeholder={t("city")}
                      className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                    />
                  )}{" "}
                  {!addressForm.isFreeTextCity && (
                    <select
                      disabled={addressForm.isCitiesPending}
                      required={!!addressForm.fieldSettings?.city.required}
                      value={addressForm.address.city?.id || ""}
                      onChange={(e) => {
                        addressForm.onCityChange(e.target.value);
                      }}
                      placeholder={t("city")}
                      className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                    >
                      <option selected>{t("selectAnOption")}</option>
                      {addressForm.cityOptions.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {addressForm.validationResult?.city.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.city.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("district")}
                  </label>
                  {(addressForm.isFreeTextDistrict ||
                    addressForm.isFreeTextCity) && (
                    <input
                      type="text"
                      required={!!addressForm.fieldSettings?.district.required}
                      value={addressForm.address.district?.name as string}
                      onChange={(e) => {
                        addressForm.onDistrictInputChange(e.target.value);
                      }}
                      placeholder={t("district")}
                      className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                    />
                  )}{" "}
                  {!addressForm.isFreeTextDistrict &&
                    !addressForm.isFreeTextCity && (
                      <select
                        disabled={addressForm.isDistrictsPending}
                        required={
                          !!addressForm.fieldSettings?.district.required
                        }
                        value={addressForm.address.district?.id || ""}
                        onChange={(e) => {
                          addressForm.onDistrictChange(e.target.value);
                        }}
                        placeholder={t("district")}
                        className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                      >
                        {addressForm.districtOptions.map((e) => (
                          <option key={e.value} value={e.value}>
                            {e.label}
                          </option>
                        ))}
                      </select>
                    )}
                  {addressForm.validationResult?.district.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.district.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("zipCode")}
                  </label>
                  <input
                    type="text"
                    value={addressForm.address.postalCode || ""}
                    required={!!addressForm.fieldSettings?.postalCode.required}
                    onChange={(e) => {
                      addressForm.onAddressPostalCodeChange(e.target.value);
                    }}
                    placeholder={t("zipCode")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {addressForm.validationResult?.postalCode.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.postalCode.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("firstName")}
                  </label>
                  <input
                    type="text"
                    value={addressForm.address.firstName}
                    required={!!addressForm.fieldSettings?.firstName.required}
                    onChange={(e) => {
                      addressForm.onFirstNameChange(e.target.value);
                    }}
                    placeholder={t("firstName")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {addressForm.validationResult?.firstName.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.firstName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("lastName")}
                  </label>
                  <input
                    type="text"
                    value={addressForm.address.lastName}
                    required={!!addressForm.fieldSettings?.lastName.required}
                    onChange={(e) => {
                      addressForm.onLastNameChange(e.target.value);
                    }}
                    placeholder={t("lastName")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {addressForm.validationResult?.lastName.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.lastName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-base text-[color:var(--black-one)] mb-0.5">
                    {t("phoneNumber")}
                  </label>
                  <input
                    type="text"
                    value={addressForm.address.phone || ""}
                    required={!!addressForm.fieldSettings?.phone.required}
                    onChange={(e) => {
                      addressForm.onPhoneChange(e.target.value);
                    }}
                    placeholder={t("phoneNumber")}
                    className="w-full border-[color:var(--input-color)] focus:ring-transparent focus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)] relative text-base font-light border rounded px-2.5"
                  />

                  {addressForm.validationResult?.phone.hasError && (
                    <span className="text-red-500 mt-0.5 text-xs">
                      {addressForm.validationResult?.phone.message}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2.5">
                  {hasAddress && (
                    <button
                      disabled={pending}
                      className="disabled:opacity-60 tracking-wide w-full border border-[color:var(--color-three)] text-[color:var(--color-three)] text-sm font-medium rounded py-2.5 px-5"
                      type="button"
                      onClick={() => {
                        onAddressFormClose();
                      }}
                    >
                      {pending ? t("loading") : t("cancel")}
                    </button>
                  )}
                  <button
                    disabled={pending}
                    className="disabled:opacity-60 tracking-wide w-full bg-[color:var(--color-three)] text-sm font-medium text-white rounded py-2.5 px-5"
                    type="submit"
                  >
                    {pending ? t("loading") : t("Submit")}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default observer(Address);
