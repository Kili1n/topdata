"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("loader-graph_idf_ge").classList.remove("hidden");
  let idf_evo = await d3.dsv(";", "data/idf_evo.csv");
  let ge_evo = await d3.dsv(";", "data/ge_evo.csv");
  console.log(idf_evo);
  console.log(ge_evo);

  // Set dimensions and margins for the chart

  const margin = { top: 70, right: 30, bottom: 40, left: 80 };
  const width = 1300 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Set up the x and y scales

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  // Create the SVG element and append it to the chart container

  const svg = d3
    .select("#graph_idf_ge")
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    )
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define the x and y domains

  x.domain(d3.extent(idf_evo, (d) => d.annee));
  y.domain([0, 3000000]);

  // Add the x-axis

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call((g) =>
      g
        .append("text")
        .attr("x", width)
        .attr("y", -4)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text("Année")
    )

    .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d")));

  // Add the y-axis

  svg
    .append("g")
    .call(d3.axisLeft(y))
    .call((g) =>
      g
        .append("text")
        .attr("x", 100)
        .attr("y", -4)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text("Nombre de licenciés")
    );

  // Create the line generator

  const line = d3
    .line()
    .x((d) => x(d.annee))
    .y((d) => y(d.total));

  // Add the line path to the SVG element
  svg
    .append("path")
    .datum(idf_evo)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1)
    .attr("d", line);

  svg
    .append("path")
    .datum(ge_evo)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr("d", line);

  //Code pour la légnede de l'IDF et du GE en dessous

  const legendIDF = svg.append("g").attr("transform", "translate(1000, 10)");

  legendIDF
    .append("line")
    .attr("x1", 0)
    .attr("y1", 10)
    .attr("x2", 30)
    .attr("y2", 10)
    .attr("stroke", "red")
    .attr("stroke-width", 2);

  legendIDF
    .append("text")
    .attr("x", 40)
    .attr("y", 15)
    .text("Ile de France")
    .style("font-size", "14px")
    .attr("alignment-baseline", "middle");

  const legendGe = svg.append("g").attr("transform", "translate(1000, 30)");

  legendGe
    .append("line")
    .attr("x1", 0)
    .attr("y1", 10)
    .attr("x2", 30)
    .attr("y2", 10)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  legendGe
    .append("text")
    .attr("x", 40)
    .attr("y", 15)
    .text("Grand Est")
    .style("font-size", "14px")
    .attr("alignment-baseline", "middle");

  document.getElementById("loader-graph_idf_ge").classList.add("hidden");
});
