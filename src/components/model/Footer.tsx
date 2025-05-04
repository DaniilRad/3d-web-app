import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

const Footer = () => {
  const [qrSize, setQrSize] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      const size = window.innerWidth / 14;
      setQrSize(size);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="text-mediumGray font-tech-mono absolute bottom-0 left-0 z-50 flex flex-col items-center justify-center gap-2 bg-black/50 px-4 py-2 backdrop-blur-[30px] backdrop-saturate-[120%]"
      style={{ width: qrSize + 30, height: qrSize + 50 }}
    >
      <div
        className="relative mt-2 flex h-full items-center justify-center"
        style={{ height: `${qrSize}px` }}
      >
        <svg width="0" height="0">
          <defs>
            <linearGradient
              id="qr-gradient"
              x1="0%"
              y1="60%"
              x2="100%"
              y2="120%"
            >
              <stop offset="0%" stopColor="#EBEDF2" />
              <stop offset="20%" stopColor="#00FFFF" />
              <stop offset="90%" stopColor="#AACCAA" />
            </linearGradient>
          </defs>
        </svg>

        <QRCodeSVG
          value={window.location.href + "control"}
          size={qrSize}
          level="H"
          fgColor="url(#qr-gradient)"
          bgColor="transparent"
        />
      </div>
      <div className="flex items-center justify-center">
        <span className="text-center text-sm md:text-base lg:text-xl xl:text-2xl">
          Controller
        </span>
      </div>
    </div>
  );
};
export default Footer;
