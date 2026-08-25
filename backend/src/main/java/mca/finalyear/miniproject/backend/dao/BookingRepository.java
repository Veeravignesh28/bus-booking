package mca.finalyear.miniproject.backend.dao;

import mca.finalyear.miniproject.backend.entity.Booking;
import mca.finalyear.miniproject.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUser(User user);
}
