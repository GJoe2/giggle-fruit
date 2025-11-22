"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    // El valor inicial se determina una sola vez
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // useEffect para actualizar el localStorage cuando el estado cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.log(error);
      }
    }
  }, [key, storedValue]);

  // Versión mejorada de setValue que imita la API de useState
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      // Permitir que el valor sea una función para tener el mismo comportamiento que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar estado
      setStoredValue(valueToStore);
    } catch (error) {
      // Un error más avanzado podría manejar este caso
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
