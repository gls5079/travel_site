function updateCity(id){
	$.ajax({
		url: '/people/' + id,
		type: 'PUT',
		data: $('#update-city').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	}
}
