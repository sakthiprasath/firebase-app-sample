



export default class CreateEditIcons{
    cache_elements(){
        let self = this;
        self.file_outline_icon = $('.file.outline.icon');
        self.folder_outline_icon = $('.folder.outline.icon');
    }
    get_image(){
        return
    }
    my_func(){
        alert('my func worked');
    }
    build_html(){
        let icon_arr = ['New Folder', 'New File', 'Rename', 'Move To Trash'];
        let img_map = {
            "New Folder" : 'https://img.icons8.com/nolan/344/add-folder.png',
            "New File" : 'https://img.icons8.com/nolan/344/add-file.png',
            "Rename" : 'https://img.icons8.com/ios/344/4a90e2/rename.png',
            "Move To Trash" : 'https://img.icons8.com/fluent-systems-regular/344/4a90e2/trash--v1.png'
        }


        let html =  "";
        let self = this;
        icon_arr.map((x) => {
            let img_html = `<img class='action-on-file-folder-icon' data-value='${x}' title='${x}' src='${img_map[x]}' alt="${x}" loading="lazy" />`;
            html += img_html;
        });

        console.log(html);
        $('.action-on-file-folder').append($(html));
        return $.Deferred().resolve();
    }
    events(){
        let self = this;
        $('.action-on-file-folder-icon').on('click',function(){
            let action_type = $(this).attr('data-value');
            switch(action_type){
                case 'New Folder': {
                    self.tsp.TreeClass.create_type = 'folder';
                    self.tsp.Dialog.launch_dialog('new-project-file-create-form');
                    break;
                }
                case 'New File': {
                    self.tsp.TreeClass.create_type = 'file';
                    self.tsp.Dialog.launch_dialog('new-project-file-create-form');
                    break;
                }
                case 'Rename': {
                    break;
                }
                case 'Move To Trash': {
                    break;
                }
            }
        });
    }

    init(tsp, to_return_values){
        let self = this;
        this.tsp = tsp;
        tsp.CreateEditIcons = this;
        self.build_html().then(function(){
            self.cache_elements();
            self.events();
        });
        return $.Deferred().resolve(tsp, to_return_values);
    }

}