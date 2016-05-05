var geocoder, 
	map,
	GOOGLE_MAPS_API_KEY = 'AIzaSyDDDW__-3OYqcUy9TH3YQGeA3d2rmFmmwk';

function returnLatLong(address) {

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			console.log("Lat",results[0].geometry.location.lat());
			console.log("Long",results[0].geometry.location.lng());
		} else {
			console.log("Geocode was not successful for the following reason: " + status);
		}
	});
}