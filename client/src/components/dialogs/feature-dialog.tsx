import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Feature, insertFeatureSchema } from "@shared/schema";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { priorities, tShirtSizes, effortLevels } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useState } from "react";

interface FeatureDialogProps {
  feature?: Feature;
  mode?: "create" | "edit";
  onClose?: () => void;
}

export default function FeatureDialog({ feature, mode = "edit", onClose }: FeatureDialogProps) {
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
    setMilestones([...milestones, { description: "", date: format(new Date(), "yyyy-MM-dd") }]);
    form.setValue("milestones", [...milestones, { description: "", date: format(new Date(), "yyyy-MM-dd") }]);
  };

  const updateMilestone = (index: number, field: keyof typeof milestones[0], value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
    form.setValue("milestones", newMilestones);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
    form.setValue("milestones", newMilestones);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "New Feature" : "Edit Feature"}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="flex flex-col h-full"
        >
          <div className="space-y-4 overflow-y-auto pr-4 flex-1">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Milestones</FormLabel>
                <Button type="button" variant="outline" onClick={addMilestone}>
                  Add Milestone
                </Button>
              </div>
              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Description"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, "description", e.target.value)}
                    />
                    <Input
                      type="date"
                      value={milestone.date}
                      onChange={(e) => updateMilestone(index, "date", e.target.value)}
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
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <Button type="submit" disabled={mutation.isPending}>
              {mode === "create" ? "Create Feature" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}