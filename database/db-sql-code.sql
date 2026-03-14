-- ============================================================
-- CSE 340 - Database Rebuild File
-- This file recreates the entire database from scratch.
-- ============================================================

-- 1. Create ENUM type for account_type
DROP TYPE IF EXISTS account_type CASCADE;
CREATE TYPE account_type AS ENUM ('Admin', 'Client');

-- 2. Create account table
DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname VARCHAR(50) NOT NULL,
  account_email VARCHAR(100) UNIQUE NOT NULL,
  account_password VARCHAR(200) NOT NULL,
  account_type account_type DEFAULT 'Client'
);

-- 3. Create classification table
DROP TABLE IF EXISTS classification CASCADE;
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

-- 4. Create inventory table
DROP TABLE IF EXISTS inventory CASCADE;
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50) NOT NULL,
  inv_model VARCHAR(50) NOT NULL,
  inv_year INT NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(100) NOT NULL,
  inv_thumbnail VARCHAR(100) NOT NULL,
  inv_price NUMERIC(10,2) NOT NULL,
  inv_miles INT NOT NULL,
  inv_color VARCHAR(20) NOT NULL,
  classification_id INT NOT NULL REFERENCES classification(classification_id)
);

-- 5. Insert classification data
INSERT INTO classification (classification_name)
VALUES
('Sport'),
('SUV'),
('Truck'),
('Sedan'),
('Electric');

-- 6. Insert inventory data
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
VALUES
('GM', 'Hummer', 2012, 'large, powerful, small interiors', '/images/hummer.jpg', '/images/hummer-tn.jpg', 32000, 120000, 'Black', 2),
('Ford', 'Mustang', 2019, 'fast and stylish sports car', '/images/mustang.jpg', '/images/mustang-tn.jpg', 45000, 30000, 'Red', 1),
('Chevrolet', 'Camaro', 2020, 'modern muscle car with great performance', '/images/camaro.jpg', '/images/camaro-tn.jpg', 50000, 15000, 'Yellow', 1),
('Tesla', 'Model S', 2021, 'electric luxury sedan', '/images/models.jpg', '/images/models-tn.jpg', 80000, 5000, 'White', 5),
('Toyota', 'RAV4', 2018, 'reliable compact SUV', '/images/rav4.jpg', '/images/rav4-tn.jpg', 28000, 60000, 'Blue', 2);

-- ============================================================
-- Assignment 2 Required Additions
-- ============================================================

-- Query 4: Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 6: Update image paths to include /vehicles
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
