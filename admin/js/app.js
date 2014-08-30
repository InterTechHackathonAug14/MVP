
	function addToWhiteList(data) {
		console.log(data);
	}

	  function postLocation() {
		var text = $('#services').val();
		console.log(text);
		addToWhiteList({
		placeId: 123,
		lat: 123,
		lng: 123,
		services: text});
	  }