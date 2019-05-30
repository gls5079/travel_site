module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select city information
	function getCity(res, mysql, context, complete){
		mysql.pool.query("SELECT c.id, c.name, c.state FROM City c", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.city = results;
			complete();
		});
	}	

	//display single city attributes for update
	function getCityInfo(res, mysql, context, id, complete){
		var sql = "SELECT c.id, c.name, c.state FROM City c WHERE c.id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.city = results[0];
			complete();
		});
	}


	
	//display cities
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getCity(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('city', context);
			}
		}
	});

	//Display single city for update city attriubtes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["update.js"];
		var mysql = req.app.get('mysql');
		getCityInfo(res, mysql, context, req.params.id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update-city', context);
			}

		}
	});

	
	/* Adds a city, then redirects back to the explore-cities page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO City (name, state) VALUES (?,?)";
		var inserts = [req.body.name, req.body.state];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/city');
			}
		});
	});

	//Send updated attributes and redirects to city page.
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE City c SET c.name=?, c.state=? WHERE c.id=?";
		var inserts = [req.body.name, req.body.state, req.params.id];
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

	/*Route to delete a city. */
	router.delete('/:id', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM City WHERE id = ?";
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
