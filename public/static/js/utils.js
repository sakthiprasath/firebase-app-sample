export default class Utils {
    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    get_formatted_date(last_updated) {
        let self = this;
        let date = new Date(last_updated);
        let date_as_string = date.toDateString();
        let day_and_date = date_as_string.substr(0, date_as_string.length - 5)
        let time = self.formatAMPM(date);
        last_updated = day_and_date + ", " + time;
        return last_updated;

    }
    init(tsp, to_return_values) {
        tsp.Utils = this;
        this.tsp = tsp;


        return $.Deferred().resolve(tsp, to_return_values);
    }
}