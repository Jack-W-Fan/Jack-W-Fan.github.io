const width = document.getElementById('visualization-container').clientWidth;
const height = document.getElementById('visualization-container').clientHeight - 50;  // Adjust for padding

const svg = d3.select("#visualization-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv('MSPUS_processed.csv').then(data => {
    data.forEach(d => {
        d.DATE = new Date(d.DATE);
        d.MSPUS = +d.MSPUS;
    });

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.DATE))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.MSPUS)])
        .range([height, 0]);

    const line = d3.line()
        .x(d => xScale(d.DATE))
        .y(d => yScale(d.MSPUS));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    const annotationsScene1 = [
        {date: '1963-01-01', text: 'Overall increase over 60 years'},
        {date: '2023-01-01', text: 'Significant rise in 2020s'}
    ];

    const annotationsScene2 = [
        {date: '2008-01-01', text: '2008 Financial Crisis'},
        {date: '2010-01-01', text: 'Post-crisis recovery'}
    ];

    const annotationsScene3 = [
        {date: '2020-01-01', text: 'COVID-19 starts'},
        {date: '2022-01-01', text: 'Significant rise post-COVID'}
    ];

    function addAnnotations(annotations) {
        svg.selectAll(".annotation").remove();

        annotations.forEach(annotation => {
            const x = xScale(new Date(annotation.date));
            const y = yScale(data.find(d => d.DATE.getFullYear() === new Date(annotation.date).getFullYear()).MSPUS);

            svg.append("text")
                .attr("class", "annotation")
                .attr("x", x)
                .attr("y", y - 10)
                .attr("fill", "black")
                .text(annotation.text);
        });
    }

    let currentScene = 1;
    document.addEventListener("keydown", event => {
        if (event.key === "ArrowRight") {
            currentScene = (currentScene % 3) + 1;
            switch (currentScene) {
                case 1:
                    addAnnotations(annotationsScene1);
                    break;
                case 2:
                    addAnnotations(annotationsScene2);
                    break;
                case 3:
                    addAnnotations(annotationsScene3);
                    break;
            }
        }
    });
    addAnnotations(annotationsScene1);
});