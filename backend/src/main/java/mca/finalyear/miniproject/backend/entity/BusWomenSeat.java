package mca.finalyear.miniproject.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bus_women_seats")
public class BusWomenSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "bus_id", nullable = false)
    private String busId;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getBusId() { return busId; }
    public void setBusId(String busId) { this.busId = busId; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }
}
