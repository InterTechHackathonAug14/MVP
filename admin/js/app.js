var app = (function(){

	var geocoder;
	var map;
	var infowindow;
	var currentPlace = null;
	var frmTpl = '<form id="frmSubmit"><div id="infoWindow"><div>{0}: {1}</div><div>Services</div><div><input id="services" type="text"/></div><button type="button" onclick="app.postLocation();">Submit</button></div></form>';

	google.maps.event.addDomListener(window, 'load', initialize);

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


	function postLocation() {
		console.log('currentPlace', currentPlace);
		var text = $('#services').val();
		console.log('servicesText', text);
		var data = {
			placeId: currentPlace.place_id,
			lat: currentPlace.geometry.location.k,
			lng: currentPlace.geometry.location.B,
			services: text
		};
		
		var url = "http://178.62.26.98:2222/place/{0}".replace("{0}", data.placeId);
		$.get( url, function( data ) {
			updateWhitelist(data);
		}).fail(function() {
			addToWhitelist(data);
		});
	}


	function addToWhitelist(data){
		console.log(data);
		//return;
		var url = "http://178.62.26.98:2222/place/{0}".replace("{0}", data.placeId);
		$.ajax(url, {
			method: "POST",
		 	data: "tags=" + data.services,
			success: function(){
				console.log('Added');
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('jqXHR', jqXHR);
				console.log('textStatus', textStatus);
				console.log('errorThrown', errorThrown);
			}
		});
	}

	
	
	function updateWhitelist(data) {
		console.log(data);
		//return;
		var url = "http://178.62.26.98:2222/place/{0}".replace("{0}", data.placeId);
		$.ajax(url, {
			method: "DELETE",
			success: function(){
				addToWhitelist(data);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('jqXHR', jqXHR);
				console.log('textStatus', textStatus);
				console.log('errorThrown', errorThrown);
			}
		});
	}


	//function xxx() {
	//	var url = "http://178.62.26.98:2222/places";
	//	//var xhr = createCORSRequest("GET", url);
	//	//if (!xhr) {
	//	//	throw new Error('CORS not supported');
	//	//}
	//	//console.log(xhr.responseText);
	//	//return;
	//	$.get( url, function( data ) {
	//		console.log(data);
	//	}).fail(function() {
	//		alert( "error" );
	//	});
	//}

	//function createCORSRequest(method, url) {
	//	var xhr = new XMLHttpRequest();
	//	if ("withCredentials" in xhr) {
	//	
	//		// Check if the XMLHttpRequest object has a "withCredentials" property.
	//		// "withCredentials" only exists on XMLHTTPRequest2 objects.
	//		xhr.open(method, url, true);
	//	
	//	} else if (typeof XDomainRequest != "undefined") {
	//	
	//		// Otherwise, check if XDomainRequest.
	//		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	//		xhr = new XDomainRequest();
	//		xhr.open(method, url);
	//	
	//	} else {
	//	
	//		// Otherwise, CORS is not supported by the browser.
	//		xhr = null;
	//	
	//	}
	//	return xhr;
	//}

	

	//function getFromWhitelist(id){
	//	console.log(id);
	//	var url = "http://178.62.26.98:2222/places/{0}".replace("{0}", id);
	//	$.get( url, function( data ) {
	//		var energy = data.tags.join();
	//		$('#services').val(services)
	//	}).fail(function() {
	//		alert( "error" );
	//	});
	//}
	return {
		postLocation: postLocation
	};
}());
