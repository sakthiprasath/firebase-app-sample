import SourceCodeSection from './DocumentSection.js';


export default class TreeCRUD{
    rename(uuid, path){
        update_in_UI();
        rename_in_backend(uuid, path);
    }

    cut_paste(uuid, path){
        update_in_UI();
        rename_in_backend(uuid, path);
    }

    copy_paste(uuid, path){
        update_in_UI();
        create_new_entry();// different uuid, pasted path
        create_a_new_json_with_copied_content();
    }

    move_to_trash(uuid){
        update_in_UI();
        put_in_trash(uuid);
    }
    starred(uuid){
        update_in_UI();
        include_the_uuid_in_starred_list();
    }
    create_new_file(){
        create_a_new_file_entry_and_json_with_name();
        update_in_UI();
    }
    create_new_folder(){
        create_a_new_folder_entry_with_name();
        update_in_UI();
    }
    init(tsp, to_return_values){
        let def = $.Deferred();
        let self = this;
        tsp.TreeCRUD = this;

        return def.resolve(tsp, to_return_values);
    }
}
