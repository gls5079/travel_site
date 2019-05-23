module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select airline information
	function getAirline(res, mysql, context, id, complete){
		mysql.pool.query("SELECT a.name, a.phone_number, ap.price FROM Airline a INNER JOIN Airline_Price ap ON a.id = ap.Airline_Id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.airline = results;
			complete();
		});
	}	
	
	//display airline
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jscripts = ["deleteairline.js", "filterairline.js", "searchairline.js"];
		var mysql = req.app.get('mysql');
		getAirline(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('airline', context);
			}
		}
	});
	
	/* Adds an airline, then redirects back to the explore-airlines page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Airline (name, phone_number) VALUES (?,?)";
		var inserts = [req.body.name, req.body.phone_number];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/explore-airlines');
			}
		});
	});

/* Adds an airline price, then redirects back to the ????? page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Airline_price (airline_id, starting_city_id, ending_city_id, flight_date, price) VALUES (?,?,?,?,?)";
		var inserts = [req.body.airline_id, req.body.starting_city_id, req.body.ending_city_id, req.body.flight_date, req.body.price];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/explore-airlines'); //WHERE SHOULD THIS REDIRECT TO?
			}
		});
	});
	
	return router;
}();
