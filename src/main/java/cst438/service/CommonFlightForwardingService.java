package cst438.service;

import java.util.Arrays;
import java.util.List;

import cst438.domain.Airport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CommonFlightForwardingService {

   private static final Logger log = LoggerFactory.getLogger(CommonFlightForwardingService.class);
   private RestTemplate restTemplate;
   private String airportsUrl;
   private String airportUrl;

   public CommonFlightForwardingService(@Value("${cfis.baseurl}") String baseUrl) {
      this.restTemplate = new RestTemplate();
      this.airportsUrl = baseUrl + "/api/airports/v1/";
      this.airportUrl = baseUrl + "/api/airport/v1/";
   }

   public List<Airport> getAirports(String prefix) {
      String url = airportsUrl + prefix;
      log.info("Fetching JSON from " + url);
      ResponseEntity<Airport[]> response = restTemplate.getForEntity(url, Airport[].class);
      log.info("Status code from CFIS server, airports:" + response.getStatusCodeValue());
      return Arrays.asList(response.getBody());
   }

   public Airport getAirport(String id) {
      String url = airportUrl + id;
      log.info("Fetching JSON from " + url);
      ResponseEntity<Airport> response = restTemplate.getForEntity(url, Airport.class);
      log.info("Status code from CFIS server, airport:" + id + " :" + response.getStatusCodeValue());
      return response.getBody();
   }
}
