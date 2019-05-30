module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select activity information
	function getActivity(res, mysql, context, complete){
		mysql.pool.query("SELECT a.id, a.name, a.phone_number, c.name as cityName FROM Activity a INNER JOIN City c ON a.city_id = c.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.activity = results;
			complete();
		});
	}	
	
	//function to display single activity attributes for update
	function getActivityInfo(res, mysql, context, id, complete){
		var sql = "SELECT id, name, phone_number, city_id FROM Activity WHERE id = ?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.activity = results[0];
			complete();
		});
	}	
	
	//function to get list of cities
	function getCityList(res, mysql, context, complete){
		mysql.pool.query("SELECT c.id, c.name FROM City c", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.cities = results;
			complete();
		});
	}
	
	//display activities
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
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
	
	//display single activity for update activity attributes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["select.js", "update.js"];
		var mysql = req.app.get('mysql');
		getActivityInfo(res, mysql, context, req.params.id, complete);
		getCityList(res, mysql, context, complete);	
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('update-activity', context);
			}

		}
	});

	//send updated attributes and redirect to activity page
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Activity SET name=?, phone_number=?, city_id=? WHERE id=?";
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
	
	//route to delete activity
	router.delete('/:id', function(req,res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Activity WHERE id = ?";
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

