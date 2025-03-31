document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#earthquake-table tbody");

    function getMagnitudeClass(magnitude) {
        if (magnitude < 4.0) {
            return "magnitude-low"; // Green for low intensity
        } else if (magnitude >= 4.0 && magnitude < 6.0) {
            return "magnitude-medium"; // Orange for medium intensity
        } else {
            return "magnitude-high"; // Red for high intensity
        }
    }

    function fetchEarthquakeData() {
        fetch("http://127.0.0.1:5000/api/earthquakes")
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = ""; // Clear the table before adding new data
                if (data.error) {
                    tableBody.innerHTML = `<tr><td colspan="3">${data.error}</td></tr>`;
                } else {
                    data.forEach(eq => {
                        const row = document.createElement("tr");
                        const magnitudeClass = getMagnitudeClass(eq.magnitude);
                        row.innerHTML = `
                            <td class="${magnitudeClass}">${eq.magnitude}</td>
                            <td>${eq.place}</td>
                            <td>${new Date(eq.time).toLocaleString()}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                tableBody.innerHTML = `<tr><td colspan="3">Error fetching data</td></tr>`;
                console.error("Error:", error);
            });
    }

    // Fetch data immediately on page load
    fetchEarthquakeData();

    // Set interval to refresh data every 1 minute
    setInterval(fetchEarthquakeData, 60000);
});
