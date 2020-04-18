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
	var monthNumber = now.getMonth() + 1;
	monthNumber = monthNumber < 10 ? '0' + monthNumber : monthNumber + '';
	var todayDate = now.getFullYear() + '-' + monthNumber + '-' + now.getDate();

	if (departureDate.length === 0 || returnDate.length === 0
			|| todayDate > departureDate || departureDate > returnDate) {
		valid = false;
		console.log("wrong date");
		console.log("departureDate / todayDate / returnDate: " + departureDate
				+ '/' + todayDate + '/' + returnDate);
		$("#departure").addClass("error");
		$("#return").addClass("error");
		$("#invalidDeparture").show();
		$("#invalidReturn").show();
	} else {
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
	} else {
		$("#inputFrom").removeClass("error");
		$("#invalidFrom").hide();
	}

	if (toCity.length < 1 || fromCity === toCity) {
		valid = false;
		console.log("invalid toAirport");
		$("#inputTo").addClass("error");
		$("#invalidTo").show();
	} else {
		$("#inputTo").removeClass("error");
		$("#invalidTo").hide();
	}

	if (valid) {
		$('#searchForm').submit();
	} else {
		console.log("invalid form");
	}
}

function initializeIndexPage() {
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
}

var currentFlightResults = [];

function searchFlight(from, to, departure, returnDate) {
	$.ajax({
		method : "get",
		url : "/commonFlightService/flights/" + encodeURIComponent(from) + '/'
				+ encodeURIComponent(to) + "?departure="
				+ encodeURIComponent(departure) + "&return="
				+ encodeURIComponent(returnDate),
		dataType : "json",
		success : function(data) {
			$(".list-group").empty();
			var prevFrom = null;
			var switched = false;
			var radioBut = null;
			currentFlightResults = data;
			$.each(data, function(index, element) {
				if (prevFrom != element.fromAirportCode && prevFrom != null) {
					switched = true;
				}
				prevFrom = prevFrom || element.fromAirportCode;

				$(".list-group").append(
						createEntryForElement(element, prevFrom, radioBut,
								switched));
				prevFrom = element.fromAirportCode;
			});
			setUpFlightSelectors();
		}
	});
	return false;
}

function redirecToIndex(error) {
	document.location = '/?error=bookingpage&description='
			+ encodeURIComponent(error || 'unknown error');
}

function redirecTo(page) {
	var url = page;
	if (arguments.length > 1) {
		url += '?';
	}
	for (var i = 1; i < arguments.length; i += 2) {
		url += encodeURIComponent(arguments[i]) + '=';
		url += encodeURIComponent(arguments[i + 1]) + '&';
	}
	document.location = url;
}

var bookingPageData = {};
function initializeBookingPage() {
	console.log("Initializing page...");
	var flightId = getUrlParameter("selectedFrom");
	var returnFlightId = getUrlParameter("selectedTo");
	if (!flightId || !returnFlightId) {
		console.log("Get parames flightId or returnFlightId were not found.");
		redirecToIndex('noparameters');
		return;
	}

	$('#flightInfo').html('Loading...');
	$('#returnFlightInfo').html('Loading...');

	getFlightInfo(flightId, function(data) {
		bookingPageData['flight'] = data;
		createFlightInfoHtml(data, "#flightInfo");
		console.log("Initialization of flight completed");
	});
	getFlightInfo(returnFlightId, function(data) {
		bookingPageData['returnFlight'] = data;
		createFlightInfoHtml(data, "#returnFlightInfo");
		console.log("Initialization of return flight completed");
	});
}

function getValueAndValidate(selector) {
	var value = $(selector).val();
	value = value ? value.trim() : '';
	if (value == '') {
		$(selector).addClass("error");
	} else {
		$(selector).removeClass("error");
	}
	return value;
}

function getCreatedReservationId() {
	var bpd = bookingPageData;
	return 'RSRV_' + bpd['flightReservation']['id'] + '_'
			+ bpd['returnFlightReservation']['id'] + '_X'
			+ Math.random().toPrecision(5).substr(2);
}

function createReservations() {

	var flightId = getUrlParameter("selectedFrom");
	var returnFlightId = getUrlParameter("selectedTo");

	var firstName = getValueAndValidate('#firstName');
	var lastName = getValueAndValidate('#lastName');
	var email = getValueAndValidate('#email');
	var passportNumber = getValueAndValidate('#passportNumber');

	var rentalCar = getValueAndValidate('input[name=rentCarRadio]:checked') || 'No';
	var shuttle = getValueAndValidate('input[name=shuttleRadio]:checked') || 'No';
	var hotel = getValueAndValidate('input[name=bookHotelRadio]:checked') || 'No';

	var seatPref1 = getValueAndValidate('#seatPref1');
	var seatPref2 = getValueAndValidate('#seatPref2');

	if (!flightId || !returnFlightId || !firstName || !lastName || !email
			|| !passportNumber || !rentalCar || !shuttle || !hotel
			|| !seatPref1 || !seatPref2) {
		console.log('flight ids and passenger data are required: ' +
				flightId + ' / ' + returnFlightId + ' / ' + firstName + ' / ' + lastName  + ' / ' + email
				 + ' / ' + passportNumber + ' / ' +rentalCar + ' / ' +shuttle + ' / ' +hotel
				 + ' / sp1: ' + seatPref1 + ' / sp2: ' + seatPref2);
		return;
	}

	$('#submitButton').hide();
	$('#submitButtonLable').show();

	// Flight
	createReservation(flightId, firstName, lastName, email, passportNumber,
			rentalCar, shuttle, hotel, seatPref1, function(data) {
				bookingPageData['flightReservation'] = data;

				// Create Return flight if only first succeeded
				createReservation(returnFlightId, firstName, lastName, email,
						passportNumber, rentalCar, shuttle, hotel, seatPref2,
						function(data) {
							bookingPageData['returnFlightReservation'] = data;
							var id = getCreatedReservationId();
							redirecTo('/reservation/view', 'id', id);
						});
			});
}

function createReservation(flightId, firstName, lastName, email,
		passportNumber, rentalCar, shuttle, hotel, seatPref, callback) {
	$.ajax({
		method : "post",
		url : "/bookingFlightService/reservations/create",
		dataType : "json",
		contentType : "application/json",
		data : JSON.stringify({
			'flightId' : flightId,
			'rentalCar' : rentalCar,
			'shuttle' : shuttle,
			'hotel' : hotel,
			'seatPref' : seatPref,
			'firstName' : firstName,
			'lastName' : lastName,
			'email' : email,
			'passportNumber' : passportNumber
		}),
		success : callback,
		error : function(xhr, b, e) {
			var s = e + "\n" + b + "\n" +xhr.responseText; 
			alert("There was an error calling the server: \n" + s);
			redirecToIndex(s);
		}
	});
}

function getFlightInfo(id, callback) {
	$.ajax({
		method : "get",
		url : "/commonFlightService/flightbyid/" + encodeURIComponent(id),
		dataType : "json",
		success : callback
	});
}

function createFlightInfoHtml(data, container) {
	$(container).empty();
	$(container).append(
			"<b>FROM:</b> " + data.fromAirportCode + ", "
					+ data.airportTitleFrom + ", " + data.airportLocationFrom
					+ "<br> <b>Departure Date:</b> " + data.departure
					+ "<br><b>To:</b> " + data.toAirportCode + ", "
					+ data.airportTitleTo + ", " + data.airportLocationTo
					+ "<br> <b>Arrival Date:</b> " + data.arrival);
}

function createEntryForElement(element, prevFrom, radioBut, switched) {
	if (switched) {
		radioBut = "<input class='form-check-input' type='radio' name='returnRadio' id='"
				+ element.id
				+ "' value='"
				+ element.id
				+ "' style='float: right'>";
	} else {
		radioBut = "<input class='form-check-input' type='radio' name='depRadio' id='"
				+ element.id
				+ "' value='"
				+ element.id
				+ "' style='float: right'>";
	}

	var startLi = "<li class='list-group-item'>";
	var html = '';

	if (prevFrom != element.fromAirportCode) {
		html += startLi + '<h3>Returning flights</h3></li>';
	}

	html += startLi + "<b>FLIGHT:</b> <span class='flightcode'>"
			+ element.flightCode + "</span><span class='radioBut'>" + radioBut
			+ "</span><br /> " + "<b>FROM: </b>" + element.airportTitleFrom
			+ " (<b class='airportcode'>" + element.fromAirportCode
			+ "</b>) <br/>" + "<b>TO: </b>" + element.airportTitleTo
			+ " (<b class='airportcode'>" + element.toAirportCode
			+ "</b>) <br/>" + "<span class='details'><b>Departure time: </b>"
			+ element.departure + "</span> "
			+ "<span class='details'><b>Arrivale time: </b>" + element.arrival
			+ "</span>" + "</li>";
	return html;
}

function startSearchingFlights() {
	searchFlight(getUrlParameter("from"), getUrlParameter("to"),
			getUrlParameter("departure"), getUrlParameter("return"));

	$("#selected-result").hide();
}

function setUpFlightSelectors() {
	$("input[name$='depRadio']").click(function() {
		$("#selected-result").show();
		var flightId = $(this).val();
		$("<input>").attr({
			name : "selectedFrom",
			id : flightId,
			type : "hidden",
			value : flightId
		}).appendTo("form");
		displayResult(flightId);
	});
	$("input[name$='returnRadio']")
			.click(
					function() {
						var flightId = $(this).val();
						$("<input>").attr({
							name : "selectedTo",
							id : flightId,
							type : "hidden",
							value : flightId
						}).appendTo("form");
						$(".flightsResult").append(
								"<br><br><b>RETURNING FLIGHT</b><br><br>")
						displayResult(flightId);
						$(".flightsResult")
								.append(
										"<br><br><br><br><button type='submit' class='btn btn-warning' onclick='proceedToBookingPage();'>Book Flight</button>")
					});
}

function proceedToBookingPage() {
	$('#bookFlightsForm').submit();
}

function displayResult(flightId) {
	for (var i = 0; i < currentFlightResults.length; i++) {
		if (currentFlightResults[i].id == flightId) {
			$(".flightsResult").append(
					"<b>FROM:</b> " + currentFlightResults[i].fromAirportCode
							+ ", " + currentFlightResults[i].airportTitleFrom
							+ ", "
							+ currentFlightResults[i].airportLocationFrom
							+ "<br> <b>Departure Date:</b> "
							+ currentFlightResults[i].departure
							+ "<br><b>To:</b> "
							+ currentFlightResults[i].toAirportCode + ", "
							+ currentFlightResults[i].airportTitleTo + ", "
							+ currentFlightResults[i].airportLocationTo
							+ "<br> <b>Arrivale Date:</b> "
							+ currentFlightResults[i].arrival);
		}
	}
}

// Returns GET variable from the current URL in browser.
function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1), sURLVariables = sPageURL
			.split('&'), sParameterName, i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true
					: decodeURIComponent(sParameterName[1]);
		}
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
});