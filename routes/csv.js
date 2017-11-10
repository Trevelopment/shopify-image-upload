var express = require('express');
var router = express.Router();
var keys = require('../secret/keys.js');
const syncWalk = require('../public/js/syncWalk.js');
const Shopify = require('shopify-api-node');
const shopify = new Shopify({
  shopName: 'TestScreenBid', // MYSHOP.myshopify.com
  apiKey: keys.getApiKey(), // Your API key
  password: keys.getApiPass(), // Your API password
  autoLimit: { calls: 2, interval: 1000, bucketSize: 25 }
});
const csv = require('ya-csv');
var reader = new csv.createCsvFileReader('parks.csv');
var writer = new csv.CsvWriter(process.stdout);
reader.addListener('data', function(data) {
    writer.writeRecord(data);
});
/*

fs.createReadStream('parks.csv').pipe(parser);

var parser = csv.parse(function(err, data){
  if(err) console.log(err);
  console.log(data);
});
shippingZone
list([params])
shop
get([params])
*/
var output = [];
/* GET shop? */
router.get('/', function(req, res, next) {
  var itemTitle="Shop?";
  var itemString="Hoe";
  var productlist = [];
  shopify.metafield.list()
  .then(metafield => console.log(metafield))
  .catch(err => console.error(err));

  var addMissingImages = function(product, productImages) {
    var prd = product.id;
  }
  var getImageList = function(products) {
    for (product in products) {
      var showCode = products[product].handle.replace(/[\_\d]/g,'').toUpperCase(); //Assuming we are only uploading one show at a time
      var allImages = syncWalk.getImageList(showCode); //Speeds up processing if we only get the list of images once
      var lotNum = products[product].handle.toUpperCase();
      if(products[product].image === null){
        for (img in allImages) {
          if(allImages[img].includes(lotNum+'_')) {
            var imgPos = allImages[img].substring(allImages[img].indexOf("_") + 1);
            console.log("Lot#: "+ lotNum+" ImgSrc: "+allImages[img]+" Pos: "+ imgPos);
            shopify.productImage.create(products[product].id,{"postiton":imgPos, "src":"https\:\/\/screenbid.info\/"+allImages[img]})
            //.then(image => (image.statusCode == 200) ? output.push(image.src) : console.log(image.statusCode))
            .then(image => console.log(image))
            .catch(err => console.error(err));
          }
        }
      } else {
        /*shopify.productImage.list(products[product].id,{"limit":1})
        .then(images => addMissingImages(products[product], images))
        .catch(err => console.error(err));*/
      }
  }
  res.render('index',{title: itemTitle, list: products, bodytext: itemString});

}
});

/*
var itemList = [];
var ids = [];
var output = [];
var itemString;
var itemTitle;
  Shopify.get('/admin/products.json', query_data, function(err, data, headers){
	  for (prdct in data.products) {
		ids.push(data.products[prdct].id);
		console.log(data.products[prdct].image);
		var pobj = {
			title: data.products[prdct].title,
			bodytext: data.products[prdct].body_html,
			sku: data.products[prdct].sku,
			price: data.products[prdct].price,
			image: data.products[prdct].image,
			images: data.products[prdct].images
		}
		itemList.push(pobj);
	  }
  itemString = JSON.stringify();
  itemTitle = data.products;
  console.log(data); // Data contains product json information
  console.log(headers); // Headers returned from request
});
for (id in ids) {
Shopify.get('/admin/products/'+id+'/images.json', {}, function(err, data, headers){
	console.log(data);
	 for (img in data.images) {
		 output.push(data.images[img].src);
	 }
});


}*/

  //res.render('index', { title: 'Express' });
//});
/*var post_data = {
  "product": {
    "title": "some shit",
    "body_html": "<strong>this is a testy</strong>",
    "product_type": "shittyness",
    "variants": [
      {
        "option1": "First",
        "price": "10000.00",
        "sku": 124
      },
      {
        "option1": "Second",
        "price": "2.00",
        "sku": "123"
      }
    ]
  }
}

Shopify.post('/admin/products.json', post_data, function(err, data, headers){
  console.log(data);
});*/
module.exports = router;
