const weights = {
    energy_density: 0.05, cetane_number: 0.05, octane_number: 0.05, flash_point: 0.05,
    viscosity: 0.05, sulfur_content: 0.1, thermal_efficiency: 0.05, carbon_intensity: 0.15,
    feedstock_sourcing: 0.05, water_usage: 0.05, blending_ratio: 0.05, carbon_footprint: 0.15,
    EROI: 0.05, co2_emissions: 0.05, nox_emissions: 0.05, pm_emissions: 0.05,
    co_emissions: 0.05, ch4_emissions: 0.05
};

// Updated thresholds for normalization
const normalizationThresholds = {
    5: 4.45,
    10: 8.3,
    15: 12.4  // Changed back to 12.4 from 12.475
};

const standards = {
    energy_density: 42.8, cetane_number: 55, octane_number: 90, flash_point: 38,
    viscosity: 1.5, sulfur_content: 15, thermal_efficiency: 30, carbon_intensity: 20,
    feedstock_sourcing: 8, water_usage: 3, blending_ratio: 50, carbon_footprint: 50,
    EROI: 10, co2_emissions: 80, nox_emissions: 10, pm_emissions: 0.01,
    co_emissions: 0.2, ch4_emissions: 0.005
};

// New constant for weight percentages for the table
const weightPercentages = {
    energy_density: 4.45, cetane_number: 4.45, octane_number: 4.45, flash_point: 4.45,
    viscosity: 4.45, sulfur_content: 8.45, thermal_efficiency: 4.45, carbon_intensity: 12.4,  // Changed back to 12.4
    feedstock_sourcing: 4.45, water_usage: 4.45, blending_ratio: 4.45, carbon_footprint: 12.4,  // Changed back to 12.4
    EROI: 4.45, co2_emissions: 4.45, nox_emissions: 4.45, pm_emissions: 4.45,
    co_emissions: 4.45, ch4_emissions: 4.45
};

// Normalize function with updated thresholds
function normalize(value, standard, weight) {
    let threshold;
    if (weight === 5) threshold = normalizationThresholds[5];
    else if (weight === 10) threshold = normalizationThresholds[10];
    else if (weight === 15) threshold = normalizationThresholds[15];
    else threshold = 10;  // default threshold for other cases

    let normalized = Math.min(threshold, Math.max(0, ((value / standard) * threshold))) * weight;
    return normalized;
}

function calculateScore() {
    let score = 0;
    let comparisonData = '';
    const normalizedScores = [];
    const labels = [];

    // Function to handle subscripts in chemical formulas
    function subscriptChemicalName(name) {
        return name.replace(/([A-Za-z]+)(\d+)/g, '$1<sub>$2</sub>');
    }

    // Function to capitalize the first letter of each word in the parameter name
    function capitalizeParameterName(name) {
        return name.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    for (let param in weights) {
        const userValue = parseFloat(document.getElementById(param).value);
        const normalized = normalize(userValue, standards[param], weights[param]);
        score += normalized;

        // Store data for pie chart
        normalizedScores.push(normalized);
        labels.push(capitalizeParameterName(param.replace('_', ' ')));

        // Adjust chemical names to display with subscripts for CO2, NOx, CH4, etc.
        let paramName = param.replace('_', ' ');
        paramName = subscriptChemicalName(paramName);

        // Capitalize the parameter name
        paramName = capitalizeParameterName(paramName);

        // Update HTML for comparison table with weight percentages
        comparisonData += `<tr><td>${paramName}</td><td>${userValue}</td><td>${standards[param]}</td><td>${weightPercentages[param]}%</td></tr>`;
    }

    document.getElementById('sustainabilityScore').textContent = score.toFixed(2);
    document.getElementById('comparisonTable').innerHTML = comparisonData;
    document.getElementById('scoreDisplay').style.display = 'block';
    document.getElementById('results').style.display = 'block';

    // Draw the pie chart with normalized scores
    drawPieChart(labels, Object.values(weightPercentages));
}


function drawPieChart(labels, data) {
    const ctx = document.getElementById('normalizedScoreChart')?.getContext('2d');
    if (!ctx) {
        console.error("Canvas element with ID 'normalizedScoresChart' not found.");
        return;
    }

    // Destroy the previous chart instance if it exists to avoid duplicate charts
    if (window.normalizedScoresChart) {
        window.normalizedScoresChart.destroy();
    }

    window.normalizedScoresChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: "Parameter Contribution",
                data: data,
                backgroundColor: [
                    '#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#95A5A6',
                    '#7B7D7D', '#4D5656', '#5D6D7E', '#839192', '#ABB2B9',
                    '#616A6B', '#566573', '#2E4053', '#1C2833', '#AAB7B8',
                    '#909497', '#4D5656', '#2C3E50'
                ]
            }]
        },
        options: {
            responsive: true,
            
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            
            
        }
    });
}

