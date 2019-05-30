module.exports = function(){
	
	var express = require('express');
	var router = express.Router();
	
	//function to select activity price information
	function getActivityPrices(res, mysql, context, complete){
		mysql.pool.query("SELECT a.name, ap.activity_id, ap.book_date, ap.price FROM Activity_Price ap INNER JOIN Activity a ON ap.activity_id=a.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.activity_price = results;
			complete();
		});
	}
	
	//function to select activity information
	function getActivities(res, mysql, context, complete){
		mysql.pool.query("SELECT a.id, a.name, a.phone_number, a.city_id FROM Activity a", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.activity = results;
			complete();
		});
	}

	//display activity prices
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getActivityPrices(res, mysql, context, complete);
		getActivities(res, mysql, context, complete)
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
			res.render('activityprice', context);
			}
		}
	});

	//adds price, then redirects back to activity price
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Activity_Price (activity_id, book_date, price) VALUES (?,?,?)";
		var inserts = [req.body.activity_id, req.body.book_date, req.body.price];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/activityprice');
			}
		});
	});
	
	return router;

}();
