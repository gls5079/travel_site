module.exports = function(){

	var express = require('express');
	var router = express.Router();

	//function to select hotel information
	function getHotel(res, mysql, context, complete){
		mysql.pool.query("SELECT h.name, h.phone_number, hp.price FROM Hotel h INNER JOIN Hotel_Price hp ON h.id = hp.Hotel_Id"), function(error, results, fields){
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
		getCity(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('hotel', context);
			}
		}
	});
	
	/* Adds a Hotel, then redirects back to the explore-hotels page*/
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
				res.redirect('/explore-hotels');
			}
		});
	});

/* Adds a hotel price, then redirects back to the ????? page*/
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO City (hotel_id, book_date, price) VALUES (?,?,?)";
		var inserts = [req.body.hotel_id, req.body.book_date, req.body.price];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/explore-hotels'); //WHERE SHOULD THIS REDIRECT TO?
			}
		});
	});
	
	return router;
}();
