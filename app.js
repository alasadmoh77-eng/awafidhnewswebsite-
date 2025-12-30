/**
 * Nawafidh Main Application Logic (Home Page)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Theme
    const savedTheme = localStorage.getItem('nawafidh_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Initialize UI Components
    await loadCategories();
    await loadBreakingNews();
    await loadLatestNews();
    await loadFeaturedNews();
    await loadMostRead();
    checkAuthStatus();

    // Event Listeners
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            const prefix = NawafidhRender.getPrefix();
            if (query) window.location.href = `${prefix}search.html?q=${encodeURIComponent(query)}`;
        }
    });
});

async function loadCategories() {
    const categories = await NawafidhAPI.categories.getAll();
    const menu = document.getElementById('category-menu');
    const footerMenu = document.getElementById('footer-cats');

    const html = NawafidhRender.categoryNav(categories);
    menu.innerHTML += html;

    // Fill footer categories (first 4)
    const prefix = NawafidhRender.getPrefix();
    footerMenu.innerHTML = categories.slice(0, 4).map(c => `<li><a href="${prefix}category.html?id=${c.id}">${c.name}</a></li>`).join('');
}

async function loadBreakingNews() {
    const breaking = await NawafidhAPI.breaking.getActive();
    const ticker = document.getElementById('breaking-ticker');
    if (breaking.length > 0) {
        ticker.innerHTML = breaking.map(b => `<span class="ticker-item"><i class="fas fa-circle" style="font-size: 0.5rem; vertical-align: middle; margin: 0 15px;"></i> ${b.title}</span>`).join(' ');
    }
}

async function loadLatestNews() {
    const grid = document.getElementById('latest-news-grid');
    grid.innerHTML = NawafidhRender.skeleton(6);

    const articles = await NawafidhAPI.articles.getAll({ status: 'published' });
    const categories = await NawafidhAPI.categories.getAll();

    // Display first 8 latest news excluding the hero one if needed
    const latest = articles.slice(0, 8);
    grid.innerHTML = latest.map(art => NawafidhRender.articleCard(art, categories)).join('');
}

async function loadFeaturedNews() {
    const heroContainer = document.getElementById('hero-article');
    const articles = await NawafidhAPI.articles.getAll({ status: 'published' });
    const categories = await NawafidhAPI.categories.getAll();

    if (articles.length > 0) {
        const hero = articles[0]; // The latest one
        const category = categories.find(c => c.id === hero.category_id);

        const prefix = NawafidhRender.getPrefix();
        heroContainer.innerHTML = `
            <div class="news-card" style="height: 450px;">
                <a href="${prefix}article.html?id=${hero.id}">
                    <div class="card-img" style="height: 100%;">
                        <img src="${hero.image}" alt="${hero.title}" style="height: 100%;">
                        <span class="category-badge" style="font-size: 1rem; padding: 5px 15px;">${category ? category.name : ''}</span>
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(transparent, rgba(0,0,0,0.9));">
                            <h2 style="font-size: 2rem; color: white; margin-bottom: 10px;">${hero.title}</h2>
                            <p style="color: #ccc; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${hero.content}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
}

async function loadMostRead() {
    const list = document.getElementById('most-read-list');
    const articles = await NawafidhAPI.articles.getAll({ status: 'published' });

    // Sort by views
    const mostRead = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
    list.innerHTML = mostRead.map((art, index) => NawafidhRender.mostReadItem(art, index)).join('');
}

function checkAuthStatus() {
    const user = NawafidhAPI.auth.getCurrentUser();
    const authBtn = document.getElementById('auth-btn');
    if (user) {
        const prefix = NawafidhRender.getPrefix();
        authBtn.innerHTML = '<i class="fas fa-user-cog"></i> لوحة التحكم';
        authBtn.href = `${prefix}admin.html`;
        authBtn.classList.remove('btn-primary');
        authBtn.style.background = 'var(--bg-card)';
        authBtn.style.border = '1px solid var(--border)';
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('nawafidh_theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}
