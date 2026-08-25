package mca.finalyear.miniproject.backend.controller;

import mca.finalyear.miniproject.backend.dto.BookingRequest;
import mca.finalyear.miniproject.backend.dto.BookingResponse;
import mca.finalyear.miniproject.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request, Authentication authentication) {
        System.out.println("Received booking request. Date: " + request.getDate() + ", BusId: " + request.getBusId());
        return ResponseEntity.ok(bookingService.createBooking(request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(bookingService.getMyBookings(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        bookingService.deleteBooking(id, email);
        return ResponseEntity.noContent().build();
    }
}
