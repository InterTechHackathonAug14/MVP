var geocoder;
var map;
var infowindow;
var currentPlace = null;
var frmTpl = '<form id="frmSubmit"><div id="infoWindow"><div>{0}: {1}</div><div>Services</div><div><input id="services" type="text"/></div><button type="button" onclick="postLocation($(\'frmSubmit\'));">Submit</button></div></form>';

function initialize() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(53, -1);
	var mapOptions = {
		zoom: 7,
		center: latlng
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var btn = document.getElementById('goSearch');
	btn.addEventListener('click', codeAddress);
	window.addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key == 13) {
			codeAddress();
		}
	});
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			//console.log(results[i]);
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	//TODO: check if already in db

	google.maps.event.addListener(marker, 'click', function() {
		currentPlace = place;
		infowindow.setContent(frmTpl.replace("{0}", place.types[0]).replace("{1}", place.name));
		infowindow.open(map, this);
	});
}

function codeAddress() {
	var address = document.getElementById('address').value;
	var searchterm = document.getElementById('searchterm').value;
	geocoder.geocode( {
		'address': address
			//set 'bounds' here to the UK or viewport area or something
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
			});

			map.setZoom(15);

			var request = {
				location: results[0].geometry.location,
				radius: 5000,
				keyword: searchterm,
				//types: ['doctor', 'health']
			};
			infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, callback);

		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

google.maps.event.addDomListener(window, 'load', initialize);

function postLocation() {
	console.log('currentPlace', currentPlace);
	var text = $('#services').val();
	console.log('servicesText', text);
	// addToWhitelist({
	// 	placeId: currentPlace.place_id,
	// 	lat: currentPlace.geometry.location.k,
	// 	lng: currentPlace.geometry.location.B,
	// 	services: text
	// });
}


function addToWhitelist(data){
	console.log(data);
	var url = "";

	$.ajax(url, {
		method: "POST",
	 	data: data,
		success: function(){
			console.log('Added succesfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log('jqXHR', jqXHR);
			console.log('textStatus', textStatus);
			console.log('errorThrown', errorThrown);
		}
	});
}
