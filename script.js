document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#earthquake-table tbody");

    // Dictionary for manual translation
    const translationDictionary = {
        "Yangon": "ရန်ကုန်",
        "Mandalay": "မန္တလေး",
        "Nay Pyi Taw": "နေပြည်တော်",
        "Bago": "ပဲခူး",
        "Pathein": "ပုသိမ်",
        "Taunggyi": "တောင်ကြီး",
        "Myitkyina": "မြစ်ကြီးနား",
        "Sittwe": "စစ်တွေ",
        "Mawlamyine": "မော်လမြိုင်",
        "Magway": "မကွေး",
        "Pyay": "ပြည်",
        "Dawei": "ထားဝယ်",
        "Myeik": "မြိတ်",
        "Hpa-An": "ဘားအံ",
        "Kyaukphyu": "ကျောက်ဖြူ",
        "Lashio": "လားရှိုး",
        "Tachileik": "တာချီလိတ်",
        "Kyaikto": "ကျိုက်ထို",
        "Kyaikmaraw": "ကျိုက်မရော",
        "Mongla": "မောင်လား",
        "Myawaddy": "မြဝတီ",
        "Kawthoung": "ကော့သောင်း",
        "Kachin": "ကချင်",
        "Kayah": "ကရင်",
        "Kayin": "ကရင်",
        "Chin": "ချင်း",
        "Mon": "မွန်",
        "Rakhine": "ရခိုင်",
        "Shan": "ရှမ်း",
        "Sagaing": "စစ်ကိုင်း",
        "Shwebo": "ရွှေဘို",
        "Monywa": "မုံရွာ",
        "Yamein": "ရမ်းမန်း",
        "Katha": "ကသာ",
        "Pyi": "ပြည်",
        "Loikaw": "လိုင်ကော်",
        "Taungoo": "တောင်ငူ",
        "Hinthada": "ဟင်္သာတ",
        "Pyinmana": "ပြင်မနား",
        "MawLamyine": "မော်လမြိုင်",
        "Yamethin": "ရမ်းမန်း",
        "Burma": "မြန်မာ",
        "km": "ကီလိုမီတာ",
        "N": "မြောက်ပိုင်း",
        "S": "တောင်ပိုင်း",
        "E": "အရှေ့ပိုင်း",
        "W": "အနောက်ပိုင်း",
        "of": "",
        // Add more translations as needed
    };

    function translateManually(text) {
        // Replace entire phrases or words directly using the dictionary
        for (const [key, value] of Object.entries(translationDictionary)) {
            const regex = new RegExp(`\\b${key}\\b`, "gi"); // Match whole words, case-insensitive
            text = text.replace(regex, value);
        }
        return text;
    }

    function getMagnitudeClass(magnitude) {
        if (magnitude < 4.0) {
            return "magnitude-low"; // Green for low intensity
        } else if (magnitude >= 4.0 && magnitude < 6.0) {
            return "magnitude-medium"; // Orange for medium intensity
        } else {
            return "magnitude-high"; // Red for high intensity
        }
    }

    const fetchEarthquakeData = async () => {
        const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=1.0&minlongitude=92&maxlongitude=101&minlatitude=9&maxlatitude=29";
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log(data.features); // Process the earthquake data here
                tableBody.innerHTML = ""; // Clear the table before adding new data
                if (data.features.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="3">No earthquake data available</td></tr>`;
                } else {
                    for (const feature of data.features) {
                        const eq = feature.properties;
                        const translatedPlace = translateManually(eq.place); // Manually translate place name
                        const row = document.createElement("tr");
                        const magnitudeClass = getMagnitudeClass(eq.mag);
                        row.innerHTML = `
                            <td>${translatedPlace}</td>
                            <td class="${magnitudeClass}">${eq.mag}</td>
                            <td>${new Date(eq.time).toLocaleString()}</td>
                        `;
                        tableBody.appendChild(row);
                    }
                }
            } else {
                console.error("Error fetching data from USGS:", response.status);
                tableBody.innerHTML = `<tr><td colspan="3">Error fetching data</td></tr>`;
            }
        } catch (error) {
            console.error("Error:", error);
            tableBody.innerHTML = `<tr><td colspan="3">Error fetching data</td></tr>`;
        }
    };

    // Fetch data immediately on page load
    fetchEarthquakeData();

    // Set interval to refresh data every 1 minute
    setInterval(fetchEarthquakeData, 60000);
});
