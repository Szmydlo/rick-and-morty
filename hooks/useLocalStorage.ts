import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>();
  useEffect(() => {
    if (typeof window === "undefined") {
      setStoredValue(initialValue);
    }
    try {
      const item = window.localStorage.getItem(key);
      return item && item !== "undefined"
        ? setStoredValue(JSON.parse(item))
        : setStoredValue(initialValue);
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    }
  }, []);

  useEffect(() => {
    if (storedValue) localStorage.setItem(key, JSON.stringify(storedValue));
  }, [storedValue]);

  return [storedValue, setStoredValue] as const;
};
