document.addEventListener("DOMContentLoaded", function () {
  fetch("common/header/header.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
    })
    .catch(error => {
      console.error("Ошибка загрузки меню:", error);
    });
});
