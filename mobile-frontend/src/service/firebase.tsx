/**
 * Asset Loading Service
 * Manages candidate images and other assets
 */

import axios from "../api/axios";
import { Config } from "../constants/config";

/**
 * Load candidate images from the API and populate the imageList state via callback.
 * Accepts an optional setState callback (for compatibility with BottomNavigation).
 */
export async function loadImages(
  setImageList?: (map: Record<string, any>) => void,
): Promise<Record<string, any>> {
  try {
    const response = await axios.get(Config.ENDPOINTS.CANDIDATES);

    if (response.data?.candidates) {
      const imageMap: Record<string, any> = {};

      response.data.candidates.forEach((candidate: any) => {
        if (candidate.name) {
          const key = candidate.name.toLowerCase().split(" ").join(".");
          if (candidate.imageUrl) {
            imageMap[key] = candidate.imageUrl;
          }
        }
        if (candidate.party) {
          const partyKey = candidate.party.toLowerCase().split(" ").join(".");
          if (candidate.partyLogoUrl) {
            imageMap[partyKey] = candidate.partyLogoUrl;
          }
        }
      });

      setImageList?.(imageMap);
      return imageMap;
    }

    setImageList?.({});
    return {};
  } catch (error) {
    if (Config.APP.SHOW_LOGS) {
      console.error("Error loading candidate images:", error);
    }
    setImageList?.({});
    return {};
  }
}

export async function getCandidateImage(code: number): Promise<string | null> {
  try {
    const images = await loadImages();
    return images[code.toString()]?.uri || null;
  } catch (error) {
    if (Config.APP.SHOW_LOGS) {
      console.error(`Error loading image for candidate ${code}:`, error);
    }
    return null;
  }
}

export async function loadPartyLogos(): Promise<Record<string, string>> {
  return {};
}

export const storage = null;
export const ref = () => null;
export const getDownloadURL = async () => "";
export const uploadBytes = async () => ({});
export const listAll = async () => ({ items: [] });
