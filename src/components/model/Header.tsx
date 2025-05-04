import img from "@/assets/logo.svg";

export interface HeaderProps {
  models: { id: string; author: string; url: string }[];
  currentModelIndex: number;
  autoSwitch: boolean;
  countdown?: number;
}

export const Header: React.FC<HeaderProps> = ({
  models,
  currentModelIndex,
  autoSwitch,
  countdown,
}) => {
  return (
    <div className="font-tech-mono text-mediumGray text-md absolute z-50 flex h-[5rem] w-full flex-row items-center justify-center gap-2 bg-black/50 backdrop-blur-[30px] backdrop-saturate-[120vh] sm:h-[6rem] sm:text-lg md:h-[6rem] md:text-2xl lg:h-[8rem] lg:text-4xl xl:h-[6rem] xl:text-3xl 2xl:h-[14rem]">
      <div className="flex-1">
        <img
          src={img}
          alt="Logo"
          className="w-[6rem] sm:w-[8rem] lg:w-[10rem] xl:w-[13rem] 2xl:w-[16rem]"
        />
      </div>
      <div className="flex flex-3 flex-col items-center justify-center">
        <p>Author: {models[currentModelIndex]?.author || "Unknown"}</p>
        <p>Model: {models[currentModelIndex]?.id || "Unknown"}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        {/* time to next model */}
        <p className="flex text-center">Auto Change</p>
        <div className="flex w-full flex-row items-center justify-center gap-5">
          {autoSwitch ? (
            <p className="flex w-fit text-center text-green-500">ON</p>
          ) : (
            <p className="flex w-fit text-center text-red-500">OFF</p>
          )}
          <p>{countdown}s</p>
        </div>
      </div>
    </div>
  );
};
