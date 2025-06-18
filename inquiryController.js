const db = require('../config/database');
// controllers/inquiryController.js
exports.sendInquiry = (req, res) => {
  const { propertyId, message, contactTime, isLoanRequired } = req.body;
  const user = req.user;

  // Check if the user is authenticated and is a buyer
  if (!user || user.userType !== 'buyer') {
    return res.status(403).json({ success: false, message: 'Only buyers can send inquiries' });
  }

  if (!propertyId || !message || !contactTime) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const query = `
      INSERT INTO inquiries (userId, propertyId, message, contactTime, isLoanRequired)
      VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [user.id, propertyId, message, contactTime, isLoanRequired ? 1 : 0], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to send inquiry' });
    }

    const inquiryId = this.lastID;

    // Fetch seller contact info from properties table
    db.get(`SELECT u.name, u.mobile FROM users u
            JOIN properties p ON p.userId = u.id
            WHERE p.id = ?`, [propertyId], (err, seller) => {
      if (err || !seller) {
        return res.status(500).json({
          success: false,
          message: 'Inquiry saved but failed to fetch seller info',
        });
      }

      const maskedPhone = seller.mobile.replace(/(\d{5})\d{5}/, '$1XXXXX');

      res.status(201).json({
        success: true,
        message: 'Inquiry sent successfully',
        inquiryId,
        sellerContact: {
          name: seller.name,
          phone: maskedPhone,
          showFullContact: false
        }
      });
    });
  });
};



// controllers/inquiryController.js

exports.scheduleVisit = (req, res) => {
    const propertyId = req.params.id;
    const { userId, preferredDate, preferredTime, message } = req.body;

    if (!userId || !propertyId || !preferredDate || !preferredTime) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const query = `
        INSERT INTO inquiries (userId, propertyId, message, contactTime, isLoanRequired, preferredDate, preferredTime, type)
        VALUES (?, ?, ?, ?, 0, ?, ?, 'visit')
    `;

    db.run(query, [userId, propertyId, message || '', preferredTime, preferredDate, preferredTime], function (err) {
        if (err) {
            console.error('Visit Schedule Error:', err);
            return res.status(500).json({ success: false, message: 'Failed to schedule visit' });
        }

        res.json({
            success: true,
            message: 'Visit scheduled successfully',
            visitId: this.lastID
        });
    });
};

// Get all inquiries made by the logged-in user
exports.getMyInquiries = (req, res) => {
  const userId = req.user?.id || 1; // Replace with middleware when ready

  const sql = `
    SELECT i.id AS inquiryId, i.message, i.contactTime, i.isLoanRequired,
           i.preferredDate, i.preferredTime, i.type,
           p.id AS propertyId, p.title, p.location, p.price
    FROM inquiries i
    JOIN properties p ON i.propertyId = p.id
    WHERE i.userId = ?
    ORDER BY i.id DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching inquiries:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
    }

    res.json({
      success: true,
      inquiries: rows
    });
  });
};
