module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select hotel information
	function getHotel(res, mysql, context, complete){
		mysql.pool.query("SELECT Hotel.id, Hotel.name, Hotel.phone_number FROM Hotel", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.hotel = results;
			complete();
		});
	}

	//display hotels 
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		//This line is used to delete, filter, or search using AJAX
		context.jscripts = ["deletehotel.js", "filterhotel.js", "searchhotel.js"];
		var mysql = req.app.get('mysql');
		getHotel(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('hotel', context);
			}
		}
	});
	
	/* Adds a hotel price, then redirects back to the ????? page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Hotel (name, phone_number) VALUES (?,?)";
		var inserts = [req.body.name, req.body.phone_number];
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

	return router;
}();
