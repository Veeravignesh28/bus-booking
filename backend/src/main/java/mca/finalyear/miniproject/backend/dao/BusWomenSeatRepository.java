package mca.finalyear.miniproject.backend.dao;

import mca.finalyear.miniproject.backend.entity.BusWomenSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusWomenSeatRepository extends JpaRepository<BusWomenSeat, Integer> {
    List<BusWomenSeat> findByBusId(String busId);
}
