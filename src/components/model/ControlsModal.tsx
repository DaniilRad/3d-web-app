import { Button } from "../ui/button";

export interface ControlsModalProps {
  setShowModal: (value: boolean) => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({
  setShowModal,
}) => {
  return (
    <div className="font-tech-mono fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[15px] backdrop-saturate-[100%]">
      <div className="bg-deepBlack/90 border-lightGray text-lightGray flex w-[60%] flex-col items-center justify-between gap-6 rounded-lg border p-6 shadow-lg">
        <h2 className="text-xl font-bold">How to Use the Controller</h2>
        <ul className="flex w-full list-disc flex-col gap-2 text-left text-sm">
          <li>
            To navigate around the model, use the mouse (hold the left button
            and move) or touch screen (one finger drag).
          </li>
          <li>
            To zoom in or out, use the mouse scroll wheel or pinch with two
            fingers on touch screens.
          </li>
          <li>
            To adjust environment settings, switch models, or use movement
            buttons, use the sidebar in the top-left corner.
          </li>
          <li>
            If you get lost in the scene, click the "Reset Camera" button to
            return to the default view.
          </li>
        </ul>
        <Button variant="outline" onClick={() => setShowModal(false)}>
          Got it!
        </Button>
      </div>
    </div>
  );
};
