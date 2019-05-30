module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select traveler information
	function getTravelers(res, mysql, context, complete){
		mysql.pool.query("SELECT id, name, address_street, address_city, address_state, address_zip_code, email_address, phone_number FROM Traveler", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.traveler = results;
			complete();
		});
	}
	
	//function to display a single traveler's attributes in order to update it
	function getTraveler(res, mysql, context, id, complete){
		var sql = "SELECT t.id, t.name, t.address_street, t.address_city, t.address_state, t.address_zip_code, t.email_address, t.phone_number FROM Traveler t WHERE t.id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.traveler = results[0];
			complete();
		});
	}
	
	//display travelers
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getTravelers(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('traveler', context);
			}
		}
	});
	
	//Displays a single traveler in order to update the traveler's attributes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["update.js"];
		var mysql = req.app.get('mysql');
		getTraveler(res, mysql, context, req.params.id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update-traveler', context);
			}

		}
	});
	
	//Sends updated attributes and redirects to the traveler page	
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Traveler t SET t.name=?, t.address_street=?, t.address_city=?, t.address_state=?, t.address_zip_code=?, t.email_address=?, t.phone_number=? WHERE t.id=?";
		var inserts = [req.body.name, req.body.address_street, req.body.address_city, req.body.address_state, req.body.address_zip_code, req.body.email_address, req.body.phone_number, req.params.id];
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
	
	/* Adds a traveler, then redirects back to the traveler page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Traveler (name, address_street, address_city, address_state, address_zip_code, email_address, phone_number) VALUES (?,?,?,?,?,?,?)";
		var inserts = [req.body.name, req.body.address_street, req.body.address_city, req.body.address_state, req.body.address_zip_code, req.body.email_address, req.body.phone_number];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/traveler');
			}
		});
	});
	
	return router;
}();
