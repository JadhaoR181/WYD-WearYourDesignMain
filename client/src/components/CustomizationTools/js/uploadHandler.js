document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileToUpload");
    const uploadButton = document.getElementById("uploadButton");

    uploadButton.addEventListener("click", function () {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select an image first.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            // Add image to Fabric.js canvas
            fabric.Image.fromURL(e.target.result, function(img) {
                img.set({
                    left: 100,
                    top: 100,
                    angle: 0,
                    padding: 10,
                    cornersize: 10,
                    hasRotatingPoint: true
                }).scale(0.5); // Adjust scale as needed
                
                canvas.add(img);
                canvas.renderAll();
                canvas.setActiveObject(img);
            });
        };

        reader.readAsDataURL(file);
    });

    // Prevent form submission
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        return false;
    });
});