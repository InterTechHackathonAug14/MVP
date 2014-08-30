
	function addToWhiteList(data) {
		console.log(data);
	}

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