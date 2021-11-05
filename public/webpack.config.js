const path = require("path");
module.exports = {
    entry: './static/js/main_1.js',
    output: {
        filename: 'primenotes.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: "production"
}