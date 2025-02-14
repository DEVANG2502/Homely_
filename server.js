const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

const USERS_FILE = "./users.json";

// ✅ Ensure users.json Exists
if (!fs.existsSync(USERS_FILE) || fs.readFileSync(USERS_FILE, "utf8").trim() === "") {
    console.log("🟡 Creating default users.json...");
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [], loggedInUsers: [] }, null, 2));
}

// ✅ Utility Functions
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf8").trim();
        return data ? JSON.parse(data) : { users: [], loggedInUsers: [] };
    } catch (error) {
        console.error("❌ Error reading users.json:", error);
        return { users: [], loggedInUsers: [] };
    }
};

const writeUsers = (data) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), "utf8");
        console.log("✅ Successfully wrote to users.json");
    } catch (error) {
        console.error("❌ Error writing to users.json:", error);
    }
};

// ✅ Signup API (Stores Users in JSON)
app.post("/api/signup", (req, res) => {
    const usersData = readUsers();
    if (!usersData.users) usersData.users = [];
    if (!usersData.loggedInUsers) usersData.loggedInUsers = [];

    const { name, email, age, gender, education } = req.body;

    if (!name || !email || !age || !gender || !education) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    // ✅ Prevent duplicate signups
    if (usersData.users.some(user => user.email === email)) {
        return res.status(400).json({ success: false, message: "Email already registered. Please log in." });
    }

    const newUser = { id: usersData.users.length + 1, name, email, age, gender, education };

    // ✅ Save new user to `users.json`
    usersData.users.push(newUser);
    console.log("🟢 Adding new user:", newUser);
    writeUsers(usersData);

    res.status(201).json({ success: true, message: "Signup successful! Please log in.", redirect: "/index.html" });
});

// ✅ Login API (No New User Addition)
app.post("/api/login", (req, res) => {
    const usersData = readUsers();
    if (!usersData.users) usersData.users = [];
    if (!usersData.loggedInUsers) usersData.loggedInUsers = [];

    const { email } = req.body;

    // ✅ Check if email exists in users.json
    const user = usersData.users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found. Please sign up." });
    }

    // ✅ Only add user to `loggedInUsers` if not already logged in
    if (!usersData.loggedInUsers.some(u => u.email === email)) {
        usersData.loggedInUsers.push(user);
        writeUsers(usersData);
    }

    res.json({ success: true, message: "Login successful!", redirect: "/index1.html" });
});

// ✅ Logout API
app.post("/api/logout", (req, res) => {
    const usersData = readUsers();
    if (!usersData.loggedInUsers) usersData.loggedInUsers = [];

    const { email } = req.body;
    usersData.loggedInUsers = usersData.loggedInUsers.filter(u => u.email !== email);
    writeUsers(usersData);

    res.json({ success: true, message: "Logged out successfully" });
});

// ✅ Serve Landing Page
app.get("/landing", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landing.html"));
});

// ✅ Redirect Logged-in Users to index1.html
app.get("/index1.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index1.html"));
});

// ✅ Start Server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});


//


// /* -------------------------------------------
//    ✅ PROPERTY LISTING ROUTES
// ------------------------------------------- */

// // ✅ Add New Listing
// app.post("/api/listings", upload.array("images", 5), (req, res) => {
//     let listings = JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf8")).listings;
    
//     const { type, price, location, bedrooms, bathrooms, size, description, agent } = req.body;

//     if (!type || !price || !location || !bedrooms || !bathrooms || !size || !description || !agent) {
//         return res.status(400).json({ success: false, message: "All fields are required!" });
//     }

//     const newListing = {
//         id: listings.length + 1,
//         type,
//         price,
//         location,
//         bedrooms,
//         bathrooms,
//         size,
//         description,
//         agent,
//         images: req.files.map(file => file.filename)
//     };

//     listings.push(newListing);
//     fs.writeFileSync(LISTINGS_FILE, JSON.stringify({ listings }, null, 2));

//     res.status(201).json({ success: true, message: "Listing added successfully!", listing: newListing });
// });

// // ✅ Get All Listings
// app.get("/api/listings", (req, res) => {
//     try {
//         let listings = JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf8")).listings;
//         res.json({ success: true, listings });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error retrieving listings." });
//     }
// });

// /* -------------------------------------------
//    ✅ START SERVER
// ------------------------------------------- */

// app.listen(3000, () => {
//     console.log("🚀 Server running on http://localhost:3000");
// });
