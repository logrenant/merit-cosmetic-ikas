import { IkasImage, Image } from "@ikas/storefront";
import { observer } from "mobx-react-lite";
import { useOnClickOutside } from "usehooks-ts";
import { useRef, useState, useEffect } from "react";

const ImageModal = ({
  images,
  onClose,
  selectedImage,
}: {
  images: IkasImage[];
  selectedImage: IkasImage;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState<IkasImage>(
    selectedImage || images[0]
  );

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });


  const handleImageClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };

  useEffect(() => {
    if (!isZoomed) {
      setZoomPosition({ x: 50, y: 50 });
    }
  }, [isZoomed]);


  useOnClickOutside(ref, onClose);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50">
      <button type="button" className="absolute top-0 right-0 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 stroke-[#fff]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex w-full items-center justify-center h-full p-10">
        <div
          ref={ref}
          className="relative max-w-4xl bg-[color:var(--bg-color)] rounded-sm overflow-hidden h-full w-full flex items-center justify-center"
        >
          {images.length > 1 && (
            <button
              onClick={() => {
                const currentIndex = images.findIndex(
                  (image) => image.id === currentImage.id
                );
                const nextIndex = currentIndex - 1;
                if (nextIndex >= 0) {
                  setCurrentImage(images[nextIndex]);
                } else {
                  setCurrentImage(images[images.length - 1]);
                }
              }}
              type="button"
              className="w-7 h-7 absolute left-3 z-40 top-1/2 transform -translate-y-1/2 rounded-full bg-[color:var(--bg-color)] border-[color:var(--black-one)] border flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}
        
          <div
            className={`cursor-${isZoomed ? 'zoom-out' : 'zoom-in'} relative h-full w-full`}
            onClick={handleImageClick}
            onMouseMove={handleMouseMove}
            style={{
              backgroundImage: `url(${currentImage.src})`,
              backgroundSize: isZoomed ? '200%' : 'contain',
              overflowX: isZoomed ? 'visible' : 'hidden',
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: 'no-repeat',
              // transition: 'background-size 0.3s ease-in-out',
              transition: 'background-size 0.3s, background-position 0.3s',

            }}
          ></div>
          {images.length > 1 && (
            <button
              onClick={() => {
                const currentIndex = images.findIndex(
                  (image) => image.id === currentImage.id
                );
                const nextIndex = currentIndex + 1;
                if (nextIndex < images.length) {
                  setCurrentImage(images[nextIndex]);
                } else {
                  setCurrentImage(images[0]);
                }
              }}
              className="w-7 h-7 absolute right-3 z-40 top-1/2 transform -translate-y-1/2 rounded-full bg-[color:var(--bg-color)] border-[color:var(--black-one)] border flex items-center justify-center"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(ImageModal);
