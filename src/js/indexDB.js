const INDEXDB_NAME="DNDMA-DB";
const INDEXDB_VERSION=2;
const STORE_NAME="NotasStore";

// Patrón Singleton: Una instancia para todo el proyecto
export class DatabaseManager {

  constructor(databaseName, databaseVersion) {
    this.databaseName = databaseName;
    this.databaseVersion = databaseVersion;
    this.db = null;
  }

  // Static: Para garantizar que el método getInstance pertenezca a la clase DatabaseManager en sí y no a las instancias individuales de la clase.
  // Si no fuera static, se podrían crear diferentes instancias de DatabaseManager, cada una con su propia "this.instance"
  static getInstance() {
    if (!this.instance) {
      this.instance = new DatabaseManager(INDEXDB_NAME, INDEXDB_VERSION);
    }
    return this.instance;
  }

  open() {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(this.databaseName, this.databaseVersion);
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onupgradeneeded = (event) => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };

    });
  }

  addData(data) {
    if (!this.db) {
      throw new Error("La base de datos no está abierta.");
    }

    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([STORE_NAME], "readwrite");
      let objectStore = transaction.objectStore(STORE_NAME);
      let request = objectStore.put(data);
      request.onsuccess = (event) => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  getData(id) {
    if (!this.db) {
      throw new Error("La base de datos no está abierta.");
    }

    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([STORE_NAME], "readonly");
      let objectStore = transaction.objectStore(STORE_NAME);
      let request = objectStore.get(id);

      request.onsuccess = (event) => {
        let data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          reject(new Error("El objeto con el id: " + id + ", no se encontró en la base de datos."));
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // Actividad: Hacer el método delete, update y getAll()
  delete(id) {
    if (!this.db) {
      throw new Error("La base de datos no está abierta.");
    }

    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([STORE_NAME], "readwrite");
      let objectStore = transaction.objectStore(STORE_NAME);
      let request = objectStore.delete(id);

      request.onsuccess = (event) => {
        
      };

      request.on = (event) => {
        reject(event.target.error);
      };
    });
  }

  getAll() {
    if (!this.db) {
      throw new Error("La base de datos no está abierta.");
    }

    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([STORE_NAME], "readonly");
      let objectStore = transaction.objectStore(STORE_NAME);
      let request = objectStore.getAll();

      request.onsuccess = (event) => {
        let data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          reject(new Error("No se ha encontrado los objetos de la base de datos"));
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });

  }
}
