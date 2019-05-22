module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select activity information
	function getActivity(res, mysql, context, complete){
		mysql.pool.query("SELECT a.name, a.phone_number, ap.price FROM Activity a INNER JOIN Activity_Price ap ON a.id = ap.Activity_Id"), function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.activity = results;
			complete();
		});
	}	
	
	//display cities
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jscripts = ["deleteactivity.js", "filteractivity.js", "searchactivity.js"];
		var mysql = req.app.get('mysql');
		getCity(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('activity', context);
			}
		}
	});
	
	/* Adds an activity, then redirects back to the explore-activities page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Airline (name, phone_number, city_id) VALUES (?,?,?)";
		var inserts = [req.body.name, req.body.phone_number, req.body.city_id];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/explore-activities');
			}
		});
	});
	
	
	/* Adds an activity price, then redirects back to the ????? page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Activity_price (activity_id, book_date, price) VALUES (?,?,?)";
		var inserts = [req.body.activity_id, req.body.book_date, req.body.price];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error)); 	
				res.end();
			}else{
				res.redirect('/explore-activities'); //WHERE SHOULD THIS REDIRECT TO?
			}
		});
	});
	
	return router;
}();

