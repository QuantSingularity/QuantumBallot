import { useEffect, useState } from "react";
import { Image } from "react-native";

const useImage = ({ src }: { src: string | null | undefined }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoaded(false);
      return;
    }

    setLoaded(false);
    setError(false);

    Image.prefetch(src)
      .then(() => setLoaded(true))
      .catch(() => setError(true));
  }, [src]);

  return { loaded, error };
};

export default useImage;
