

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    btc_balance NUMERIC(18,8) DEFAULT 0.00000000,
    deposit_address VARCHAR(255) UNIQUE
);