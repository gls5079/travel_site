function deleteCity(id){
	$.ajax({
		url: '/city/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

function deleteHotel(id){
	$.ajax({
		url: '/hotel/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

function deleteActivity(id){
	$.ajax({
		url: '/activity/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};


function deleteAirline(id){
	$.ajax({
		url: '/airline/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

