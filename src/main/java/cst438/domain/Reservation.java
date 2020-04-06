package cst438.domain;

import javax.persistence.*;

@Entity
public class Reservation {

	@Column(name = "idReservation")
	private int idReservation;
	
	@Column(name = "rentalCar")
	private String rentalCar;
	
	@Column(name = "shuttle")
	private String shuttle;
	
	@Column(name = "hotel")
	private String hotel;
	
	@Column(name = "seatPref")
	private String seatPref;
	
	@Column(name = "Flight_idFlight")
	private int Flight_idFlight;
	
	@Column(name = "passenger_idPassenger")
	private int passenger_idPassenger;

	public Reservation(int idReservation, String rentalCar, String shuttle, String hotel, String seatPref,
			int flight_idFlight, int passenger_idPassenger) {
		super();
		this.idReservation = idReservation;
		this.rentalCar = rentalCar;
		this.shuttle = shuttle;
		this.hotel = hotel;
		this.seatPref = seatPref;
		Flight_idFlight = flight_idFlight;
		this.passenger_idPassenger = passenger_idPassenger;
	}

	public int getIdReservation() {
		return idReservation;
	}

	public void setIdReservation(int idReservation) {
		this.idReservation = idReservation;
	}

	public String getRentalCar() {
		return rentalCar;
	}

	public void setRentalCar(String rentalCar) {
		this.rentalCar = rentalCar;
	}

	public String getShuttle() {
		return shuttle;
	}

	public void setShuttle(String shuttle) {
		this.shuttle = shuttle;
	}

	public String getHotel() {
		return hotel;
	}

	public void setHotel(String hotel) {
		this.hotel = hotel;
	}

	public String getSeatPref() {
		return seatPref;
	}

	public void setSeatPref(String seatPref) {
		this.seatPref = seatPref;
	}

	public int getFlight_idFlight() {
		return Flight_idFlight;
	}

	public void setFlight_idFlight(int flight_idFlight) {
		Flight_idFlight = flight_idFlight;
	}

	public int getPassenger_idPassenger() {
		return passenger_idPassenger;
	}

	public void setPassenger_idPassenger(int passenger_idPassenger) {
		this.passenger_idPassenger = passenger_idPassenger;
	}
	
}
