import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFeatureSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/features", async (_req, res) => {
    const features = await storage.getFeatures();
    res.json(features);
  });

  app.get("/api/features/:id", async (req, res) => {
    const feature = await storage.getFeature(Number(req.params.id));
    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }
    res.json(feature);
  });

  app.post("/api/features", async (req, res) => {
    const result = insertFeatureSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid feature data" });
    }
    const feature = await storage.createFeature(result.data);
    res.status(201).json(feature);
  });

  app.patch("/api/features/:id", async (req, res) => {
    const result = insertFeatureSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid feature data" });
    }
    try {
      const feature = await storage.updateFeature(Number(req.params.id), result.data);
      res.json(feature);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/features/:id", async (req, res) => {
    await storage.deleteFeature(Number(req.params.id));
    res.status(204).end();
  });

  return createServer(app);
}
