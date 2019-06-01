module.exports = function(){

	var express = require('express');
	var router = express.Router();

	function getHotelPrices(res, mysql, context, complete){
		mysql.pool.query("SELECT h.name, hp.hotel_id, hp.book_date, hp.price FROM Hotel_Price hp INNER JOIN Hotel h on hp.hotel_id=h.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.hotel_price = results;
			complete();
		});
	}
	
	//function to select one hotel price information in order to update it
	function getHotelPrice(res, mysql, context, id, complete){
		var sql = "SELECT hp.id, hp.hotel_id, hp.book_date, hp.price FROM Hotel_Price hp WHERE hp.id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.hotel_price = results[0];
			complete();
		});
	}

	function getHotels(res, mysql, context, complete){
		mysql.pool.query("SELECT h.id, h.name FROM Hotel h", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.hotel = results;
			complete();
		});
	}
	
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getHotelPrices(res, mysql, context, complete);
		getHotels(res, mysql, context, complete)
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('hotelprice', context);
			}
		}
	});
	
	//Displays a single hotel price in order to update the hotel price attributes
	router.get('/:id', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["select.js", "update.js"];
		var mysql = req.app.get('mysql');
		getHotelPrice(res, mysql, context, req.params.id, complete);
		getHotels(res, mysql, context, complete)
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('update-hotelprice', context);
			}

		}
	});
	
	//Sends updated attributes and redirects to the hotel price page
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Hotel_Price hp SET hp.book_date=?, hp.price=? WHERE hp.id=?";
		var inserts = [req.body.book_date, req.body.price, req.params.id];
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
	
	router.post('/', function(req, res){
		console.log(req.body)
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Hotel_Price (hotel_id, book_date, price) VALUES (?,?,?)";
		var inserts = [req.body.hotel_id, req.body.book_date, req.body.price];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/hotelprice');
			}
		});
	});
	
	return router;
}();
