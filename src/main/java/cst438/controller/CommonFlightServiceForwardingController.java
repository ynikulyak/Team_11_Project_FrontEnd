package cst438.controller;

import org.springframework.web.bind.annotation.RestController;

import cst438.domain.Airport;
import cst438.service.CommonFlightForwardingService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
public class CommonFlightServiceForwardingController {
      
   @Autowired
   private CommonFlightForwardingService commonFlightService;
   
   @GetMapping("/commonFlightService/airports/{prefix}")
   public List<Airport> getAirports(@PathVariable("prefix") String prefix) {
      return commonFlightService.getAirports(prefix);
   }
   
   @GetMapping("/commonFlightService/airport/{id}")
   public Airport getRent(@PathVariable("id") String id) {
      return commonFlightService.getAirport(id);
   }
}
