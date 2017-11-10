const test = require('./test.js');
var http = require('http');
var imageList = [];
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  imageList = test.getImageList('TGD');
  res.write('Hello World!');
  for(i in imageList) {
    res.write('<li>'+imageList[i]+'</li>')
  }
  res.end();
});
server.listen(8080);
