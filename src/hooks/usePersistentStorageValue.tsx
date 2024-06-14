import { persistentStorage } from "../interfaces/presistentStorage";
import { useEffect, useState } from "react";

/**
 * Use Persistent Storage Value
 *
 * @description This hook will store and retrieve a value using persistent storage.
 * @param {T} key - Key to store and retrieve the value.
 * @param {T} [initialValue] [optional] - Initial value to use if the key is not defined in storage.
 * @returns {[T, (value: T) => void]} - Array containing the current value and a function to update the value.
 */
export default function usePersistentStorageValue<T>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T>(() => {
    const valueFromStorage = persistentStorage.getItem(key);

    if (
      typeof initialValue === "object" &&
      !Array.isArray(initialValue) &&
      initialValue !== null
    ) {
      return {
        ...initialValue,
        ...valueFromStorage,
      };
    }

    return valueFromStorage || initialValue;
  });

  useEffect(() => {
    persistentStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
