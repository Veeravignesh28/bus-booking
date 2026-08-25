-- Seed Buses
INSERT INTO buses (id, name, type, source, destination, departure_time, arrival_time, price, total_seats) VALUES
('1', 'KPN Travels', 'AC Sleeper', 'Tirunelveli', 'Coimbatore', '21:00', '05:00', 650, 40),
('2', 'SRS Travels', 'AC Seater', 'Chennai', 'Coimbatore', '22:30', '06:30', 450, 40),
('3', 'Parveen Travels', 'Non-AC Seater', 'Chennai', 'Coimbatore', '20:00', '04:30', 300, 40),
('4', 'Orange Travels', 'AC Sleeper', 'Chennai', 'Bangalore', '22:00', '05:30', 750, 40),
('5', 'VRL Travels', 'Non-AC Sleeper', 'Bangalore', 'Chennai', '19:00', '03:00', 400, 40);

-- Seed Women Seats
INSERT INTO bus_women_seats (bus_id, seat_number) VALUES
('1', 1), ('1', 2), ('1', 3), ('1', 4),
('2', 1), ('2', 2), ('2', 3), ('2', 4),
('3', 1), ('3', 2), ('3', 3), ('3', 4),
('4', 1), ('4', 2), ('4', 3), ('4', 4),
('5', 1), ('5', 2), ('5', 3), ('5', 4);

-- Seed Admin User (Password is 'admin123' bcrypt hashed)
INSERT INTO users (id, name, email, password, age, contact, role) VALUES
('admin-001', 'Admin User', 'admin@busbooking.com', '$2a$10$yZ6Yd.sYtK/9v/N0VlP3e.35xV/9Q6yP9x/K9Y/z3x/qQ/Vz9Q9/2', '30', '9999999999', 'ROLE_ADMIN');
