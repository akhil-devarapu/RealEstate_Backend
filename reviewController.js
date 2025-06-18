// controllers/reviewsController.js
const db = require('../config/database');

exports.submitPropertyReview = (req, res) => {
  const {
    propertyId,
    rating,
    review,
    livingStatus,
    aspects
  } = req.body;

  if (!propertyId || !rating || !review || !livingStatus || !aspects) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const {
    location = null,
    amenities = null,
    connectivity = null,
    maintenance = null
  } = aspects;

  const query = `
    INSERT INTO reviews (
    propertyId,
    rating,
    review,
    livingStatus,
    locationRating,
    amenitiesRating,
    connectivityRating,
    maintenanceRating,
    createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;

  const values = [
  propertyId,
  rating,
  review,
  livingStatus,
  aspects.location,
  aspects.amenities,
  aspects.connectivity,
  aspects.maintenance
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error("Error inserting review:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      reviewId: this.lastID
    });
  });
};
exports.getPropertyReviews = (req, res) => {
  const propertyId = req.params.propertyId;

  const sql = `
    SELECT 
      id,
      propertyId,
      rating,
      review,
      livingStatus,
      locationRating,
      amenitiesRating,
      connectivityRating,
      maintenanceRating,
      createdAt
    FROM reviews
    WHERE propertyId = ?
    ORDER BY createdAt DESC
  `;

  db.all(sql, [propertyId], (err, rows) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
        error: err.message
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found for this property'
      });
    }

    res.json({
      success: true,
      reviews: rows
    });
  });
};