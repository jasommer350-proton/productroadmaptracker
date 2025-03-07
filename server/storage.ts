import { features, type Feature, type InsertFeature } from "@shared/schema";

export interface IStorage {
  getFeatures(): Promise<Feature[]>;
  getFeature(id: number): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeature(id: number, feature: Partial<InsertFeature>): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private features: Map<number, Feature>;
  private currentId: number;

  constructor() {
    this.features = new Map();
    this.currentId = 1;
  }

  async getFeatures(): Promise<Feature[]> {
    return Array.from(this.features.values());
  }

  async getFeature(id: number): Promise<Feature | undefined> {
    return this.features.get(id);
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const id = this.currentId++;
    const feature: Feature = { ...insertFeature, id };
    this.features.set(id, feature);
    return feature;
  }

  async updateFeature(id: number, update: Partial<InsertFeature>): Promise<Feature> {
    const feature = await this.getFeature(id);
    if (!feature) {
      throw new Error(`Feature not found: ${id}`);
    }
    const updatedFeature = { ...feature, ...update };
    this.features.set(id, updatedFeature);
    return updatedFeature;
  }

  async deleteFeature(id: number): Promise<void> {
    this.features.delete(id);
  }
}

export const storage = new MemStorage();
