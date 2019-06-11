module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//SELECT tc.id, tc.travelers_id, tc.starting_city_id, tc.start_date, tc.end_date, tc.max_budget, tc.destination_type_id FROM Trip_Criteria tc
	//function to select activity price information	
	function getTripCriterias(res, mysql, context, complete){
		mysql.pool.query("SELECT tc.id, t.name AS trav_name, c.name AS city_name, tc.start_date, tc.end_date, tc.max_budget, dt.type FROM Trip_Criteria tc INNER JOIN Traveler t ON tc.travelers_id=t.id INNER JOIN City c ON tc.starting_city_id=c.id INNER JOIN Destination_Type dt ON tc.destination_type_id=dt.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.trip_criteria = results;
			complete();
		});
	}
	
	//function to select one traveler's destination information in order to update it
	function getTripCriteria(res, mysql, context, id, complete){
		var sql = "SELECT tc.id, t.name AS trav_name, c.name AS city_name, tc.start_date, tc.end_date, tc.max_budget, dt.type FROM Trip_Criteria tc INNER JOIN Traveler t ON tc.travelers_id=t.id INNER JOIN City c ON tc.starting_city_id=c.id INNER JOIN Destination_Type dt ON tc.destination_type_id=dt.id WHERE tc.id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.trip_criteria = results[0];
			complete();  
		});
	}

	//function to select city information
	function getCities(res, mysql, context, complete){
		mysql.pool.query("SELECT c.id, c.name FROM City c", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.cities = results;
			complete();
		});
	}
	
	//function to select traveler information
	function getTravelers(res, mysql, context, complete){
		mysql.pool.query("SELECT t.id, t.name FROM Traveler t", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.traveler = results;
			complete();
		});
	}
	
	//function to select destination type information
	function getDestinationTypes(res, mysql, context, complete){
		mysql.pool.query("SELECT dt.id, dt.type FROM Destination_Type dt", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.destination_type = results;
			complete();
		});
	}

	//display activity prices	
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getTripCriterias(res, mysql, context, complete);
		getCities(res, mysql, context, complete);
		getTravelers(res, mysql, context, complete);
		getDestinationTypes(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 4){
				res.render('tripcriteria', context);
			}
		}
	});
	
		//Displays a single trip criteria in order to update the attributes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["select.js", "update.js"];
		var mysql = req.app.get('mysql');
		getTripCriteria(res, mysql, context, req.params.id, complete);
		getCities(res, mysql, context, complete);
		getTravelers(res, mysql, context, complete);
		getDestinationTypes(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 4){
				res.render('update-tripcriteria', context);
			}

		}
	});
	
	//Sends updated attributes and redirects to the trip criteria price page
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Trip_Criteria tc SET tc.starting_city_id=?, tc.start_date=?, tc.end_date=?, tc.max_budget=?, tc.destination_type_id=? WHERE tc.id=?";
		var inserts = [req.body.starting_city_id, req.body.start_date, req.body.end_date, req.body.max_budget, req.body.destination_type_id, req.params.id];
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
	
	/* Adds a trip criteria, then redirects back to the trip criteria page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Trip_Criteria (travelers_id, starting_city_id, start_date, end_date, max_budget, destination_type_id) VALUES (?,?,?,?,?,?)";
		var inserts = [req.body.travelers_id, req.body.starting_city_id, req.body.start_date, req.body.end_date, req.body.max_budget, req.body.destination_type_id];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/tripcriteria');
			}
		});
	});
	
	return router;
}();
