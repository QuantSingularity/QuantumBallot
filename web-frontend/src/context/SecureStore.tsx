import * as CryptoJS from "crypto-js";

const SECRET_KEY_TOKEN: string = import.meta.env.VITE_SECRET_KEY_TOKEN ?? "quantumballot-default-secret-key";

const setItemAsync = async (key: string, value: string): Promise<void> => {
  const encryptedData = CryptoJS.AES.encrypt(value, SECRET_KEY_TOKEN).toString();
  sessionStorage.setItem(key, encryptedData);
};

const deleteItemAsync = async (key: string): Promise<void> => {
  sessionStorage.removeItem(key);
};

const getItemAsync = async (key: string): Promise<string | null> => {
  const value = sessionStorage.getItem(key);
  if (value === null) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY_TOKEN);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData || null;
  } catch {
    return null;
  }
};

export { deleteItemAsync, getItemAsync, setItemAsync };
