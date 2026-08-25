package mca.finalyear.miniproject.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import mca.finalyear.miniproject.backend.entity.Booking;

public class BookingResponse {
    private String bookingId;
    private String userId;
    private String busId;
    private String busName;
    private String from;
    private String to;
    private LocalDate date;
    private String departure;
    private String arrival;
    private List<Integer> seats;
    private PassengerRequest passenger;
    private String paymentMethod;
    private Double total;
    private LocalDateTime bookedAt;

    public BookingResponse(Booking booking, List<Integer> seats, PassengerRequest passengerInfo) {
        this.bookingId = booking.getId();
        this.userId = booking.getUser().getId();
        this.busId = booking.getBus().getId();
        this.busName = booking.getBus().getName();
        this.from = booking.getBus().getSource();
        this.to = booking.getBus().getDestination();
        this.date = booking.getTravelDate();
        this.departure = booking.getBus().getDepartureTime();
        this.arrival = booking.getBus().getArrivalTime();
        this.seats = seats;
        this.passenger = passengerInfo;
        this.paymentMethod = booking.getPaymentMethod();
        this.total = booking.getTotalAmount();
        this.bookedAt = booking.getBookedAt();
    }

    // Getters and Setters
    public String getBookingId() { return bookingId; }
    public String getUserId() { return userId; }
    public String getBusId() { return busId; }
    public String getBusName() { return busName; }
    public String getFrom() { return from; }
    public String getTo() { return to; }
    public LocalDate getDate() { return date; }
    public String getDeparture() { return departure; }
    public String getArrival() { return arrival; }
    public List<Integer> getSeats() { return seats; }
    public PassengerRequest getPassenger() { return passenger; }
    public String getPaymentMethod() { return paymentMethod; }
    public Double getTotal() { return total; }
    public LocalDateTime getBookedAt() { return bookedAt; }
}
