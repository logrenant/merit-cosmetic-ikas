import { observer } from "mobx-react-lite";
import { useDirection } from "../../utils/useDirection";
import { Image, Link, useTranslation, IkasNavigationLink, IkasImage } from "@ikas/storefront";
import { FooterProps, FooterLink } from "../__generated__/types";
import useEmailSubscription from "src/utils/useEmailSubscription";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";

const ts = {
  en: {
    contactUs: "CONTACT US",
    links: "Usefull Links",
    title: "NEWSLETTER SIGN UP",
    submit: "Submit",
    desc: "Subscribe to our newsletter and get the latest news and offers from us.",
    success: "You have successfully subscribed to our newsletter",
    error: "You are already subscribed to our newsletter",
  },
  ar: {
    contactUs: "اتصل بنا",
    links: "مفيدة",
    title: "الاشتراك في النشرة الإخبارية",
    submit: "الاشتراك",
    desc: "اشترك في النشرة الإخبارية لدينا واحصل على آخر الأخبار والعروض منا.",
    error: "أنت مشترك بالفعل في النشرة الإخبارية لدينا",
    success: "لقد اشتركت بنجاح في النشرة الإخبارية لدينا",
  },
};

const Footer = ({ linkdata }: FooterProps) => {
  const { direction } = useDirection();
  const { t } = useTranslation();

  const [usefull, setUsefull] = useState<IkasNavigationLink[]>([]);
  const [social, setSocial] = useState<any[]>([]);


  useEffect(() => {

    linkdata.forEach((childBase) => {

      if (childBase.title === "Kurumsal") {

        setUsefull([])

        childBase.links.forEach((child) => {

          const a = {
            itemId: child.itemId,
            label: child.label,
            href: child.href,
            subLinks: child.subLinks,

          };
          setUsefull((prev) => {
            return [...prev, a];
          });



        });



      } else if (childBase.title === "social") {
        setSocial([])

        childBase.links.forEach((child) => {
          const soc = {
            itemId: child.itemId,
            label: child.label,
            href: child.href,
            subLinks: child.subLinks,

          };

          setSocial((prev) => {
            return [...prev, soc];
          });



        });


      }

    })

  }, [linkdata]);





  const {
    pending,
    responseStatus,
    onSubmit,
    email,
    setEmail,
  } = useEmailSubscription();




  const onSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  }


  useEffect(() => {
    if (responseStatus === "success") {
      // toast.success(t("successActionMessage"));
      toast.success(t("submit").toLowerCase() === "submit" ? ts.en.success : ts.ar.success);
    } else if (responseStatus === "error") {
      // toast.error(t("errorActionMessage"));
      toast.success(t("submit").toLowerCase() === "submit" ? ts.en.error : ts.ar.error);

    }
  }, [responseStatus]);



  return (
    <footer
      dir={direction}
      className='bg-[color:var(--color-one)]  flex flex-col items-center text-center lg:text-left mt-6'>



      <div className="container p-6 bg-[color:var(--color-one)]">


        <section className="grid place-items-center md:grid-cols-2 lg:grid-cols-3 text-white">

          <section className="mb-6 md:mb-6 text-white self-start">
            <h5 className="mb-2.5 font-bold uppercase">

              {t("submit").toLowerCase() === "submit" ? ts.en.contactUs : ts.ar.contactUs}

            </h5>

            <div className="flex gap-2 mt-4">

              <div className="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>


              <span className="text-slate-200`">Istanbul / Turkey</span>


            </div>

            <div className="flex gap-2 mt-4">

              <div className="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>

              </div>


              <span className="text-slate-200`">info@meritcosmetics.com</span>


            </div>

            <div className="flex gap-2 mt-4">

              <div className="w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>


              </div>


              <span className="text-slate-200`">+ 90 555 555 555 555</span>


            </div>

            <div className="flex w-full gap-8 mt-2 md:mt-6">



              {social?.map((fl, idx) => {



                const socialLink = fl.href as string



                if (fl.href.includes("x.com") || fl.href.includes("twitter.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <svg
                        width="24"
                        height="24"
                        className="min-w-[20px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.53902 22.5C16.5954 22.5 21.551 14.9956 21.551 8.49877C21.551 8.28765 21.551 8.07653 21.5414 7.8654C22.5018 7.17446 23.3373 6.30118 24 5.31275C23.1164 5.7062 22.1657 5.96531 21.1669 6.09006C22.1849 5.48548 22.9628 4.51624 23.3373 3.36466C22.3866 3.93086 21.3301 4.33391 20.2065 4.55463C19.3037 3.59498 18.0264 3 16.6146 3C13.8968 3 11.6879 5.20718 11.6879 7.92298C11.6879 8.30684 11.7359 8.6811 11.8127 9.04577C7.72149 8.84424 4.09124 6.87697 1.66146 3.90207C1.2389 4.6314 0.9988 5.47589 0.9988 6.37795C0.9988 8.08612 1.87275 9.59277 3.18848 10.4756C2.38175 10.4468 1.62305 10.2261 0.960384 9.86146C0.960384 9.88066 0.960384 9.89985 0.960384 9.92864C0.960384 12.3086 2.66026 14.3046 4.90756 14.7557C4.4946 14.8708 4.06242 14.9284 3.61104 14.9284C3.29412 14.9284 2.98679 14.8996 2.68908 14.842C3.31333 16.7997 5.13806 18.22 7.28932 18.2584C5.59904 19.5827 3.47659 20.3696 1.17167 20.3696C0.777912 20.3696 0.384154 20.3504 0 20.3024C2.17047 21.6843 4.76351 22.5 7.53902 22.5Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  )
                } else if (fl.href.includes("instagram.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">

                      <svg
                        width="24"
                        height="24"
                        className="min-w-[20px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.0011 0C8.74209 0 8.33309 0.0142504 7.05307 0.072501C5.77556 0.131002 4.90355 0.333254 4.14054 0.630007C3.35128 0.93651 2.68178 1.34651 2.01477 2.01377C1.34726 2.68078 0.937259 3.35028 0.629756 4.13929C0.332253 4.90255 0.129751 5.77481 0.0722506 7.05182C0.015 8.33184 0 8.74109 0 12.0001C0 15.2592 0.0145004 15.6669 0.072501 16.9469C0.131252 18.2244 0.333504 19.0964 0.630007 19.8595C0.93676 20.6487 1.34676 21.3182 2.01402 21.9852C2.68078 22.6527 3.35028 23.0637 4.13904 23.3702C4.90255 23.667 5.77481 23.8692 7.05207 23.9277C8.33209 23.986 8.74084 24.0002 11.9996 24.0002C15.2589 24.0002 15.6667 23.986 16.9467 23.9277C18.2242 23.8692 19.0972 23.667 19.8607 23.3702C20.6497 23.0637 21.3182 22.6527 21.985 21.9852C22.6525 21.3182 23.0625 20.6487 23.37 19.8597C23.665 19.0964 23.8675 18.2242 23.9275 16.9472C23.985 15.6672 24 15.2592 24 12.0001C24 8.74109 23.985 8.33209 23.9275 7.05207C23.8675 5.77456 23.665 4.90255 23.37 4.13954C23.0625 3.35028 22.6525 2.68078 21.985 2.01377C21.3175 1.34626 20.65 0.93626 19.86 0.630007C19.0949 0.333254 18.2224 0.131002 16.9449 0.072501C15.6649 0.0142504 15.2574 0 11.9974 0H12.0011ZM10.9246 2.16252C11.2441 2.16202 11.6006 2.16252 12.0011 2.16252C15.2052 2.16252 15.5849 2.17402 16.8502 2.23152C18.0202 2.28502 18.6552 2.48053 19.0782 2.64478C19.6382 2.86228 20.0375 3.12228 20.4572 3.54229C20.8772 3.96229 21.1372 4.3623 21.3552 4.9223C21.5195 5.34481 21.7152 5.97981 21.7685 7.14982C21.826 8.41484 21.8385 8.79484 21.8385 11.9974C21.8385 15.1999 21.826 15.5799 21.7685 16.8449C21.715 18.0149 21.5195 18.6499 21.3552 19.0724C21.1377 19.6325 20.8772 20.0312 20.4572 20.451C20.0372 20.871 19.6385 21.131 19.0782 21.3485C18.6557 21.5135 18.0202 21.7085 16.8502 21.762C15.5852 21.8195 15.2052 21.832 12.0011 21.832C8.79684 21.832 8.41709 21.8195 7.15207 21.762C5.98206 21.708 5.34706 21.5125 4.9238 21.3482C4.3638 21.1307 3.96379 20.8707 3.54379 20.4507C3.12378 20.0307 2.86378 19.6317 2.64578 19.0714C2.48153 18.6489 2.28577 18.0139 2.23252 16.8439C2.17502 15.5789 2.16352 15.1989 2.16352 11.9944C2.16352 8.78984 2.17502 8.41184 2.23252 7.14682C2.28602 5.97681 2.48153 5.3418 2.64578 4.9188C2.86328 4.3588 3.12378 3.95879 3.54379 3.53879C3.96379 3.11878 4.3638 2.85878 4.9238 2.64078C5.34681 2.47578 5.98206 2.28077 7.15207 2.22702C8.25909 2.17702 8.68809 2.16202 10.9246 2.15952V2.16252ZM18.4067 4.15504C17.6117 4.15504 16.9667 4.7993 16.9667 5.59456C16.9667 6.38957 17.6117 7.03457 18.4067 7.03457C19.2017 7.03457 19.8467 6.38957 19.8467 5.59456C19.8467 4.79955 19.2017 4.15454 18.4067 4.15454V4.15504ZM12.0011 5.83756C8.59784 5.83756 5.83856 8.59684 5.83856 12.0001C5.83856 15.4034 8.59784 18.1614 12.0011 18.1614C15.4044 18.1614 18.1627 15.4034 18.1627 12.0001C18.1627 8.59684 15.4042 5.83756 12.0009 5.83756H12.0011ZM12.0011 8.00008C14.2101 8.00008 16.0012 9.79085 16.0012 12.0001C16.0012 14.2091 14.2101 16.0002 12.0011 16.0002C9.79185 16.0002 8.00108 14.2091 8.00108 12.0001C8.00108 9.79085 9.79185 8.00008 12.0011 8.00008Z"
                          fill="white"
                        />
                      </svg>

                    </a>
                  )

                } else if (fl.href.includes("facebook.com")) {
                  return (
                    <a key={fl.itemId + "-link-" + idx} href={socialLink} target="_blank" rel="noreferrer">
                      <svg
                        width="24"
                        className="min-w-[20px]"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24.0004 12.0731C24.0004 5.40489 18.6275 -0.000732422 11.9997 -0.000732422C5.37192 -0.000732422 -0.000976562 5.40489 -0.000976562 12.0731C-0.000976562 18.0995 4.38751 23.0944 10.1246 24.0002V15.5632H7.07756V12.0731H10.1246V9.41307C10.1246 6.38707 11.9162 4.7156 14.6575 4.7156C15.9704 4.7156 17.3438 4.95142 17.3438 4.95142V7.92271H15.8305C14.3397 7.92271 13.8748 8.8534 13.8748 9.80822V12.0731H17.2032L16.6711 15.5632H13.8748V24.0002C19.6119 23.0944 24.0004 18.0995 24.0004 12.0731Z"
                          fill="white"
                        />
                      </svg>

                    </a>)

                } else return null
              })}


            </div>

          </section>


          {/* <!-- Second links section --> */}
          <section className="mb-6 md:mb-6 self-start">
            <h5 className="mb-2.5 font-bold uppercase">
              {t("submit").toLowerCase() === "submit" ? ts.en.links : ts.ar.links}

            </h5>

            <nav className="mt-2.5 flex flex-col gap-1.5">

              {usefull?.map((fl, idx) => {
                return (
                  <a key={fl.itemId + "-link-" + idx} href={fl.href}>
                    {fl.label} {" "}
                  </a>
                )
              })}


            </nav>
          </section>

          {/* <!-- Third form section -->  */}
          <section className="md:mb-6 self-start">
            <h5 className="mb-2.5 font-bold uppercase">
              {t("submit").toLowerCase() === "submit" ? ts.en.title : ts.ar.title}
            </h5>

            <form onSubmit={onSubmitEmail}>
              <div
                className="">
                <div className="md:mb-6 md:ms-auto">
                  <p>
                    {t("submit").toLowerCase() === "submit" ? ts.en.desc : ts.ar.desc}
                  </p>
                </div>

                <div className="md:mb-0 mb-2">
                  <label htmlFor="contactEmailForm" className="sr-only">Label</label>
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="email"
                      required
                      id="contactEmailForm"
                      name="contactEmailForm"
                      placeholder={t("email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}

                      className="py-3 px-4 block text-slate-700 w-full outline-none focus:ring-transparent ring-transparent active:ring-transparent
      xfocus:border-[color:var(--color-six)] bg-[color:var(--tx-bg)]  shadow-sm rounded-s-lg text-sm focus:z-10  border-[color:var(--tx-bg)] focus:border-[color:var(--tx-bg)]
      " />


                    <button type="submit"
                      disabled={!email || pending}
                      className="py-3 border-t border-r border-b border-[color:var(--tx-bg)] px-4 inline-flex 
                      justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md  
                      
      bg-[color:var(--color-three)] text-white  focus:outline-none xfocus:bg-red-700 x-disabled:opacity-50 disabled:pointer-events-none">
                      {t("submit").toLowerCase() === "submit" ? ts.en.submit : ts.ar.submit}


                    </button>
                  </div>
                </div>


                <img src={'payments-ps.png'} alt="logo" className="object-contain scale-[1] mt-6 w-full" />


              </div>
            </form>
          </section>



        </section>

      </div>


      <div className="w-full bg-black/5 p-4 text-center">

        <span className="rtl:mr-2 ltr:ml-2 text-xs text-slate-200 leading-none pb-[1.5px]">
          &copy; 2024 Merit Cosmetics
        </span>
      </div>
    </footer>
  );
};

export default observer(Footer);
