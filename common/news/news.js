document.addEventListener("DOMContentLoaded",()=>{
  // Определяем, на какой странице мы
const isListPage = !!document.querySelector('#news-list');
const isDetailPage = !!document.querySelector('#news-content');

// Общая функция загрузки JSON
async function fetchNewsData() {
  const res = await fetch('/common/news/news.json');
  return await res.json();
}

// Рендер отдельной новости
async function renderNewsDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const news = await fetchNewsData();
  const item = news.find(n => n.slug === slug);

  if (!item) {
    document.querySelector('#news-content').textContent = 'Новость не найдена';
    return;
  }
  document.title = item.title;
  document.querySelector("#news-title-header").innerHTML = item.title;
  document.querySelector("#news-date").innerHTML = item.date;
  document.querySelector("#news-content").innerHTML = item.content;
}

// Запуск в зависимости от страницы
if (isDetailPage) renderNewsDetail();


const ITEMS_PER_PAGE = 5;  // количество новостей на страницу

async function fetchNewsData() {
  const res = await fetch('/common/news/news.json');
  return await res.json();
}

function getCurrentPage() {
  const p = Number(new URLSearchParams(window.location.search).get('page'));
  return (p && p > 0) ? p : 1;
}

/**
 * Отрисовывает навигацию по новостям
 * @param {Number} currentPage – текущий массив узлов
 * @param {Number} totalPages – путь, который ищем
 */
function renderPagination(currentPage, totalPages) {
  const nav = document.querySelector('#pagination');
  if (!nav || totalPages < 2) return;

  // Helper: создаёт ссылку
  const makeLink = (page, text, disabled) => {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = `novosti.html?page=${page}`;
    if (disabled) a.classList.add('disabled');
    if (page === currentPage) a.classList.add('active');
    return a;
  };

  // «Предыдущая»
  nav.append(makeLink(currentPage - 1, '←', currentPage === 1));

  // Номера страниц
  for (let i = 1; i <= totalPages; i++) {
    nav.append(makeLink(i, i, false));
  }

  // «Следующая»
  nav.append(makeLink(currentPage + 1, '→', currentPage === totalPages));
}

async function renderNewsList() {
  const news = await fetchNewsData();
  const container = document.querySelector('#news-list');
  const totalItems = news.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPage = getCurrentPage();

  // Отсортировать
  news.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Получить порцию для текущей страницы
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = news.slice(start, start + ITEMS_PER_PAGE);

  // Рендерим элементы
  pageItems.forEach(item => {
    const a = document.createElement('a');
    a.href = `novost.html?slug=${item.slug}`;
    a.className = 'news-item';
    a.innerHTML = /* html */`
    <div style="display:flex; flex-direction:row;">
      <div style="width: 150px; height: 150px; min-width: 150px; overflow: hidden; border-radius: 8px;">
      <img style="width: 100%; height: 100%; object-fit: cover; opacity:0.8;" src="/common/news/images/${item.image}"/>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column;">
        <h3 style="margin: 10px 5px 0 5px; font-size:14px;">${item.title}</h3>
        <p style="margin: 10px 5px 0 5px; font-size:12px;">${item.summary}</p>
        <time style="margin: auto 0 0 0; font-size:12px;">${item.date}</time>
      <div>
    </div>
    `;
    container.append(a);
  });

  // Рендер пагинации
  renderPagination(currentPage, totalPages);
}

async function renderNewsBanner() {
  const news = await fetchNewsData();
  const container = document.querySelector('.gallery');
  const totalItems = news.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPage = getCurrentPage();

  // Отсортировать
  news.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Получить порцию для текущей страницы
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = news.slice(start, start + ITEMS_PER_PAGE);

  // Рендерим элементы
  pageItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-cell';
    div.innerHTML = /* html */`
        <a style="height: 100%; href="novost.html?slug=${item.slug}" target="_blank">
        <div style="height: 100%;display:flex; flex-direction:row; justify-content: center; flex-wrap:wrap; padding:20px;">
          <img style="height:100%; opacity:0.8;" src="/common/news/images/${item.image}"/>
          <div style="margin-left:20px; min-width:400px; width: 40%">
            <p style="font-size:28px; text-align: left; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;"><time>${item.date}</time> - - ${item.title}</p>
          </div>
        </div>
        </a>
    `;
    container.append(div);
  });

  const flkty = new Flickity(container, {
  cellAlign: 'left',
  contain: true,
  autoPlay: 7000,
  wrapAround: true,
});
}

if (isListPage) renderNewsList();
renderNewsBanner();

});