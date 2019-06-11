module.exports = function(){

	var express = require('express');
	var router = express.Router();
	
	//function to select city information	
	function getDestinationTypes(res, mysql, context, complete){
		mysql.pool.query("SELECT c.name, dt.city_id, dt.type FROM Destination_Type dt INNER JOIN City c ON dt.city_id=c.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.destination_type = results;
			complete();
		});
	}
	
	//function to select one city's destination information in order to update it
	function getDestinationType(res, mysql, context, id, complete){
		var sql = "SELECT dt.id, c.name, dt.city_id, dt.type FROM Destination_Type dt INNER JOIN City c ON dt.city_id=c.id WHERE dt.id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.destination_type = results[0];
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
	
	//display city destination types
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getDestinationTypes(res, mysql, context, complete);
		getCities(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('destinationtype', context);
			}
		}
	});
	
	//Displays a single city's destination type in order to update the destination type attribute
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["update.js"];
		var mysql = req.app.get('mysql');
		getDestinationType(res, mysql, context, req.params.id, complete);
		getCities(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('update-destinationtype', context);
			}

		}
	});
	
	//Sends updated type attribute and redirects to the destination type page
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Destination_Type dt SET dt.type=? WHERE dt.id=?";
		var inserts = [req.body.type, req.params.id];
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
	
	/* Adds a destination type to a city, then redirects back to the destination type page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Destination_Type (city_id, type) VALUES (?,?)";
		var inserts = [req.body.city_id, req.body.type];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/destinationtype');
			}
		});
	});
	
	return router;
}();
