
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

exports.index = function(req, res){
  res.render('index', { title: 'Craving <food>' });
};

exports.doAction = function(req, res) {
	console.log(req.body.data);
	setFoodType(req.body.data);
	res.send(200);
};

exports.main = function(req, res) {
	if(getFoodType() === undefined) {
		setFoodType("italian");
	}
	res.render('main');
};