import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { IkasNavigationLink, Link } from "@ikas/storefront";

import { FooterProps } from "../__generated__/types";
import { useDirection } from "../../utils/useDirection";
import useEmailSubscription from "src/utils/useEmailSubscription";

import Location from "../svg/Location";
import Envelope from "../svg/Envelope";
import Phone from "../svg/Phone";


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
  const router = useRouter();
  const { direction } = useDirection();
  const currentLang = (router.locale as "en" | "ar") || "en";
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
      <div className="container p-6 bg-[color:var(--color-one)]">
        <section className="grid place-items-center md:grid-cols-2 lg:grid-cols-3 text-white">
          {/* Contact Section */}
          <section className="mb-6 md:mb-6 text-white self-start">
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
            <div className="flex w-full gap-8 mt-2 md:mt-6">
              {social?.map((fl, idx) => {
                const socialLink = fl.href as string;

                if (socialLink.includes("x.com") || socialLink.includes("twitter.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <svg width="24" height="24" className="min-w-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.53902 22.5C16.5954 22.5 21.551 14.9956 21.551 8.49877C21.551 8.28765 21.551 8.07653 21.5414 7.8654C22.5018 7.17446 23.3373 6.30118 24 5.31275C23.1164 5.7062 22.1657 5.96531 21.1669 6.09006C22.1849 5.48548 22.9628 4.51624 23.3373 3.36466C22.3866 3.93086 21.3301 4.33391 20.2065 4.55463C19.3037 3.59498 18.0264 3 16.6146 3C13.8968 3 11.6879 5.20718 11.6879 7.92298C11.6879 8.30684 11.7359 8.6811 11.8127 9.04577C7.72149 8.84424 4.09124 6.87697 1.66146 3.90207C1.2389 4.6314 0.9988 5.47589 0.9988 6.37795C0.9988 8.08612 1.87275 9.59277 3.18848 10.4756C2.38175 10.4468 1.62305 10.2261 0.960384 9.86146C0.960384 9.88066 0.960384 9.89985 0.960384 9.92864C0.960384 12.3086 2.66026 14.3046 4.90756 14.7557C4.4946 14.8708 4.06242 14.9284 3.61104 14.9284C3.29412 14.9284 2.98679 14.8996 2.68908 14.842C3.31333 16.7997 5.13806 18.22 7.28932 18.2584C5.59904 19.5827 3.47659 20.3696 1.17167 20.3696C0.777912 20.3696 0.384154 20.3504 0 20.3024C2.17047 21.6843 4.76351 22.5 7.53902 22.5Z" fill="white" />
                      </svg>
                    </a>
                  );
                } else if (socialLink.includes("instagram.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <svg width="24" height="24" className="min-w-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.0004 12.0731C24.0004 5.40489 18.6275 -0.000732422 11.9997 -0.000732422C5.37192 -0.000732422 -0.000976562 5.40489 -0.000976562 12.0731C-0.000976562 18.0995 4.38751 23.0944 10.1246 24.0002V15.5632H7.07756V12.0731H10.1246V9.41307C10.1246 6.38707 11.9162 4.7156 14.6575 4.7156C15.9704 4.7156 17.3438 4.95142 17.3438 4.95142V7.92271H15.8305C14.3397 7.92271 13.8748 8.8534 13.8748 9.80822V12.0731H17.2032L16.6711 15.5632H13.8748V24.0002C19.6119 23.0944 24.0004 18.0995 24.0004 12.0731Z" fill="white" />
                      </svg>
                    </a>
                  );
                } else if (socialLink.includes("facebook.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <svg width="24" height="24" className="min-w-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.0004 12.0731C24.0004 5.40489 18.6275 -0.000732422 11.9997 -0.000732422C5.37192 -0.000732422 -0.000976562 5.40489 -0.000976562 12.0731C-0.000976562 18.0995 4.38751 23.0944 10.1246 24.0002V15.5632H7.07756V12.0731H10.1246V9.41307C10.1246 6.38707 11.9162 4.7156 14.6575 4.7156C15.9704 4.7156 17.3438 4.95142 17.3438 4.95142V7.92271H15.8305C14.3397 7.92271 13.8748 8.8534 13.8748 9.80822V12.0731H17.2032L16.6711 15.5632H13.8748V24.0002C19.6119 23.0944 24.0004 18.0995 24.0004 12.0731Z" fill="white" />
                      </svg>
                    </a>
                  );
                } else return null;
              })}
            </div>
          </section>

          {/* Useful Links Section */}

          <section className="mb-6 md:mb-6 self-start">
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
                <div className="md:mb-6 md:ms-auto">
                  <p>{ts[currentLang].desc}</p>
                </div>
                <div className="md:mb-0 mb-2">
                  <label htmlFor="contactEmailForm" className="sr-only">Label</label>
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="email"
                      required
                      id="contactEmailForm"
                      name="contactEmailForm"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block text-slate-700 w-full outline-none focus:ring-transparent ring-transparent active:ring-transparent bg-[color:var(--tx-bg)] shadow-sm rounded-s-lg text-sm focus:z-10 border-[color:var(--tx-bg)] focus:border-[color:var(--tx-bg)]"
                    />
                    <button
                      type="submit"
                      disabled={!email || pending}
                      className="py-3 border-t border-l border-r border-b border-[color:var(--tx-bg)] px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md bg-[color:var(--color-three)] text-white focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {ts[currentLang].submit}
                    </button>
                  </div>
                </div>
                <img src={'payments-ps.png'} alt="logo" className="object-contain scale-[1] mt-6 w-full" />
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