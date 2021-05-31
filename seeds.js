var mongoose=require("mongoose");
var campground=require("./models/campground");
var comment =require("./models/comment");
var data =[
		{
			name: "baverly hills",
			image:"https://tse2.mm.bing.net/th?id=OIP.i3IUN9HqK_soWrJIw5E_ZQHaE8&pid=Api&P=0&w=242&h=163",
			description:"very good place"
		},
		{
			name: "jaipur",
			image:"https://tse2.mm.bing.net/th?id=OIP.bc2yiXyvJcG0ssJtSIQk1gHaE9&pid=Api&P=0&w=241&h=162",
			description:"very good place" 
		},
		{
			name: "delhi",
			image:"https://tse4.mm.bing.net/th?id=OIP.0pHhzrbxZIvNTkZewCBV0wHaEW&pid=Api&P=0&w=288&h=170",
			description:"very good place"
		},
		{
			name: "manali",
			image:"https://tse4.mm.bing.net/th?id=OIP.SKaM59ZUZpGCFw0_Ix340gHaFj&pid=Api&P=0&w=215&h=162",
			description:"very good place"
		}						
]
function seeddb(){
campground.remove({},function(err){
	if(err){
		console.log(err);
	}
	console.log("removed campgrounds!");
	data.forEach(function(seed){
	campground.create(seed,function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			console.log("added a campground");
			// adding comment
			comment.create({
				text:"something....",
				author:"me"
			},function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					campground.comments.push(comment);
					campground.save();
					console.log("created new comment");
				}
			}); 
		}
		});
	});
});

}
module.exports=seeddb;