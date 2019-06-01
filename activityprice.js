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
	
	//function to select one activity price information in order to update it
	function getActivityPrice(res, mysql, context, id, complete){
		var sql = "SELECT ap.id, ap.activity_id, ap.book_date, ap.price FROM Activities_Price ap WHERE ap.id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.activity_price = results[0];
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
	
	//Displays a single activity price in order to update the activyty price attributes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["select.js", "update.js"];
		var mysql = req.app.get('mysql');
		getActivityPrice(res, mysql, context, req.params.id, complete);
		getActivities(res, mysql, context, complete)
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('update-activityprice', context);
			}

		}
	});
	
	//Sends updated attributes and redirects to the activity price page
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Activities_Price ap SET ap.book_date=?, ap.price=? WHERE ap.id=?";
		var inserts = [req.body.book_date, req.body.price, req.params.id];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(error)
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.status(200);
				res.end();
			}
		});
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
