import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      maximize: () => void;
      minimize: () => void;
      isChatHidden: () => boolean;
      start: (opt: { showWidget: boolean }) => void;
      onBeforeLoad?: () => void;
      onChatMaximized?: () => void;
      onChatMinimized?: () => void;
      onChatHidden?: () => void;
      onLoad?: () => void;
    };
    Tawk_LoadStart?: Date;
    showChatBtn?: () => void;
    hideChatBtn?: () => void;
  }
}

export default function TawkProvider() {
  useEffect(() => {
    window.showChatBtn = () => {
      const btn = document.getElementById("chatLaunchBtn");
      if (btn) btn.style.display = "flex";
    };

    window.hideChatBtn = () => {
      const btn = document.getElementById("chatLaunchBtn");
      if (btn) btn.style.display = "none";
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        #tawkchat-minified-wrapper,
        #tawkchat-minified-container,
        iframe[id^="tawkchat-minified"],
        .widget-visible,
        #tawkchat-minified-box,
        .tawk-min-box {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
        }
      `}</style>

      <Script
        id="tawk-embed"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();

            const css = '#tawkchat-minified-wrapper, #tawkchat-minified-container, iframe[id^="tawkchat-minified"], .widget-visible { display:none!important; visibility:hidden!important; opacity:0!important; position:absolute!important; left:-9999px!important; top:-9999px!important; }';
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);

            window.Tawk_API.onBeforeLoad = () => {
              setTimeout(() => {
                window.Tawk_API.hideWidget?.();
              }, 50);
            };

            window.Tawk_API.onChatMaximized = () => window.hideChatBtn?.();
            window.Tawk_API.onChatMinimized = () => { 
              window.hideChatBtn?.(); 
              window.showChatBtn?.(); 
            };
            window.Tawk_API.onChatHidden = () => window.showChatBtn?.();

            window.Tawk_API.onLoad = () => {
              window.Tawk_API.minimize?.();
              window.Tawk_API.hideWidget?.();
              window.showChatBtn?.();
            };

            window.addEventListener('beforeunload', () => {
              window.Tawk_API?.minimize?.();
            });

            (function(){
              var lang = (navigator.language || 'en').slice(0,2).toLowerCase();
              var id = (lang === 'ar') 
                ? '66c47b42ea492f34bc081602/1iqdpfssj'
                : '66c47b42ea492f34bc081602/1i5no2uru';
              
              var s = document.createElement('script');
              s.async = true; 
              s.src = 'https://embed.tawk.to/' + id; 
              s.charset = 'UTF-8';
              s.setAttribute('crossorigin', '*'); 
              document.body.appendChild(s);
            })();
          `,
        }}
      />
    </>
  );
}
