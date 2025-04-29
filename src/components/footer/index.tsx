import { toast } from "react-hot-toast";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";

import { FooterProps } from "../__generated__/types";
import { useDirection } from "../../utils/useDirection";
import { IkasNavigationLink, Link } from "@ikas/storefront";
import { useStore, useTranslation } from "@ikas/storefront";
import useEmailSubscription from "src/utils/useEmailSubscription";

import X from "../svg/X";
import Phone from "../svg/Phone";
import Location from "../svg/Location";
import Envelope from "../svg/Envelope";
import Facebook from "../svg/Facebook";
import Instagram from "../svg/Instagram";


const Footer = ({ linkdata, footerResponse, newsletterTitle, newsletterDesc, helpLinks, helpLinksTitle }: FooterProps) => {
  const { t } = useTranslation();
  const { direction } = useDirection();

  const currentYear = new Date().getFullYear();

  const [usefull, setUsefull] = useState<IkasNavigationLink[]>([]);
  const [social, setSocial] = useState<any[]>([]);

  useEffect(() => {
    linkdata.forEach((childBase) => {
      if (childBase.title === "Kurumsal") {
        setUsefull([]);
        childBase.links.forEach((child) => {
          const a = {
            itemId: child.itemId,
            label: child.label,
            href: child.href,
            subLinks: child.subLinks,
          };
          setUsefull((prev) => [...prev, a]);
        });
      } else if (childBase.title === "social") {
        setSocial([]);
        childBase.links.forEach((child) => {
          const soc = {
            itemId: child.itemId,
            label: child.label,
            href: child.href,
            subLinks: child.subLinks,
          };
          setSocial((prev) => [...prev, soc]);
        });
      }
    });
  }, [linkdata]);

  const { pending, responseStatus, onSubmit, email, setEmail } = useEmailSubscription();

  const onSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      toast.error(
        footerResponse?.invalidEmail
        ?? 'Please enter a valid email address.'
      );
      return;
    }

    onSubmit();
  };

  useEffect(() => {
    if (responseStatus === 'success') {
      toast.success(
        footerResponse?.success
        ?? 'Your subscription was successful.'
      );
    } else if (responseStatus === 'error') {
      toast.error(
        footerResponse?.error
        ?? 'An unexpected error occurred. Please try again.'
      );
    }
  }, [responseStatus, footerResponse]);

  return (
    <footer
      dir={direction}
      className="bg-[color:var(--color-one)] flex flex-col items-center text-center lg:text-left mt-6"
    >
      <div className="py-6 layout">
        <section className="text-white flex flex-col gap-4 lg:flex-row justify-between lg:items-start w-full">
          {/* Contact Section */}
          <section className="flex flex-col text-white items-center lg:items-start">

            <div className="flex flex-col gap-2 items-center lg:items-start">
              <h5 className="mb-2.5 font-bold uppercase">{t("contactUs")}</h5>
              <div className="flex flex-row items-start gap-2">
                <Location />
                <span className="text-slate-200">Muratpaşa mah. 561. sokak 41/B <br />MURATPAŞA / ANTALYA</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Envelope />
                <span className="text-slate-200">info@meritcosmetics.com</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Phone />
                <span className="text-slate-200">+90 (551)-812-81-00</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex xl:justify-start justify-center w-full gap-8 mt-4 md:mt-6">
              {social?.map((fl, idx) => {
                const socialLink = fl.href as string;
                if (socialLink.includes("x.com") || socialLink.includes("twitter.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <X />
                    </a>
                  );
                } else if (socialLink.includes("instagram.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <Instagram />
                    </a>
                  );
                } else if (socialLink.includes("facebook.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <Facebook />
                    </a>
                  );
                } else return null;
              })}
            </div>
          </section>
          {/* Useful Links Section */}
          <section className="mb-6 flex flex-col text-white items-center lg:items-start">
            <h5 className="mb-2.5 font-bold uppercase">{helpLinksTitle}</h5>
            <nav className="mt-2.5 flex flex-col gap-1.5">
              {helpLinks?.map((fl, idx) => (
                <Link key={fl.itemId + "-link-" + idx} href={fl.href}>
                  {fl.label}
                </Link>
              ))}
            </nav>
          </section>
          {/* Newsletter Section */}
          <section className="self-start">
            <h5 className="mb-2.5 font-bold uppercase">{newsletterTitle}</h5>
            <form onSubmit={onSubmitEmail}>
              <div>
                <div className="mb-2 md:mb-6 md:ms-auto">
                  <p>{newsletterDesc}</p>
                </div>
                <div className="md:mb-0 mb-2">
                  <label htmlFor="contactEmailForm" className="sr-only">Label</label>
                  <div className="flex rounded-lg shadow-xs">
                    <input
                      type="email"
                      required
                      id="contactEmailForm"
                      name="contactEmailForm"
                      placeholder={t("email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block text-slate-700 w-full outline-hidden focus:ring-transparent ring-transparent active:ring-transparent bg-[color:var(--tx-bg)] shadow-xs rounded-s-lg text-sm focus:z-10 border-[color:var(--tx-bg)] focus:border-[color:var(--tx-bg)]"
                    />
                    <button
                      type="submit"
                      disabled={!email || pending}
                      className="py-3 border-t border-l border-r border-b border-[color:var(--tx-bg)] px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md bg-[color:var(--color-three)] text-white focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {t("submit")}
                    </button>
                  </div>
                </div>
                <img src={"payments-ps.png"} alt="logo" className="object-contain mt-6 w-full" />
              </div>
            </form>
          </section>
        </section>
      </div>
      {/* Footer Bottom */}
      <div className="w-full bg-black/5 p-4 text-center">
        <span className="rtl:mr-2 ltr:ml-2 text-xs text-slate-200 leading-none pb-[1.5px]">
          &copy; {currentYear} Merit Cosmetics
        </span>
      </div>
    </footer>
  );
};

export default observer(Footer);