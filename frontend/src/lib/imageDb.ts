const DB_NAME = "pawpass-db";

const PROFILE_IMAGE_STORE = "profile-images";
const FOUND_PET_IMAGE_STORE = "found-pet-images";

const DB_VERSION = 2;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(PROFILE_IMAGE_STORE)) {
        db.createObjectStore(PROFILE_IMAGE_STORE);
      }

      if (!db.objectStoreNames.contains(FOUND_PET_IMAGE_STORE)) {
        db.createObjectStore(FOUND_PET_IMAGE_STORE);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/* ---------------- PROFILE IMAGES ---------------- */

export async function saveProfileImage(
  userId: string,
  image: string,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      PROFILE_IMAGE_STORE,
      "readwrite",
    );

    const store = transaction.objectStore(PROFILE_IMAGE_STORE);

    store.put(image, `profile-photo-${userId}`);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getProfileImage(
  userId: string,
): Promise<string | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      PROFILE_IMAGE_STORE,
      "readonly",
    );

    const store = transaction.objectStore(PROFILE_IMAGE_STORE);

    const request = store.get(`profile-photo-${userId}`);

    request.onsuccess = () => {
      db.close();
      resolve(request.result ?? null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function deleteProfileImage(
  userId: string,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      PROFILE_IMAGE_STORE,
      "readwrite",
    );

    const store = transaction.objectStore(PROFILE_IMAGE_STORE);

    store.delete(`profile-photo-${userId}`);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

/* ---------------- FOUND PET IMAGES ---------------- */

export async function saveFoundPetImage(
  foundReportId: string,
  image: string,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      FOUND_PET_IMAGE_STORE,
      "readwrite",
    );

    const store = transaction.objectStore(FOUND_PET_IMAGE_STORE);

    store.put(image, `found-photo-${foundReportId}`);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getFoundPetImage(
  foundReportId: string,
): Promise<string | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      FOUND_PET_IMAGE_STORE,
      "readonly",
    );

    const store = transaction.objectStore(FOUND_PET_IMAGE_STORE);

    const request = store.get(
      `found-photo-${foundReportId}`,
    );

    request.onsuccess = () => {
      db.close();
      resolve(request.result ?? null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function deleteFoundPetImage(
  foundReportId: string,
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      FOUND_PET_IMAGE_STORE,
      "readwrite",
    );

    const store = transaction.objectStore(FOUND_PET_IMAGE_STORE);

    store.delete(`found-photo-${foundReportId}`);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}