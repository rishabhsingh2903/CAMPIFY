var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localstrategy=require("passport-local");
var campground=require("./models/campground");
var user=require("./models/user");
var seeddb=require("./seeds");
var comment=require("./models/comment");
mongoose.connect('mongodb://localhost/yelcamp', { useNewUrlParser: true, useUnifiedTopology: true });
// seeddb();

 app.use(bodyparser.urlencoded({extended: true}));

app.set("view engine","ejs"); 

//passport configuration
app.use(require("express-session")({
	secret:"once again i win",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/",function(req,res){
	res.render("landing");
});
app.get("/campgrounds",function(req,res){

	campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/campgrounds",{campgrounds:allcampgrounds});			
		}
	});
});
app.post("/campgrounds",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var newcampground={name: name,image: image,description: description};
	campground.create(newcampground,function(err,newycreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");	
		}	
	});

});

app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
});
app.get("/campgrounds/:id",function(req,res){
	campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundcampground);
			res.render("campgrounds/show",{campground:foundcampground});
		}
	});

});
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});
		}
	})
});


app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+campground._id);
				}
			});
		}

	})
});

//auth routes
app.get("/register",function(req,res){
	res.render("register");
}); 
//handle sign up logic
app.post("/register",function(req,res){
	var newuser=new user({username:req.body.username});
	user.register(newuser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		});
	});
});

//show login form
app.get("/login",function(req,res){
	res.render("login");
});
//handling login logic
app.post("/login",passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}), function(req,res){
});

//logout route
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds");	
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000,function(){
	console.log("server started");
}); 
