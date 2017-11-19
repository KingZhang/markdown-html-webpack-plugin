# markdown to html Plugin
Convert markdown as html file to export path.
if non-markdown file, just copy to export path.
if want to insert convert content to a template html file, just provide the template.html and replace with ``` {{markdownContent}} ```

## Install
```bash
npm install --save-dev markdown-webpack-plugin
```

## Usage
```js
const markdownPlugin = require('markdown-webpack-plugin');

module.exports = {
  
  plugins: [
    new markdownPlugin({
        filePath: '../inputPath',
        exportPath: '../public/outPath/',
        template: 'template.html'
      }),
  ]
}
```

## template.html sample

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <div id="app">{{markdownContent}}</div>
</body>
</html>
```

## Output
```html 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <div id="app">
    <h1 id="header1">header1</h1>
    <h2 id="header2">header2</h2>
    <p><img src="image/cat.jpg" alt=""></p>
    <pre>
        <code class="lang-js">
            var test = 1;
            if(test === 1) {
              return true;
            }
        </code>
    </pre>
    </div>
</body>
</html>

```

