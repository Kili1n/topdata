"use strict";
document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("loader-graph-infra-regions")
    .classList.remove("hidden");

  let equipementsParRegion = await d3.dsv(";", "data/data-es2.csv");

  // Conversion des strings en nombre
  equipementsParRegion.forEach((d) => {
    d.nb_infra = +d.equip_type_name;
  });

  let data = equipementsParRegion.filter((d) => d.nb_infra > 17000); //Prend en compte uniquement les régions avec plus de 17 000 infrastructures (permet de garder uniquement 10 régions)

  const width = 2200;
  const spaceForTexte = 100;
  const height = 500;
  const marginTop = 40;
  const marginRight = 0;
  const marginBottom = 40;
  const marginLeft = 40;
  const taillePolice = "14px";
  const nb_infra_max = 45000;


  const x = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        data,
        ([d]) => -d.nb_infra,
        (d) => d.reg_nom
      )
    )
    .range([marginLeft, width - marginRight - spaceForTexte])
    .padding(0.1);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  const y = d3
    .scaleLinear()
    .domain([0, nb_infra_max])
    .range([height - marginBottom, marginTop]);

  const svg = d3
    .select("#graph-infra-par-regions")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")

  svg
    .append("g")
    .attr("class", "bars")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.reg_nom))
    .attr("y", (d) => y(d.nb_infra))
    .attr("height", (d) => y(0) - y(d.nb_infra))
    .attr("width", x.bandwidth())
    .append("title")
    .text((d) => "La région " + d.reg_nom +" possède "+d.nb_infra+" infrastructures");

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) =>
      g
        .append("text")
        .attr("x", width - 70)
        .attr("y", 30)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Régions")
        .style("font-size", taillePolice)
    );

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Nombre d'infrastructure")
        .style("font-size", taillePolice)
    );

  document.getElementById("loader-graph-infra-regions").classList.add("hidden");
});
