package mca.finalyear.miniproject.backend.service;

import mca.finalyear.miniproject.backend.dao.BookingSeatRepository;
import mca.finalyear.miniproject.backend.dao.BusRepository;
import mca.finalyear.miniproject.backend.dao.BusWomenSeatRepository;
import mca.finalyear.miniproject.backend.dto.BusResponse;
import mca.finalyear.miniproject.backend.entity.Booking;
import mca.finalyear.miniproject.backend.entity.BookingSeat;
import mca.finalyear.miniproject.backend.entity.Bus;
import mca.finalyear.miniproject.backend.entity.BusWomenSeat;
import mca.finalyear.miniproject.backend.entity.User;
import mca.finalyear.miniproject.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final BusWomenSeatRepository busWomenSeatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final mca.finalyear.miniproject.backend.dao.UserRepository userRepository;
    private final mca.finalyear.miniproject.backend.dao.BookingRepository bookingRepository;

    public BusService(BusRepository busRepository, BusWomenSeatRepository busWomenSeatRepository, 
                      BookingSeatRepository bookingSeatRepository,
                      mca.finalyear.miniproject.backend.dao.UserRepository userRepository,
                      mca.finalyear.miniproject.backend.dao.BookingRepository bookingRepository) {
        this.busRepository = busRepository;
        this.busWomenSeatRepository = busWomenSeatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<BusResponse> getAllBuses(String from, String to, String date) {
        List<Bus> buses;
        if (from != null && to != null && !from.isEmpty() && !to.isEmpty()) {
            buses = busRepository.findBySourceAndDestination(from, to);
            
            // Dynamic Seeding Logic
            if (buses.size() < 3) {
                int needed = 3 - buses.size();
                String[][] busOptions = {
                    {"KPN Travels", "AC Sleeper"},
                    {"Parveen Travels", "AC Sleeper"},
                    {"SRM Transport", "AC Seater"},
                    {"Rathimeena Travels", "AC Sleeper"},
                    {"SRS Travels", "Volvo Multi-Axle"},
                    {"YBM Travels", "AC Sleeper"},
                    {"National Travels", "AC Seater"},
                    {"Orange Tours & Travels", "AC Sleeper"},
                    {"Kallada Travels", "AC Sleeper"},
                    {"SETC", "Non-AC Seater"},
                    {"TNSTC", "Non-AC Seater"},
                    {"Mettur Super Services", "Non-AC Seater"},
                    {"AJJ Travels", "AC Seater"},
                    {"Vivegam Travels", "AC Sleeper"},
                    {"Universal Travels", "AC Seater"},
                    {"IntrCity SmartBus", "Volvo Multi-Axle"},
                    {"Shama Sardar Travels", "AC Sleeper"},
                    {"JaiSwaraj Travels", "AC Seater"},
                    {"Sri Krishna Travels", "AC Sleeper"},
                    {"No1 Travels", "Non-AC Seater"}
                };
                java.util.Random rand = new java.util.Random();
                
                for (int i = 0; i < needed; i++) {
                    String[] selectedBus = busOptions[rand.nextInt(busOptions.length)];
                    mca.finalyear.miniproject.backend.dto.BusRequest req = new mca.finalyear.miniproject.backend.dto.BusRequest();
                    req.setName(selectedBus[0]);
                    req.setType(selectedBus[1]);
                    req.setSource(from);
                    req.setDestination(to);
                    
                    // Random departure between 06:00 and 22:00
                    int depH = 6 + rand.nextInt(17);
                    int depM = (rand.nextInt(4) * 15);
                    req.setDepartureTime(String.format("%02d:%02d", depH, depM));
                    
                    // Arrival 4-8 hours later
                    int duration = 4 + rand.nextInt(5);
                    int arrH = (depH + duration) % 24;
                    req.setArrivalTime(String.format("%02d:%02d", arrH, depM));
                    
                    req.setPrice(400.0 + (rand.nextInt(12) * 50));
                    req.setTotalSeats(40);
                    
                    createBus(req);
                }
                
                // Re-fetch after generation
                buses = busRepository.findBySourceAndDestination(from, to);
            }
        } else {
            buses = busRepository.findAll();
        }

        LocalDate travelDate = (date != null && !date.isEmpty()) ? LocalDate.parse(date) : LocalDate.now();

        return buses.stream().map(bus -> getBusResponse(bus, travelDate)).collect(Collectors.toList());
    }

    public BusResponse getBusById(String id, String date) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
        LocalDate travelDate = (date != null && !date.isEmpty()) ? LocalDate.parse(date) : LocalDate.now();
        return getBusResponse(bus, travelDate);
    }

    private BusResponse getBusResponse(Bus bus, LocalDate travelDate) {
        List<Integer> womenSeats = busWomenSeatRepository.findByBusId(bus.getId())
                .stream().map(BusWomenSeat::getSeatNumber).collect(Collectors.toList());

        List<Integer> bookedSeats = bookingSeatRepository.findByBusIdAndTravelDate(bus.getId(), travelDate)
                .stream().map(BookingSeat::getSeatNumber).collect(Collectors.toList());

        return new BusResponse(bus, bookedSeats, womenSeats, travelDate.toString());
    }

    public BusResponse createBus(mca.finalyear.miniproject.backend.dto.BusRequest request) {
        Bus bus = new Bus();
        bus.setId("BUS" + System.currentTimeMillis()); // Generate a readable ID
        bus.setName(request.getName());
        bus.setType(request.getType());
        bus.setSource(request.getSource());
        bus.setDestination(request.getDestination());
        bus.setDepartureTime(request.getDepartureTime());
        bus.setArrivalTime(request.getArrivalTime());
        bus.setPrice(request.getPrice());
        bus.setTotalSeats(request.getTotalSeats());

        bus = busRepository.save(bus);

        // Auto-allocate seats 1-4 for women
        for (int i = 1; i <= 4; i++) {
            BusWomenSeat ws = new BusWomenSeat();
            ws.setBusId(bus.getId());
            ws.setSeatNumber(i);
            busWomenSeatRepository.save(ws);
        }

        // Auto-create dummy booking to "lock" seats 5, 6, 7
        User admin = userRepository.findAll().stream().filter(u -> "ROLE_ADMIN".equals(u.getRole())).findFirst().orElse(null);
        if (admin != null) {
            Booking dummyBooking = new Booking();
            dummyBooking.setId("BKG" + System.currentTimeMillis());
            dummyBooking.setUser(admin);
            dummyBooking.setBus(bus);
            dummyBooking.setTravelDate(LocalDate.now());
            dummyBooking.setTotalAmount(bus.getPrice() * 3);
            dummyBooking.setPaymentMethod("SYSTEM_DUMMY");
            dummyBooking.setStatus("SUCCESS");
            dummyBooking.setBookedAt(LocalDateTime.now());
            bookingRepository.save(dummyBooking);

            for (int i = 5; i <= 7; i++) {
                BookingSeat bs = new BookingSeat();
                bs.setBooking(dummyBooking);
                bs.setSeatNumber(i);
                bs.setBusId(bus.getId());
                bs.setTravelDate(LocalDate.now());
                bookingSeatRepository.save(bs);
            }
        }

        return getBusResponse(bus, LocalDate.now());
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteBus(String id) {
        // First delete associated women seats
        List<BusWomenSeat> womenSeats = busWomenSeatRepository.findByBusId(id);
        busWomenSeatRepository.deleteAll(womenSeats);

        // Delete the bus (if there are bookings, it will fail due to foreign key constraints, which is correct)
        busRepository.deleteById(id);
    }
}
