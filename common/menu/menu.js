document.addEventListener("DOMContentLoaded", function () {
  fetch("common/menu/menu.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("menu").innerHTML = html;
    })
    .then(() => {
      const toggleBtn = document.getElementById('menu-toggle');
      const menuBar = document.getElementById('menu-bar');

      toggleBtn.addEventListener('click', () => {
        // Переключаем класс collapsed
        menuBar.classList.toggle('collapsed');
        
        // Опционально: анимация самой кнопки (крестик)
        toggleBtn.classList.toggle('open');
      });
    })
    .catch(error => {
      console.error("Ошибка загрузки меню:", error);
    });
});

