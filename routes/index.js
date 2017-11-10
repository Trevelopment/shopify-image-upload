var express = require('express');
var router = express.Router();
var keys = require('../secret/keys.js')
const syncWalk = require('../public/js/syncWalk.js');
const Shopify = require('shopify-api-node');
const shopify = new Shopify({
  shopName: 'TestScreenBid', // MYSHOP.myshopify.com
  apiKey: keys.getApiKey(), // Your API key
  password: keys.getApiPass(), // Your API password
  autoLimit: { calls: 2, interval: 1000, bucketSize: 25 }
});
//shopify.on('callLimits', limits => console.log(limits));
var query_data = {
  "fields": "id,title,body_html,sku,title,price,image,images"
};
var output = [];
/* GET products. */
router.get('/', function(req, res, next) {
  var itemTitle="Products";
  var itemString="Hoe";
  var productlist = [];
  shopify.product.list({ limit: 110 })
  .then(products => getImageList(products))
  .catch(err => console.error(err));

  var addMissingImages = function(product, productImages) {
    var prd = product.id;
    //console.log("prd.image "+ JSON.stringify(product) +" - " +prd + (typeof productImages[0] == "undefined"));
    /*if (typeof productImages[0] == "undefined") {
        console.log("https://screenbid.info/photos/TMP/"+product.handle+"_1.jpg");
        shopify.productImage.create(prd,{"postiton":1, "src":"https\:\/\/screenbid.info\/photos\/TMP\/"+product.handle.toUpperCase()+"_1\.jpg"})
          .then(image => (image.statusCode == 200) ? output.push(image.src) : null)
          .catch(err => console.error(err));
    }*/
    //console.log(productImages);
    //res.render('index',{title: itemTitle, list: productImages, bodytext: itemString});
  }
  var getImageList = function(products) {
    //console.log(JSON.stringify(products));
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
     shopify.metafield.list({metafield: { owner_resource: 'product', owner_id: products[product].id}})
        .then(fields => console.log(fields))
        .catch(err => console.error(err));
        /*shopify.metafield.create({
          key: 'show',
          value: 'Show Title',
          value_type: 'string',
          namespace: 'c_f',
          owner_resource: 'product',
          owner_id: products[product].id
        }).then(
          metafield => console.log(metafield),
          err => console.error(err)
        );*/
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
