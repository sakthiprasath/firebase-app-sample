function toAsciiArrayMaker(s1) {
    // var s1 = "AIzaSyApJRgVPBvyx7VQOcGdPPm_5NlgKVJEtX0"
    var i = 0;
    var s1Arr = s1.split('');
    var resAscii = [];
    s1Arr.map(function(x) {
        resAscii.push(x.charCodeAt(0));
    });
    return resAscii;
}

function toEncryptedMapMaker(config) {
    var result = {};
    var i = 0;
    for (var key in config) {
        result[++i] = [toAsciiArrayMaker(key), toAsciiArrayMaker(config[key])];
    }
    console.log(result);
}
var config = {
    apiKey: "AIzaSyApJRgVPBvyx7VQOcGdPPm_5NlgKVJEtX0",
    authDomain: "primenotes-17aa2.firebaseapp.com",
    databaseURL: "https://primenotes-17aa2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "primenotes-17aa2",
    storageBucket: "primenotes-17aa2.appspot.com",
    messagingSenderId: "769006089587",
    appId: "1:769006089587:web:90c4b0595e89dd195f8106",
    measurementId: "G-WDC2R9TFPX"
};
toEncryptedMapMaker(config);