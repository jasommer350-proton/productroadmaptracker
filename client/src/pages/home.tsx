import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import KanbanBoard from "@/components/board/kanban-board";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Settings2, Plus } from "lucide-react";
import ColumnConfig from "@/components/dialogs/column-config";
import FeatureForm from "@/components/feature-form";
import { Feature } from "@shared/schema";

type View = "board" | "form";

interface FormState {
  mode: "create" | "edit";
  feature?: Feature;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [columnField, setColumnField] = useState<keyof Feature>("priority");
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [view, setView] = useState<View>("board");
  const [formState, setFormState] = useState<FormState>({ mode: "create" });

  const { data: features = [], isLoading } = useQuery({
    queryKey: ["/api/features"],
  });

  const filteredFeatures = features.filter((feature: Feature) =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showForm = (mode: "create" | "edit", feature?: Feature) => {
    setFormState({ mode, feature });
    setView("form");
  };

  if (view === "form") {
    return (
      <FeatureForm
        mode={formState.mode}
        feature={formState.feature}
        onClose={() => setView("board")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Product Roadmap</h1>
          <div className="flex gap-2">
            <Button onClick={() => showForm("create")}>
              <Plus className="h-4 w-4 mr-2" />
              New Feature
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowColumnConfig(true)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <KanbanBoard 
            features={filteredFeatures} 
            columnField={columnField} 
            onEditFeature={(feature) => showForm("edit", feature)}
          />
        )}

        <ColumnConfig
          open={showColumnConfig}
          onOpenChange={setShowColumnConfig}
          currentField={columnField}
          onFieldChange={setColumnField}
        />
      </div>
    </div>
  );
}