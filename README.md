# 🏠 Real Estate Backend API

A comprehensive backend API for a real estate platform built with **Node.js**, **Express**, and **SQLite**. It supports user registration, property listings, inquiries, favorites, projects, reviews, alerts, price trends, broker and admin dashboards, and authentication with role-based access.

---

## 🚀 Features

- User authentication with role-based access (`buyer`, `seller`, `broker`, `builder`, `admin`)
- Property listing and searching
- Inquiries and site visits
- Favorites and property comparisons
- Builder projects and unit details
- Price trends and home loan calculator
- Broker registration and search
- Property reviews and ratings
- Alerts and notifications
- Admin-only verification and reports
- Seller dashboard and lead management

---

## 🛠 Tech Stack

- Node.js + Express.js
- SQLite (with `sqlite3` npm package)
- JWT for authentication
- Bcrypt for password hashing
- Postman for API testing

---

## 🔐 Authentication

- JWT-based
- Stored in `Authorization: Bearer <token>` header
- Auth middleware: `/middleware/auth.js`
- Role checks for routes (e.g., seller-only, admin-only)

---



