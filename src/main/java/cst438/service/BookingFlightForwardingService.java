package cst438.service;

import java.util.Arrays;
import java.util.List;

import cst438.domain.Airport;
import cst438.domain.Flight;
import cst438.domain.Passenger;
import cst438.domain.Reservation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BookingFlightForwardingService {

   private static final Logger log = LoggerFactory.getLogger(BookingFlightForwardingService.class);
   
   private final RestTemplate restTemplate;
   private final String reservationUrl;
   private final String reservationCreateUrl;
   private final String passengerUrl;
   private final String passengerUrlByEmail;
  

   public BookingFlightForwardingService(@Value("${rs.baseurl}") String baseUrl) {
         this.restTemplate = new RestTemplate();
         this.reservationUrl = baseUrl + "/api/reservations/v1/";
         this.passengerUrl = baseUrl + "/api/passenger/v1/";
         this.passengerUrlByEmail = baseUrl + "/api/passenger/v1/email/";
         this.reservationCreateUrl = baseUrl + "/api/reservation/v1/create";
      }

   public Reservation getReservation(Long id) {
      String url = reservationUrl + id;
      log.info("Fetching JSON from " + url);
      ResponseEntity<Reservation> response = restTemplate.getForEntity(url, Reservation.class);
      log.info("Status code from RS server, reservation:" + id + " :" + response.getStatusCodeValue());
      return response.getBody();
   }

   public Passenger getPassengerById(Long id) {
      String url = passengerUrl + id;
      log.info("Fetching JSON from " + url);
      ResponseEntity<Passenger> response = restTemplate.getForEntity(url, Passenger.class);
      log.info("Status code from RS server, passenger:" + id + " :" + response.getStatusCodeValue());
      return response.getBody();
   }

   public Passenger getPassengerByEmail(String email) {
      String url = passengerUrlByEmail + email;
      log.info("Fetching JSON from " + url);
      ResponseEntity<Passenger> response = restTemplate.getForEntity(url, Passenger.class);
      log.info("Status code from RS server, passenger:" + email + " :" + response.getStatusCodeValue());
      return response.getBody();
   }
   
   public Reservation create(Reservation reservation) {
      if (reservation.flightId == null || reservation.passengerId == null) {
         throw new IllegalArgumentException("flightId and passengerId are required.");
      }
      reservation.id = null;
      log.info("Sending JSON (creation) to " + reservationCreateUrl);
      ResponseEntity<Reservation> response = restTemplate.postForEntity(reservationCreateUrl, reservation, Reservation.class);
      log.info("Status code from RS server, create reservation: " + response.getStatusCodeValue());
      log.info("Created reservation id: " + response.getBody().id);
      return response.getBody();
   }
}
