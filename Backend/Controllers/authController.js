
const User = require("../Models/user");

// Register
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.json({ success: true });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
};