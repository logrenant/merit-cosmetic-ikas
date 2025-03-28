import { toast } from "react-hot-toast";
import { useStore } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { IkasNavigationLink, Link } from "@ikas/storefront";
import { FooterProps } from "../__generated__/types";
import { useDirection } from "../../utils/useDirection";
import useEmailSubscription from "src/utils/useEmailSubscription";

import Location from "../svg/Location";
import Envelope from "../svg/Envelope";
import Phone from "../svg/Phone";
import Instagram from "../svg/Instagram";
import X from "../svg/X";
import Facebook from "../svg/Facebook";

const ts = {
  en: {
    contactUs: "CONTACT US",
    links: "Useful Links",
    title: "NEWSLETTER SIGN UP",
    submit: "Submit",
    desc: "Subscribe to our newsletter and get the latest news and offers from us.",
    success: "You have successfully subscribed to our newsletter",
    error: "You are already subscribed to our newsletter",
  },
  ar: {
    contactUs: "اتصل بنا",
    links: "روابط مفيدة",
    title: "الاشتراك في النشرة الإخبارية",
    submit: "الاشتراك",
    desc: "اشترك في النشرة الإخبارية لدينا واحصل على آخر الأخبار والعروض منا.",
    success: "لقد اشتركت بنجاح في النشرة الإخبارية لدينا",
    error: "أنت مشترك بالفعل في النشرة الإخبارية لدينا",
  },
};

const Footer = ({ linkdata }: FooterProps) => {
  const { direction } = useDirection();
  const store = useStore();
  const [selectedLocale, setSelectedLocale] = useState<string>("en");

  // LocalBar'da uygulanan mantığa benzer şekilde, store üzerinden dil bilgisini alıyoruz.
  useEffect(() => {
    if (store.router?.locale) {
      setSelectedLocale(store.router.locale);
    }
  }, [store.router]);

  // selectedLocale "ar" ise Arapça, aksi halde İngilizce kullanıyoruz.
  const currentLang: "en" | "ar" = selectedLocale === "ar" ? "ar" : "en";
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
    onSubmit();
  };

  useEffect(() => {
    if (responseStatus === "success") {
      toast.success(ts[currentLang].success);
    } else if (responseStatus === "error") {
      toast.error(ts[currentLang].error);
    }
  }, [responseStatus, currentLang]);

  return (
    <footer
      dir={direction}
      className="bg-[color:var(--color-one)] flex flex-col items-center text-center lg:text-left mt-6"
    >
      <div className="py-6 layout">
        <section className="text-white flex flex-col gap-4 lg:flex-row justify-between lg:items-start w-full">
          {/* Contact Section */}
          <section className="mb-6 flex flex-col text-white items-center lg:items-start">
            <h5 className="mb-2.5 font-bold uppercase">{ts[currentLang].contactUs}</h5>
            <div className="flex gap-2 mt-4">
              <Location />
              <span className="text-slate-200">Istanbul / Turkey</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Envelope />
              <span className="text-slate-200">info@meritcosmetics.com</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Phone />
              <span className="text-slate-200">+90 555 555 5555</span>
            </div>
            {/* Social Links */}
            <div className="flex justify-center w-full gap-8 mt-4 md:mt-6">
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
            <h5 className="mb-2.5 font-bold uppercase">{ts[currentLang].links}</h5>
            <nav className="mt-2.5 flex flex-col gap-1.5">
              {usefull?.map((fl, idx) => (
                <Link key={fl.itemId + "-link-" + idx} href={fl.href}>
                  {fl.label}
                </Link>
              ))}
            </nav>
          </section>
          {/* Newsletter Section */}
          <section className="md:mb-6 self-start">
            <h5 className="mb-2.5 font-bold uppercase">{ts[currentLang].title}</h5>
            <form onSubmit={onSubmitEmail}>
              <div>
                <div className="mb-2 md:mb-6 md:ms-auto">
                  <p>{ts[currentLang].desc}</p>
                </div>
                <div className="md:mb-0 mb-2">
                  <label htmlFor="contactEmailForm" className="sr-only">Label</label>
                  <div className="flex rounded-lg shadow-xs">
                    <input
                      type="email"
                      required
                      id="contactEmailForm"
                      name="contactEmailForm"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block text-slate-700 w-full outline-hidden focus:ring-transparent ring-transparent active:ring-transparent bg-[color:var(--tx-bg)] shadow-xs rounded-s-lg text-sm focus:z-10 border-[color:var(--tx-bg)] focus:border-[color:var(--tx-bg)]"
                    />
                    <button
                      type="submit"
                      disabled={!email || pending}
                      className="py-3 border-t border-l border-r border-b border-[color:var(--tx-bg)] px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md bg-[color:var(--color-three)] text-white focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {ts[currentLang].submit}
                    </button>
                  </div>
                </div>
                <img src={"payments-ps.png"} alt="logo" className="object-contain scale-1 mt-6 w-full" />
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
