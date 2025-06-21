"use strict";
document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("loader-graph-infra-regions")
    .classList.remove("hidden");

  // Chargement du CSV
  let equipementsParRegion = await d3.dsv(";", "data/data-es2.csv");

  // Conversion des valeurs en nombre
  equipementsParRegion.forEach((d) => {
    d.nb_infra = +d.equip_type_name;
    d.reg_nom = d.reg_nom;
  });

  // Option : filtrer les régions avec plus de 5000 infrastructures
  let data = equipementsParRegion.filter((d) => d.nb_infra > 5000);

  // Debug
  console.log(data);

  // Dimensions
  const width = 2200;
  const spaceForTexte = 100;
  const height = 500;
  const marginTop = 40;
  const marginRight = 0;
  const marginBottom = 40;
  const marginLeft = 40;
  const taillePolice = "14px";

  // Détermination du max dynamique
  const nb_infra_max = d3.max(data, d => d.nb_infra);

  // Échelle X
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

  // Échelle Y
  const y = d3
    .scaleLinear()
    .domain([0, nb_infra_max])
    .range([height - marginBottom, marginTop]);

  // Création du SVG
  const svg = d3
    .select("#graph-infra-par-regions")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .call(zoom);

  // Barres
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
    .attr("width", x.bandwidth());

  // Axe X
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

  // Axe Y
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

  // Fonction de zoom
  function zoom(svg) {
    const extent = [
      [marginLeft, marginTop],
      [width - marginRight, height - marginTop],
    ];

    svg.call(
      d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed)
    );

    function zoomed(event) {
      x.range(
        [marginLeft, width - marginRight].map((d) => event.transform.applyX(d))
      );
      svg
        .selectAll(".bars rect")
        .attr("x", (d) => x(d.reg_nom))
        .attr("width", x.bandwidth());
      svg.selectAll(".x-axis").call(xAxis);
    }
  }

  document.getElementById("loader-graph-infra-regions").classList.add("hidden");
});
