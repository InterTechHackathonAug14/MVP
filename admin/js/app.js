
  function postLocation() {
		console.log(currentPlace);
		var text = $('#services').val();
		console.log(text);
		addToWhiteList({
		placeId: currentPlace.id,
		lat: currentPlace.geometry.location.k,
		lng: currentPlace.geometry.location.B,
		services: text});
  }


	function addToWhitelist(data){
		console.log(data);

		// $.ajax(url, {
		// 	method: "POST",
		// 	data: {
		// 		//placeId,
		// 		//latLng,
		// 		//services
		// 	},
		//
		// });
	}
