package mca.finalyear.miniproject.backend.dto;

import mca.finalyear.miniproject.backend.entity.Bus;
import java.util.List;

public class BusResponse {
    private String id;
    private String name;
    private String type;
    private String from;
    private String to;
    private String departure;
    private String arrival;
    private Double price;
    private Integer totalSeats;
    private List<Integer> bookedSeats;
    private List<Integer> womenSeats;
    private String date;

    public BusResponse(Bus bus, List<Integer> bookedSeats, List<Integer> womenSeats, String date) {
        this.id = bus.getId();
        this.name = bus.getName();
        this.type = bus.getType();
        this.from = bus.getSource();
        this.to = bus.getDestination();
        this.departure = bus.getDepartureTime();
        this.arrival = bus.getArrivalTime();
        this.price = bus.getPrice();
        this.totalSeats = bus.getTotalSeats();
        this.bookedSeats = bookedSeats;
        this.womenSeats = womenSeats;
        this.date = date;
    }

    // Getters and Setters (frontend compatibility mapping)
    public String getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getFrom() { return from; }
    public String getTo() { return to; }
    public String getDeparture() { return departure; }
    public String getArrival() { return arrival; }
    public Double getPrice() { return price; }
    public Integer getTotalSeats() { return totalSeats; }
    public List<Integer> getBookedSeats() { return bookedSeats; }
    public List<Integer> getWomenSeats() { return womenSeats; }
    public String getDate() { return date; }
}
