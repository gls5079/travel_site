function deleteCity(id){
	$.ajax({
		url: '/city/' + id,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		}
	})
};

