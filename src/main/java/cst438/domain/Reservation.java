package cst438.domain;

public class Reservation {
   
   public Long id;
   public Long flightId;
   public String firstName;
   public String lastName;
   public String email;
   public String passportNumber;
   public String rentalCar;
   public String shuttle;
   public String hotel;
   public String seatPref;
   public String flightCode;
   public String fromAirportCode;
   public String toAirportCode;
   public String departure;
   public String arrival;
   public String airportTitleFrom;
   public String airportLocationFrom;
   public String airportTitleTo;
   public String airportLocationTo;
   
   public Reservation() {
      this(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
   }
   public Reservation(Long id, Long flightId, String firstName, String lastName, String email, String passportNumber,
         String rentalCar, String shuttle, String hotel, String seatPref, String flightCode, String fromAirportCode,
         String toAirportCode, String departure, String arrival, String airportTitleFrom, String airportLocationFrom,
         String airportTitleTo, String airportLocationTo) {
      super();
      this.id = id;
      this.flightId = flightId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.passportNumber = passportNumber;
      this.rentalCar = rentalCar;
      this.shuttle = shuttle;
      this.hotel = hotel;
      this.seatPref = seatPref;
      this.flightCode = flightCode;
      this.fromAirportCode = fromAirportCode;
      this.toAirportCode = toAirportCode;
      this.departure = departure;
      this.arrival = arrival;
      this.airportTitleFrom = airportTitleFrom;
      this.airportLocationFrom = airportLocationFrom;
      this.airportTitleTo = airportTitleTo;
      this.airportLocationTo = airportLocationTo;
   }
   
}
