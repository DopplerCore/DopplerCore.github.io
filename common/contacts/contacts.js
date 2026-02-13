document.addEventListener("DOMContentLoaded", function () {
  fetch("common/contacts/contacts.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("contacts").innerHTML = html;
    })
    .catch(error => {
      console.error("Ошибка загрузки контактов:", error);
    });
});
