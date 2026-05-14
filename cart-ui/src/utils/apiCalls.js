import { api } from "./api";

export const getAllHeroSections = async () => {
  try {
    const response = await api.get("/all-hero-sections");
    return response;
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    throw error;
  }
};