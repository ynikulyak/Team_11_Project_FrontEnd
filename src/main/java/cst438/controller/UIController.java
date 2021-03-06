package cst438.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class UIController {
   
   @GetMapping("/index")
   public String getMainPage() {
      return "index";
   }
   
   @GetMapping("/rent")
   public String getRent() {
      return "rent";
   }
   
   @GetMapping("/shuttle")
   public String getShuttle() {
      return "shuttle";
   }
   
   @GetMapping("/hotel")
   public String getHotel() {
      return "hotel";
   }
   
   @GetMapping("/searchResult")
   public String getResults() {
      return "searchResult";
   }
   
   @GetMapping("/booking")
   public String getBooking() {
      return "booking";
   }
   
   @GetMapping("/reservation")
   public String getReservation() {
      return "reservation";
   }

}
