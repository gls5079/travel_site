module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select activity information
	function getActivity(res, mysql, context, complete){
		mysql.pool.query("SELECT Activity.name, Activity.phone_number, City.name as cityName FROM Activity INNER JOIN City ON Activity.city_id = City.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.activity = results;
			complete();
		});
	}	
	
	//function to get list of cities
	function getCityList(res, mysql, context, complete){
		mysql.pool.query("SELECT id, name FROM City", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.city = results;
			complete();
		});
	}
	

	//display activities
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jscripts = ["deleteactivity.js", "filteractivity.js", "searchactivity.js"];
		var mysql = req.app.get('mysql');
		getActivity(res, mysql, context, complete);
		getCityList(res, mysql, context, complete);
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
		var sql = "INSERT INTO Activity (name, phone_number, city_id) VALUES (?,?,?)";
		var inserts = [req.body.name, req.body.phone_number, req.body.city_id];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/activity');
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
				res.redirect('/activity'); //WHERE SHOULD THIS REDIRECT TO?
			}
		});
	});
	
	return router;
}();

