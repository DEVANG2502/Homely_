'use strict';

// Debugging - Ensure Script is Running
console.log("Script Loaded!");

// Function to Load Map
const loadMap = () => {
    console.log("Initializing Map...");

    if (typeof L === "undefined") {
        console.error("Leaflet.js is not loaded!");
        return;
    }

    const map = L.map('map').setView([40.7128, -74.0060], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const properties = [
        { name: "Luxury Apartment", lat: 40.73061, lng: -73.935242, price: "$3,000/mo" },
        { name: "Cozy House", lat: 40.650002, lng: -73.949997, price: "$2,500/mo" },
        { name: "Modern Condo", lat: 40.785091, lng: -73.968285, price: "$4,500/mo" }
    ];

    properties.forEach(property => {
        L.marker([property.lat, property.lng])
            .addTo(map)
            .bindPopup(`<b>${property.name}</b><br>${property.price}`);
    });

    console.log("Map Loaded Successfully!");
};

window.addEventListener("load", loadMap);

// Login System
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (sessionStorage.getItem("loggedIn") === "true" && window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
    }

    if (!sessionStorage.getItem("loggedIn") && window.location.pathname.includes("index.html")) {
        window.location.href = "login.html";
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (username === "login" && password === "123") {
                sessionStorage.setItem("loggedIn", "true");
                window.location.href = "index.html";
            } else {
                alert("Invalid username or password");
            }
        });
    }

    if (sessionStorage.getItem("loggedIn") === "true") {
        if (loginBtn) loginBtn.classList.add("hidden");
        if (logoutBtn) logoutBtn.classList.remove("hidden");
    } else {
        if (loginBtn) loginBtn.classList.remove("hidden");
        if (logoutBtn) logoutBtn.classList.add("hidden");
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("loggedIn");
            alert("Logged out successfully!");
            window.location.href = "login.html";
        });
    }
});

// Fetch & Display Property Listings
document.addEventListener("DOMContentLoaded", async () => {
    const listingsContainer = document.getElementById("listings");

    try {
        const response = await fetch("http://localhost:3000/api/listings");
        const result = await response.json();

        if (result.success && result.listings.length > 0) {
            listingsContainer.innerHTML = ""; // Clear existing content

            result.listings.forEach(listing => {
                const card = document.createElement("div");
                card.classList.add("property-card");

                // ✅ Corrected Image Path
                const imageUrl = (listing.images && listing.images.length > 0) 
                    ? `/uploads/${listing.images[0].split('/').pop()}` 
                    : "default-image.jpg";

                card.innerHTML = `
                    <div class="property-image">
                        <img src="${imageUrl}" alt="Property">
                        <span class="property-status ${listing.type.toLowerCase()}">${listing.type}</span>
                    </div>
                    <div class="property-info">
                        <h3>${listing.title || "Beautiful Apartment"}</h3>
                        <p class="location">📍 ${listing.location}</p>
                        <p class="price">$${listing.price} <span>/ Month</span></p>
                        <p class="description">${listing.description}</p>
                        <div class="property-details">
                            <span>🛏️ ${listing.bedrooms} Bedrooms</span>
                            <span>🛁 ${listing.bathrooms} Bathrooms</span>
                            <span>📏 ${listing.size} sqft</span>
                        </div>
                    </div>
                `;

                listingsContainer.appendChild(card);
            });
        } else {
            listingsContainer.innerHTML = "<p>No listings available.</p>";
        }
    } catch (error) {
        console.error("Error fetching listings:", error);
        listingsContainer.innerHTML = "<p>Failed to load listings.</p>";
    }
});
