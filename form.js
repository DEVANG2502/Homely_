document.getElementById("property-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const type = document.getElementById("property-type").value;
    const title = document.getElementById("property-title").value;
    const description = document.getElementById("property-description").value;
    const price = document.getElementById("property-price").value;
    const images = document.getElementById("property-images").files;

    const propertyData = {
        type,
        title,
        description,
        price,
        images: []
    };

    for (let i = 0; i < images.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(images[i]);
        reader.onload = function (e) {
            propertyData.images.push(e.target.result);

            if (propertyData.images.length === images.length) {
                localStorage.setItem("propertyListing", JSON.stringify(propertyData));
                window.location.href = "index1.html"; // Redirect to main page
            }
        };
    }
});
