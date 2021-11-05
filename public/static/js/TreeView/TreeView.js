import SourceCodeSection from '../DocumentSection.js';


export default class TreeClass {
    set_constants() {
        return {
            trash_restored: "Trash Restored",
            slash: "/"
        }
    }
    _get_tree_file_html(path, name, uuid) {
        let file_html = `<li class="tree-file">` +
            `<a href="#" class='file-click' content-type="file" file-uuid='${uuid}' filename='${name}' title='${name}'` +
            `file-type='document' file-path='${path}' >` +
            `<div class="tree-note-file-name-div">` +
            `<span> * </span>` +
            `</div>` +
            `<span class="tree-note-file-name">${name}` +
            `</span>` +
            `</a><span class='three-dots' content-type="file">...</span> </li>`;
        return file_html;
    }

    _get_tree_folder_html(path, name, uuid) {
        let html = `<li><div class='folder-section' folder-name='${name}' folder-uuid='${uuid}' folder-path='${path}'>`
        html += `<span class="folder">`
        html += `<span class='open-close-folder'> <i class="ui icon folder blue"></i> </span>${name}`
        html += `</span>`
        html += `<span class='three-dots'>...</span>`
        html += `</div><ul class="nested"></ul></li>`;

        return html;
    }

    _build_trash_section() {
        let self = this;
        let path = '';
        for (let i in self.trash_list) {
            path = self.trash_list[i];
            let file_html = `<li class='tree-file'>` +
                `<a href="#" class='file-click' content-type="file" file-uuid='${self.metadata_map[path].uuid}' filename='${self.metadata_map[path].name}' title='${self.metadata_map[path].name}'` +
                `file-type='document' file-path='${path}' >` +
                `<div class="tree-note-file-name-div">` +
                `<span> * </span>` +
                `</div>` +
                `<span class="tree-note-file-name">${self.metadata_map[path].name}` +
                `</span>` +
                `</a><span class='three-dots' content-type="file">...</span> </li>`;
            let nested_section = $('.tree-trash-class').siblings().get(0);
            $(nested_section).append($(file_html));
        }
        let tree_trash_section = $('.tree-trash-class').parent();
        $('.tree-trash-tab-class').append($(tree_trash_section).clone());
        $(tree_trash_section).remove();
        //append($(nested_section));
    }
    _build_starred_section() {
        let self = this;
        let path = '';
        for (let i in self.starred_list) {
            path = self.starred_list[i];
            let file_html = `<li class='tree-file'>` +
                `<a href="#" class='file-click' content-type="file" file-uuid='${self.metadata_map[path].uuid}' filename='${self.metadata_map[path].name}' title='${self.metadata_map[path].name}'` +
                `file-type='document' file-path='${path}' >` +
                `<div class="tree-note-file-name-div">` +
                `<span> * </span>` +
                `</div>` +
                `<span class="tree-note-file-name">${self.metadata_map[path].name}` +
                `</span>` +
                `</a><span class='three-dots' content-type="file">...</span> </li>`;
            let nested_section = $('.tree-starr-class').siblings().get(0);
            $(nested_section).append($(file_html));
        }
        let tree_starr_section = $('.tree-starr-class').parent();
        $('.tree-starr-tab-class').append($(tree_starr_section).clone());
        $(tree_starr_section).remove();
    }
    _build_files(file_arr) {
        let file_html = '';
        let self = this;
        for (let index in file_arr) {
            if (self.untitled_map[file_arr[index]] != undefined)
                continue;
            if (self.metadata_map[file_arr[index]].trash !== undefined && self.metadata_map[file_arr[index]].trash === "true") {
                self.trash_list.push(file_arr[index]);
                continue;
            } else if (self.metadata_map[file_arr[index]].starred.toString().toLocaleLowerCase() == "true") {
                self.starred_list.push(file_arr[index]);
            }
            let temp_arr = file_arr[index].split('\\');
            let file_name = self.metadata_map[file_arr[index]].name;
            //(temp_arr[temp_arr["length"]-1]).replace('.txt', '');//hard-coded
            let file_uuid = self.metadata_map[file_arr[index]].uuid;

            this.file_list.push({
                title: file_name,
                description: file_arr[index]
            });

            file_html += `<li class='tree-file'>` +
                `<a href="#" class='file-click' content-type="file" file-uuid='${file_uuid}' filename='${file_name}' title='${file_name}'` +
                `file-type='document' file-path='${file_arr[index]}' >` +
                `<div class="tree-note-file-name-div">` +
                `<span> * </span>` +
                `</div>` +
                `<span class="tree-note-file-name">${file_name}` +
                `</span>` +
                `</a><span class='three-dots' content-type="file">...</span> </li>`;
        }
        return file_html;
    }

    _get_folder_section(folder_path) {
        let self = this;
        let class_list_str = "";
        let name = '';
        let folder_uuid = '';
        if (folder_path.indexOf('MY-ROOT') >= 0) {
            name = 'MY-ROOT';
        } else {
            console.log(folder_path);
            try {
                let obj = self.metadata_map[folder_path];
                if (obj !== undefined) {
                    folder_uuid = obj.uuid;
                    name = self.metadata_map[folder_path].name;
                } else
                    throw "folder path " + folder_path + "not found";
            } catch (err) {
                console.log(err);
            }
            this.folder_list.push({
                title: name,
                description: folder_path
            });
        }
        if (folder_path === 'Trash') {
            class_list_str += ' tree-trash-class';
        } else if (folder_path === 'Starred') {
            class_list_str += ' tree-starr-class';
        }
        let html = `<div class='folder-section ${class_list_str}' folder-name='${name}' folder-uuid='${folder_uuid}' folder-path='${folder_path}'>`
        html += `<span class="folder">`
        html += `<span class='open-close-folder'> <i class="ui icon folder blue"></i> </span>${name}`
        html += `</span>`
        html += `<span class='three-dots'>...</span>`
        html += `</div>`;
        return html;
    }

    _get_html(m1, main_folder_name) {
        if (m1 == {} || m1 == undefined) {
            return '';
        }
        let file_html = '';
        let folder_html = [];
        let nested_section = '';
        let folder_section = '';
        let overall_folder_html = '';
        for (let key in m1) {
            if (key == 'files') {
                file_html = this._build_files(m1['files']);
            } else if (key != '__proto__') {
                folder_html.push(this._get_html(m1[key], key));
            }
        }
        for (let index in folder_html) {
            overall_folder_html += folder_html[index];
        }
        nested_section = `<ul class="nested">` + file_html + overall_folder_html + '</ul>';

        folder_section = this._get_folder_section(main_folder_name);

        let res = `<li>` + folder_section + nested_section + `</li>`;
        return res;
    }

    //    _get_tree_structure(){
    //        let temp_map = {};
    //         var defObj=$.Deferred();
    //            var promise =
    //                $.ajax
    //                ({
    //                    url:"http://localhost:5000/api/individual-component-fetch/tree",
    //                    type : "GET",
    //                    contentType:'application/x-www-form-urlencoded',
    //                    success : function(response){
    //
    //                        return defObj.resolve(response);
    //                    }
    //                });
    //            return defObj.promise();
    //    }

    set_active_folder_and_file(folder = undefined, file = undefined) {
        let self = this;
        self.curr_active_folder = folder;
        self.curr_active_file = file;
    }

    _get_tree_structure_metadata() {
        let self = this;
        let temp_map = {};
        var defObj = $.Deferred();
        var promise =
            $.ajax({
                url: self.tsp.PrimenotesCache.data.url_prefix + '/api/tree-note//get-tree-with-metadata',
                type: "GET",
                contentType: 'application/x-www-form-urlencoded',
                success: function(response) {
                    return defObj.resolve(response);
                }
            });
        return defObj.promise();
    }

    _build_tree_and_close_sidenav() {

        /*beginning of navigation  bar */
        let self = this;
        self.kojinFlag = 2;
        //$('#main-section-button').addClass('top-header-highlighter');

        //        $('#closebtn').off("click");
        //.sidenav-button-class ,
        $('#closebtn').click(function() {
            if (self.kojinFlag == 0) { //closing navigation-bar
                var sideNavWidth = '40%';
                var sideNavLeft = 0;
                $('#navigation-bar').css('width', '0px');
                $('#parent-source-code-main-div').css({ 'left': '20px', 'width': '100%' });
                $('.split__bar').css('left', '20px');
                self.kojinFlag = 1;
            } else { //opening navigation-bar
                let screen_width = window.innerWidth;
                let size_map = {};
                switch (screen_width) {
                    case screen_width <= 500:
                        {
                            size_map['nav-bar-width'] = 100;
                            size_map['split-bar-left'] = 100;
                            size_map['source-code-left'] = 100;
                            size_map['source-code-width'] = 0;
                            break;
                        }
                    case screen_width > 500 && screen_width < 650:
                        {
                            size_map['nav-bar-width'] = 50;
                            size_map['split-bar-left'] = 50;
                            size_map['source-code-left'] = 50;
                            size_map['source-code-width'] = 50;
                            break;
                        }
                    case screen_width > 650 && screen_width < 850:
                        {
                            size_map['nav-bar-width'] = 40;
                            size_map['split-bar-left'] = 40;
                            size_map['source-code-left'] = 40;
                            size_map['source-code-width'] = 60;
                            break;
                        }
                    case screen_width > 850:
                        {
                            size_map['nav-bar-width'] = 25;
                            size_map['split-bar-left'] = 25;
                            size_map['source-code-left'] = 25;
                            size_map['source-code-width'] = 75;

                            break;
                        }
                }
                let percent = function(num) { return (num + "%"); }

                $('#navigation-bar').css('width', percent(size_map['nav-bar-width']));
                $('.split__bar').css('left', percent(size_map['split-bar-left']));
                $('#parent-source-code-main-div').css('left', percent(size_map['source-code-left']));
                $('#parent-source-code-main-div').css('width', percent(size_map['source-code-width']));

                //				$('#sidenav-button-id').css('display','none');
                self.kojinFlag = 0;
            }

        });
        /*end   navigation bar */

        //        $('#sidenav-button-id, #main-section-button').off('click');
        $('#sidenav-button-id, #main-section-button').on('click', function() {
            if (self.tsp.GlobalConstants.previous_window == 1) {
                self.tsp.GlobalConstants.previous_window = 2;
                return;
            }
            let curr_ele = $(this);
            if (self.kojinFlag == 1) {
                //            	$('#parent-source-code-main-div').css({'left':'19%','width':'81%'});
                //				$('#parent-source-code-main-div').css('left','19%');
                //                curr_ele.css('display','none');
                //				$('#navigation-bar').css({'width':'19%' , 'left':'0%'});
                //				 $('.split__bar').css('left','19%');
                let screen_width = window.innerWidth;
                let size_map = {};
                if (screen_width <= 500) {
                    size_map['nav-bar-width'] = 100;
                    size_map['split-bar-left'] = 100;
                    size_map['source-code-left'] = 100;
                    size_map['source-code-width'] = 0;
                } else if (screen_width > 500 & screen_width < 650) {
                    size_map['nav-bar-width'] = 50;
                    size_map['split-bar-left'] = 50;
                    size_map['source-code-left'] = 50;
                    size_map['source-code-width'] = 50;
                } else if (screen_width > 650 & screen_width < 850) {
                    size_map['nav-bar-width'] = 40;
                    size_map['split-bar-left'] = 40;
                    size_map['source-code-left'] = 40;
                    size_map['source-code-width'] = 60;
                } else if (screen_width > 850) {
                    size_map['nav-bar-width'] = 20;
                    size_map['split-bar-left'] = 20;
                    size_map['source-code-left'] = 20;
                    size_map['source-code-width'] = 80;
                }

                let percent = function(num) { return (num + "%"); }

                $('#navigation-bar').css('width', percent(size_map['nav-bar-width']));
                $('.split__bar').css('left', percent(size_map['split-bar-left']));
                $('#parent-source-code-main-div').css('left', percent(size_map['source-code-left']));
                $('#parent-source-code-main-div').css('width', percent(size_map['source-code-width']));
                self.kojinFlag = 0;
            } else {
                var sideNavWidth = '40%';
                var sideNavLeft = 0;
                $('#navigation-bar').css('width', '0px');
                $('#parent-source-code-main-div').css({ 'left': '20px', 'width': '100%' });
                //                $('#sidenav-button-id').css('display','block');
                $('.split__bar').css('left', '20px');
                self.kojinFlag = 1;
            }
        });
    }

    clone_folder_into_dialog(folder_path) {
        let self = this;
        $('.modal-content').addClass('model-content-on-tree-clone');
        if (folder_path === self.root_name) {
            let q1 = $(`.folder-section[folder-path='${self.root_name}']`).parent().get(0);
            let q2 = $($(q1).children().get(0)).clone(); // folder-section
            let q3 = $($(q1).children().get(1)).clone(); //nested section
            $('#folder-clone-section').empty().append($(q2)).append($(q3));
            self.cloned_folder_parent_in_tree = q1;
        } else {
            let uuid = self.metadata_map[folder_path]['uuid'];
            let q1 = ($(`.folder-section[folder-uuid=${uuid} ]`)).parent().get(0);
            let q2 = $($(q1).children().get(0)).clone(); // folder-section
            let q3 = $($(q1).children().get(1)).clone(); //nested section
            $('#folder-clone-section').empty().append($(q2)).append($(q3));
            self.cloned_folder_parent_in_tree = q1;

        }
    }

    action_functions() {
        let self = this;
        self.action_function_map = {
            create_new_tree_note_submit: function(project_note_name) {
                if (project_note_name == undefined)
                    project_note_name = $('#new-project-note-name').val();
                let path = "";
                if (self.curr_active_folder.indexOf('MY-ROOT') >= 0) {
                    self.curr_active_folder = self.curr_active_folder.replace('MY-ROOT', '');
                    path = project_note_name;
                } else {
                    path = self.curr_active_folder + '/' + project_note_name;
                }
                let temp_map = {
                    'folder_path': path,
                    'file_name': project_note_name,
                    'file_type': 'document',
                    'create_type': self.create_type,
                }
                self.tsp.DomActions._create_file_in_backend_with_metadata(temp_map).then(function(ret_value) {
                    self.tsp.TreeClass.metadata_map[path] = ret_value;

                    let new_file_html = '';
                    let file_name = '';

                    // let folder_path = self.curr_active_folder + '/' + project_note_name;
                    if (self.create_type == 'folder') {
                        new_file_html = self._get_tree_folder_html(path, project_note_name, ret_value['uuid']);
                    } else if (self.create_type == 'file') {
                        file_name = ('${self.curr_active_folder}').toString();
                        new_file_html = self._get_tree_file_html(path, ret_value.name, ret_value.uuid);
                    }
                    let nested_folder_sibling = $(self.parent_folder).siblings().get(0);
                    if (nested_folder_sibling === undefined) {
                        let q1 = $(self.parent_folder).find('.nested');
                        $(q1).append($(new_file_html)).addClass('active');
                    } else {
                        $(nested_folder_sibling).prepend($(new_file_html)).addClass('active');
                    }

                    /*initialising events for the created file in tree*/
                    let source_code_section_obj = self.tsp.SourceCodeSection;
                    if (self.create_type != 'folder') {
                        source_code_section_obj
                            .buildTab(project_note_name, 'document', path);
                    }
                    self._events();
                    self.tsp.SourceCodeSection.events();
                    self.tsp.NotificationBar.launch_notification(`${self.create_type} Creation Success`);
                });
            },

            copy_paste_UI_update: function(project_note_name, path, uuid) {
                let new_file_html = `<li class="tree-file"><a href="#" class="file-click" filename="${project_note_name}" content-type="file" file-type="document" file-uuid="${uuid}" title="${project_note_name}" file-path="${path}">`;
                new_file_html += `<div class="tree-note-file-name-div"><span> * </span>`;
                new_file_html += `</div>`;
                new_file_html += `<span class="tree-note-file-name">${project_note_name}`;
                new_file_html += `</span>`;
                new_file_html += `</div></a>`;
                new_file_html += `<span class="three-dots" content-type="file">...</span>`
                new_file_html += `</li>`;
                let nested_folder_sibling = $(self.parent_folder).siblings().get(0);
                $(nested_folder_sibling).prepend($(new_file_html));
            },

            cut_paste_UI_update: function(project_note_name, new_path, old_path, uuid) {
                let temp_file_list = $(`.file-click[file-uuid=${uuid}]`);
                let len = temp_file_list.length;
                let temp_clone = '';
                for (let i = 0; i < len; i++) {
                    let temp_ele = $(temp_file_list[i]);
                    if (temp_ele.attr('file-uuid') === uuid) {
                        temp_clone = temp_ele.clone();
                        temp_ele.parent().remove();
                        console.log(temp_clone);

                    }
                }

                let new_file_html = `<li class="tree-file"></li>`;
                temp_clone.attr('file-path', new_path);
                let new_ele = $(new_file_html).append(temp_clone).append(`<span class="three-dots" content-type="file">...</span>`);
                let nested_folder_sibling = $(self.parent_folder).siblings().get(0);
                $(nested_folder_sibling).prepend(new_ele);

                /*Updating Tabs section after cut paste*/
                let target_tab = $(`#tab-container > .tab [file-path='${old_path}']`)[0];
                $(target_tab).attr('file-path', new_path);

            },

            move_to_trash_in_UI: function(path, uuid) {
                let temp_file_list = $('.file-click');
                let len = temp_file_list.length;
                let temp_clone = '';

                for (let i = 0; i < len; i++) {
                    if ($(temp_file_list[i]).attr('file-uuid') === uuid) {
                        temp_clone = $(temp_file_list[i]).clone();
                        $(temp_file_list[i]).parent().remove();
                        break;
                    }
                }
                let new_file_html = `<li class="tree-file"></li>`;
                temp_clone.attr('file-path', path);
                let new_ele = $(new_file_html).append(temp_clone).append($(`<span class="three-dots" content-type="file">...</span>`));
                let nested_folder_sibling = $('.tree-trash-class').siblings().get(0);
                $(nested_folder_sibling).prepend(new_ele);
            },
            move_to_trash_restored_in_UI: function(path, uuid) {
                let target_ele = $('.tree-trash-tab-class').find(`.file-click[file-uuid='${uuid}']`);
                let temp_clone = $(target_ele).clone();
                target_ele.remove();

                let new_file_html = `<li class="tree-file"></li>`;
                temp_clone.attr('file-path', path);
                let new_ele = $(new_file_html).append(temp_clone).append($(`<span class="three-dots" content-type="file">...</span>`));
                let nested_folder_sibling = $(`.folder-section[folder-uuid='folder-uuid-14cb-4ec1-9fdc-0783951a365daxq']`).siblings().get(0)
                $(nested_folder_sibling).prepend(new_ele);
            },
            deleted_file_permanently_in_UI: function(path, uuid) {
                let target_ele = $('.tree-trash-tab-class').find(`.file-click[file-uuid='${uuid}']`);
                target_ele.remove();
            },
            starr_it_in_UI: function(path) {
                let temp_file_list = $(`.file-click[file-path='${path}']`);
                let len = temp_file_list.length;
                let temp_clone = '';

                for (let i = 0; i < len; i++) {
                    if ($(temp_file_list[i]).attr('file-uuid') === self.metadata_map[path].uuid) {
                        temp_clone = $(temp_file_list[i]).clone();
                        break;
                    }
                }
                let new_file_html = `<li class="tree-file"></li>`;
                //                        temp_clone.attr('file-path', path);
                let new_ele = $(new_file_html).append(temp_clone).append($(`<span class="three-dots" content-type="file">...</span>`));
                let nested_folder_sibling = $('.tree-starr-class').siblings().get(0);
                $(nested_folder_sibling).prepend(new_ele);
            },
            remove_from_starr_UI: function(path) {
                let temp_file_list = $(`.tree-starr-tab-class  .file-click[file-path='${path}']`);
                let len = temp_file_list.length;
                let temp_clone = '';

                for (let i = 0; i < len; i++) {
                    if ($(temp_file_list[i]).attr('file-uuid') === self.metadata_map[path].uuid) {
                        temp_clone = $(temp_file_list[i]).clone();
                        $(temp_file_list[i]).parent().remove();
                        break;
                    }
                }
            }
        }
    }
    move_all_to_trash() {
        let self = this;
        let metadata_map = self.metadata_map;
        let metadata_keys = Object.keys(metadata_map);
        let len = metadata_keys.length;
        let def = $.Deferred();
        let to_delete_uuid_list = [];
        to_delete_uuid_list.push(metadata_map[self.curr_active_folder].uuid);
        for (let i = 0; i < len; i++) {
            let curr_obj = metadata_map[metadata_keys[i]];
            if (metadata_keys[i].startsWith(self.curr_active_folder) &&
                (metadata_keys[i] !== self.curr_active_folder) &&
                ((curr_obj.trash + "") == "false" || (curr_obj.trash + "") == "undefined")) {
                to_delete_uuid_list.push(curr_obj.uuid);
            }
        }


        self.tsp.DomActions._bulk_delete_project_note_file(to_delete_uuid_list).then(function() {
            for (let i = 0; i < len; i++) {
                let curr_uuid = metadata_keys[i];
                let curr_obj = metadata_map[curr_uuid];
                if (curr_obj.path.startsWith(self.curr_active_folder) &&
                    (curr_obj.path !== self.curr_active_folder) &&
                    ((curr_obj.trash + "") == "false" || (curr_obj.trash + "") == "undefined")) {
                    if (curr_obj.folder_type == "folder") {
                        delete metadata_map[metadata_keys[i]];
                    } else if (curr_obj.folder_type == 'file') {
                        console.log(metadata_map[curr_uuid].path);
                        metadata_map[curr_uuid].path = self.local_constants.trash_restored + self.local_constants.slash + metadata_map[curr_uuid].name;
                        metadata_map[curr_uuid].trash = "true";
                        metadata_map[curr_uuid].starred = "false";
                        self.action_function_map.move_to_trash_in_UI(curr_obj.path, curr_obj.uuid);
                        self.action_function_map.remove_from_starr_UI(curr_obj.path);
                        self._events();
                        self.tsp.SourceCodeSection.events();

                    }
                }
            }
            self.metadata_map = metadata_map;
            $(self.parent_folder).parent().remove()

            self._events();
            self.tsp.SourceCodeSection.events();
            self.tsp.Dialog.close_dialog_action();
            self.tsp.NotificationBar.launch_notification('Successfully moved all files To Trash ');
            return def.resolve();
        });

        return def.promise();
    }
    _events() {
        let self = this;
        let context_menu = function(event, curr) {
            let path = '';
            if ($('.context').is(":visible")) {
                $('.context').hide();
                return;
            }

            if (event.target.getAttribute('content-type') === "file") {
                self.parent_folder = $(curr).siblings().get(0);
                path = self.curr_active_file = $(self.parent_folder).attr('file-path');
                self.curr_active_folder = undefined;
                $('.only-folder').hide();
                if ($('.item.active').attr('data-tab') === "trash") {
                    $('.only-file').hide();
                    $('.only-trash').show();
                    $('.both-file-and-folder').hide();
                } else {
                    $('.only-file').show();
                    $('.only-trash').hide();
                    $('.both-file-and-folder').show();
                }
            } else if ($(event.target).closest('a')[0] !== undefined && $(event.target).closest('a')[0].getAttribute('content-type') === "file") {
                self.parent_folder = $(event.target).closest('a')[0];
                path = self.curr_active_file = $(self.parent_folder).attr('file-path');
                self.curr_active_folder = undefined;
                $('.only-folder').hide();
                if ($('.item.active').attr('data-tab') === "trash") {
                    $('.only-file').hide();
                    $('.only-trash').show();
                    $('.both-file-and-folder').hide();
                } else {
                    $('.only-file').show();
                    $('.only-trash').hide();
                    $('.both-file-and-folder').show();
                }
            } else { //folder right click
                self.parent_folder = $(curr).parent().get(0);
                if ($(self.parent_folder).attr('folder-path') === undefined)
                    self.parent_folder = $(curr).get(0);

                path = self.curr_active_folder = $(self.parent_folder).attr('folder-path');
                self.curr_active_file = undefined;
                $('.only-file').hide();
                if ($('.item.active').attr('data-tab') === "trash") {
                    $('.only-folder').hide();
                    $('.only-trash').show();
                    $('.both-file-and-folder').hide();
                } else {
                    $('.only-folder').show();
                    $('.only-trash').hide();
                    $('.both-file-and-folder').show();
                }
            }
            $('.tree-note-star-input').prop('checked', self.metadata_map[path].starred == "true");
            event.preventDefault();
            $(".context")
                .show()
                .css({
                    top: event.pageY - 130,
                    left: event.pageX
                });
        };

        self.event_map = {

            three_dots: function() {
                $('.three-dots').off("click");
                $('.three-dots').on("click", function(event) {
                    context_menu(event, this);
                });
            },
            folder_section_context_menu: function() {
                $('.folder-section').off('contextmenu');
                $('.folder-section').contextmenu(function(e) {
                    e.preventDefault();
                    context_menu(e, this);
                });
            },
            tree_file: function() {
                $('.tree-file').off('contextmenu');
                $('.tree-file').contextmenu(function(e) {
                    e.preventDefault();
                    context_menu(e, this);
                });
            },
            folder_section: function() {
                /*events for tree*/
                $('.folder-section').off('click');
                $('.folder-section').on('click', function(e) {
                    let q1 = $(this).children()[0];
                    let q2 = $(q1).find('.ui.icon.folder');
                    if ($(q2).hasClass('open')) {
                        $(q2).removeClass('open');
                    } else {
                        $(q2).addClass('open')
                    }


                    $('.folder-section').css('background', 'none');
                    $(this).css('background', self.highlight_background_color);
                    self.curr_active_folder = $(this).attr('folder-path');
                    self.parent_folder = $(this);
                    self.curr_active_file = undefined;
                    if ($(e.target).hasClass('three-dots')) { return; }
                    let curr = $(this);
                    let sibling_1_nested = $(curr).siblings().get(0);
                    $(sibling_1_nested).toggleClass('active');
                    $(curr).toggleClass('folder-down');
                    //            let sibling_1_nested = $(this).siblings().get(0);
                    //            $(sibling_1_nested).toggleClass('active');
                    //            $(this).toggleClass('folder-down');
                    /*Nested section highlight */
                    $('.nested').css('background', 'none');
                    let sibling = $(this).siblings().get(0);
                    console.log(sibling);
                    $(sibling).css({
                        'background': '#dae6e0',
                        'left': '-10px',
                        'width': 'calc( 100% + 10px)'
                    });
                });
            },

            tree_folder_icon_open_close: function() {
                //                $('.folder-section').off('click');
                //                $('.folder-section').on('click',function(){
                //
                //                });
            },
            search_box_clear: () => {
                $('.tree-note-search-box-clear').click(() => {
                    $('#searchInput  .prompt').val('').focus();
                })
            }

        }
        for (let key in self.event_map) {
            self.event_map[key]();
        }
        /*put this context_menu in to event map fpr global access*/
        self.event_map.context_menu = context_menu;
    }
    __internal_folder_rename(uuid, old_path, new_path, new_name) {
        let self = this;
        let def = $.Deferred();
        let new_file_name = $('#tree-note-file-rename').val();
        //            self.label_map[file_key].name = new_file_name;
        let send_data = {
            'uuid': uuid,
            'old_path': old_path,
            'new_path': new_path,
            'new_name': new_name
        }

        self.tsp.DomActions._rename_tree_note_folder_with_metadata(send_data).then(function(response) {
            /*Update the Tree list if we do the file raname from within the Starred tab*/

            return def.resolve(response);
        });
        return def.promise();
    }
    __internal_file_rename(uuid, old_path, new_path, new_name) {
        let self = this;
        let def = $.Deferred();
        let new_file_name = $('#tree-note-file-rename').val();
        //            self.label_map[file_key].name = new_file_name;
        let send_data = {
            'uuid': uuid,
            'new_path': new_path,
            'new_name': new_name
        }
        self.tsp.DomActions._rename_tree_note_files_with_metadata(send_data).then(function(response) {

            /*Updating Tabs section after cut paste*/
            let target_tab = $(`#tab-container > .tab [file-path='${old_path}']`)[0];
            $(target_tab).attr('file-path', new_path).text(new_name);

            /*Update the Tree list if we do the file raname from within the Starred tab*/

            return def.resolve(response);
        });
        return def.promise();
    }

    _onfocusout_rename_field() {
        let self = this;

        let private_rename = function(new_name) {
            let qq = self.parent_folder;
            let old_path = '',
                old_name = '',
                uuid = '';
            if (self.curr_active_folder !== undefined) {
                old_path = $(qq).attr('folder-path');
                old_name = $(qq).attr('title');
                uuid = $(qq).attr('folder-uuid');
            } else {
                old_path = $(qq).attr('file-path');
                old_name = $(qq).attr('title');
                uuid = $(qq).attr('file-uuid');
            }
            let path_arr = old_path.split('/');
            path_arr[path_arr["length"] - 1] = '';
            let new_path = path_arr.join('/');
            new_path = new_path + new_name;


            if (old_name !== new_name) {
                if (self.curr_active_folder !== undefined) {
                    self.__internal_folder_rename(uuid, old_path, new_path, new_name).then(function(response) {

                        delete self.metadata_map[old_path];
                        self.metadata_map[new_path] = response;

                        $(qq).attr('file-path', new_path);
                        $(qq).show()
                        $('#tree-note-file-rename').remove();
                        self.build_tree('for-rename').then(function() {

                            self.tsp.SourceCodeSection.events();
                            $($('.folder-section')[0]).hide().click();
                        });
                        self.tsp.NotificationBar.launch_notification('Rename Successful');
                    });
                } else {
                    self.__internal_file_rename(uuid, old_path, new_path, new_name).then(function(response) {
                        let html = self._get_tree_file_html(new_path, new_name, uuid);

                        delete self.metadata_map[old_path];
                        self.metadata_map[new_path] = response;

                        let temp = $(qq).parent().parent();
                        temp.prepend($(html));

                        $(qq).parent().remove();

                        let old_files = $(`.file-click[file-path='${old_path}']`)

                        temp = $(old_files[0]).parent().parent();
                        temp.append($(html));
                        $(old_files[0]).parent().remove();
                        self.tsp.SourceCodeSection.events();
                        self._events();
                        self.tsp.NotificationBar.launch_notification('Rename Successful');
                    });
                }

            } else {
                $(qq).show();
                $('#tree-note-file-rename').remove();
            }
        }
        $('#tree-note-file-rename').off('blur');
        $('#tree-note-file-rename').on('blur', function() {
            private_rename($(this).val());
        });
        private_rename($('#rename-tree-file-text-box').val());
    }
    starr_it(file_or_folder_path) {
        /*star or unstar the tree file*/
        let self = this;
        if (self.metadata_map[file_or_folder_path].starred == "true") {
            self.metadata_map[file_or_folder_path].starred = "false";
            self.action_function_map.remove_from_starr_UI(file_or_folder_path);
        } else {
            self.metadata_map[file_or_folder_path].starred = "true";
            self.action_function_map.starr_it_in_UI(file_or_folder_path);
        }
        self.tsp.DomActions._starr_tree_note_file_or_folder(self.metadata_map[file_or_folder_path].uuid);
    }
    restore() {
        /* Restore the deleted tree file to "Trash Restored" folder */
        let self = this;
        let uuid = self.metadata_map[self.curr_active_file].uuid;
        let path = self.curr_active_file;
        self.tsp.DomActions.restore_tree_file(uuid).then(function() {
            self.metadata_map[path]['trash'] = false;
            self.action_function_map.move_to_trash_restored_in_UI(path, uuid);
            self._events();
            self.tsp.SourceCodeSection.events();
            self.tsp.NotificationBar.launch_notification('File Restored');
        });
    }
    delete_file_permanently() {
        /* Restore the deleted tree file to "Trash Restored" folder */
        let self = this;
        let uuid = self.metadata_map[self.curr_active_file].uuid;
        let path = self.curr_active_file;
        self.tsp.DomActions._delete_project_note_permanently(uuid).then(function() {
            delete self.metadata_map[path];
            self.action_function_map.deleted_file_permanently_in_UI(path, uuid);
            self.tsp.NotificationBar.launch_notification('File Deleted From Trash');
        });
    }
    _build_rename_field_and_call_backend() {
        let self = this;

        let q1 = self.parent_folder;
        let q2 = $(`<input id="tree-note-file-rename"  type="text" />`);
        $(q1).before(q2);
        $(q1).hide();
        let q3_text = '';
        if (self.curr_active_folder !== undefined) {
            q3_text = $(q1).attr('folder-name')
        } else {
            q3_text = $(q1).attr('filename')
        }
        $(q2).val(q3_text)
        $(q2).focus();

        $('#tree-note-file-rename').keypress(function(e) {
            if (e.which == 13) {
                $(this).blur();
            }
        });
        self._onfocusout_rename_field();
    }
    set_search_drop_down_list(tab = "tree", file_list = null, folder_list = null) {
        let self = this;
        let metadata_map = self.metadata_map;
        let temp_file_list = [];

        let set_search_map = (file_list = [], folder_list = []) => {
            self.file_folder_list = [{
                    name: "File",
                    results: file_list //this is list
                },
                {
                    name: "Folder",
                    results: folder_list //this is list
                },
            ];
        }
        if (tab == "tree") {
            set_search_map(self.file_list, self.folder_list);
        } else if (tab == "starred") {
            for (let item in metadata_map) {
                if (metadata_map[item].starred !== undefined &&
                    metadata_map[item].starred !== null &&
                    (metadata_map[item].starred).toString().toLowerCase() == "true" &&
                    metadata_map[item].folder_type === 'file') {
                    console.log(metadata_map[item])
                    temp_file_list.push({
                        title: metadata_map[item].name,
                        description: metadata_map[item].path
                    });
                }
            }
            set_search_map(temp_file_list, []);
        } else if (tab == "trash") {
            for (let item in metadata_map) {
                if (metadata_map[item].trash !== undefined &&
                    metadata_map[item].trash !== null &&
                    (metadata_map[item].trash).toString().toLowerCase() == "true" &&
                    metadata_map[item].folder_type === 'file') {
                    console.log(metadata_map[item])
                    temp_file_list.push({
                        title: metadata_map[item].name,
                        description: metadata_map[item].path
                    });
                }
            }
            set_search_map(temp_file_list, []);
        }
    }
    paste_after_copy() {
        let self = this;
        let data_map = {
            'old_file_uuid': self.metadata_map[self.curr_copy_file].uuid,
            'new_path': self.curr_active_folder + '/' + self.metadata_map[self.curr_copy_file].name
        }
        self.tsp.DomActions._copy_paste_file_in_backend_with_metadata(data_map).then(function(response) {
            self.tsp.TreeClass.metadata_map[response.path] = response;
            self.action_function_map.copy_paste_UI_update(response.name, response.path, response.uuid);
            self._events();
            self.tsp.SourceCodeSection.events();
            self.file_list.pop({ title: response.name, description: self.curr_copy_file });
            self.file_list.push({
                title: response.name,
                description: response.path
            });
            self.set_search_drop_down_list("tree");
        });
        self.tsp.NotificationBar.launch_notification(`Copy Paste was Successful`);
    }
    paste_after_cut() {
        let self = this;
        let data_map = {
            'file_uuid': self.metadata_map[self.curr_copy_file].uuid,
            'new_path': self.curr_active_folder + '/' + self.metadata_map[self.curr_copy_file].name
        }
        self.tsp.DomActions._cut_paste_file_in_backend_with_metadata(data_map).then(function(response) {

            self.action_function_map.cut_paste_UI_update(response.name, response.path, self.curr_copy_file, response.uuid);
            self.tsp.TreeClass.metadata_map[response.path] = response;
            if (response.starred == "true") {
                //                                    self.action_function_map.remove_from_starr_UI(self.curr_copy_file, response.uuid);
                self.action_function_map.starr_it_in_UI(response.path);
            }
            delete self.tsp.TreeClass.metadata_map[self.curr_copy_file];
            self._events();
            self.tsp.SourceCodeSection.events();
            self.file_list.pop({ title: response.name, description: self.curr_copy_file });
            self.file_list.push({
                title: response.name,
                description: response.path
            });
            self.set_search_drop_down_list("tree");
        });
        self.tsp.NotificationBar.launch_notification(`Cut Paste was Successful`);
    }
    _context_menu_for_project_tree() {

        /*Even its a events function this function need not be inside the events() function
        since it is not needed the context menu is not refreshed every time the file/folder is created.
        The same reason applies for file-menu in top right  */
        let self = this;
        $(document).click(function(e) {
            if ($(e.target).hasClass('three-dots') != true) {
                $(".context").css('display', 'none');
            }
        });
        $('.inner-item, .menu > .item ').off('click');
        $('.inner-item, .menu > .item, #tree-create-root-folder').on('click', function() {
            let option_name = $(this).attr('data-option');
            switch (option_name) {
                case "New File":
                    {
                        self.create_type = 'file';
                        self.tsp.Dialog.launch_dialog('new-project-file-create-form');
                        break;
                    }
                case "Move To Trash":
                    {
                        let uuid = '';
                        let delete_type = '';
                        let path = '';
                        if (self.curr_active_folder !== undefined) {
                            self.tsp.Dialog.launch_dialog('confirm-delete-all-files-in-folder');
                            uuid = self.metadata_map[self.curr_active_folder].uuid;
                            path = self.curr_active_folder;
                            delete_type = 'folder';
                        } else {
                            uuid = self.metadata_map[self.curr_active_file].uuid;
                            path = self.curr_active_file;
                            delete_type = 'file';
                            self.tsp.DomActions._delete_project_note_file(uuid).then(function() {
                                self.metadata_map[path]['trash'] = true;
                                self.metadata_map[path]['starred'] = false;
                                self.metadata_map[path]['path'] = self.local_constants.trash_restored + self.local_constants.slash + self.metadata_map[path]['name'];
                                self.action_function_map.move_to_trash_in_UI(path, uuid);
                                self.action_function_map.remove_from_starr_UI(path);
                                self._events();
                                self.tsp.SourceCodeSection.events();
                                self.tsp.NotificationBar.launch_notification(delete_type + ' Moved To Trash');
                            });
                        }
                        break;
                    }
                case "New Folder":
                    {
                        self.create_type = 'folder';
                        self.tsp.Dialog.launch_dialog('new-project-file-create-form')
                        break;
                    }
                case "Create Root Folder":
                    {
                        let root_folder = $('.folder-section')[0];
                        self.parent_folder = $(root_folder);
                        self.curr_active_folder = $(root_folder).attr('folder-name'); //note here give folder-name not folder-path like create  "New Folder"
                        self.create_type = 'folder';
                        self.tsp.Dialog.launch_dialog('new-project-file-create-form')
                        break;
                    }

                case "Rename":
                    {
                        if ($(this).hasClass('item')) {
                            self.tsp.Dialog.launch_dialog('rename-tree-file-form');
                            break;
                        }
                        self._build_rename_field_and_call_backend();
                        break;
                    }
                case "Copy":
                    {
                        self.copy_flag = true;
                        self.cut_flag = false;
                        //                        if(self.curr_active_folder !== undefined){
                        //                            self.curr_copy_folder = self.curr_active_folder;
                        //                        }
                        if (self.curr_active_file !== undefined) {
                            self.curr_copy_file = self.curr_active_file;
                        }
                        break;
                    }
                case "Cut":
                    {
                        self.copy_flag = false;
                        self.cut_flag = true;
                        //                        if(self.curr_active_folder !== undefined){
                        //                            self.curr_copy_folder = self.curr_active_folder;
                        //                        }
                        if (self.curr_active_file !== undefined) {
                            self.curr_copy_file = self.curr_active_file;
                        }
                        break;
                    }
                case "Paste":
                    {
                        if (self.copy_flag == true) {
                            self.paste_after_copy();
                        } else {
                            self.paste_after_cut();
                        }
                    }

                case "Details":
                    {
                        if (self.curr_active_folder !== undefined) {
                            self.tsp.DetailsPanel.launch_details_data(self.curr_active_folder);
                            self.tsp.DetailsPanel.open_details();
                        } else {
                            self.tsp.DetailsPanel.launch_details_data(self.curr_active_file);
                            self.tsp.DetailsPanel.open_details();
                        }
                        break;
                    }
                case "Starred":
                    {
                        let path = '';
                        //                        if(self.curr_active_folder !== undefined){
                        //                            path = self.curr_active_folder;
                        //                        }
                        //                        else{
                        path = self.curr_active_file;
                        //                        }
                        self.starr_it(path);
                        self._events();
                        self.tsp.SourceCodeSection.events();
                        self.tsp.NotificationBar.launch_notification('File Starred Successfully');
                        break;
                    }
                case "Move To Folder":
                    {
                        self.clone_folder_into_dialog($($('.folder-section')[1]).attr('folder-path'));
                        self.tsp.Dialog.launch_dialog('file-move');
                        self.event_map.folder_section();
                        break;
                    }
                case "Copy To Folder":
                    {
                        self.clone_folder_into_dialog($($('.folder-section')[1]).attr('folder-path'));
                        self.tsp.Dialog.launch_dialog('file-copy');
                        self.event_map.folder_section();
                        break;
                    }
                case "Restore":
                    {
                        self.restore();
                        break;
                    }
                case "Delete from Trash":
                    {
                        self.delete_file_permanently();
                        break;
                    }
            }
        });
    }
    _build_breadcrumb(path) {
        let self = this;
        let path_arr = path.split('/');
        let len = path_arr.length;
        let html = `<a class='section' folder-path='${self.root_name}'> Home </a>`;
        html += `<div class='divider'> / </div> `;
        for (let index = 0; index < path_arr.length; index++) {

            if (index !== len - 1) {
                html += `<a class='section' folder-path='${path_arr.slice(0,index+1).join("/")}'>${path_arr[index]} </a>`;
                html += `<div class='divider'> / </div> `;
            } else {
                html += `<a class='active section'>${path_arr[index]}</a>`;
            }
        }
        $('.ui.breadcrumb').empty();
        $('.ui.breadcrumb').append($(html));

        $('.breadcrumb > .section').off('click');
        $('.breadcrumb > .section').on('click', function() {
            if ($(this).attr('folder-path') !== undefined) {
                self.tsp.TreeClass.clone_folder_into_dialog($(this).attr('folder-path'));
                self.tsp.Dialog.launch_dialog('folder-clone-section');
                self._events();
                self.tsp.SourceCodeSection.events();

            }
        });
    }
    build_tree(reason_for_building) {
        let self = this;
        let def_obj = $.Deferred();
        if (reason_for_building == 'for-rename') {
            $('#myUL').empty();
            $('.tree-trash-tab-class').empty();
            $('.tree-starr-tab-class').empty();
        }
        self._get_tree_structure_metadata().then(function(res) {
            self.metadata_map = res[1];
            self.untitled_map = res[2];
            let tree_html = self._get_html(res[0], self.root_name);
            document.getElementById('myUL').innerHTML = tree_html;
            self._build_trash_section();
            self._build_starred_section();
            self._context_menu_for_project_tree();
            self._events();
            $('.tabular.menu .item').tab({
                'onVisible': function() {
                    setTimeout(function() {
                        let tab = $('.item.active').attr('data-tab');
                        self.tsp.TreeClass.set_search_drop_down_list(tab);
                    }, 1000)

                }
            });
            return def_obj.resolve();
        });
        return def_obj.promise();
    }
    init(tsp, to_return_values) {
        let def = $.Deferred();
        let self = this;
        tsp.TreeClass = this;
        this.tsp = tsp;
        this.event_map = {};
        this.file_list = [];
        this.folder_list = [];
        this.file_folder_list = [];
        this.action_function_map = {};
        this.curr_copy_file = undefined;
        this.curr_copy_folder = undefined;
        this.local_constants = this.set_constants();

        this.action_functions();
        this.metadata_map = {};
        this.untitled_map = {};
        this.trash_list = [];
        this.starred_list = [];
        this.root_name = `../frontend_files/web-app/all_general_files/separate_project/MY-ROOT`

        this.highlight_background_color = '#cce2d6';
        this.cloned_folder_parent_in_tree = null;

        this.set_search_drop_down_list("tree");
        this.build_tree().then(function() {
            self._build_tree_and_close_sidenav();
            return def.resolve(tsp, to_return_values);
        })
        self._build_breadcrumb('');
        return def.promise();
    }
}