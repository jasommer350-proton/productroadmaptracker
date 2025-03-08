import { type DroppableProvided } from "react-beautiful-dnd";
import { Feature } from "@shared/schema";
import FeatureCard from "./feature-card";

interface ColumnProps {
  title: string;
  features: Feature[];
  onEditFeature: (feature: Feature) => void;
  provided: DroppableProvided;
}

export default function Column({ title, features, onEditFeature, provided }: ColumnProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="bg-muted/50 rounded-lg p-4"
    >
      <h2 className="font-semibold mb-4 capitalize">{title}</h2>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <FeatureCard 
            key={feature.id} 
            feature={feature} 
            index={index}
            onEdit={() => onEditFeature(feature)}
          />
        ))}
        {provided.placeholder}
      </div>
    </div>
  );
}