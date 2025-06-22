"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const width = 500;
  const height = 500;

  const margin = 70;

  const radius = 180;

  const svg = d3
    .select("#mySvg")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`); //Pour centrer le radar-chart

  const allData = await d3.dsv(";", "data/spider-chart.csv");

  // Vérification cruciale : les données sont-elles valides ?

  const citySelector = d3.select("#city-selector");

  //Récupère toutes les villes, les tries puis supprime la ville 0 (qui sera première après le sort)
  let cityNames = [];
  for (let i = 0; i < allData.length; i++) {
    let city = allData[i].new_name;
    if (!cityNames.includes(city)) {
      cityNames.push(city);
    }
  }

  cityNames.sort();
  cityNames.shift();

  //Créer toutes les options
  citySelector
    .selectAll("option")
    .data(cityNames)
    .join("option")
    .text((d) => d)
    .attr("value", (d) => d);

  function updateChart(selectedVille) {
    svg.selectAll("*").remove(); //Supprime tous les éléments du svg

    const cityData = allData.find((d) => d.new_name === selectedVille);

    const data = [
      { axis: "Licences", value: +cityData.score_licences },
      { axis: "Équipement", value: +cityData.score_equipement },
      { axis: "Subventions", value: +cityData.score_subventions },
    ]; //Récupère les infos de la ville séléctionné

    const angleSlice = (Math.PI * 2) / data.length; //Calcul l'angle nécessaire pour pour chaque donnée

    //Création de l'échelle (même si le domaine est 0, 1 D3 extrapole au dessus en suivant notre domaine)
    //Exemple rScale(1.3) = radius * 1.3
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 1]); 

    //Créer les cercles gris
    svg
      .append("g")
      .selectAll("circle")
      .data(d3.range(0.25, 1.1, 0.25))
      .join("circle")
      .attr("r", (d) => rScale(d))
      .attr("fill", "none")
      .attr("stroke", "#ccc");

    const axisGroup = svg.selectAll(".axis").data(data).join("g");

    //Créer les lignes reliées à chaque donnée
    axisGroup
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr(
        "x2",
        (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2) 
      ) 
      .attr(
        "y2",
        (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2)
      ) 
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "2,2");

    //Place les textes de chaque données
    axisGroup
      .append("text")
      .attr(
        "x",
        (d, i) => rScale(1.25) * Math.cos(angleSlice * i - Math.PI / 2)
      ) //%%
      .attr("y", (d, i) => rScale(1.25) * Math.sin(angleSlice * i - Math.PI / 2)) //%%
      .text((d) => d.axis)
      .style("text-anchor", "middle")
      .style("font-size", "14px");

    svg
      .append("g")
      .selectAll("text")
      .data(d3.range(0.25, 1.1, 0.25))
      .join("text")
      .attr("x", 4)
      .attr("y", (d) => -rScale(d) - 2) //%%
      .style("font-size", "10px")
      .style("fill", "#555")
      .text((d) => d * 100 + "%");

    //Créer un polygone à l'aide des différentes données
    const radarLine = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value)) //Calcul le rayon de chacun des points
      .angle((d, i) => i * angleSlice); //Calcul l'angle sur lequel devra se placer le point

    //Permet de tracer le polygone correspondant aux données
    svg
      .append("path")
      .datum(data) //Récupère tout le tableau data
      .attr("d", radarLine) //Exécute un équivalent de radarline(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    //Ajoute les valeurs au bout de chaque angle du triangle
    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr(
        "x",
        (d, i) =>
          (rScale(d.value) + 15) * Math.cos(angleSlice * i - Math.PI / 2)
      ) 
      .attr(
        "y",
        (d, i) =>
          (rScale(d.value) + 15) * Math.sin(angleSlice * i - Math.PI / 2)
      ) 
      .text((d) => (d.value * 100).toFixed(2) + "%")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#cb4335");
  }

  citySelector.on("change", (event) => {
    updateChart(event.target.value);
  });

  updateChart(cityNames[0]);
});
