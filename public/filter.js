function filterCity(){
	//get id of selected state from filter dropdown
	var state_id = document.getElementById('filter_city').value
	//construct URL and redirect to it
	window.location = '/city/filter/' + paseInt(state_id)
}
