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
	var number = 0;
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