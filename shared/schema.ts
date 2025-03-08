import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const priorities = ["high", "medium", "low"] as const;
export const tShirtSizes = ["xs", "s", "m", "l", "xl"] as const;
export const effortLevels = ["low", "medium", "high"] as const;
export const milestoneTypes = ["planning", "development", "testing", "deployment", "review"] as const;

export const milestoneSchema = z.object({
  description: z.string(),
  date: z.string(),
  completed: z.boolean().default(false),
  percentComplete: z.number().min(0).max(100).default(0),
  type: z.enum(milestoneTypes).default("planning"),
});

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priority: text("priority", { enum: priorities }).notNull(),
  release: text("release").notNull(),
  estimatedCompletion: timestamp("estimated_completion").notNull(),
  tShirtSize: text("t_shirt_size", { enum: tShirtSizes }).notNull(),
  effortLevel: text("effort_level", { enum: effortLevels }).notNull(),
  backlogItems: text("backlog_items").array().notNull(),
  notes: text("notes").notNull(),
  milestones: json("milestones").$type<Array<z.infer<typeof milestoneSchema>>>().notNull(),
});

export const insertFeatureSchema = createInsertSchema(features, {
  estimatedCompletion: z.string().transform(str => new Date(str)),
}).extend({
  milestones: z.array(milestoneSchema),
  backlogItems: z.array(z.string()),
});

export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;
export type Priority = typeof priorities[number];
export type TShirtSize = typeof tShirtSizes[number];
export type EffortLevel = typeof effortLevels[number];
export type MilestoneType = typeof milestoneTypes[number];
export type Milestone = z.infer<typeof milestoneSchema>;