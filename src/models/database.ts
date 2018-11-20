class DB {
    public db: IDBDatabase;
    private req: IDBFactory;
    private store_name: string;

    constructor(store_name:string) {
        this.req = window.indexedDB;
        this.store_name = store_name;
        this.openDB();
    }

    //Open conection to IndexedDB
    openDB(store_name: string = this.store_name) {
        let self = this;
        var req: IDBOpenDBRequest;
        req = this.req.open("Database");
        req.onupgradeneeded = function(e:any){
            this.db = e.target.result;
            var store: IDBObjectStore = this.db.createObjectStore("Formular", { keyPath: "key" });
            var store2 = this.db.createObjectStore("Versions", { keyPath: "key" });
        };
        req.onsuccess = function (e: any) {
            return this.db = e.target.result;
        }
        req.onerror = (e: Event) => {
            console.log(e);
        }
    }

    //Insert Row
    insertRow(obj: any, store_name:string) {
        var req: IDBOpenDBRequest;
        req = this.req.open("Database");
        req.onsuccess = function (e: any) {
            this.db = e.target.result;
            var tx: IDBTransaction;
            var store: IDBObjectStore;
            tx = this.db.transaction(store_name, "readwrite");
            store = tx.objectStore(store_name);
            store.add(obj);
        };
    }

    //update database with new data
    update(obj: any, store_name:string) {
        var req: IDBOpenDBRequest;
        req = this.req.open("Database");
        req.onsuccess = function (e: any) {
            var db = this.db = e.target.result;
            var tx: IDBTransaction;
            var store: IDBObjectStore;
            var req: IDBRequest;
            tx = db.transaction([store_name], "readwrite");
            store = tx.objectStore(store_name);
            req = store.get(obj["key"]);
            req.onsuccess = function (e: any) {
                store.put(obj);
            };
            req.onerror = function (e: any) {
                alert(e.target.result);
            }
        }
    }

    //Search by key
    getRow(key: any, store_name:string): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            var req: IDBOpenDBRequest;
            req = this.req.open("Database");
            req.onsuccess = function (e: any) {
                this.db = e.target.result;
                var tx: IDBTransaction;
                var store: IDBObjectStore;
                var req: IDBRequest;
                tx = this.db.transaction([store_name], "readwrite");
                store = tx.objectStore(store_name);
                req = store.get(key);
                req.onsuccess = function (e: any) {
                    var obj: Data;
                    obj = e.target.result;
                    resolve(obj)
                }
                req.onerror = function (e: any) {
                    alert(e.target.result);
                    reject(e);
                }
            }
        });
        return promise;
    }

    //get all data from DB
    getAll(store_name: string): Promise<any> {
        const promise = new Promise((resolve) => {
            var req: IDBOpenDBRequest;
            req = this.req.open("Database");
            req.onsuccess = function (e: any) {
                this.db = e.target.result;
                var tx: IDBTransaction = this.db.transaction([store_name], "readwrite");
                var store: IDBObjectStore = tx.objectStore(store_name);
                var req: IDBRequest = store.getAll();
                req.onsuccess = (obj: any) => {
                    resolve(obj.currentTarget.result);
                }
                req.onerror = (err) => {
                    console.log(err);
                }
            }
        });
        return promise;
    }
}