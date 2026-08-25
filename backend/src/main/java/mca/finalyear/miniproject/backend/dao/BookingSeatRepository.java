package mca.finalyear.miniproject.backend.dao;

import mca.finalyear.miniproject.backend.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Integer> {
    List<BookingSeat> findByBusIdAndTravelDate(String busId, LocalDate travelDate);
    boolean existsByBusIdAndTravelDateAndSeatNumber(String busId, LocalDate travelDate, Integer seatNumber);
}
