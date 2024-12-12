# 2dof Frontend

```
cd frontend
```

## Build

The frontend uses Sass and Webpack to build the css and js files.  
Build style.css and bundle.js by running:
```
npm run build
```

Other commands are available:

```
# build only style.css
npm run build_css

# build only bundle.js
npm run build_js

# build style.css when edited
npm run watch_sass

# build bundle.js when edited
npm run watch_js
```

## Hosting
The frontend files should be available at: `/2dof/`.  

Only **index.html**, **style.css** and **bundle.js** have to be on the server. Additionally, the **.htaccess** should be uploaded if the server does not already add missing file extensions for **.html** and **.php**.