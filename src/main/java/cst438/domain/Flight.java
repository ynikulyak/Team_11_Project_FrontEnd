package cst438.domain;
import javax.persistence.*;

@Entity
@Table(name = "flight")
public class Flight {

	@Column(name = "idFlight")
	private int idFlight;
	
	@Column(name = "departureTime")
	private String departureTime;
	
	@Column(name = "arrivalTime")
	private String arrivalTime;
	
	@Column(name = "Flightcol")
	private String Flightcol;
	
	@Column(name="Arrival_Airport_id")
	private int arrivalAirportId;
	
	@Column(name="Departure_Airport_id")
	private int departureAirportId;

	public Flight(int idFlight, String departureTime, String arrivalTime, String flightcol, int arrivalAirportId,
			int departureAirportId) {
		super();
		this.idFlight = idFlight;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		Flightcol = flightcol;
		this.arrivalAirportId = arrivalAirportId;
		this.departureAirportId = departureAirportId;
	}

	public int getIdFlight() {
		return idFlight;
	}

	public void setIdFlight(int idFlight) {
		this.idFlight = idFlight;
	}

	public String getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
	}

	public String getArrivalTime() {
		return arrivalTime;
	}

	public void setArrivalTime(String arrivalTime) {
		this.arrivalTime = arrivalTime;
	}

	public String getFlightcol() {
		return Flightcol;
	}

	public void setFlightcol(String flightcol) {
		Flightcol = flightcol;
	}

	public int getArrivalAirportId() {
		return arrivalAirportId;
	}

	public void setArrivalAirportId(int arrivalAirportId) {
		this.arrivalAirportId = arrivalAirportId;
	}

	public int getDepartureAirportId() {
		return departureAirportId;
	}

	public void setDepartureAirportId(int departureAirportId) {
		this.departureAirportId = departureAirportId;
	}
	
}
