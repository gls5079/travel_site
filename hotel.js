module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select hotel information
	function getHotel(res, mysql, context, complete){
		mysql.pool.query("SELECT Hotel.id, Hotel.name, Hotel.phone_number, City.name as cityName FROM Hotel INNER JOIN City ON Hotel.city_id = City.id ", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.hotel = results;
			complete();
		});
	}

	//function to display city list
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

	//function to get attributes for a hotel for updating
	function getHotelInfo(res, mysql, context, id, complete){
		var sql = "SELECT id, name, phone_number, city_id FROM Hotel WHERE id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.hotel = results[0];
			complete();
		});
	}	


	//display hotels 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getHotel(res, mysql, context, complete);
		getCities(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('hotel', context);
			}
		}
	});


	//display single hotel for update attributes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["select.js", "update.js"];
		var mysql = req.app.get('mysql');
		getHotelInfo(res, mysql, context, req.params.id, complete);
		getCities(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('update-hotel', context);
			}

		}
	});


	//send update attributes and redirects to hotel page
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Hotel SET name=?, phone_number=?, city_id=? WHERE id=?";
		var inserts = [req.body.name, req.body.phone_number, req.body.city_id, req.params.id];
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

	
	/* Adds a hotel */ 
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Hotel (name, phone_number, city_id) VALUES (?,?,?)";
		var inserts = [req.body.name, req.body.phone_number, req.body.city_id];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/hotel'); //WHERE SHOULD THIS REDIRECT TO?
			}
		});
	});

	//Route to delete hotel
	router.delete('/:id', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Hotel WHERE id = ?";
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
