-- USERS
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    userType TEXT CHECK(userType IN ('buyer', 'seller', 'broker', 'builder')) NOT NULL,
    verified BOOLEAN DEFAULT 0,
    contactPreference TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PROPERTIES
CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    type TEXT,
    status TEXT CHECK(status IN ('available', 'sold', 'rented')) DEFAULT 'available',
    address TEXT,
    city TEXT,
    state TEXT,
    zipCode TEXT,
    country TEXT,
    latitude REAL,
    longitude REAL,
    userId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- INQUIRIES
CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyId INTEGER,
    userId INTEGER,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (propertyId) REFERENCES properties(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    builderId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (builderId) REFERENCES users(id)
);

-- BROKERS
CREATE TABLE IF NOT EXISTS brokers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    licenseNumber TEXT,
    agencyName TEXT,
    experience INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- PRICES
CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyId INTEGER,
    price INTEGER NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (propertyId) REFERENCES properties(id)
);
