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
    <div className="font-tech-mono text-mediumGray absolute z-50 flex w-full flex-row items-center justify-center gap-2 bg-black/50 px-6 py-6 backdrop-blur-[30px] backdrop-saturate-[120%] lg:h-52 lg:text-3xl xl:h-30 2xl:h-32 2xl:text-2xl">
      <div className="flex flex-1 items-center justify-start">
        <img src={img} alt="Logo" className="h-full w-xl lg:w-52 2xl:w-52" />
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
