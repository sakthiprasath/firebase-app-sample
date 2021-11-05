//support for only dark theme
export default class Theme {

    cache_elems() {
        let self = this;
    }
    change_theme() {
        let theme = self.tsp.GlobalConstants.themes.greenish;
        $('.individual-search-background').attr
    }
    init(tsp, to_return_Values) {
        tsp.Theme = this;
        this.tsp = tsp;
        this.event_map = {};
        this.cache_elems();
        return $.Deferred().resolve(tsp, to_return_Values);
    }

}