package mca.finalyear.miniproject.backend.controller;

import mca.finalyear.miniproject.backend.dto.AuthResponse;
import mca.finalyear.miniproject.backend.dto.LoginRequest;
import mca.finalyear.miniproject.backend.dto.RegisterRequest;
import mca.finalyear.miniproject.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
