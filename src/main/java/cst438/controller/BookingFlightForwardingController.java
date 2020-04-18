package cst438.controller;

import org.springframework.web.bind.annotation.RestController;

import cst438.domain.Passenger;
import cst438.domain.Reservation;
import cst438.service.BookingFlightForwardingService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class BookingFlightForwardingController {

   private static final Logger log = LoggerFactory.getLogger(BookingFlightForwardingController.class);

   @Autowired
   private BookingFlightForwardingService bookingFlightService;

   @GetMapping("/bookingFlightService/passenger/{id}")
   public Passenger getPassenger(@PathVariable("id") long id) {
      return bookingFlightService.getPassengerById(id);
   }

   @GetMapping("/bookingFlightService/passengerByEmail/{email}")
   public Passenger getPassengerByEmail(@PathVariable("email") String email) {
      return bookingFlightService.getPassengerByEmail(email);
   }

   @GetMapping("/bookingFlightService/reservation/{id}")
   public Reservation getReservation(@PathVariable("id") long id) {
      return bookingFlightService.getReservation(id);
   }

   @PostMapping(path = "/bookingFlightService/reservations/create", consumes = "application/json", produces = "application/json")
   public Reservation createReservation(@RequestBody Reservation reservation) {
      log.info("Creating reservation flightId/passengerId: " + reservation.flightId + "/" + reservation.passengerId
            + ", seat: " + reservation.seatPref);
      return bookingFlightService.create(reservation);
   }
}
