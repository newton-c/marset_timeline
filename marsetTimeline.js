
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 220 - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#marsetTimeline")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/newton-c/marset_timeline/main/data/timelineMarset_EN.csv",
//d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/connectedscatter.csv",

  // When reading the csv, I must format variables:
  d => {
      return {date : d3.timeParse("%Y-%m-%d")(d.date), value : d.note, ans : d.ans}}).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const y = d3.scaleTime()
      .domain(d3.extent(data, d => d.date).reverse())
      .range([ height, 0 ]);
    svg.append("g")
     // .attr("transform", `translate(0, ${width})`)
      .call(d3.axisLeft(y));

    // Add Y axis
    const x = d3.scaleLinear()
      .domain( [0, 0])
      .range([ 0, 0]);
    svg.append("g")
      .call(d3.axisBottom(x));


    // create a tooltip
    const Tooltip = d3.select("#marsetTimeline")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
        Tooltip
          .style("opacity", 1)
      }
      const mousemove = function(event,d) {
        Tooltip
          .html(d.value)
          .style("left", `${event.layerX+10}px`)
          .style("top", `${event.layerY}px`)
      }
      const mouseleave = function(event,d) {
        Tooltip
          .style("opacity", 0)
      }



    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
        .attr("class", "myCircle")
        .attr("cy", d => y(d.date))
        .attr("cx", 0)
        .attr("r", 8)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


        svg
        .append("g")
        .selectAll("text")
        .data(data)
        .join("text")
          .attr("class", "myAnnotations")
          .attr("y", d => y(d.date))
          .attr('dy', 5)
          .attr("x", 10)
          .html(d => d.ans)
})
