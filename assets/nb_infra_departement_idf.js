document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("loader-graph-infra-departement-idf")
    .classList.remove("hidden");
  // Charger les données
  let idf_equipement_sportif = await d3.dsv(
    ";",
    "data/idf-equipement-sportif.csv"
  );

  const geojson = await d3.json("data/departements.geojson");

  const idfDeps = ["75", "77", "78", "91", "92", "93", "94", "95"];
  
  geojson.features.forEach((feat) => {

    let code = feat.properties.code;
    let depNbInfra;
    for (let i = 0; i < idf_equipement_sportif.length; i++) {
      if (idf_equipement_sportif[i].dep_code == code) {

        depNbInfra = +idf_equipement_sportif[i].equip_type_name;
      }
    }

    if (depNbInfra) {
      feat.properties.nb_infra = depNbInfra;
    } else {
      feat.properties.nb_infra = 0;
    }
  });

  const width = 700;
  const height = 600;

  // Projection centrée sur l'IDF
  const projection = d3
    .geoMercator()
    .center([2.5, 48.8])
    .scale(18000)
    .translate([width / 2 + 125, height / 2 + 50]);

  const path = d3.geoPath().projection(projection);

  const maxInfra = d3.max(geojson.features, (d) => d.properties.nb_infra);
  const color = d3.scaleSequential(d3.interpolateBlues).domain([0, maxInfra]);

  const svg = d3
    .select("#graph-infra-departement-idf")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Dessiner les départements
  svg
    .selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => color(d.properties.nb_infra))
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5)
    .append("title")
    .text((d) => {
      if (idfDeps.includes(d.properties.code)) {
        return `Département ${d.properties.code}: ${d.properties.nb_infra} équipements`;
      }
    });

  // Ajouter le nombre d'équipements au centre de chaque département
  svg
    .selectAll("text")
    .data(geojson.features)
    .join("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .style("fill", "white")
    .text((d) => d.properties.nb_infra);

  // Ajouter une légende
  const legendWidth = 200,
    legendHeight = 10;

  const legendSvg = svg
    .append("g")
    .attr("transform", `translate(${width - legendWidth + 175},${height + 50})`);

  const legendScale = d3
    .scaleLinear()
    .domain([0, maxInfra])
    .range([0, legendWidth]);

  // Dégradé
  const defs = svg.append("defs");
  const linearGradient = defs
    .append("linearGradient")
    .attr("id", "legend-gradient");

  linearGradient
    .selectAll("stop")
    .data(d3.ticks(0, 1, 10))
    .join("stop")
    .attr("offset", (d) => `${d * 100}%`)
    .attr("stop-color", (d) => color(d * maxInfra));

  legendSvg
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  legendSvg
    .append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format("~s")))
    .select(".domain")
    .remove();

  legendSvg
    .append("text")
    .attr("x", 0)
    .attr("y", -5)
    .style("font-size", "12px")
    .text("Nombre d'équipements sportifs");

  document
    .getElementById("loader-graph-infra-departement-idf")
    .classList.add("hidden");
});
