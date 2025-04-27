import { QRCodeSVG } from "qrcode.react";

const Footer = () => {
  return (
    <div className="text-mediumGray font-tech-mono absolute bottom-0 left-0 z-50 flex w-full flex-row items-center justify-between gap-14 bg-black/50 p-4 backdrop-blur-[30px] backdrop-saturate-[120%]">
      <div className="relative">
        <svg width="0" height="0">
          <defs>
            <linearGradient
              id="qr-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#12C2E9" />
              <stop offset="50%" stopColor="#C471ED" />
              <stop offset="100%" stopColor="#F64F59" />
            </linearGradient>
          </defs>
        </svg>

        <QRCodeSVG
          value={window.location.href + "control"}
          size={90}
          level="H"
          fgColor="url(#qr-gradient)"
          bgColor="transparent"
        />
      </div>
      <div>
        <span className="text-[1.5rem] text-balance">
          Scan the QR code to quickly upload your 3D models directly from your
          device. No complicated steps—just scan, select your file, and upload
          it instantly. Your model will be processed and available for viewing
          in the 3D web app.
        </span>
      </div>
    </div>
  );
};
export default Footer;
