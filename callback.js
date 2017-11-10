var fs = require('fs');
var csv = require('csv');

fs.createReadStream('parks.csv').pipe(parser);

var parser = csv.parse(function(err, data){
  console.log(data);
});