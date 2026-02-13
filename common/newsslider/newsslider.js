document.addEventListener("DOMContentLoaded", function () {
  fetch("common/newsslider/newsslider.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById('newsslider-container').innerHTML = html;
    })
    .catch(error => {
      console.error("Ошибка загрузки карусели новостей:", error);
    });
});