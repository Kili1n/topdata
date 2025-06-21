"use strict";

document.addEventListener('DOMContentLoaded', async () => {


await createBubbleChart("svgAqui", "aquitaine");
await createBubbleChart("svgAuver", "auvergne");
await createBubbleChart("svgGE", "grandest");
await createBubbleChart("svgOcci", "occitanie");
await createBubbleChart("svgIDF", "idf");

});