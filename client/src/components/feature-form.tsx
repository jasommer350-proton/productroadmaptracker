import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Feature, insertFeatureSchema, milestoneTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { priorities, tShirtSizes, effortLevels } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

interface FeatureFormProps {
  feature?: Feature;
  mode?: "create" | "edit";
  onClose?: () => void;
}

export default function FeatureForm({ feature, mode = "edit", onClose }: FeatureFormProps) {
  const defaultValues = mode === "create" ? {
    name: "",
    description: "",
    priority: "medium",
    release: "",
    estimatedCompletion: format(new Date(), "yyyy-MM-dd"),
    tShirtSize: "m",
    effortLevel: "medium",
    backlogItems: [],
    notes: "",
    milestones: []
  } : {
    ...feature,
    estimatedCompletion: feature ? format(new Date(feature.estimatedCompletion), "yyyy-MM-dd") : "",
  };

  const form = useForm({
    resolver: zodResolver(insertFeatureSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof defaultValues) => {
      if (mode === "create") {
        await apiRequest("POST", "/api/features", data);
      } else if (feature) {
        await apiRequest("PATCH", `/api/features/${feature.id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      if (onClose) onClose();
    },
  });

  const [milestones, setMilestones] = useState(defaultValues.milestones || []);

  const addMilestone = () => {
    setMilestones([...milestones, { 
      description: "", 
      date: format(new Date(), "yyyy-MM-dd"), 
      completed: false,
      percentComplete: 0,
      type: "planning"
    }]);
    form.setValue("milestones", [...milestones, { 
      description: "", 
      date: format(new Date(), "yyyy-MM-dd"), 
      completed: false,
      percentComplete: 0,
      type: "planning"
    }]);
  };

  const updateMilestone = (index: number, field: keyof typeof milestones[0], value: any) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    if (field === 'completed') {
      newMilestones[index].percentComplete = value ? 100 : 0;
    }
    setMilestones(newMilestones);
    form.setValue("milestones", newMilestones);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
    form.setValue("milestones", newMilestones);
  };

  const totalCompletion = milestones.length > 0
    ? Math.round(milestones.reduce((sum, m) => sum + m.percentComplete, 0) / milestones.length)
    : 0;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Board
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "New Feature" : "Edit Feature"}
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea className="font-mono" rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="release"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedCompletion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Completion</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tShirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T-Shirt Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tShirtSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="effortLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level of Effort</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {effortLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <FormLabel className="text-lg font-semibold">
                Milestones 
                <span className="ml-2 text-sm text-muted-foreground">
                  (Total Completion: {totalCompletion}%)
                </span>
              </FormLabel>
              <Button type="button" variant="outline" onClick={addMilestone}>
                Add Milestone
              </Button>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                  <Checkbox
                    checked={milestone.completed}
                    onCheckedChange={(checked) => 
                      updateMilestone(index, "completed", checked)
                    }
                  />
                  <Input
                    placeholder="Description"
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, "description", e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={milestone.type}
                    onValueChange={(value) => updateMilestone(index, "type", value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {milestoneTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={milestone.percentComplete}
                    onChange={(e) => updateMilestone(index, "percentComplete", parseInt(e.target.value, 10))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <Input
                    type="date"
                    value={milestone.date}
                    onChange={(e) => updateMilestone(index, "date", e.target.value)}
                    className="w-40"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeMilestone(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mode === "create" ? "Create Feature" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}