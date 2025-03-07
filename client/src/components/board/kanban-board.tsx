import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Feature } from "@shared/schema";
import Column from "./column";
import { apiRequest } from "@/lib/queryClient";

interface KanbanBoardProps {
  features: Feature[];
  columnField: keyof Feature;
}

export default function KanbanBoard({ features, columnField }: KanbanBoardProps) {
  const updateFeature = useMutation({
    mutationFn: async ({ id, update }: { id: number; update: Partial<Feature> }) => {
      await apiRequest("PATCH", `/api/features/${id}`, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
    },
  });

  const columns = Array.from(new Set(features.map((f) => String(f[columnField]))));

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const feature = features.find((f) => f.id === Number(result.draggableId));
    if (!feature) return;

    const update = {
      [columnField]: result.destination.droppableId,
    };

    updateFeature.mutate({ id: feature.id, update });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((columnValue) => (
          <Droppable key={columnValue} droppableId={columnValue}>
            {(provided) => (
              <Column
                title={columnValue}
                features={features.filter(
                  (f) => String(f[columnField]) === columnValue
                )}
                provided={provided}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
