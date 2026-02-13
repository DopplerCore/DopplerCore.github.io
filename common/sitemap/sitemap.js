// sitemap.js

window.siteMap = [
  {
    name: 'Главная',
    path: '/index.html',
    children: [
      {
        name: 'О компании',
        path: '/about.html'
      },
      {
        name: 'Услуги',
        path: '/services/',
        children: [
          { name: 'Web-разработка', path: '/services/web.html' },
          { name: 'Дизайн',       path: '/services/design.html' }
        ]
      },
      {
        name: 'Новости',
        path: '/novosti.html',
        children: [
          { name: 'Новость', path: '/novost.html' }
        ]
      }
    ]
  },
  {
    name: 'Контакты',
    path: '/contacts.html'
  }
];

/**
 * Находит через DFS маршрут (breadcrumb) до целевого пути
 * @param {Array} nodes – текущий массив узлов
 * @param {string} target – путь, который ищем
 * @param {Array} route – накопленный маршрут
 * @returns {Array|null} – массив узлов маршрута или null
 */
window.findRoute = function(nodes, target, route = []) {
  for (let node of nodes) {
    const newRoute = [...route, { name: node.name, path: node.path }];
    if (node.path === target) {
      return newRoute;
    }
    if (node.children) {
      const res = window.findRoute(node.children, target, newRoute);
      if (res) return res;
    }
  }
  return null;
};

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  const route = window.findRoute(window.siteMap, currentPath);

  if (!route) return; // Страницы нет в карте

  const nav = document.getElementById('breadcrumb');
  
  route.forEach((crumb, index) => {
    const a = document.createElement('a');
    a.textContent = crumb.name;
    a.href = crumb.path;
    if(crumb.name === "Новость") a.href = window.location.href;
    nav.appendChild(a);

    if (index < route.length - 1) {
      const sep = document.createTextNode(' › ');
      nav.appendChild(sep);
    }
  });
});
