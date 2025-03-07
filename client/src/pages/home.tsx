import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import KanbanBoard from "@/components/board/kanban-board";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Settings2, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ColumnConfig from "@/components/dialogs/column-config";
import FeatureDialog from "@/components/dialogs/feature-dialog";
import { Feature } from "@shared/schema";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [columnField, setColumnField] = useState<keyof Feature>("priority");
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [showNewFeature, setShowNewFeature] = useState(false);

  const { data: features = [], isLoading } = useQuery({
    queryKey: ["/api/features"],
  });

  const filteredFeatures = features.filter((feature: Feature) =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Product Roadmap</h1>
          <div className="flex gap-2">
            <Dialog open={showNewFeature} onOpenChange={setShowNewFeature}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Feature
                </Button>
              </DialogTrigger>
              <FeatureDialog mode="create" />
            </Dialog>
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
          <KanbanBoard features={filteredFeatures} columnField={columnField} />
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