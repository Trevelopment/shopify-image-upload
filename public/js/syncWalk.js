// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
  dir = dir || ".";
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    try {
       if (fs.statSync(path.join(dir, file)).isFile()) {
        if (file.indexOf('.jpg') == file.length - 4
        || file.indexOf('.png') == file.length - 4) {
          filelist.push(path.join(dir, file));
        }
      }else if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = walkSync(path.join(dir, file), filelist);
      } else {
        //do nothing
      }
    } catch (e) {
      console.error(e);
    }
  });
  return filelist;
};
exports.getImageList = function (showCode) {
  if(showCode.length > 5) {
    return console.log("ERROR");
  } else {
    return walkSync("photos/"+showCode+"/");
  }
}
