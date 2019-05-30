module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select airline information
	function getAirline(res, mysql, context, complete){
		mysql.pool.query("SELECT id, name, phone_number FROM Airline", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.airline = results;
			complete();
		});
	}	

	function getAirlineInfo(res, mysql, context, id, complete){
		var sql = "SELECT id, name, phone_number FROM Airline WHERE id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.airline = results[0];
			complete();
		});
	}
	
	//display airline
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getAirline(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('airline', context);
			}
		}
	});
	
	//display single airline for pudating attributes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["update.js"];
		var mysql = req.app.get('mysql');
		getAirlineInfo(res, mysql, context, req.params.id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update-airline', context);
			}

		}
	});

	//send updated attributes and redirect to airline page
	
        router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Airline SET name=?, phone_number=? WHERE id=?";
		var inserts = [req.body.name, req.body.phone_number, req.params.id];
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
				res.redirect('/airline');
			}
		});
	});


	//route to delete airline
	router.delete('/:id', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Airline WHERE id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(error)
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
				res.status(202).end();
			}
		})
	})
	
	return router;
}();
