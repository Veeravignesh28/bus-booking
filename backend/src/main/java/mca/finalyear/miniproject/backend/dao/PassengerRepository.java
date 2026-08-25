package mca.finalyear.miniproject.backend.dao;

import mca.finalyear.miniproject.backend.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import mca.finalyear.miniproject.backend.entity.Booking;
import java.util.Optional;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {
    Optional<Passenger> findByBooking(Booking booking);
}
