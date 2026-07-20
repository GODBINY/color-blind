const DATABASE = "iris-pending-image";
const STORE = "files";
const KEY = "latest";

const openDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DATABASE, 1);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE);
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

export async function savePendingImage(file: File) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE, "readwrite");
    transaction.objectStore(STORE).put(file, KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function takePendingImage(): Promise<File | null> {
  const database = await openDatabase();
  const file = await new Promise<File | null>((resolve, reject) => {
    const transaction = database.transaction(STORE, "readwrite");
    const store = transaction.objectStore(STORE);
    const request = store.get(KEY);
    request.onsuccess = () => {
      const value = request.result;
      if (value) store.delete(KEY);
      resolve(value instanceof File ? value : null);
    };
    request.onerror = () => reject(request.error);
  });
  database.close();
  return file;
}
