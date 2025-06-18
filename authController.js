const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// In-memory store for OTPs (replace with Redis/DB in production)
const otpStore = {};

// REGISTER NEW USER
exports.register = (req, res) => {
    const { name, email, password, mobile, userType, city } = req.body;

    if (!name || !email || !password || !mobile || !userType || !city) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `
        INSERT INTO users (name, email, password, mobile, userType, city, isVerified)
        VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    db.run(query, [name, email, hashedPassword, mobile, userType, city], function (err) {
        if (err) {
            console.error('Registration error:', err);
            return res.status(500).json({ success: false, message: 'Registration failed' });
        }

        const token = jwt.sign({ id: this.lastID, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your mobile number.',
            userId: this.lastID,
            token
        });
    });
};

// LOGIN USER
exports.login = (req, res) => {
    const { email, password,isVerified} = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }


    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, user) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                isVerified: user.isVerified === 1
            }
        });
    });
};

// SEND OTP TO MOBILE
exports.sendOtp = (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[mobile] = otp;

    console.log(`OTP for ${mobile}: ${otp}`);
    res.json({ success: true, message: 'OTP sent successfully' });
};

// VERIFY OTP
exports.verifyOtp = (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ success: false, message: 'Mobile and OTP are required' });
    }

    if (otpStore[mobile] && otpStore[mobile] === otp) {
        db.run(`UPDATE users SET isVerified = 1 WHERE mobile = ?`, [mobile], function (err) {
            if (err) {
                console.error('OTP verification error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            delete otpStore[mobile];
            return res.json({ success: true, message: 'Mobile number verified successfully' });
        });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
};
