package mca.finalyear.miniproject.backend.dao;

import mca.finalyear.miniproject.backend.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BusRepository extends JpaRepository<Bus, String> {
    @Query("SELECT b FROM Bus b WHERE LOWER(b.source) = LOWER(:source) AND LOWER(b.destination) = LOWER(:destination)")
    List<Bus> findBySourceAndDestination(@Param("source") String source, @Param("destination") String destination);
}
