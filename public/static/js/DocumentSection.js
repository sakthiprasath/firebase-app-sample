




export default class SourceCodeSection{
    code_mirror_editor='';
    scroll_to_view(ele){
        ele.scrollIntoView({
            behaviour: "smooth",
            block: "end"
        });
    }
    removeCurrentTab(ele) {
      let self = this;
      let curr_target = $(ele).parent().parent();//.remove();
      self._removeCurrentTab(curr_target);
    };

    _highlight_and_fetch(tab_elem){
        if($(tab_elem).parent().hasClass('tab-active')){
            return false;
        }
        $('.file-get-section').parent().removeClass('tab-active');
        $(tab_elem).parent().addClass('tab-active');
    }
    get_editor_file(curr, type, flag, file_path){
            let self = this;
            $('.file-get-section').parent().removeClass('tab-active');
                if (flag == true){
                    if(this._highlight_and_fetch($(curr)) == false){

                        return;

                    }
                }
                $(curr).parent().addClass('tab-active');
                let file_name = $(curr).text();
                this.getComponentHtmlFromServer(file_path).then(function(res){
                    let content = res["content"]
                    self._fill_test_area(content, type).then(function(){
                    }).fail(function(){
                        self.tsp.NotificationBar.launch_notification('Unable To Fetch The file');
                    });
                });

    }

    save_editor_file(file_path, type, new_file_Flag){
         let self = this;
//       let text_ele = $(curr).parent();
//       if ( text_ele.parent().hasClass('tab-active') == false ) {
//            return;
//       }

//        let file_name = text_ele.parent().children()[0].textContent;
        let savable_data = ''
//        file_name = 'separate_project-'+ file_name;
        if (new_file_Flag != true && type == 'document'){
//            savable_data =  $(self.summer_note_ele).summernote('code');
                savable_data = JSON.stringify({
                "name": "",
                "content": self.summer_note_ele.innerHTML
                });
        }
        else if(new_file_Flag != true){
            savable_data = this.code_mirror_editor.getValue();
        }
        let file_uuid = '';
        try{
                let obj = self.tsp.TreeClass.metadata_map[file_path];
                if(obj !==undefined){
                        file_uuid = obj.uuid;
                }
        }
        catch(err){
            console.log(err);
        }
        var defObj=$.Deferred();
                var promise =
//                     $.ajax
//                     ({
// //                        url: 'http://localhost:5000/api/individual-component-fetch/save-file?file_path=' + (file_path),
//                         url: 'http://localhost:5000/api/tree-note/save-file/' + file_uuid,
//                         data: JSON.stringify(savable_data),
//                         type : "POST",
//                         contentType: 'application/json;charset=UTF-8',
//                         success : function(response){
//                             return defObj.resolve(response);
//                         }
//                     });
        

        self.tsp.TreeClass.action_function_map.update_tree_note_submit(file_uuid, savable_data, self.tsp.TreeClass.metadata_map[file_path]).then(function(response){
            return defObj.resolve(response);
        });
        return defObj.promise();
}

    buildTab(file_name, type, file_path){
        let self = this;
        $('#display-tab-setting-message').hide();
//        $(self.summer_note_ele).focus();
        /*Build a tab on file-tree click*/

        /*find the to-build-tab filename is already present in tab container*/
        let tab_elems =  $('#tab-container .file-get-section');
        let len =tab_elems.length;
        self.tsp.TreeClass._build_breadcrumb(file_path);
        for(let i=0;i < len ;i++){
            let curr_tab_file_path = $(tab_elems[i]).attr('file-path');
            if(curr_tab_file_path === file_path){
                this._highlight_and_fetch(tab_elems[i]);
                this.get_editor_file(tab_elems[i], type, 'false', file_path);
                this.events();
                self.scroll_to_view(tab_elems[i]);
                self.scroll_to_view($(`.file-click[ file-path='${file_path}' ]`)[0]);
                self.tsp.DetailsPanel.launch_details_data(file_path);
                self._highlight_in_tree(file_path);
                return;
            }
            else{
                //remove the unwanted tabs if the multi_tab_check is false
                 if(!this.multi_tab_flag)
                    $(tab_elems[i]).parent().remove();
            }
        }

        var resultHtml= `<div class='tab' `;
// <div class="tab-left-side"></div> <div class='tab-right-side'></div>
        resultHtml += `>  <div class='file-get-section' file-type=${type} file-path='${file_path}'  title='${file_path}'>${file_name}`;//$(this).text();
        resultHtml +=`</div> <div class='save-close-for-tab'>   <div class='close-tab' > <span class='close-tab-x'>X</span> </div></div> </div>`;
        let curr = $(resultHtml);

        if(this.multi_tab_flag){
            $('#tab-container').append(curr);
        }
        else{
            $('.tab').remove();
            $('#tab-container').append(curr);
        }
        self.scroll_to_view($(curr)[0]);
        self.tsp.DetailsPanel.launch_details_data(file_path);
        self._highlight_in_tree(file_path);
        this.get_editor_file(curr.children()[0], type, false, file_path);

        this.events();
        return this;
    }

    _fill_test_area(general_Text, type){
        let self = this;
        let def_obj = $.Deferred();
        if( type == 'document'){
            $('#code-editor').css('display', 'none');
            $('#summer-note-iframe-id').css('display', 'block');
//            $('.note-editor').css('display', 'block');

//            $(self.summer_note_ele).summernote('code', general_Text);
            document.getElementById('summer-note-iframe-id').contentWindow.document.getElementById('refresh-summer-note-editor').click();
            self.summer_note_ele = document.getElementById('summer-note-iframe-id').contentWindow.document.getElementsByClassName('note-editable')[0];
            self.summer_note_ele.innerHTML = general_Text;
            $(self.summer_note_ele).off('blur');
            $(self.summer_note_ele).on('blur',function(){
                let active_file_path = $($('.tab-active').children()[0]).attr('file-path');
                self.save_editor_file(active_file_path, 'document', false).then(function(){
                    self.tsp.NotificationBar.launch_notification(`File saved`);
                });
            });

            return def_obj.resolve();
        }

        $('#code-editor').css('display', 'block');
        $('#summer-note-iframe-id').css('display', 'none');
        $('.note-editor').css('display', 'none');

        $('.cm-s-material').remove();
        $('#js').text(general_Text);
        this.code_mirror_editor = CodeMirror.fromTextArea(document.getElementById('js'), {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'material'
          });

          this.code_mirror_editor.setSize(null,535);
          this.code_mirror_editor.focus();
          this.code_mirror_editor.on('blur',function(){
                let active_file_name =  $('.tab-active').children()[0].textContent;
                console.log(active_file_name);
                this.save_editor_file(active_file_name);
            });
            return def_obj.promise();
    }

    getComponentHtmlFromServer(file_path){
        let self = this;
        let file_uuid = '';
        if(self.tsp.TreeClass.untitled_map[file_path] != undefined)
            file_uuid = self.tsp.TreeClass.untitled_map[file_path]["uuid"]
        else
            file_uuid = self.tsp.TreeClass.metadata_map[file_path]["uuid"];
        var defObj=$.Deferred();
        // var promise =
        //         $.ajax
        //         ({
        //             //url:'http://localhost:5000/api/individual-component-fetch/general_files/separate_project?file_path='+ JSON.stringify(file_path),
        //             url:'http://localhost:5000/api/tree-note/get-file-data/' + file_uuid,
        //             type : "GET",
        //             contentType:'application/x-www-form-urlencoded',
        //             success : function(response){
        //                 return defObj.resolve(response);
        //             }
        //         });

            var promise = self.tsp.TreeNoteFirebase.read_single_file(file_uuid).then(function(response){
                console.log(response);
                return defObj.resolve(response);
            });
            return defObj.promise();
        };

    _highlight_in_tree(curr_tab_active_file_path){
            var list = $('.file-click');
            if(curr_tab_active_file_path != $('.project-file-active').attr('file-path')){
                list.map(x => {
                    let txt = $(list[x]).attr('file-path');

                    if( txt === curr_tab_active_file_path ){
                        $('.project-file-active').removeClass('project-file-active');
                        $(list[x]).addClass('project-file-active');
                       }
                    });
                }
        }

    events(){
        let self = this;

        $('.file-get-section').off('click');
        $('.file-get-section').on('click', function(){
            if ( $(this).attr('file-type') == 'document' ){
                //save_file_func = "this.save_editor_file(this,'document');"
                let file_path = $(this).attr('file-path');
//                self.get_editor_file(this, 'document', false,  file_path);
                self.buildTab($(this).attr('title'), $(this).attr('file-type'), $(this).attr('file-path') );
                self._highlight_in_tree(file_path);
            }
            else{
                type = 'code'
                //save_file_func = "this.save_editor_file(this);";
                self.get_editor_file(this, 'code', false,  $(this).attr('file-path'));
            }
        });

        $('#note-editor-toolbar-check').off('change');
        $('#note-editor-toolbar-check').change(function(){
            if($(this).prop('checked')){
                $(document.getElementById('summer-note-iframe-id').contentWindow.document.getElementsByClassName('note-toolbar')[0]).show();
            }
            else{
                $(document.getElementById('summer-note-iframe-id').contentWindow.document.getElementsByClassName('note-toolbar')[0]).hide();
            }
        });

        $('#tab-check').off('change');
        $('#tab-check').change(function(){
            if(this.checked == true)
                self.multi_tab_flag = true;
            else{
                self.multi_tab_flag = false;
                var tab_list =  $('#tab-container > .tab');
                var tab_active_text = $($('#tab-container > .tab-active').children()[0]).attr('file-path');
                tab_list.map( x =>{
                     let cached_ele = $(tab_list[x]);
                    console.log($(cached_ele.children()[0]).text());
                    if($(cached_ele.children()[0]).attr('file-path') != tab_active_text){
                        cached_ele.remove();
                    }
                });

            }
        });


        $('.close-tab').off('click');
        $('.close-tab').on('click', function(){
            self.removeCurrentTab(this);
        });

        $('.file-click').off('click');
        $('.file-click').on('click',function(){
            $('.file-click.project-file-active').removeClass('project-file-active');
            $(this).addClass('project-file-active');
            let file_name = $(this).attr('filename');
            let file_path = $(this).attr('file-path');
            let type =  $(this).attr('file-type');
            if( type  == 'document'){
                self.buildTab(file_name, type, file_path);
//                self._initialise_summer_note();
            }
            else{
                    self.buildTab(file_name, type, file_path);
            }
        });

        $('.tree-note-details-icon').off('click');
        $('.tree-note-details-icon').on('click',function(){
            self.tsp.DetailsPanel.open_details()
        });


//        $(self.summer_note_ele).off("summernote.blur");
//        $(self.summer_note_ele).on("summernote.blur", function(){
//            var markupStr = $(self.summer_note_ele).summernote('code');
//            let active_file_path = $($('.tab-active').children()[0]).attr('file-path');
//            self.save_editor_file(active_file_path, 'document', false);
//        });
        $(self.summer_note_ele).off('blur');
        $(self.summer_note_ele).on('blur',function(){
            let active_file_path = $($('.tab-active').children()[0]).attr('file-path');
            self.save_editor_file(active_file_path, 'document', false).then(function(){
                self.tsp.NotificationBar.launch_notification(`File saved`);
            });
        });

//        $(document.getElementById('summer-note-iframe-id').contentWindow.document.getElementsByClassName('note-editor')[0]).on('blur', function(){
//            $('#display-tab-setting-backdrop').show();
//        });
//

//            $('#display-tab-setting-backdrop').off('dblclick');
//            $('#display-tab-setting-backdrop').dblclick(function(){
//                $(this).hide();
//                $(self.summer_note_ele).focus();
//            });

//            $('#edit-tree-note').off('click');
//            $('#edit-tree-note').click(function(){
//                $('#display-tab-setting-backdrop').hide();
//                $(self.summer_note_ele).focus();
//            });



        $('#add-new-file-in-project-notes').off('click');
        $('#add-new-file-in-project-notes').on('click', function(){
              self.tsp.TreeClass.create_type = 'file';
              let rand_value = (Math.random() * 10000).toString().split('.')[0];
              self.tsp.TreeClass.action_function_map.create_new_tree_note_submit( 'untitled ' + rand_value, true);
        });

    }//end of events

    _removeCurrentTab(curr){
        let self = this;
        let ele_arr = $('#tab-container .tab');
                    let prev = '';
                    for(let i = ele_arr.length - 1; i>= 0 ; i--){
                      let temp = ele_arr[i];
                      if( curr[0] == temp ){
                        $(temp).remove();
                        if(prev == "" ){
                            if( i-1 >= 0){
                                let next_target = $($(ele_arr[i-1]).find('.file-get-section'));
                                self.buildTab(
                                next_target.attr('title'),
                                next_target.attr('file-type'),
                                next_target.attr('file-path'));
                                break;
                            }
                            else{
                                self.display("No Files Opened");
                                return;
                            }
                        }
                        else if($(curr[0]).hasClass('tab-active') === true) {
                            let prev_target = $($(prev).find('.file-get-section'));
                            self.buildTab(
                            prev_target.attr('title'),
                            prev_target.attr('file-type'),
                            prev_target.attr('file-path'));
                        }
                        break;
                      }
                      else{
                        prev = temp;
                      }
                    }
    }

    display(display_message){
        $('#display-tab-setting-message').empty().append(`<span class="tab-setting-message">${display_message}</span>`).show();
    }

    close_tabs_settings(curr){
            let self = this;
            let close_type = '';
//            if(_close_type !== undefined){
//                close_type = _close_type;
//            }else{
//            }
            close_type = $(curr).attr('close-type');
            let display = function(display_message){
                $('#display-tab-setting-message').empty().append(`<span class="tab-setting-message">${display_message}</span>`).show();
            }
            switch(close_type){
                case 'close_tabs_to_the_left':
                case 'close_all_except_the_current':{
                    let ele_arr = $('#tab-container > .tab');
                    for(let i= 0; i< ele_arr.length; i++){
                      let temp= ele_arr[i];
                      if($(temp).hasClass('tab-active')){
                        if(close_type === 'close_tabs_to_the_left')
                            break;
                        else if(close_type === 'close_all_except_the_current')
                            continue;
                      }
                      else
                        $(temp).remove();
                    }
                    break;
                }
                case 'close_tabs_to_the_right':{
                    let ele_arr = $('#tab-container > .tab');
                    for(let i= ele_arr.length - 1; i>= 0 ; i--){
                      let temp = ele_arr[i];
                      if($(temp).hasClass('tab-active'))
                        break;
                      else
                        $(temp).remove();
                    }
                    break;
                }
                case 'close_the_current_tab':{
                    let ele_arr = $('#tab-container > .tab');
                    let prev = '';
                    for(let i= ele_arr.length - 1; i>= 0 ; i--){
                      let temp = ele_arr[i];
                      if($(temp).hasClass('tab-active')){
                        $(temp).remove();
                        if(prev == ""){
                            if( i-1 >= 0){
                                let next_target = $($(ele_arr[i-1]).find('.file-get-section'));
                                self.buildTab(
                                next_target.attr('title'),
                                next_target.attr('file-type'),
                                next_target.attr('file-path'));
                                break;
                            }
                            else{
                                self.display("No Files Opened");
                                return;
                            }
                        }
                        let prev_target = $($(prev).find('.file-get-section'));
                        self.buildTab(
                        prev_target.attr('title'),
                        prev_target.attr('file-type'),
                        prev_target.attr('file-path'));
                        break;
                      }
                      else{
                        prev = temp;
                      }
                    }
                    break;
                }
                case 'all':{
                    $($('#tab-container > .tab')).remove();
                    self.display("No file opened");
                }
            }
        }

    tree_note_settings(){
        let self = this;
        $('.menu > .item').click(function(){
            self.close_tabs_settings(this);
        });
    }

    build_untitled_tabs(){
        let self = this;
        let untitled_map = self.tsp.TreeClass.untitled_map;
        for(let x in untitled_map){
            self.buildTab(
            untitled_map[x]['name'],
            untitled_map[x]['type'],
            untitled_map[x]['path'])
        }
    }

    init(tsp, to_return_values){
//        this._initialise_summer_note();
        console.log("i am in document section-----1");
        
        tsp.SourceCodeSection = this;
        this.tsp = tsp;
        // this.summer_note_ele = document.getElementById('summer-note-iframe-id').contentWindow.document.getElementsByClassName('note-editable')[0];

        
//        this.build_untitled_tabs();
        console.log("i am in document section-----2");
        this.events(); //this might be called more than once ondemand
        this.multi_tab_flag = true;
        console.log("i am in document section-----");
        
//        this._tabs_dropdown_click();
//        this._move_tabs_for_source_code_section();
        console.log("i am in document section");
        this.tree_note_settings();

        return $.Deferred().resolve(tsp, to_return_values);
    }



}