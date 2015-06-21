
/*
 * GET home page.
 */

var foodType;
var setFoodType = function(name) {
    foodType = name;
}
var getFoodType = function() {
    return foodType;
}

var randomFoods = ["pizza", "burrito", "fried chicken","gelato","panini","pad thai", "italian"];

var xPos;
var yPos;
var position = [];

var yelp = require("yelp").createClient({
  consumer_key: "hidden", 
  consumer_secret: "hidden",
  token: "hidden",
  token_secret: "hidden"
});

exports.index = function(req, res){
  res.render('index', { title: 'Craving <food>' });
};

exports.doAction = function(req, res) {
	console.log(req.body.data);
  var data = req.body.data.split(",");
  if(data[0] === "random" || data[0] === undefined) {
    var index = Math.floor((Math.random() * randomFoods.length) + 1);
    setFoodType(randomFoods[index]);
  } else {
    setFoodType(data[0]);
  }
  xPos = data[1];
  yPos = data[2];
	res.send(200);
};

exports.main = function(req, res) {
	if(getFoodType() === undefined) {
    var index = Math.floor((Math.random() * randomFoods.length) + 1);
    setFoodType(randomFoods[index]);
		console.log("Food default set");
	}
	search(getFoodType(), res);
};

exports.getPosition = function(req, res) {
    console.log(req.body.data);
    var coordinates = req.body.data;
    if(coordinates === undefined) {
        xPos = 45.253;
        yPos = -75.742;
    } else {
        xPos = coordinates[0];
        yPos = coordinates[1];
    }
    position.push(xPos);
    position.push(yPos);
}

var search = function(food, res){
    console.log("Searching for food");
    if(xPos === undefined || xPos > 45.99 || xPos < 45.01 || yPos > -75.01 || yPos < -75.99) {
        xPos = 45.253;
        yPos = -75.742;
    }
    yelp.search({term: food, location: "Ottawa", cll: xPos + "," + yPos, sort: 2, limit: 10}, function(error, data) {
      if(error) {
          console.log("There was an error in retrieving the results");
      } else {
      	  console.log(data);
          data['lat'] = xPos;
          data['lon'] = yPos;
          res.send(data);
      } 
    });
}

exports.landing = function(req, res) {
    res.render('main', { title: 'Craving <food>' });
}
