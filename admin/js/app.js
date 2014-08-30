
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
