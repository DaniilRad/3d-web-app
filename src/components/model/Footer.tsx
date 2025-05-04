import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

const Footer = () => {
  const isPortrait = window.innerHeight > window.innerWidth;
  const [qrSize, setQrSize] = useState(0);

  useEffect(() => {
    let qrCodeSize = isPortrait
      ? window.innerWidth < 640
        ? 100
        : window.innerWidth < 1024
          ? 120
          : 120
      : window.innerWidth >= 1920
        ? 90
        : window.innerWidth > 1080
          ? 90
          : 200;
    setQrSize(qrCodeSize);
  }, []);

  return (
    <div className="text-mediumGray font-tech-mono absolute bottom-0 left-0 z-50 flex h-fit w-fit flex-col items-center justify-center gap-5 bg-black/50 px-6 py-6 backdrop-blur-[30px] backdrop-saturate-[120%]">
      <div
        className="relative flex h-full flex-1 items-center justify-center"
        style={{ height: `${qrSize}px` }}
      >
        <svg width="0" height="0">
          <defs>
            <linearGradient
              id="qr-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#EBEDF2" />
              <stop offset="50%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#AACCAA" />
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
      <div className="flex flex-5 items-center justify-center">
        <span className="text-center lg:text-xl 2xl:text-xl">Controller</span>
      </div>
    </div>
  );
};
export default Footer;
