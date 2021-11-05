


export default class IndexedDb{

    get_db_obj(){
        let self = this;
        let db;
        let dbReq = indexedDB.open('prime_notes_db', 1);

        let notes;
        dbReq.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('quick_notes_store')) {
                notes = db.createObjectStore('quick_notes_store', { keyPath: 'id',  autoIncrement: true });
            } else {
                notes = dbReq.transaction.objectStore('quick_notes_store');
            }
            if (!notes.indexNames.contains('timestamp')) {
                notes.createIndex('timestamp', 'timestamp');
            }
        }

        dbReq.onsuccess = function(event) {
            db = event.target.result;
            self.db = db;
//            self.update_quick_note({
//                'name' : 'updated123-quick-note-name',
//                'content' : '<p> html content goes here .. </p>',
//                'last_updated' : Date.now().toString()
//            });
            self.getAllKeys();
        }

        dbReq.onerror = function(event) {
            alert('error opening database ' + event.target.errorCode);
        }
    }
//     var newUser = [{fname:$('#fname').val(),lname:$('#lname').val()}];
//
//               phodaDB.indexedDB.addUser(newUser);
//var request = store.put(userObject);

    add_quick_note(note_json){
      let self = this;

      let db = self.db;
      let tx = db.transaction(['quick_notes_store'], 'readwrite');
      let store = tx.objectStore('quick_notes_store');

//      let req = store.getAllKeys();

      let req = store.add({id : (Date.now()).toString() ,
                            value: note_json}, undefined);
      req.onsuccess = function(event){
        console.log(event.target.result);
      }
//      let note = {note_json};
//      store.add(note);
      tx.oncomplete = function() { console.log('indexed db stored note!') }
      tx.onerror = function(event) {
        alert('error storing note ' + event.target.errorCode);
      }
    }

    update_quick_note(note_json){
        let self = this;

        let db = self.db;
        let tx = db.transaction(['quick_notes_store'], 'readwrite');
        let store = tx.objectStore('quick_notes_store');

//      let req = store.getAllKeys();

        let req = store.put({id : 1607869940920,
                            value: note_json}, undefined);
        req.onsuccess = function(event){
            console.log(event.target.result);
        }
//      let note = {note_json};
//      store.add(note);
        tx.oncomplete = function() { console.log('indexed db stored note!') }
        tx.onerror = function(event) {
                alert('error storing note ' + event.target.errorCode);
            }
        }
        getAllKeys(){
            let self = this;

            let db = self.db;
            let tx = db.transaction(['quick_notes_store'], 'readwrite');
            let store = tx.objectStore('quick_notes_store');

            let req = store.getAllKeys();

            req.onsuccess = function(event){
                console.log(event.target.result);
                let key_arr = event.target.result;
                key_arr.map( i => {
                    self.get_quick_note_json(key_arr[i]);
                });

            }
            tx.oncomplete = function() { console.log('indexed db stored note!') }
            tx.onerror = function(event) {
                    alert('error storing note ' + event.target.errorCode);
                }
        }
        get_quick_note_json(key){
            let self = this;
            let db = self.db;
            let tx = db.transaction(['quick_notes_store'], 'readwrite');
            let store = tx.objectStore('quick_notes_store');

            let req = store.get(key);

            req.onsuccess = function(event){
                console.log(event.target.result);
            }
            tx.oncomplete = function() { console.log('indexed db stored note!') }
            tx.onerror = function(event) {
                    alert('error storing note ' + event.target.errorCode);
                }
        }


    init(tsp, to_return_values){
        tsp.IndexedDb = this;

        this.get_db_obj();

        return $.Deferred().resolve(tsp, to_return_values);
    }
}