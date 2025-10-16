import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { AnalyticsHead, AnalyticsBody } from "@ikas/storefront";

import { IkasStorefrontConfig } from "@ikas/storefront-config";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  render() {
    const favicon = IkasStorefrontConfig.getFavicon();
    return (
      <Html lang="en">
        <Head>
          {favicon?.id && (
            <link
              rel="shortcut icon"
              href={`${process.env.NEXT_PUBLIC_CDN_URL}images/${favicon.id}/image_180.webp`}
              type="image/webp"
            />
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5TVZJ7KF');
              `,
            }}
          />

          <AnalyticsHead />

          {/* Early Arabic redirect script - runs before React */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                try {
                  var arabicCountries = ['AE','BH','DZ','DJ','EG','ER','IQ','JO','KW','LB','LY','MR','MA','OM','PS','QA','SA','SO','SD','SY','SS','TN','YE','EH','TD','KM'];
                  var cached = sessionStorage.getItem('user-location-country-code');
                  var userSelected = sessionStorage.getItem('user-selected-country-code');
                  var isFirstLoad = !cached && !userSelected;
                  
                  if (isFirstLoad) {
                    fetch('https://ipapi.co/json/')
                      .then(function(res) { return res.json(); })
                      .then(function(data) {
                        sessionStorage.setItem('user-location-country-code', data.country_code || 'unknown');
                        if (window.location.pathname === '/' && window.location.href.indexOf('/ar') === -1 && arabicCountries.indexOf(data.country_code) !== -1) {
                          window.location.href = '/ar';
                        }
                      })
                      .catch(function(err) {
                        // Geolocation failed
                      });
                  }
                } catch(e) {}
              })();
              `,
            }}
          />

          <link rel="preconnect" href={process.env.NEXT_PUBLIC_CDN_URL}></link>
          <link
            rel="dns-prefetch"
            href={process.env.NEXT_PUBLIC_CDN_URL}
          ></link>
        </Head>
        <body className="min-w-[380px] bg-[color:var(--bg-color)]">
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5TVZJ7KF"
                height="100" width="120""></iframe>
              `,
            }}
          />
          <AnalyticsBody />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
