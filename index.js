var fs = require('fs');
var path = require('path');
var marked = require('marked');

var rootPath = path.resolve(__dirname, '..');
var mdReg = /\.md$/g;

/**
 * function to convert markdown to html file
 * @param  {String} dir        current dir
 * @param  {String} exportPath export path -- relative path
 * @param  {String} parentDir  parent dir
 * @param  {String} parentPath parent path -- relative path
 * @return {[type]}            [description]
 */
function generateHTML(dir, exportPath, templateContent, parentDir, parentPath) {
    var files = fs.readdirSync(dir),
        currentFolder = parentDir ? dir.replace(parentDir, "") : "./",
        parentPath = parentPath || "./",
        generatePath = path.join(rootPath, exportPath, parentPath, currentFolder);

    files.forEach(file => {
        var filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            generateHTML(filePath, exportPath, templateContent, dir, currentFolder);
        } else {
            let generateFile = path.join(generatePath, file.replace(mdReg, ".html"));

            try {
                fs.mkdirSync(generatePath);
            } catch (e) {}

            if(mdReg.test(file)) {
                // if markdown file, convert to html
                let data = fs.readFileSync(filePath, { encoding: "utf8" });
                data = marked(data);
                
                if(templateContent) {
                    data = templateContent.replace("{{markdownContent}}", data);
                } 

                fs.writeFileSync(generateFile, data, { encoding: "utf8" })
            } else {
                // if not markdown file, just copy
                // nodejs v8.5 use copyFileSync
                // fs.copyFileSync(filePath, generateFile);
                fs.createReadStream(filePath).pipe(fs.createWriteStream(generateFile));
            }
            
        }
    });
}

function MarkdownPlugin(options) {
    this.filePath = path.join(rootPath, options.filePath);
    this.exportPath = options.exportPath;

    if(options.template) {
        this.templateContent = fs.readFileSync(path.join(rootPath, options.template), { encoding: "utf8" });
    }
}

MarkdownPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
        generateHTML(this.filePath, this.exportPath, this.templateContent);
        callback();
    });

};

module.exports = MarkdownPlugin;