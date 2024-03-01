import constants from './constants/constants.js';

export default class Dialog {
    cache_elems() {
        let self = this;
        self.cache = {
            modal: $("#modal-id"),
            modal_header: $('.modal-header .header'),
            dialog_button: $('.dialog-button')
        }
        self.button_map = {
            'new-project-file-create-form': 'Create',
            'create-new-quick-file-form': 'Create',
            'rename-tree-file-form': 'Proceed Renaming',
            'file-move': 'Move Here',
            'file-copy': 'Copy Here',
            'confirm-delete-all-files-in-folder': 'Confirm'
        }
    }
    launch_dialog(form_id, header = "") {
        let self = this;
        self.current_dialog = form_id;
        self.cache.modal.css("display", "block");
        $('.inner-item-form').hide();
        $('#' + form_id).show();
        self.cache.modal_header.text(header);
        self.cache.dialog_button.show();
        switch (self.current_dialog) {
            /*if the dialog is for renaming file, then fill the dialog text box with current file name */
            case 'rename-tree-file-form':
                {
                    let tree_class_obj = self.tsp.TreeClass;
                    $('#rename-tree-file-text-box').val(tree_class_obj.metadata_map[tree_class_obj.curr_active_file].name);
                    break;
                }
            case 'file-move':
            case 'file-copy':
            case 'video-notes-help-dialog':
                {
                    $('.' + form_id).html(`
                    ` +
                        self.tsp.GlobalConstants.video_notes_help_dialog_content);
                    self.cache.dialog_button.hide();
                    break;
                }
            case 'folder-clone-section':
                {
                    break;
                }

        }



        $('.dialog-button').text(self.button_map[self.current_dialog]);
    }
    close_dialog_action() {
        let self = this;
        self.cache.modal.css("display", "none");

        $('.modal-content').removeClass('model-content-on-tree-clone');
        if (self.tsp.TreeClass.cloned_folder_parent_in_tree !== null) {
            let q1 = $('#folder-clone-section').children().get(0);
            let q2 = $('#folder-clone-section').children().get(1);
            $(self.tsp.TreeClass.cloned_folder_parent_in_tree).empty().append(q1);
            $(self.tsp.TreeClass.cloned_folder_parent_in_tree).append(q2);
            self.tsp.TreeClass._events();
            self.tsp.SourceCodeSection.events();
            self.tsp.TreeClass.cloned_folder_parent_in_tree = null;
        }
    }
    events() {
        let self = this;
        let event_map = {
            boot_tree_note_dialog: function() {
                self.cache.dialog_button.hide();
                $('#model-footer-button').click(function() {
                    switch (self.current_dialog) {
                        case 'new-project-file-create-form':
                            {
                                self.tsp.TreeClass.action_function_map.create_new_tree_note_submit();
                                break;
                            }
                        case 'create-new-quick-file-form':
                            {
                                self.tsp.loadComponentsContainer.action_function_map.create_new_file_submit_btn();
                                break;
                            }
                        case 'rename-tree-file-form':
                            {
                                let curr_active_element = $(`.file - click[file - path = '${ self.tsp.TreeClass.curr_active_file}']
                    `);
                                self.tsp.TreeClass.parent_folder = curr_active_element;
                                self.tsp.TreeClass._onfocusout_rename_field();
                                break;
                            }
                        case 'file-move':
                            {
                                let tree_class_obj = self.tsp.TreeClass;
                                tree_class_obj.curr_copy_file = $('#tab-container .tab-active .file-get-section').attr('file-path');

                                self.tsp.TreeClass.paste_after_cut();
                                break;
                            }
                        case 'file-copy':
                            {
                                let tree_class_obj = self.tsp.TreeClass;
                                tree_class_obj.curr_copy_file = $('#tab-container .tab-active .file-get-section').attr('file-path');

                                self.tsp.TreeClass.paste_after_copy();

                                break;
                            }
                        case 'confirm-delete-all-files-in-folder':
                            {
                                self.tsp.TreeClass.move_all_to_trash();
                                break;
                            }
                    }
                });
            },
            close_dialog: function() {
                $('.close-modal').click(function() {
                    self.close_dialog_action();
                });
            }
        }

        /* initializing eventlistners by calling above event_map in a loop*/
        for (let key in event_map) {
            //          console.log(event_map[key]);
            event_map[key]();
        }
    }
    init(tsp, to_return_Values) {
        tsp.Dialog = this;
        this.tsp = tsp;
        this.event_map = {};
        this.current_dialog = undefined;
        this.cache_elems();
        this.events();
        return $.Deferred().resolve(tsp, to_return_Values);
    }

}