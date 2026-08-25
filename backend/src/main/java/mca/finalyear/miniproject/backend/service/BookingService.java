package mca.finalyear.miniproject.backend.service;

import mca.finalyear.miniproject.backend.dao.*;
import mca.finalyear.miniproject.backend.dto.BookingRequest;
import mca.finalyear.miniproject.backend.dto.BookingResponse;
import mca.finalyear.miniproject.backend.dto.PassengerRequest;
import mca.finalyear.miniproject.backend.entity.*;
import mca.finalyear.miniproject.backend.exception.BadRequestException;
import mca.finalyear.miniproject.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final PassengerRepository passengerRepository;
    private final BusRepository busRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, BookingSeatRepository bookingSeatRepository,
                          PassengerRepository passengerRepository, BusRepository busRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.passengerRepository = passengerRepository;
        this.busRepository = busRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        LocalDate parsedDate = request.getDate() != null ? LocalDate.parse(request.getDate()) : LocalDate.now();

        // Validate double booking
        for (Integer seatNumber : request.getSeats()) {
            boolean exists = bookingSeatRepository.existsByBusIdAndTravelDateAndSeatNumber(
                    bus.getId(), parsedDate, seatNumber);
            if (exists) {
                throw new BadRequestException("Seat " + seatNumber + " is already booked for this date.");
            }
        }

        // Validate total amount
        double expectedTotal = bus.getPrice() * request.getSeats().size();
        if (Math.abs(expectedTotal - request.getTotal()) > 0.01) {
            throw new BadRequestException("Invalid total amount. Expected: " + expectedTotal);
        }

        // Create booking
        Booking booking = new Booking();
        booking.setId("BK" + System.currentTimeMillis()); // Or UUID
        booking.setUser(user);
        booking.setBus(bus);
        booking.setTravelDate(parsedDate);
        booking.setTotalAmount(expectedTotal);
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setStatus("SUCCESS");
        booking.setBookedAt(LocalDateTime.now());
        booking = bookingRepository.save(booking);

        // Save seats
        for (Integer seatNumber : request.getSeats()) {
            BookingSeat seat = new BookingSeat();
            seat.setBooking(booking);
            seat.setBusId(bus.getId());
            seat.setTravelDate(parsedDate);
            seat.setSeatNumber(seatNumber);
            bookingSeatRepository.save(seat);
        }

        // Save passenger
        Passenger passenger = new Passenger();
        passenger.setBooking(booking);
        passenger.setName(request.getPassenger().getName());
        passenger.setEmail(request.getPassenger().getEmail());
        passenger.setContact(request.getPassenger().getContact());
        passenger.setGender(request.getPassenger().getGender());
        passengerRepository.save(passenger);

        return new BookingResponse(booking, request.getSeats(), request.getPassenger());
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Booking> bookings = bookingRepository.findByUser(user);

        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteBooking(String bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        User requestingUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!booking.getUser().getEmail().equals(userEmail) && !requestingUser.getRole().equals("ROLE_ADMIN")) {
            throw new BadRequestException("You can only delete your own bookings");
        }

        bookingRepository.delete(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        List<Integer> seats = bookingSeatRepository.findByBusIdAndTravelDate(booking.getBus().getId(), booking.getTravelDate())
                .stream()
                .filter(s -> s.getBooking().getId().equals(booking.getId()))
                .map(BookingSeat::getSeatNumber)
                .collect(Collectors.toList());

        Passenger passenger = passengerRepository.findByBooking(booking).orElse(new Passenger());
        PassengerRequest passengerRequest = new PassengerRequest();
        passengerRequest.setName(passenger.getName());
        passengerRequest.setEmail(passenger.getEmail());
        passengerRequest.setContact(passenger.getContact());
        passengerRequest.setGender(passenger.getGender());

        return new BookingResponse(booking, seats, passengerRequest);
    }
}
