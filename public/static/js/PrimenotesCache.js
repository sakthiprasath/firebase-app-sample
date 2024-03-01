

export default class PrimenotesCache {

    cache_data(){
        let self = this;
        self.data ={
            url_prefix : "http://127.0.0.1:5501" //"https://primenotes.azurewebsites.net/"
         }
    }
    init(tsp, to_return_values){
        tsp.PrimenotesCache = this;
        this.tsp = tsp;
        this.cache_data();
        return $.Deferred().resolve(this.tsp, to_return_values);
    }
}