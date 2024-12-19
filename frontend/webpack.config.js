// Used to bundle all JavaScript files
// "npm run build_js" or "npx webpack" to bundle

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './js/main.js', // Starting point (everything else is imported)
    output: {
        filename: 'bundle.js', // Bundled file
        path: path.resolve(__dirname),
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
    mode: 'development', // 'development' for debugging
};