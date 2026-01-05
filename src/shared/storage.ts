const STORAGE_KEY = "german-practice:v1";

export function loadProgress<T>(): T | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function saveProgress<T>(data: T): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
