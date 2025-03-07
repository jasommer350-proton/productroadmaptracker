import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Feature } from "@shared/schema";

interface ColumnConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentField: keyof Feature;
  onFieldChange: (field: keyof Feature) => void;
}

const columnOptions: { value: keyof Feature; label: string }[] = [
  { value: "priority", label: "Priority" },
  { value: "release", label: "Release" },
  { value: "tShirtSize", label: "T-Shirt Size" },
  { value: "effortLevel", label: "Level of Effort" },
];

export default function ColumnConfig({
  open,
  onOpenChange,
  currentField,
  onFieldChange,
}: ColumnConfigProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Board Columns</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Select value={currentField} onValueChange={onFieldChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a field for columns" />
            </SelectTrigger>
            <SelectContent>
              {columnOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
