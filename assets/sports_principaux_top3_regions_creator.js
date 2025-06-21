"use strict";

document
  .getElementById("loader-graph-bubble-container")
  .classList.remove("hidden");

// Fonction pour créer le bubble chart dans un conteneur donné
async function createBubbleChart(pID, reg) {
  const container = document.getElementById(pID);
  container.innerHTML = "";

  let data;
  try {
    data = await d3.dsv(";", `data/es-classement_${reg}.csv`);
  } catch (error) {
    console.error("Erreur de chargement du fichier CSV :", error);
    container.innerHTML =
      "<p style='color:red;'>Impossible de charger les données.</p>";
    return;
  }

  const width = 800;
  const height = 800;
  const margin = 1;
  const names = (d) => d.equip_type_name;
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const pack = d3
    .pack()
    .size([width - margin * 2, height - margin * 2])
    .padding(3);
  const root = pack(
    d3.hierarchy({ children: data }).sum((d) => parseInt(d.count))
  );

  const svg = d3
    .select(`#${pID}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-margin, -margin, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
    .attr("text-anchor", "middle");

  const node = svg
    .append("g")
    .selectAll()
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  node
    .append("title")
    .text((d) => `${d.data.equip_type_name}\n${d.data.count}`);

  node
    .append("circle")
    .attr("fill-opacity", 0.7)
    .attr("fill", (d) => color(names(d.data)))
    .attr("r", (d) => d.r);

  const text = node.append("text").attr("clip-path", (d) => `circle(${d.r})`);
  text
    .append("tspan")
    .attr("x", 0)
    .attr("y", 0)
    .text((d) => names(d.data));
  text
    .append("tspan")
    .attr("x", 0)
    .attr("y", "1.1em")
    .attr("fill-opacity", 0.7)
    .text((d) => d.data.count);
}

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("region-select");
  const graphContainerID = "graph-bubble-container";

  await createBubbleChart(graphContainerID, select.value);

  select.addEventListener("change", async () => {
    await createBubbleChart(graphContainerID, select.value);
  });

  document
    .getElementById("loader-graph-bubble-container")
    .classList.add("hidden");
});
