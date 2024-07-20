const width = document.getElementById('visualization-container').clientWidth;
const height = document.getElementById('visualization-container').clientHeight;

// Create an SVG element
const svg = d3.select("#visualization-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Example data (replace with your actual data)
const data = [
    {x: 10, y: 20},
    {x: 40, y: 90},
    {x: 80, y: 50}
];

// Create scales
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height, 0]);

// Create circles for each data point
svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 5)
    .attr("fill", "blue");

svg.append("text")
    .attr("x", xScale(data[0].x))
    .attr("y", yScale(data[0].y) - 10)
    .attr("fill", "black")
    .text("First point");

let currentScene = 1;

document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
        currentScene = (currentScene % 3) + 1;
        updateScene(currentScene);
    }
});

function updateScene(scene) {
    svg.selectAll("*").remove();
    switch (scene) {
        case 1:
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 5)
                .attr("fill", "blue");
            break;
        case 2:

            break;
        case 3:

            break;
    }
}

updateScene(currentScene);