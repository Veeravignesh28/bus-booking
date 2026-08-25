CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age VARCHAR(10),
    contact VARCHAR(20),
    role VARCHAR(50) NOT NULL
);

CREATE TABLE buses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_time VARCHAR(50),
    arrival_time VARCHAR(50),
    price DOUBLE PRECISION NOT NULL,
    total_seats INTEGER NOT NULL
);

CREATE TABLE bus_women_seats (
    id SERIAL PRIMARY KEY,
    bus_id VARCHAR(255) NOT NULL,
    seat_number INTEGER NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    bus_id VARCHAR(255) NOT NULL,
    travel_date DATE NOT NULL,
    total_amount DOUBLE PRECISION,
    payment_method VARCHAR(50),
    status VARCHAR(50),
    booked_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

CREATE TABLE booking_seats (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(255) NOT NULL,
    seat_number INTEGER NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Constraint to prevent double booking on the same bus, travel_date, and seat_number
-- We can enforce this with a unique index by joining the booking context.
-- Actually, it's better to store bus_id and travel_date in booking_seats or just rely on a unique constraint if we denormalize,
-- but since they are in bookings, we can create a unique index on a view, or denormalize bus_id and travel_date to booking_seats for strict DB-level constraint.
ALTER TABLE booking_seats ADD COLUMN bus_id VARCHAR(255) NOT NULL;
ALTER TABLE booking_seats ADD COLUMN travel_date DATE NOT NULL;
ALTER TABLE booking_seats ADD CONSTRAINT unique_bus_date_seat UNIQUE (bus_id, travel_date, seat_number);

CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    contact VARCHAR(50),
    gender VARCHAR(20),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
