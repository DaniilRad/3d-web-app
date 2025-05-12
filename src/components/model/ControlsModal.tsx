import { MonitorCheck, MonitorOff } from "lucide-react";
import { Button } from "../ui/button";

export interface ControlsModalProps {
  setShowModal: (value: boolean) => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({
  setShowModal,
}) => {
  return (
    <div className="font-tech-mono fixed inset-0 z-50 flex w-full items-center justify-center backdrop-blur-[15px] backdrop-saturate-[100%]">
      <div className="bg-deepBlack/90 border-lightGray text-lightGray mx-4 flex w-full flex-col items-center justify-between gap-6 rounded-lg border p-6 shadow-lg sm:w-[50%]">
        <h2 className="text-neonBlue text-center text-xl font-extrabold sm:text-4xl">
          How to Use the Controller
        </h2>
        <div className="flex w-fit flex-col justify-end gap-3">
          <ul className="flex w-full list-disc flex-col items-start justify-center gap-2 pl-3 text-left text-[0.8rem] sm:text-[0.9rem]">
            <li>
              To navigate around the model,{" "}
              <span className="text-neonBlue font-extrabold">
                use the mouse
              </span>{" "}
              (hold the left button and move) or{" "}
              <span className="text-neonBlue font-extrabold">touch screen</span>
              (one finger drag).
            </li>
            <li>
              To zoom in or out,{" "}
              <span className="text-neonBlue font-extrabold">
                use the mouse scroll wheel
              </span>{" "}
              or{" "}
              <span className="text-neonBlue font-extrabold">
                pinch with two fingers
              </span>{" "}
              on touch screens.
            </li>
            <li>
              To adjust environment settings, switch models, or use movement
              buttons,{" "}
              <span className="text-neonBlue font-extrabold">
                use the sidebar in the top-left corner
              </span>
              .
            </li>
            <li>
              If you get lost in the scene,{" "}
              <span className="text-neonBlue font-extrabold">
                click the "Reset Camera" button
              </span>{" "}
              to return to the default view.
            </li>
          </ul>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <MonitorOff size={30} className="text-red-500" />
              <span className="text-center text-xs">
                Controller <span className="text-red-500">lacks</span>{" "}
                permissions (Another controller is connected)
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <MonitorCheck size={32} className="text-lightGray" />
              <span className="text-center text-xs">
                Controller <span className="text-neonBlue">has</span>{" "}
                permissions (Only you are connected)
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowModal(false)}>
          Got it!
        </Button>
      </div>
    </div>
  );
};
