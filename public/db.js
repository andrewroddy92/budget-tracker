const indexDb = window.indexedDB;

let db;
const req = indexDb.open("budget", 1);

req.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

req.onsuccess = ({ target }) => {
  db = target.result;

  if (navigator.onLine) {
    pullFromDB();
  }
};

req.onerror = function(evt) {
  console.log(evt.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const objectStore = transaction.objectStore("pending");

  objectStore.add(record);
}

function pullFromDB() {
  const transaction = db.transaction(["pending"], "readwrite");
  const objectStore = transaction.objectStore("pending");
  const getAll = objectStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => {        
        return response.json();
      })
      .then(() => {
        const transaction = db.transaction(["pending"], "readwrite");
        const objectStore = transaction.objectStore("pending");
        objectStore.clear();
      });
    }
  };
}

window.addEventListener("online", pullFromDB);