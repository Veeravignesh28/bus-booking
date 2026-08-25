package mca.finalyear.miniproject.backend.service;

import mca.finalyear.miniproject.backend.dao.UserRepository;
import mca.finalyear.miniproject.backend.dto.AuthResponse;
import mca.finalyear.miniproject.backend.dto.LoginRequest;
import mca.finalyear.miniproject.backend.dto.RegisterRequest;
import mca.finalyear.miniproject.backend.dto.UserResponse;
import mca.finalyear.miniproject.backend.entity.User;
import mca.finalyear.miniproject.backend.exception.BadRequestException;
import mca.finalyear.miniproject.backend.security.CustomUserDetails;
import mca.finalyear.miniproject.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAge(request.getAge());
        user.setContact(request.getContact());
        user.setRole("ROLE_USER");

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(new CustomUserDetails(user));
        return new AuthResponse(jwtToken, new UserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String jwtToken = jwtService.generateToken(new CustomUserDetails(user));
        return new AuthResponse(jwtToken, new UserResponse(user));
    }

    public java.util.List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserResponse::new).toList();
    }
}
