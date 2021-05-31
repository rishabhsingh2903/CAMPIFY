var mongoose =require("mongoose");
mongoose.connect('mongodb://localhost/cat_app', { useNewUrlParser: true, useUnifiedTopology: true });

var  catschema = new mongoose.Schema({
	name:String,
	age:Number,
	temperament:String
});
var cat=mongoose.model("cat",catschema);
//var george = new cat({
//	name:"george",
//	age:11,
//	temperament:"grouchy"
//});
//george.save(function(err,cat){
//	if(err){
//		console.log("error");
//	}
//	else{
//		console.log("we saved it.");
//		console.log(cat);
//	}
//});
cat.create({
	name:"white",
	age:15,
	temperament:"bland";
},function(err,cats){
	if(err){
		console.log("oh, no");
	}
	else{
		console.log(cats);
	}
});
//cat.find({},function(err,cats){
//	if(err){
//		console.log("oh, no");
//		console.log(err);
//	}
//	else{
//		console.log("all the cats");
//		console.log(cats);
//	}
//});