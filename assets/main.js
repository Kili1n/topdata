document.addEventListener("DOMContentLoaded", function () {
  const discoverBtn = document.getElementById("boutonVersPageAccueil");
  const backBtn = document.getElementById("boutonRetour");

  if (discoverBtn) {
    discoverBtn.addEventListener("click", () => {
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = "pagePrincipale.html";
      }, 600);
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 600);
    });
  }
});
