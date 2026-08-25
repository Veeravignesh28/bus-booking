package mca.finalyear.miniproject.backend.config;

import mca.finalyear.miniproject.backend.dao.UserRepository;
import mca.finalyear.miniproject.backend.entity.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import mca.finalyear.miniproject.backend.dto.BusRequest;
import mca.finalyear.miniproject.backend.service.BusService;
import mca.finalyear.miniproject.backend.dao.BusRepository;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                                           BusRepository busRepository, BusService busService) {
        return args -> {
            if (!userRepository.existsByEmail("admin")) {
                User admin = new User();
                admin.setId(UUID.randomUUID().toString());
                admin.setName("System Admin");
                admin.setEmail("admin");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
            }

            if (busRepository.count() == 0) {
                // Seed Chennai -> Bangalore buses
                BusRequest b1 = new BusRequest();
                b1.setName("KPN Travels"); b1.setType("AC Sleeper"); b1.setSource("Chennai"); b1.setDestination("Bangalore");
                b1.setDepartureTime("21:00"); b1.setArrivalTime("05:00"); b1.setPrice(1200.0); b1.setTotalSeats(40);
                busService.createBus(b1);

                BusRequest b2 = new BusRequest();
                b2.setName("SRS Travels"); b2.setType("Non-AC Seater"); b2.setSource("Chennai"); b2.setDestination("Bangalore");
                b2.setDepartureTime("22:30"); b2.setArrivalTime("06:30"); b2.setPrice(750.0); b2.setTotalSeats(44);
                busService.createBus(b2);

                // Seed Mumbai -> Pune buses
                BusRequest b3 = new BusRequest();
                b3.setName("Neeta Travels"); b3.setType("Volvo Multi-Axle"); b3.setSource("Mumbai"); b3.setDestination("Pune");
                b3.setDepartureTime("07:00"); b3.setArrivalTime("10:30"); b3.setPrice(650.0); b3.setTotalSeats(40);
                busService.createBus(b3);

                BusRequest b4 = new BusRequest();
                b4.setName("Purple Travels"); b4.setType("AC Seater"); b4.setSource("Mumbai"); b4.setDestination("Pune");
                b4.setDepartureTime("18:00"); b4.setArrivalTime("21:45"); b4.setPrice(550.0); b4.setTotalSeats(44);
                busService.createBus(b4);
            }
        };
    }
}
