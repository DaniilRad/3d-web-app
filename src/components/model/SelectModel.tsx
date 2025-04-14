import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const SelectModel = ({
  models,
  setCurrentModelIndex,
}: {
  models: string[];
  setCurrentModelIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="text-lightGray font-tech-mono absolute top-0 left-0 z-50 flex w-full items-center justify-center gap-4 px-4 py-6 backdrop-blur-[15px] backdrop-saturate-[100%]">
      <Select
        onValueChange={(value) => setCurrentModelIndex(models.indexOf(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Models</SelectLabel>
            {models.map((_model, index) => (
              <SelectItem value={_model} key={index}>
                Model {index + 1}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
