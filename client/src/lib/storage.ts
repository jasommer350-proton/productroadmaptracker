import localforage from "localforage";
import { Feature } from "@shared/schema";

const STORAGE_KEY = "kanban-features";

export async function saveFeatures(features: Feature[]) {
  await localforage.setItem(STORAGE_KEY, features);
}

export async function loadFeatures(): Promise<Feature[]> {
  const features = await localforage.getItem<Feature[]>(STORAGE_KEY);
  return features || [];
}
