import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import { Feature } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

  const totalCompletion = feature.milestones.length > 0
    ? Math.round(feature.milestones.reduce((sum, m) => sum + m.percentComplete, 0) / feature.milestones.length)
    : 0;

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
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between items-center">
                  <span>Due: {format(new Date(feature.estimatedCompletion), "PP")}</span>
                  <span className="font-medium">{feature.release}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="capitalize">Priority: {feature.priority}</span>
                  <span>{totalCompletion}% Complete</span>
                </div>
                <Progress value={totalCompletion} className="h-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}