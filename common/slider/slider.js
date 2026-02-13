document.addEventListener('DOMContentLoaded', ()=>{
  fetch('common/slider/slider.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('slider-container').innerHTML = html;
    })
    .then(()=>{
      const swiper = new Swiper('.swiper', {
      loop: true,
      spaceBetween: 0,
      autoplay: {
        delay: 3000, // Автоматическая прокрутка каждые 3 секунды
        disableOnInteraction: false // Не останавливать при взаимодействии
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 2 },
        480: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
        1024: { slidesPerView: 6 }
      }
      });
    });
});

