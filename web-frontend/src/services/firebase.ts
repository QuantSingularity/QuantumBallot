import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  type StorageReference,
  uploadBytes,
} from "firebase/storage";
import { app } from "./firebase-config";

export const useFirebaseStorage = (path: string) => {
  const [items, setItems] = useState<StorageReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, path);
        const result = await listAll(storageRef);
        setItems(result.items);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      }
    };

    fetchItems();
  }, [path]);

  return { items, loading, error };
};

export const getItemName = (item: StorageReference): string => {
  const fullPath = item.fullPath;
  const pathParts = fullPath.split("/");
  return pathParts[pathParts.length - 1];
};

export const getUsername = (item: StorageReference): string => {
  const fullPath = item.fullPath;
  const pathParts = fullPath.split("/");
  return pathParts.length > 1 ? pathParts[1] : "";
};

export const getSpeech = (item: StorageReference): string => {
  const fullPath = item.fullPath;
  const pathParts = fullPath.split("/");
  return pathParts.length > 1 ? pathParts[1] : "";
};

export const uploadImage = async (
  file: File,
  path: string,
): Promise<string> => {
  try {
    const storage = getStorage(app);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const loadImages = async (
  setImageList: (
    updater: (
      prev: Record<string, string> | undefined,
    ) => Record<string, string>,
  ) => void,
): Promise<void> => {
  try {
    const storage = getStorage(app);
    const imageListRef = ref(storage, "images");
    const res = await listAll(imageListRef);
    res.items.forEach((item) => {
      getDownloadURL(item).then((url) => {
        const parts = item.fullPath.split("/");
        const username = parts.length > 1 ? parts[1] : parts[0];
        setImageList((prev) => ({ ...prev, [username]: url }));
      });
    });
  } catch (error) {
    console.error("Error loading images:", error);
  }
};

export const uploadImageWithName = async (
  file: File | null | undefined,
  filename: string,
  setImageList: (
    updater: (
      prev: Record<string, string> | undefined,
    ) => Record<string, string>,
  ) => void,
): Promise<void> => {
  if (!file || filename === "") return;
  try {
    const storage = getStorage(app);
    const imageRef = ref(storage, `images/${filename}`);
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    setImageList((prev) => ({ ...prev, [filename]: url }));
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
