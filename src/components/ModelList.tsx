import React from "react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { Delete02Icon } from "hugeicons-react";
import { handleDeleteModel } from "@/utils/api";

interface Model {
  name: string;
  url: string;
}

interface ModelListProps {
  models: Model[];
  onModelsListChange: () => void;
  onModelChange: (url: string) => void;
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  onModelsListChange,
  onModelChange,
}) => {
  const handleDelete = async (file: string) => {
    try {
      const message = await handleDeleteModel(file);
      console.log("Deleted model:", message);
      onModelsListChange();
    } catch (error) {
      console.error("Error deleting files:", error);
      alert("Error deleting files");
    }
  };

  return (
    <div className="my-16">
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
      >
        <CarouselPrevious />
        <CarouselContent className="-mt-1 md:h-[185px] lg:h-[315px] w-[160px]">
          {models.map((model, index) => (
            <CarouselItem
              key={index}
              className="pt-1 md:basis-1/3 lg:basis-1/5"
            >
              <Card className="bg-primary text-primary-foreground shadow hover:bg-primary/90">
                <CardContent className="p-2">
                  <button
                    className="flex items-center justify-between w-full"
                    onClick={() => onModelChange(model.url)}
                  >
                    <span>{model.name}</span>
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      onClick={() => handleDelete(model.url)}
                    >
                      <Delete02Icon />
                    </Button>
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ModelList;
