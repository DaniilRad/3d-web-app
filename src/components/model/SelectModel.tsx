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
  modelsList,
  setCurrentModelIndex,
}: {
  modelsList: { id: string; author: string; url: string; folder: string }[];
  setCurrentModelIndex: (index: number) => void;
}) => {
  return (
    <div className="text-lightGray font-tech-mono flex w-full items-center justify-center gap-4 px-2 py-3">
      <Select
        onValueChange={(value) => {
          setCurrentModelIndex(
            modelsList.findIndex((model) => model.id === value),
          );
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Models</SelectLabel>
            {modelsList.map((_model, index) => (
              <SelectItem value={_model.id} key={index}>
                {_model.id}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
