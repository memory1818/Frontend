export const getFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null; // Check for null
  } catch {
    return null;
  }
};

export const saveToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearStorages = (): void => {
  localStorage.clear();
  window.location.href = '/';

};
