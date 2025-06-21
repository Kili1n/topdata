"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("loader-graph-licences-revenus")
    .classList.remove("hidden");

  let licencies_revenues_population = await d3.dsv(
    ";",
    "data/licencies_revenues_population.csv"
  );

  let data = licencies_revenues_population;

  console.log(licencies_revenues_population);

  // Specify the chart’s dimensions.
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 50;

  // Create the horizontal (x) scale, positioning N/A values on the left margin.
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => parseInt(d["Total_licenciés"]))])
    .nice()
    .range([marginLeft, width - marginRight])
    .unknown(marginLeft);

  // Create the vertical (y) scale, positioning N/A values on the bottom margin.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => parseInt(d["population_2017"]))])
    .nice()
    .range([height - marginBottom, marginTop])
    .unknown(height - marginBottom);

  // Create the SVG container.
  const svg = d3
    .select("#graph-licences-revenus")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .property("value", []);

  // Append the axes.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", width - marginRight)
        .attr("y", -4)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text("Nombre de licenciés")
    );

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .select(".tick:last-of-type text")
        .clone()
        .attr("x", 4)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Nombre d'habitants")
    );

  // Append the dots.
  svg
    .append("g")
    .attr("fill", "gold")
    .attr("stroke", "gold")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr(
      "transform",
      (d) => `translate(${x(d["Total_licenciés"])},${y(d["population_2017"])})`
    )
    .attr("r", 2);

  document
    .getElementById("loader-graph-licences-revenus")
    .classList.add("hidden");
});
