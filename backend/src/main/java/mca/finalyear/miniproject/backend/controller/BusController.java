package mca.finalyear.miniproject.backend.controller;

import mca.finalyear.miniproject.backend.dto.BusResponse;
import mca.finalyear.miniproject.backend.service.BusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping
    public ResponseEntity<List<BusResponse>> getBuses(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(busService.getAllBuses(from, to, date));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusResponse> getBusById(
            @PathVariable String id,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(busService.getBusById(id, date));
    }
}
