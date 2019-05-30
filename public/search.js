function searchCityByState(){
	//get the city name
	var city_name = document.getElementById('city_search_string').value
	//construct URL and redirect
	window.location = '/city/search/' + encodeURI(city_name)
}
