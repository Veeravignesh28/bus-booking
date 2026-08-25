package mca.finalyear.miniproject.backend.controller;

import mca.finalyear.miniproject.backend.dto.BookingResponse;
import mca.finalyear.miniproject.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookingService bookingService;
    private final mca.finalyear.miniproject.backend.service.AuthService authService;
    private final mca.finalyear.miniproject.backend.service.BusService busService;

    public AdminController(BookingService bookingService, mca.finalyear.miniproject.backend.service.AuthService authService, mca.finalyear.miniproject.backend.service.BusService busService) {
        this.bookingService = bookingService;
        this.authService = authService;
        this.busService = busService;
    }

    @PostMapping("/buses")
    public ResponseEntity<mca.finalyear.miniproject.backend.dto.BusResponse> createBus(@RequestBody mca.finalyear.miniproject.backend.dto.BusRequest request) {
        return ResponseEntity.ok(busService.createBus(request));
    }

    @DeleteMapping("/buses/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable String id) {
        busService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<mca.finalyear.miniproject.backend.dto.UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id, Authentication authentication) {
        bookingService.deleteBooking(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
