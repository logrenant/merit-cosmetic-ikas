import { Link, useStore, useTranslation } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { useEffect, useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
const AccountButton = () => {
  const store = useStore();
  const [isLogged, setIsLogged] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setIsLogged(!!store?.customerStore?.customer?.firstName);
  }, [store.customerStore.customer]);

  if (isLogged) {
    return (
      <div ref={ref} className="relative hidden lg:flex items-center">
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="rtl:ml-1.5 ltr:mr-2 lg:flex items-center justify-center"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.3119 20.2194C18.4579 19.0887 17.353 18.1717 16.0843 17.5407C14.8155 16.9097 13.4176 16.5819 12.0006 16.5832C10.5836 16.5819 9.18569 16.9097 7.91694 17.5407C6.6482 18.1717 5.54329 19.0887 4.68928 20.2194M19.3107 20.2194C20.9772 18.737 22.1537 16.7831 22.6843 14.6167C23.2148 12.4504 23.0743 10.1739 22.2813 8.08922C21.4883 6.00456 20.0804 4.21019 18.2442 2.9441C16.408 1.67801 14.2304 1 12 1C9.76964 1 7.59197 1.67801 5.75579 2.9441C3.91962 4.21019 2.51168 6.00456 1.71871 8.08922C0.92574 10.1739 0.785198 12.4504 1.31572 14.6167C1.84625 16.7831 3.02278 18.737 4.68928 20.2194M19.3107 20.2194C17.299 22.0139 14.6964 23.0038 12.0006 23C9.30442 23.0041 6.70134 22.0141 4.68928 20.2194M15.6673 9.24977C15.6673 10.2222 15.281 11.1549 14.5933 11.8425C13.9057 12.5302 12.9731 12.9165 12.0006 12.9165C11.0282 12.9165 10.0955 12.5302 9.40789 11.8425C8.72025 11.1549 8.33395 10.2222 8.33395 9.24977C8.33395 8.27729 8.72025 7.34465 9.40789 6.657C10.0955 5.96936 11.0282 5.58305 12.0006 5.58305C12.9731 5.58305 13.9057 5.96936 14.5933 6.657C15.281 7.34465 15.6673 8.27729 15.6673 9.24977V9.24977Z"
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs whitespace-nowrap rtl:mr-1.5 ltr:ml-1.5">
            {!store.customerStore.customer?.firstName &&
              !store.customerStore.customer?.lastName
              ? t("account")
              : ""}{" "}
            {store.customerStore.customer?.firstName}{" "}
            {store.customerStore.customer?.lastName}
          </span>
        </button>
        {open && (
          <div className="absolute z-50 right-0 top-[28px] rounded-sm overflow-hidden bg-[color:var(--bg-color)] shadow-navbar">
            <div className="flex flex-col divide-y divide-[color:var(--gray-one)]">
              <button
                onClick={() => {
                  store.router?.push("/account");
                  setOpen(false);
                }}
                className="text-left text-xs font-light gap-1.5 flex items-center px-5 whitespace-nowrap py-2 w-full"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3119 20.2194C18.4579 19.0887 17.353 18.1717 16.0843 17.5407C14.8155 16.9097 13.4176 16.5819 12.0006 16.5832C10.5836 16.5819 9.18569 16.9097 7.91694 17.5407C6.6482 18.1717 5.54329 19.0887 4.68928 20.2194M19.3107 20.2194C20.9772 18.737 22.1537 16.7831 22.6843 14.6167C23.2148 12.4504 23.0743 10.1739 22.2813 8.08922C21.4883 6.00456 20.0804 4.21019 18.2442 2.9441C16.408 1.67801 14.2304 1 12 1C9.76964 1 7.59197 1.67801 5.75579 2.9441C3.91962 4.21019 2.51168 6.00456 1.71871 8.08922C0.92574 10.1739 0.785198 12.4504 1.31572 14.6167C1.84625 16.7831 3.02278 18.737 4.68928 20.2194M19.3107 20.2194C17.299 22.0139 14.6964 23.0038 12.0006 23C9.30442 23.0041 6.70134 22.0141 4.68928 20.2194M15.6673 9.24977C15.6673 10.2222 15.281 11.1549 14.5933 11.8425C13.9057 12.5302 12.9731 12.9165 12.0006 12.9165C11.0282 12.9165 10.0955 12.5302 9.40789 11.8425C8.72025 11.1549 8.33395 10.2222 8.33395 9.24977C8.33395 8.27729 8.72025 7.34465 9.40789 6.657C10.0955 5.96936 11.0282 5.58305 12.0006 5.58305C12.9731 5.58305 13.9057 5.96936 14.5933 6.657C15.281 7.34465 15.6673 8.27729 15.6673 9.24977V9.24977Z"
                    stroke="#212121"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("account")}
              </button>

              <button
                onClick={() => {
                  store.customerStore.logout();
                  setOpen(false);
                }}
                className="text-left text-xs font-light gap-1.5 flex items-center px-5 whitespace-nowrap py-2 w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.3}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 ltr:rotate-0 rtl:rotate-180"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>

                {t("logout")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <Link href={"/account/login"}>
      <a className="hidden rtl:ml-2 ltr:mr-2 lg:flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.3119 20.2194C18.4579 19.0887 17.353 18.1717 16.0843 17.5407C14.8155 16.9097 13.4176 16.5819 12.0006 16.5832C10.5836 16.5819 9.18569 16.9097 7.91694 17.5407C6.6482 18.1717 5.54329 19.0887 4.68928 20.2194M19.3107 20.2194C20.9772 18.737 22.1537 16.7831 22.6843 14.6167C23.2148 12.4504 23.0743 10.1739 22.2813 8.08922C21.4883 6.00456 20.0804 4.21019 18.2442 2.9441C16.408 1.67801 14.2304 1 12 1C9.76964 1 7.59197 1.67801 5.75579 2.9441C3.91962 4.21019 2.51168 6.00456 1.71871 8.08922C0.92574 10.1739 0.785198 12.4504 1.31572 14.6167C1.84625 16.7831 3.02278 18.737 4.68928 20.2194M19.3107 20.2194C17.299 22.0139 14.6964 23.0038 12.0006 23C9.30442 23.0041 6.70134 22.0141 4.68928 20.2194M15.6673 9.24977C15.6673 10.2222 15.281 11.1549 14.5933 11.8425C13.9057 12.5302 12.9731 12.9165 12.0006 12.9165C11.0282 12.9165 10.0955 12.5302 9.40789 11.8425C8.72025 11.1549 8.33395 10.2222 8.33395 9.24977C8.33395 8.27729 8.72025 7.34465 9.40789 6.657C10.0955 5.96936 11.0282 5.58305 12.0006 5.58305C12.9731 5.58305 13.9057 5.96936 14.5933 6.657C15.281 7.34465 15.6673 8.27729 15.6673 9.24977V9.24977Z"
            stroke="#212121"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs rtl:mr-1.5 ltr:ml-1.5">{t("account")}</span>
      </a>
    </Link>
  );
};

export default observer(AccountButton);
