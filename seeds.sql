-- Seed users
INSERT INTO users (name, email, password, phone, userType, verified, contactPreference)
VALUES
  ('Alice Buyer', 'alice@example.com', 'hashedpassword1', '9999999991', 'buyer', 1, 'email'),
  ('Bob Seller', 'bob@example.com', 'hashedpassword2', '9999999992', 'seller', 1, 'phone'),
  ('Charlie Broker', 'charlie@example.com', 'hashedpassword3', '9999999993', 'broker', 1, 'email'),
  ('Dave Builder', 'dave@example.com', 'hashedpassword4', '9999999994', 'builder', 1, 'email');

-- Seed properties
INSERT INTO properties (title, description, price, type, status, address, city, state, zipCode, country, latitude, longitude, userId)
VALUES
  ('2BHK in Hyderabad', 'Spacious flat near Gachibowli', 5500000, 'apartment', 'available', 'Street 1', 'Hyderabad', 'TS', '500032', 'India', 17.450, 78.380, 2),
  ('Luxury Villa', '5BHK in Banjara Hills', 25000000, 'villa', 'available', 'Banjara Hills', 'Hyderabad', 'TS', '500034', 'India', 17.410, 78.460, 2);

-- Seed inquiries
INSERT INTO inquiries (propertyId, userId, message)
VALUES
  (1, 1, 'I am interested in this property. Please contact me.');

-- Seed projects
INSERT INTO projects (name, description, location, builderId)
VALUES
  ('Dream Heights', 'Gated community project with 2BHK, 3BHK flats', 'Kondapur', 4);

-- Seed brokers
INSERT INTO brokers (userId, licenseNumber, agencyName, experience)
VALUES
  (3, 'BRK12345', 'Skyline Realty', 5);

-- Seed prices
INSERT INTO prices (propertyId, price)
VALUES
  (1, 5500000),
  (2, 25000000);
