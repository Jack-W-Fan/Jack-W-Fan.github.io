const width = document.getElementById('visualization-container').clientWidth;
const height = document.getElementById('visualization-container').clientHeight;
const svg = d3.select("#visualization-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const dataScene1 = [
    {x: 10, y: 20},
    {x: 40, y: 90},
    {x: 80, y: 50}
];
const dataScene2 = [
    {x: 15, y: 30},
    {x: 50, y: 70},
    {x: 90, y: 40}
];
const dataScene3 = [
    {x: 20, y: 10},
    {x: 60, y: 80},
    {x: 100, y: 60}
];

const xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);
const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

function updateScene(data) {
    svg.selectAll("*").remove();
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
        .text("Data Point 1");
    svg.append("text")
        .attr("x", xScale(data[1].x))
        .attr("y", yScale(data[1].y) - 10)
        .attr("fill", "black")
        .text("Data Point 2");
    svg.append("text")
        .attr("x", xScale(data[2].x))
        .attr("y", yScale(data[2].y) - 10)
        .attr("fill", "black")
        .text("Data Point 3");
}

let currentScene = 1;
document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
        currentScene = (currentScene % 3) + 1;
        switch (currentScene) {
            case 1:
                updateScene(dataScene1);
                break;
            case 2:
                updateScene(dataScene2);
                break;
            case 3:
                updateScene(dataScene3);
                break;
        }
    }
});
updateScene(dataScene1);