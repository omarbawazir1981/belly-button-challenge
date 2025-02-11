// Fetch the JSON data and initialize the dashboard
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize the dashboard
function init() {
    d3.json(url).then(data => {
        let dropdown = d3.select("#selDataset");

        // Populate the dropdown with subject IDs
        data.names.forEach(id => {
            dropdown.append("option").text(id).property("value", id);
        });

        // Load the first subject's data
        let firstID = data.names[0];
        buildCharts(firstID);
        buildMetadata(firstID);
    });
}

// Function to update all plots when a new subject is selected
function optionChanged(newID) {
    buildCharts(newID);
    buildMetadata(newID);
}

// Function to build the bar chart and bubble chart
function buildCharts(subjectID) {
    d3.json(url).then(data => {
        let sampleData = data.samples.filter(sample => sample.id === subjectID)[0];

        // Bar Chart (Top 10 OTUs)
        let barData = [{
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        let barLayout = {
            title: "Top 10 OTUs Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Bubble Chart
        let bubbleData = [{
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
        }];

        let bubbleLayout = {
            title: "OTU Distribution",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" },
            hovermode: "closest"
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Function to build metadata panel
function buildMetadata(subjectID) {
    d3.json(url).then(data => {
        let metadata = data.metadata.filter(obj => obj.id == subjectID)[0];
        let metadataPanel = d3.select("#sample-metadata");

        // Clear existing metadata
        metadataPanel.html("");

        // Loop through metadata object and append key-value pairs
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("h5").text(`${key}: ${value}`);
        });
    });
}

// Initialize the dashboard
init();
