export class TreeNote {

    update_tree_view_metadata(file_uuid, metadata) {
        let def = $.Deferred();
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();

        // self.tsp.GlobalConstants.tree_note['mandatory_metadata'];
        db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.tree_note_const)
            .doc(self.tsp.GlobalConstants.tree_note.META_DATA)
            .collection(file_uuid)
            .set({
                file_uuid: metadata
            }).then((collection) => {
                self.read_tree_view_metadata().then(function (res) {
                    return def.resolve(res);
                });
            }, self.messageHandler);

        // let built_tree_metadata = this.build_tree_structure_from_metadata(metadata_map);
        // return def.resolve(built_tree_metadata);
        return def.promise();
    }

    rename_file(input_json) {
        try {
            obj = TreeNote();
            file_uuid = input_json['uuid'];
            name = input_json['new_name'];
            path = input_json['new_path'];

            ret_dict = obj.rename_file(file_uuid, name, path);
            return ret_dict;
        }
        catch (error) {
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
    create_file(tsp, name, file_type, path) {
        // baseCollectionName, userId, QuickNoteConst, FileId
        let self = this;
        let file_uuid = tsp.GlobalConstants.generate_UUID();
        let def = $.Deferred();
        var db = tsp.FireBase.firebase.firestore();
        let content = "sample content";


        var file_details = {
            name: name,
            content: content,
            date_created: new Date().toGMTString(),
            last_updated: new Date().toGMTString(),
            starred: "false",
            folder_type: file_type
        };

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
                let metadata = {
                    "date_created": ,
                    "last_updated": "2022-07-03 22:02:08.584484",
                    "path": " Root folder/ZoneForGeeks.com trending concepts",
                    "name": "ZoneForGeeks.com trending concepts",
                    "type": "document",
                    "folder_type": "file",
                    "starred": false
                };
                self.update_tree_view_metadata; (file_uuid, metadata);
                return def.resolve(file_details);
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
