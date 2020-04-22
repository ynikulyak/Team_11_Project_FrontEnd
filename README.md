# Team_11_Project_FrontEnd

1. Run FlightReservation.sql file from CommonFlightInfoService repository to create database and initialize tables Airport and Flight
2. Change in application.properties into your data
    # Common Flight Information Service base URL
    cfis.baseurl=http://localhost:8081

    # Reservation Service base URL
    rs.baseurl=http://localhost:8082
3. Front end runs in port 8080
4. To the project purpose only, we initialized tables Flight and Airports with only 10 rows. So, in index page in select "From" 
field enter "San Francisco", "To" field - "Los Angeles", "Dparture Date" May, 1, 2020; "Return Date" - May, 10, 2020
