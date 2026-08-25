package mca.finalyear.miniproject.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class BookingRequest {
    private String busId;
    private String busName;
    private String from;
    private String to;
    private String date;
    private String departure;
    private String arrival;
    private List<Integer> seats;
    private PassengerRequest passenger;
    private String paymentMethod;
    private Double total;

    // Getters and Setters
    public String getBusId() { return busId; }
    public void setBusId(String busId) { this.busId = busId; }

    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDeparture() { return departure; }
    public void setDeparture(String departure) { this.departure = departure; }

    public String getArrival() { return arrival; }
    public void setArrival(String arrival) { this.arrival = arrival; }

    public List<Integer> getSeats() { return seats; }
    public void setSeats(List<Integer> seats) { this.seats = seats; }

    public PassengerRequest getPassenger() { return passenger; }
    public void setPassenger(PassengerRequest passenger) { this.passenger = passenger; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}
