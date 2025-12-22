import { useEffect } from "react";
import { router } from "expo-router";

export const IndexRedirect = () => {
  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return null;
};

export default IndexRedirect;
