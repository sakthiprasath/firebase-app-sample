


class TreeNote { 
    update_tree_view_metadata(file_uuid, metadata){
        let def = $.Deferred();
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        
        // self.tsp.GlobalConstants.tree_note['mandatory_metadata'];
            
            let _key = file_uuid.toString(); //JSON.stringify(file_uuid);
            let to_update_metadata = {};
            to_update_metadata[_key] = metadata;
            // alert(JSON.parse(to_update_metadata));

            db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.tree_note_const)
            .doc(self.tsp.GlobalConstants.tree_note.META_DATA)
            .update(to_update_metadata).then((res) => {
                return def.resolve(res);    
            }, self.messageHandler);
        
            // let built_tree_metadata = this.build_tree_structure_from_metadata(metadata_map);
            // return def.resolve(built_tree_metadata);
        
            
        return def.promise();
    }

    get_metadata(input_json){
        let only_metadata = input_json;
        delete only_metadata['content'];

        return only_metadata;
    }

    rename_file(input_json){
        try{
            obj = TreeNote();
            file_uuid = input_json['uuid'];
            name = input_json['new_name'];
            path = input_json['new_path'];
    
            ret_dict = obj.rename_file(file_uuid, name, path);
            return ret_dict;
        }
        catch(error){
            console.log(error);
        }
    }
    
    // get_file_json(self, name, type, parent_path){
    //     now = str(datetime.now());
    //     return {
    //         "date_created": now,
    //         "last_updated": now,
    //         "path": parent_path,
    //         "name": name,
    //         "type": type,
    //         "folder_type": "file",
    //         "starred": False,
    //          "uuid": <test-uuid>
    //     }
    // }
    
    create_file(tsp, name, file_type, path, content){
        // baseCollectionName, userId, QuickNoteConst, FileId
        let self = this;
        let file_uuid = tsp.GlobalConstants.generate_UUID();
        let def = $.Deferred();
        var db = tsp.FireBase.firebase.firestore();
        let _content = "";
        if(!content){
            _content = "sample content";
        }else{
            _content = content;
        }
        


        var file_details = {
            name: name,
            content: _content,
            date_created: new Date().toGMTString(),
            last_updated: new Date().toGMTString(),
            starred: "false",
            folder_type: file_type
        }
        
        self.user_data = this.tsp.FireBase.user_data;
        self.base_collection_name = "users";
        self.common_setting_collection_name = "CommonSettings";

        db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.tree_note_const)
            .doc(file_uuid).set(file_details)
            .then((res) => {
                // console.log('file creation success');
                // console.log(res)
                file_details.uuid = file_uuid;


                //update the metadata
                let date_time_now = new Date().toGMTString();
                let metadata =  {
                    "date_created": date_time_now,
                    "last_updated": date_time_now,
                    "path": path,
                    "name": name,
                    "type": "document",
                    "folder_type": "file",
                    "starred": false
                  };
                self.update_tree_view_metadata(file_uuid, metadata);
                return def.resolve(file_details);
            }, self.messageHandler);
        return def.promise(); 
    }
    update_file(tsp, file_uuid, input_json){
        // baseCollectionName, userId, QuickNoteConst, FileId
        let self = this;
        let def = $.Deferred();
        var db = tsp.FireBase.firebase.firestore();
        
        
        self.user_data = this.tsp.FireBase.user_data;
        self.base_collection_name = "users";
        self.common_setting_collection_name = "CommonSettings";

        db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.tree_note_const)
            .doc(file_uuid).set(input_json)
            .then((res) => {
                // console.log('file creation success');
                // console.log(res)

                self.update_tree_view_metadata(file_uuid, input_json);
                return def.resolve(input_json);
            }, self.messageHandler);
        return def.promise(); 
    }

    create_folder(tsp, name, create_type, path){
        // baseCollectionName, userId, QuickNoteConst, FileId
        let self = this;
        let file_uuid = tsp.GlobalConstants.generate_UUID();
        let def = $.Deferred();
        var db = tsp.FireBase.firebase.firestore();
        let content = "sample content";


        var folder_details = {
            name: name,
            content: content,
            date_created: new Date().toGMTString(),
            last_updated: new Date().toGMTString(),
            starred: "false",
            folder_type: create_type
        }
        
        self.user_data = this.tsp.FireBase.user_data;
        self.base_collection_name = "users";
        self.common_setting_collection_name = "CommonSettings";
        
        //update the metadata
        let date_time_now = new Date().toGMTString();
        let metadata =  {
            "date_created": date_time_now,
            "last_updated": date_time_now,
            "path": path,
            "name": name,
            "type": create_type,
            "folder_type": create_type,
            "starred": false
        };
        self.update_tree_view_metadata(file_uuid, metadata).then(function(){
            return def.resolve(folder_details);
        });
        return def.promise(); 
    }
    
    move_to_trash(tsp, file_uuid, input_json){
        // baseCollectionName, userId, QuickNoteConst, FileId
        let self = this;
        let def = $.Deferred();
        var db = tsp.FireBase.firebase.firestore();
        self.user_data = this.tsp.FireBase.user_data;

        input_json["trash"] = true;
        input_json["starred"] = false;
        input_json['path'] = "Trash" + '/' + input_json['name'];

        let metadata = self.get_metadata(input_json);
            self.update_tree_view_metadata(file_uuid, metadata).then((res)=>{
                // console.log('file moved to trash');
                // console.log(res)
                return def.resolve(res);
            }, self.messageHandler);
        return def.promise(); 
    }
    restore_from_trash(tsp, file_uuid, input_json){
        let self = this;
        let def = $.Deferred();
        var db = tsp.FireBase.firebase.firestore();
        self.user_data = this.tsp.FireBase.user_data;

        input_json["trash"] = false;
        input_json['path'] = "Trash Restored" + '/' + input_json['name'];

        let metadata = self.get_metadata(input_json);
            self.update_tree_view_metadata(file_uuid, metadata).then((res)=>{
                // console.log('file moved to trash');
                // console.log(res)
                return def.resolve(res);
            }, self.messageHandler);
        return def.promise(); 

    }
    init(tsp, to_return_values) {
        tsp.TreeNote = this;
        this.tsp = tsp;

        this.user_data = this.tsp.FireBase.user_data;
        this.base_collection_name = "users";
        this.common_setting_collection_name = "CommonSettings";
        return $.Deferred().resolve(this.tsp, to_return_values);
    }
}




// import { user } from "firebase-functions/v1/auth";

export class TreeNoteFireBase {
    form_folder(fold_arr, n) {
        return fold_arr.slice(0, n).join('/');
    }
    
    get_path_uuid_dict(metadata) {
        const res_dict = {};
        const untitled_dict = {};
        for (const k in metadata) {
            if (metadata[k].untitled) {
                untitled_dict[metadata[k].path] = { uuid: k };
                Object.assign(untitled_dict[metadata[k].path], metadata[k]);
            } else {
                res_dict[metadata[k].path] = { uuid: k };
                Object.assign(res_dict[metadata[k].path], metadata[k]);
            }
        }
        // console.log(res_dict);
        return [res_dict, untitled_dict];
    }

    get_node(tree, fold_arr, n) {

        let f_str = fold_arr[0];
        let temp_node = tree[f_str];
      
        if (temp_node === undefined || temp_node === null) {
          return null;
        }
      
        for (let i = 1; i < n; i++) {
          f_str = f_str + '/' + fold_arr[i];
          console.log(f_str);
      
          if (!(f_str in temp_node)) {
            return null;
          }
      
          temp_node = temp_node[f_str];
        }
      
        return temp_node;
      }
      

    create_key_value(tree, fold_arr, type, n, recur_bool) {
        const formed_folder = this.form_folder(fold_arr, n);
        if (recur_bool === true) {
            const node = this.get_node(tree, fold_arr, n);
            if (node !== null) {
                if (type === 'folder' && Object.keys(node).length === 0) {
                    node = { files: [] };
                }
                // else if (type === 'file') {
                //     formed_file = this.form_folder(fold_arr, n);
                //     node.files.push();
                // }
                return node;
            }
        }
        if (n >= 2) {
            const sub_tree_node = this.create_key_value(tree, fold_arr, 'folder', n - 1, true);
            if (type === 'folder') {
                if (sub_tree_node !== null) {
                    if (!sub_tree_node.hasOwnProperty(formed_folder)) {
                        sub_tree_node[formed_folder] = { files: [] };
                    }
                }
            } else if (type === 'file') {
                if (sub_tree_node !== null) {
                    if (!sub_tree_node.files.includes(formed_folder)) {
                        sub_tree_node.files.push(formed_folder); // this is a file
                    }
                }
            }
            return sub_tree_node;
        } else {
            if(formed_folder === "Some Root Folder"){
                console.log("formed_folder inside if: " + formed_folder);    
            }
            console.log("formed_folder: " + formed_folder);
            console.log("tree: " + JSON.stringify(tree));
            if(tree[formed_folder] && tree[formed_folder]['files'] != []){
                return tree[formed_folder];    
            }
            else{
                tree[formed_folder] = {};
                tree[formed_folder]['files'] = [];
                return tree[formed_folder];
            }
            return tree[formed_folder];
        }
    }

    
    build_tree_structure_from_metadata(_metadata) {

        const tree = {};
        const metadata = _metadata
        console.log("\n\n\n\n\n--------metadata-------", metadata);
        let outer_k = "";
        try{
            for (const k in metadata) {
                outer_k = k;
                const path = metadata[k].path;
                const type = metadata[k].folder_type;
                const folder_arr = path.split('/');
                this.create_key_value(tree, folder_arr, type, folder_arr.length, false);
            }
        }catch(error){
            console.log(error);
        }
        

        const ret_list = this.get_path_uuid_dict(metadata);
        return [tree, ret_list[0], ret_list[1]];
    }
    

    read_tree_view_metadata(){
        let def = $.Deferred();
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        let uuid = "metadata";

        // self.tsp.GlobalConstants.tree_note['mandatory_metadata'];
        db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.tree_note_const)
            .doc(self.tsp.GlobalConstants.tree_note.META_DATA)
            .get().then((doc) => {
                let metadata_map = doc.data();
                console.log(metadata_map);
                if (Object.keys(metadata_map).length === 0){

                    db.collection(self.base_collection_name)
                    .doc(self.user_data.uid)
                    .collection(self.tsp.GlobalConstants.tree_note_const)
                    .doc(self.tsp.GlobalConstants.tree_note.META_DATA)
                    .set(self.tsp.GlobalConstants.tree_note.mandatory_metadata).then((doc) => {
                        self.read_tree_view_metadata().then(function(res){
                            return def.resolve(res);    
                        });
                    }, self.messageHandler);
                }
                else{
                    let built_tree_metadata = this.build_tree_structure_from_metadata(metadata_map);
                    return def.resolve(built_tree_metadata);
                }
            });
            
        return def.promise();

    } 

    create(input_json) {
        // baseCollectionName, userId, QuickNoteConst, FileId
        let self = this;
        let def = $.Deferred();
        
        
        // let temp_map = {
        //     'folder_path': path,
        //     'file_name': project_note_name,
        //     'file_type': 'document',
        //     'create_type': self.create_type,
        // }


        let name = input_json['file_name'];
        let path = input_json['folder_path'];
        let create_type = input_json["create_type"];
        let file_type = input_json["file_type"];

        if (create_type == "folder"){
            self.tsp.TreeNote.create_folder(self.tsp, name, create_type, path).then(function(res){
                def.resolve(res);
            });
        }
        else{
            self.tsp.TreeNote.create_file(self.tsp, name, file_type,  path).then(function(response){
                self.read_tree_view_metadata().then(function(res){
                    return def.resolve(response);    
                });
                
            });
        }
        return def.promise();

    }

    update_file(file_uuid, savable_data, input_json){
         // baseCollectionName, userId, QuickNoteConst, FileId
         let self = this;
         let def = $.Deferred();
        

        input_json['content'] = JSON.parse(savable_data)['content'];
        input_json['last_updated'] = new Date().toGMTString();
        
        // var file_details = {
        //     name: name,
        //     content: _content,
        //     date_created: new Date().toGMTString(),
        //     last_updated: new Date().toGMTString(),
        //     starred: "false",
        //     folder_type: file_type
        // }
        
        self.tsp.TreeNote.update_file(self.tsp, file_uuid, input_json).then(function(response){
                self.read_tree_view_metadata().then(function(res){
                    return def.resolve(response);    
                });
        });
        return def.promise();
    }
    read_single_file(file_key) {
        let def = $.Deferred();
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        // getAllusers(db, 'users');
        try{
            var users = db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.tree_note_const)
            .doc(file_key).get().then((doc) => {
                // console.log(doc.data());
                return def.resolve(doc.data());
            });
        //working code for adding new document [doc id generated dynamically]
        /*db.collection('users').add({ "qwe": "refds" }).then((sanpshot) => {
            snapshot.forEach(doc => {
                console.log(doc.data())
            });
        });*/
        }
        catch(error){
            console.log(error);
        }
        
        return def.promise();
    }

    move_to_trash(file_uuid, input_json){
        let self = this;
        let def = $.Deferred();
       
       self.tsp.TreeNote.move_to_trash(self.tsp, file_uuid, input_json).then(function(response){
               self.read_tree_view_metadata().then(function(res){
                   return def.resolve(response);    
               });
       });
       return def.promise();
        
    }
    restore_from_trash(file_uuid, input_json){
        let self = this;
        let def = $.Deferred();
       
       self.tsp.TreeNote.restore_from_trash(self.tsp, file_uuid, input_json).then(function(response){
               self.read_tree_view_metadata().then(function(res){
                   return def.resolve(response);    
               });
       });
       return def.promise();
        
    }

    rename_tree_note(file_uuid, metadata){
        let self = this;
        let def = $.Deferred();
       
        self.tsp.TreeNote.update_tree_view_metadata(file_uuid, metadata).then(function(folder_details){
            return def.resolve(folder_details);
        });
        return def.promise();
    }
    init(tsp, to_return_values) {
        tsp.TreeNoteFirebase = this;
        
        new TreeNote().init(tsp, to_return_values).then(function(tsp, to_return_Values){

            tsp.TreeNote = tsp.TreeNote;
        });
        this.tsp = tsp;

        this.user_data = this.tsp.FireBase.user_data;
        this.base_collection_name = "users";
        this.common_setting_collection_name = "CommonSettings";
        return $.Deferred().resolve(this.tsp, to_return_values);
    }
}