import { useEffect } from 'react';

declare module 'react' {
    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}

const ContentProtector = () => {
    useEffect(() => {
        // Metin seçimini engelleme
        const disableSelection = (e: Event) => {
            e.preventDefault();
            return false;
        };

        // Klavye kısayollarını engelleme
        const disableShortcuts = (e: KeyboardEvent) => {
            if (
                e.ctrlKey ||
                e.metaKey ||
                e.key === 'PrintScreen' ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        // Mobil long-press engelleme
        let touchTimer: NodeJS.Timeout;
        const handleTouchStart = () => {
            touchTimer = setTimeout(() => {
                window.getSelection()?.removeAllRanges();
            }, 500);
        };

        const handleTouchEnd = () => {
            clearTimeout(touchTimer);
        };

        // Event listener'ları ekle
        document.addEventListener('selectstart', disableSelection);
        document.addEventListener('contextmenu', disableSelection);
        document.addEventListener('keydown', disableShortcuts);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);

        // Temizlik
        return () => {
            document.removeEventListener('selectstart', disableSelection);
            document.removeEventListener('contextmenu', disableSelection);
            document.removeEventListener('keydown', disableShortcuts);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, []);

    return (
        <style jsx global>{`
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-tap-highlight-color: transparent;
      }
      
      img, video {
        pointer-events: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `}</style>
    );
};

export default ContentProtector;