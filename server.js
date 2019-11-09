const express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

const app = express();

app.use(bodyParser.urlencoded({ extended: false}));

app.use(bodyParser.json());



app.all("/addphonenumber", addPhoneNumber);
function addPhoneNumber(req, res) {
	MongoClient.connect(url)
		.then(function(db) {
			var dbo = db.db("db");
			var myobj = req.body;
			myobj.keywords = myobj.keywords.split(',');
			dbo.collection("users").update({"phone": myobj.phone}, myobj, {upsert: true})
			})
			.catch(function (err) {})
	console.log("1 document inserted/updated");
	res.status(200).send("Success!");
}

app.all("/subscriptions", checkSubscriptions);
function checkSubscriptions(req, res) {
	MongoClient.connect(url) 
		.then(function(db) {
			var dbo = db.db("db");
			var myobj = req.body.phone;
			dbo.collection("users").findOne({"phone": myobj}, function(err, result) {
				if(err) throw err;
				console.log(result.keywords);
				db.close();
			})
			.catch(function (err) {})
	})
	res.status(200).send("Success!");
}

app.listen(8000);