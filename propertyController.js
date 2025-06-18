const db = require('../config/database');

// Create a new property
exports.createProperty = (req, res) => {
    const usersId = req.user?.id;
  const userType = req.user?.userType;

  // Check user type
  if (!['seller', 'builder'].includes(userType)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: only sellers or builders can post properties'
    });
  }
    const {
        title,
        description,
        price,
        location,
        city,
        state,
        propertyType,
        propertyFor,
        bedrooms,
        bathrooms,
        area,
        latitude,
        longitude,
        userId
    } = req.body;

    if (
        !title || !description || !price || !location || !city || !state ||
        !propertyType || !propertyFor || !bedrooms || !bathrooms || !area ||
        latitude === undefined || longitude === undefined || !userId
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const query = `
        INSERT INTO properties 
        (title, description, price, location, city, state, propertyType, propertyFor, bedrooms, bathrooms, area, latitude, longitude, userId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title, description, price, location, city, state,
        propertyType, propertyFor, bedrooms, bathrooms, area,
        latitude, longitude, userId
    ];

    db.run(query, values, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        res.status(201).json({ success: true, message: 'Property created successfully', propertyId: this.lastID });
    });
};

// Get all properties
exports.getAllProperties = (req, res) => {
    const query = `SELECT * FROM properties`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        res.json({ success: true, properties: rows });
    });
};

// Get property by ID
exports.getPropertyById = (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM properties WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }

        if (!row) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        res.json({ success: true, property: row });
    });
};
