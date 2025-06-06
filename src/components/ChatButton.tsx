import { useEffect, useState } from "react";
import Image from "next/image";

export default function ChatButton() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkTawkReady = () => {
      if (typeof window.Tawk_API !== "undefined") {
        setIsReady(true);
        window.showChatBtn?.();
      } else {
        setTimeout(checkTawkReady, 100);
      }
    };

    checkTawkReady();
  }, []);

  const handleChatOpen = () => {
    if (typeof window.Tawk_API !== "undefined") {
      window.Tawk_API.maximize();
      window.hideChatBtn?.();
    }
  };

  if (!isReady) return null;

  return (
    <button
      id="chatLaunchBtn"
      aria-label="Open Chat"
      title="Chat"
      onClick={handleChatOpen}
      className="fixed bottom-5 right-6 w-[60px] h-[60px] rounded-full
                 bg-[#ac0821] text-white shadow-lg flex items-center justify-center
                 z-[999999999] border-none cursor-pointer"
      style={{
        boxShadow: "0 4px 4px 0 hsla(0,0%,51%,.08)",
      }}
    >
      <Image
        src="/tawk.svg"
        alt="Chat icon"
        width={32}
        height={32}
        className="invert"
        priority
      />
    </button>
  );
}
