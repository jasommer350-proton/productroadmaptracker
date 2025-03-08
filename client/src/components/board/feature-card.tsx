import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { Feature } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  feature: Feature;
  index: number;
  onEdit: () => void;
}

export default function FeatureCard({ feature, index, onEdit }: FeatureCardProps) {
  const priorityColors = {
    high: "bg-destructive/10 border-destructive/20",
    medium: "bg-yellow-500/10 border-yellow-500/20",
    low: "bg-green-500/10 border-green-500/20",
  };

  return (
    <Draggable draggableId={String(feature.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            className={`mb-2 cursor-pointer hover:shadow-md transition-shadow ${
              priorityColors[feature.priority]
            }`}
            onClick={onEdit}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{feature.name}</h3>
              <div className="text-sm text-muted-foreground">
                <p>Due: {format(new Date(feature.estimatedCompletion), "PP")}</p>
                <p className="capitalize">Priority: {feature.priority}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}