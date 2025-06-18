const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Admin Registration
exports.registerAdmin = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Admin registration failed' });
    }
    return res.status(201).json({ success: true, message: 'Admin registered successfully', adminId: this.lastID });
  });
};

// Admin Login
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM admins WHERE email = ?`, [email], (err, admin) => {
    if (err || !admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, message: 'Login successful', token });
  });
};

exports.verifyProperty = (req, res) => {
  const propertyId = req.params.id;

  const sql = `UPDATE properties SET verified = 1 WHERE id = ?`;

  db.run(sql, [propertyId], function (err) {
    if (err) {
      console.error("Error verifying property:", err.message);
      return res.status(500).json({ success: false, message: "Failed to verify property" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    return res.json({ success: true, message: "Property verified successfully" });
  });
};
exports.getListingReports = (req, res) => {
  const sql = `
    SELECT p.*, u.name as ownerName, u.email 
    FROM properties p
    JOIN users u ON p.userId = u.id
    
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching listing reports:", err.message);
      return res.status(500).json({ success: false, message: "Failed to get reports" });
    }

    return res.json({ success: true, listings: rows });
  });
};
