CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (LENGTH(TRIM(name)) > 0),
    quantity NUMERIC NOT NULL
        CHECK (quantity >= 1 AND quantity < 'Infinity'::numeric),
    unit_price NUMERIC(10, 2) NOT NULL
        CHECK (unit_price > 0 AND unit_price < 'Infinity'::numeric)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin'))
);

INSERT INTO items (name, quantity, unit_price)
VALUES
    ('Apple', 5, 1.50),
    ('Rice', 2, 4.25),
    ('Milk', 3, 2.99);