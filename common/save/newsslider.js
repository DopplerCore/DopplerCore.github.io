document.addEventListener('DOMContentLoaded', ()=>{
  fetch('common/news/newsslider.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('newsslider-container').innerHTML = html;
    })
    .then(()=>{
      const swiper = new Swiper('.newsswiper', {
      loop: true,
      spaceBetween: 0,
      autoplay: {
        delay: 10000, // Автоматическая прокрутка каждые 3 секунды
        disableOnInteraction: false // Не останавливать при взаимодействии
      }
      });
    });
});