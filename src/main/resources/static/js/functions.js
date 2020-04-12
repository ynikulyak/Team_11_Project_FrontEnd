function getFromChoice() {
	return $("#inputFrom").val();
}

function getToChoice() {
	return $("#inputTo").val();
}

function getDepartureDate() {
	return $("#departure").val();
}

function getReturnDate() {
	return $("#return").val();
}

function hideCalendar() {
	$("#calendar").hide();
}

var airportsRequestsCache = {};
function airportAutoCompleteFunction(request, response) {
	var term = request.term;
	if (term in airportsRequestsCache) {
		response(airportsRequestsCache[term]);
		return;
	}

	var serviceUrl = "/commonFlightService/airports/"
			+ encodeURIComponent(term);

	$.getJSON(serviceUrl, {}, function(data, status, xhr) {
		airportsRequestsCache[term] = convertAirportDataToCompleterData(data);
		response(airportsRequestsCache[term]);
	});
}

function convertAirportDataToCompleterData(data) {
	if (!Array.isArray(data)) {
		return [];
	}
	var completerData = [];
	for ( var index in data) {
		var airport = data[index];
		var title = airport.title + ' (' + airport.id + ')' + ', '
				+ airport.location;
		completerData.push({
			'label' : title,
			'value' : title,
			'airportId' : airport.id
		});
	}
	return completerData;
}

function validateAndSubmit() {
	var valid = true;
	var now = new Date();
	var departureDate = $("#departure").val().trim();
	var returnDate = $("#return").val().trim();
	var monthNumber = now.getMonth()+1;
	monthNumber = monthNumber < 10 ? '0'+ monthNumber : monthNumber+'';
	var todayDate = now.getFullYear() + '-' + monthNumber + '-' + now.getDate();
	
	if (departureDate.length === 0 || returnDate.length === 0 || todayDate > departureDate || departureDate > returnDate){
		valid = false;
		console.log("wrong date");
		console.log("departureDate / todayDate / returnDate: " + departureDate + '/' + todayDate + '/' + returnDate);
		$("#departure").addClass("error");
		$("#return").addClass("error");
		$("#invalidDeparture").show();
		$("#invalidReturn").show();
	}else {
		$("#departure").removeClass("error");
		$("#return").removeClass("error");
		$("#invalidDeparture").hide();
		$("#invalidReturn").hide();
	}

	var fromCity = $("#inputFrom").val();
	var toCity = $("#inputTo").val();

	if (fromCity.length < 1) {
		valid = false;
		console.log("wrong FromAirprot");
		$("#inputFrom").addClass("error");
		$("#invalidFrom").show();
	}else {
		$("#inputFrom").removeClass("error");
		$("#invalidFrom").hide();
	}

	if (toCity.length < 1 || fromCity === toCity) {
		valid = false;
		console.log("invalid toAirport");
		$("#inputTo").addClass("error");
		$("#invalidTo").show();
	}else {
		$("#inputTo").removeClass("error");
		$("#invalidTo").hide();
	}

	if (valid) {
		$('#searchForm').submit();
	} else {
		console.log("invalid form");
	}
}

$(document).ready(function() {
	hideCalendar();
	$(".invalid-feedback").hide();

	$('input[type="radio"]').click(function() {
		if ($(this).val() === "yes") {
			$('#calendar').show();
		} else {
			$('#calendar').hide();
		}
	});

	$("#inputFrom").autocomplete({
		minLength : 1,
		source : airportAutoCompleteFunction,
		select : function(event, suggestion) {
			console.log('from', suggestion);
			$("#inputFromId").val(suggestion.item.airportId);
		}
	});
	$("#inputTo").autocomplete({
		minLength : 1,
		source : airportAutoCompleteFunction,
		select : function(event, suggestion) {
			console.log('to', suggestion);
			$("#inputToId").val(suggestion.item.airportId);
		}
	});
});
