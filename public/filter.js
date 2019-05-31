function filterCity(){
	//get id of selected state from filter dropdown
	var state_name = document.getElementById('state_filter').value
	//construct URL and redirect to it
	window.location = '/city/filter/' + state_name
}


function filterActivity(){
	//get id of selected city from filter dropdown
	var city_name = document.getElementById('city_filter').value
	//construct URL and redirect to it
	window.location = '/activity/filter/' + parseInt(city_name)
}
