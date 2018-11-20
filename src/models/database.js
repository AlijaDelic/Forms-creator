"use strict";
var DB = /** @class */ (function () {
    function DB(store_name) {
        this.req = window.indexedDB;
        this.store_name = store_name;
        this.openDB();
    }
    //Open conection to IndexedDB
    DB.prototype.openDB = function (store_name) {
        if (store_name === void 0) { store_name = this.store_name; }
        var self = this;
        var req;
        req = this.req.open("Database");
        req.onupgradeneeded = function (e) {
            this.db = e.target.result;
            var store = this.db.createObjectStore("Formular", { keyPath: "key" });
            var store2 = this.db.createObjectStore("Versions", { keyPath: "key" });
        };
        req.onsuccess = function (e) {
            return this.db = e.target.result;
        };
        req.onerror = function (e) {
            console.log(e);
        };
    };
    //Insert Row
    DB.prototype.insertRow = function (obj, store_name) {
        var req;
        req = this.req.open("Database");
        req.onsuccess = function (e) {
            this.db = e.target.result;
            var tx;
            var store;
            tx = this.db.transaction(store_name, "readwrite");
            store = tx.objectStore(store_name);
            store.add(obj);
        };
    };
    //update database with new data
    DB.prototype.update = function (obj, store_name) {
        var req;
        req = this.req.open("Database");
        req.onsuccess = function (e) {
            var db = this.db = e.target.result;
            var tx;
            var store;
            var req;
            tx = db.transaction([store_name], "readwrite");
            store = tx.objectStore(store_name);
            req = store.get(obj["key"]);
            req.onsuccess = function (e) {
                store.put(obj);
            };
            req.onerror = function (e) {
                alert(e.target.result);
            };
        };
    };
    //Search by key
    DB.prototype.getRow = function (key, store_name) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var req;
            req = _this.req.open("Database");
            req.onsuccess = function (e) {
                this.db = e.target.result;
                var tx;
                var store;
                var req;
                tx = this.db.transaction([store_name], "readwrite");
                store = tx.objectStore(store_name);
                req = store.get(key);
                req.onsuccess = function (e) {
                    var obj;
                    obj = e.target.result;
                    resolve(obj);
                };
                req.onerror = function (e) {
                    alert(e.target.result);
                    reject(e);
                };
            };
        });
        return promise;
    };
    //get all data from DB
    DB.prototype.getAll = function (store_name) {
        var _this = this;
        var promise = new Promise(function (resolve) {
            var req;
            req = _this.req.open("Database");
            req.onsuccess = function (e) {
                this.db = e.target.result;
                var tx = this.db.transaction([store_name], "readwrite");
                var store = tx.objectStore(store_name);
                var req = store.getAll();
                req.onsuccess = function (obj) {
                    resolve(obj.currentTarget.result);
                };
                req.onerror = function (err) {
                    console.log(err);
                };
            };
        });
        return promise;
    };
    return DB;
}());
