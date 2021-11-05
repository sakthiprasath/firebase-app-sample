export default class DetailsPanel {


    build_details_header_html(data_obj) {
        let html = `<div class="row11">`
        html += `<span class="details-name">${data_obj['data']}</span>`;
        html += `<span class="details-close" style="padding:  10px;"><i class="ui icon close"></i></span>`;
        html += `</div>`;

        return html;
    }

    build_label_data_html(data_obj) {
        let html = `<div class="row1">`
        html += `<span class="details-label">${data_obj['label']}</span>`;
        html += `<span class="details-value">${data_obj['data']}</span>`;
        html += `</div>`;

        return html;
    }

    close_details() {
        //            $('#destination-container').css('width','100%');
        //            $('#pane').css('width','99%');
        $('#right-side-panel').css({ 'z-index': '0', 'display': 'none' });
    }
    open_details() {
        //         $('#destination-container').css('width','calc(100% - 315px)');
        //         $('#pane').css('width','78.6%');
        $('#right-side-panel').css({ 'z-index': '100', 'display': 'block' });

    }
    get_local_date_time(date_time_string) {
        let date = new Date(date_time_string);
        return (date.toDateString() + ", " + date.toLocaleTimeString());
    }
    launch_details_data(path) {
        let self = this;
        let metadata = self.tsp.TreeClass.metadata_map[path];

        let html = self.build_details_header_html({
            'data': metadata['name']
        });
        html += self.build_label_data_html({
            'label': 'Date Created',
            'data': self.get_local_date_time(metadata['date_created'])
        });

        html += self.build_label_data_html({
            'label': 'Last Updated',
            'data': self.get_local_date_time(metadata['last_updated'])
        });

        html += self.build_label_data_html({
            'label': `${ metadata['folder_type'].charAt(0).toUpperCase() + metadata['folder_type'].slice(1)}` + ' Path',
            'data': metadata['path']
        });

        html += self.build_label_data_html({
            'label': 'Link',
            'data': `<a href="#"> app.preimenotes.app/sakthi25/${metadata['uuid']}</a>`
        });

        html += self.build_label_data_html({
            'label': 'Starred',
            'data': `<label class="switch"><input type="checkbox" checked="true"></label>`
        });

        $('.details-section').empty().html(html);
        self.events();
    }
    launch_quick_file_details_data(file_key) {
        let self = this;
        let metadata = self.tsp.loadComponentsContainer.label_map[file_key];

        let html = self.build_details_header_html({
            'data': metadata['name']
        });
        html += self.build_label_data_html({
            'label': 'Date Created',
            'data': self.tsp.Utils.get_formatted_date(metadata['date_created'])
        });

        html += self.build_label_data_html({
            'label': 'Last Updated',
            'data': self.tsp.Utils.get_formatted_date(metadata['last_updated'])
        });


        // let url = `localhost:5500/public?share=${file_key}`;
        // html += self.build_label_data_html({
        //     'label': 'Link',

        //     'data': ` <a href='${url}'> ${url}</a>`
        // });

        let lines = metadata.content.split("\n").length;
        html += self.build_label_data_html({
            'label': 'Total No of lines : ',
            'data': `${lines}`
        });

        let word_count = metadata.content.split(" ").length;
        html += self.build_label_data_html({
            'label': 'Word Count',
            'data': `${word_count}`
        });

        $('.details-section').empty().html(html);
        self.events();
    }
    events() {
        let self = this;
        $('.details-close').off('click');
        $('.details-close ').on('click', function() {
            self.close_details();
        });
    }
    init(tsp, to_return_values) {
        tsp.DetailsPanel = this;
        this.tsp = tsp;
        //        this.build_right_side_panel();
        this.events();
        return $.Deferred().resolve(this.tsp, to_return_values);

    }
}