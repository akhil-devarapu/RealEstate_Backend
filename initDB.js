const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Connect to database
const dbPath = path.join(dataDir, 'real_estate.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to database', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      mobile TEXT,
      userType TEXT CHECK(userType IN ('buyer', 'seller', 'broker')) NOT NULL,
      city TEXT,
      isVerified INTEGER DEFAULT 0
    )
  `, )
  db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    price INTEGER,
    location TEXT,
    city TEXT,
    state TEXT,
    propertyType TEXT,
    propertyFor TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area REAL,
    latitude REAL,
    longitude REAL,
    userId INTEGER
)
`,)
db.run(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    propertyId INTEGER,
    message TEXT,
    contactTime TEXT,
    isLoanRequired INTEGER DEFAULT 0,
    preferredDate TEXT,
    preferredTime TEXT,
    type TEXT DEFAULT 'inquiry',
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(propertyId) REFERENCES properties(id)
  );
;`)
db.run(`CREATE TABLE IF NOT EXISTS site_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    propertyId INTEGER,
    preferredDate TEXT,
    preferredTime TEXT,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);`,)
db.run(`CREATE TABLE  IF NOT EXISTS favorites(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    propertyId INTEGER,
    UNIQUE(userId, propertyId)
);`,)
db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectName TEXT,
    builderName TEXT,
    projectType TEXT,
    location TEXT,
    projectDetails TEXT,
    unitTypes TEXT,
    amenities TEXT,
    approvals TEXT,
    specifications TEXT
);`,)
db.run(`CREATE TABLE IF NOT EXISTS price_trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    locality TEXT,
    propertyType TEXT,
    currentAvgPrice REAL,
    priceChangePercentage REAL,
    priceChangeDirection TEXT,
    forecastNextQuarter TEXT,
    forecastRecommendation TEXT
);`,)
db.run(`CREATE TABLE IF NOT EXISTS brokers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firmName TEXT NOT NULL,
    reraNumber TEXT NOT NULL UNIQUE,
    experience INTEGER,
    specialization TEXT,         
    description TEXT,
    rating REAL DEFAULT 0        
);
`,)
db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyId INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    livingStatus TEXT CHECK (livingStatus IN ('currently_living', 'previously_lived', 'visited')),
    locationRating INTEGER CHECK (locationRating BETWEEN 1 AND 5),
    amenitiesRating INTEGER CHECK (amenitiesRating BETWEEN 1 AND 5),
    connectivityRating INTEGER CHECK (connectivityRating BETWEEN 1 AND 5),
    maintenanceRating INTEGER CHECK (maintenanceRating BETWEEN 1 AND 5),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`,)
db.run(`CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  propertyFor TEXT,
  propertyType TEXT,
  city TEXT,
  localities TEXT,          
  bedrooms TEXT,          
  budgetMax INTEGER,
  frequency TEXT CHECK(frequency IN ('instant', 'daily', 'weekly')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)
db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );`)
});

// Helper to log result of each table creation
function logResult(table) {
  return (err) => {
    if (err) {
      console.error(`❌ Error creating ${table} table:`, err.message);
    } else {
      console.log(`✅ ${table} table created`);
    }
  };
}
