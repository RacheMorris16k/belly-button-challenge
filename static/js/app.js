// Build the metadata panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let dropdown = d3.select("#selDataset");
console.log("app.js is connected!");
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.find(obj => obj.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    })
  });
}

// function to build both charts
function buildCharts(sample) {
  // Get the samples field 
  d3.json("samples.json").then((data) => {
   
   
    // Filter the samples for the object with the desired sample number
    let sampleData = data.samples.find(obj => obj.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;
     //For the Bar Chart, map the otu_ids to a list of strings for your yticks
        let barData = [{
          x: sample_values.slice(0, 10).reverse(),
          y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
          text: otu_labels.slice(0, 10).map(label => label.split(";")[0]).reverse(),
          type: "bar",
          orientation: "h"
        }];
    
        let barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: { t: 30, l: 100,r:100 }
        };
     // Render the Bar Chart
        Plotly.newPlot("bar", barData, barLayout);
    
        // BUBBLE CHART
        let bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth",
            line: { color: "black", width: 0.5 },
            opacity: 0.8
          }
        }];
    //Build a Bubble Chart
        let bubbleLayout = {
          title: "Bacteria Cultures per Sample",
          margin: { t: 0},
          xaxis: { title: "OTU ID" },
          yaxis: { title: "Sample Value"  },
          margin: { t: 30 },
          hovermode: "closest"
        };

        // Render the Bubble Chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      });
    }
    // Don't forget to slice and reverse the input data appropriately

// Function to run on page load
function init() {
  d3.json("samples.json").then((data) => {
    const dropdown = d3.select("#selDataset");
    // Get the names field
data.names.forEach((id) => {
  dropdown.append("option")
  .text(id)
  .property("value", id);
});
    // Use d3 to select the dropdown with id of `#selDataset`
  // Use the list of sample names to populate the select options
    let firstSample = data.names[0];
    // Get the first sample from the list
    buildCharts(firstSample);
    // Build charts and metadata panel with the first sample
  buildMetadata(firstSample);

    
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name. 

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();
