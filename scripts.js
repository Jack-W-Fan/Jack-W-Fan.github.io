const width = document.getElementById('visualization-container').clientWidth;
const height = 500;
const padding = 80;

const svg = d3.select("#visualization-container")
    .append("svg")
    .attr("width", width + padding)
    .attr("height", height + padding)
    .append("g")
    .attr("transform", `translate(${padding / 2}, ${padding / 2})`);

d3.csv('MSPUS_processed.csv').then(data => {
    data.forEach(d => {
        d.DATE = new Date(d.DATE);
        d.MSPUS = +d.MSPUS;
    });

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.DATE))
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.MSPUS)])
        .range([height - 50, 50]);

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
        .attr("transform", `translate(0, ${height - 50})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(yAxis);

    const annotationsScene1 = [
        { date: '1963-01-01', text: 'Overall increase over 60 years', direction: 'upright' },
        { date: '2023-01-01', text: 'Significant rise in 2020s', direction: 'left' }
    ];

    const annotationsScene2 = [
        { date: '2008-01-01', text: '2008 Financial Crisis', direction: 'upleft' },
        { date: '2010-01-01', text: 'Post-crisis recovery', direction: 'down' }
    ];

    const annotationsScene3 = [
        { date: '2020-01-01', text: 'COVID-19 starts', direction: 'left' },
        { date: '2022-01-01', text: 'Significant rise post-COVID', direction: 'left' }
    ];

    const sceneDescriptions = [
        'Scene 1: This scene highlights the overall steady increase in housing prices over the past 60 years, with a significant rise in the 2020s.',
        'Scene 2: This scene focuses on the impact of the 2008 financial crisis, showing the drop in housing prices and subsequent recovery.',
        'Scene 3: This scene highlights the significant increase in housing prices since the COVID-19 pandemic started in 2020.'
    ];

    function addAnnotations(annotations) {
        svg.selectAll(".annotation").remove();
        svg.selectAll(".annotation-line").remove();

        annotations.forEach(annotation => {
            const date = new Date(annotation.date);
            const datum = data.find(d => d.DATE.getFullYear() === date.getFullYear());
            const x = xScale(date);
            const y = yScale(datum.MSPUS);
            const price = datum.MSPUS;

            let xOffset, yOffset, textXOffset, textYOffset, textAnchor;

            switch (annotation.direction) {
                case 'down':
                    xOffset = 0;
                    yOffset = 50;
                    textXOffset = 0;
                    textYOffset = 65;
                    textAnchor = 'middle';
                    break;
                case 'left':
                    xOffset = -50;
                    yOffset = 0;
                    textXOffset = -55;
                    textYOffset = -5;
                    textAnchor = 'end';
                    break;
                case 'upleft':
                    xOffset = -50;
                    yOffset = -50;
                    textXOffset = -55;
                    textYOffset = -55;
                    textAnchor = 'end';
                    break;
                case 'upright':
                    xOffset = 50;
                    yOffset = -50;
                    textXOffset = 55;
                    textYOffset = -55;
                    textAnchor = 'start';
                    break;
                default:
                    xOffset = 50;
                    yOffset = 0;
                    textXOffset = 55;
                    textYOffset = -5;
                    textAnchor = 'start';
            }

            svg.append("line")
                .attr("class", "annotation-line")
                .attr("x1", x)
                .attr("y1", y)
                .attr("x2", x + xOffset)
                .attr("y2", y + yOffset);

            svg.append("text")
                .attr("class", "annotation")
                .attr("x", x + textXOffset)
                .attr("y", y + textYOffset)
                .attr("text-anchor", textAnchor)
                .attr("fill", "black")
                .text(annotation.text);

            svg.append("text")
                .attr("class", "annotation")
                .attr("x", x + textXOffset)
                .attr("y", y + textYOffset + 15)
                .attr("text-anchor", textAnchor)
                .attr("fill", "black")
                .text(`(${date.getFullYear()}, $${price})`);
        });
    }

    document.getElementById('scene1-btn').addEventListener('click', () => {
        addAnnotations(annotationsScene1);
        document.getElementById('scene-description').innerText = sceneDescriptions[0];
    });

    document.getElementById('scene2-btn').addEventListener('click', () => {
        addAnnotations(annotationsScene2);
        document.getElementById('scene-description').innerText = sceneDescriptions[1];
    });

    document.getElementById('scene3-btn').addEventListener('click', () => {
        addAnnotations(annotationsScene3);
        document.getElementById('scene-description').innerText = sceneDescriptions[2];
    });

    addAnnotations(annotationsScene1);
    document.getElementById('scene-description').innerText = sceneDescriptions[0];
}).catch(error => {
    console.error('Error loading the CSV file:', error);
});