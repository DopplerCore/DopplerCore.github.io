async function loadSection(id, file) {
    try {
    let response = await fetch(file);
    let data = await response.text();
    document.getElementById(id).innerHTML = data;
    } catch (error) {
    console.error(`Ошибка загрузки ${file}:`, error);
    }
}

async function loadContent() {
    await loadSection('header', 'common/header.html');
    await loadSection('banner', 'common/banner.html');
    await loadSection('cta', 'common/cta.html');
    await loadSection('footer', 'common/footer.html');

    // Дожидаемся загрузки header перед загрузкой скриптов
    await loadScript('assets/js/jquery.min.js');
    await loadScripts();
    document.getElementById("preloader").style.display = "none";
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
    });
}

async function loadScripts() {
    let scripts = [
    'assets/js/jquery.dropotron.min.js',
    'assets/js/jquery.scrolly.min.js',
    'assets/js/jquery.scrollex.min.js',
    'assets/js/browser.min.js',
    'assets/js/breakpoints.min.js',
    'assets/js/util.js',
    'assets/js/main.js'
    ];

    for (let src of scripts) {
    await loadScript(src);
    }
}

loadContent();