import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import React from "react";

const inputFileVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputFileProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputFileVariants> {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filename?: File;
  asChild?: boolean;
}

const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
  ({ className, variant, size, asChild = false, onChange, filename, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(inputFileVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <Label htmlFor="model" className="cursor-pointer">
          {!filename ? "Choose a file" : filename.name}
        </Label>
        <Input onChange={onChange} id="model" type="file" className="hidden" />
      </Comp>
    );
  }
);
InputFile.displayName = "InputFile";

export { InputFile, inputFileVariants };