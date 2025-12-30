/**
 * Nawafidh UI Rendering Engine
 * Responsible for creating dynamic HTML components.
 */

const render = {
    /**
     * Helper to get correct path based on current location
     */
    getPrefix: () => {
        return window.location.pathname.includes('/pages/') ? '' : 'pages/';
    },

    /**
     * Creates an article card HTML
     * @param {Object} article 
     * @param {Array} categories 
     */
    articleCard: (article, categories) => {
        const prefix = render.getPrefix();
        const category = categories.find(c => c.id === article.category_id);
        const date = new Date(article.created_at).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="news-card" data-id="${article.id}">
                <a href="${prefix}article.html?id=${article.id}" class="card-link">
                    <div class="card-img">
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                        ${category ? `<span class="category-badge">${category.name}</span>` : ''}
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${article.title}</h3>
                        <div class="card-meta">
                            <span class="card-date"><i class="far fa-calendar"></i> ${date}</span>
                            <span class="card-views"><i class="far fa-eye"></i> ${article.views || 0}</span>
                        </div>
                    </div>
                </a>
            </article>
        `;
    },

    /**
     * Creates a sidebar most-read item
     */
    mostReadItem: (article, index) => {
        const prefix = render.getPrefix();
        return `
            <div class="most-read-item" data-id="${article.id}">
                <a href="${prefix}article.html?id=${article.id}">
                    <h4 class="card-title" style="font-size: 0.95rem; margin-bottom: 5px;">${article.title}</h4>
                    <span class="card-meta" style="font-size: 0.75rem;">${article.views} مشاهدة</span>
                </a>
            </div>
        `;
    },

    /**
     * Creates category menu items
     */
    categoryNav: (categories, activeId = null) => {
        const prefix = render.getPrefix();
        return categories.map(cat => `
            <li><a href="${prefix}category.html?id=${cat.id}" class="${activeId === cat.id ? 'active' : ''}">${cat.name}</a></li>
        `).join('');
    },

    /**
     * Creates a skeleton loader
     */
    skeleton: (count = 3) => {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="news-card skeleton" style="height: 350px; background: var(--bg-surface); opacity: 0.5;">
                    <div style="height: 200px; background: var(--border);"></div>
                    <div style="padding: 15px;">
                        <div style="height: 20px; background: var(--border); width: 80%; margin-bottom: 10px;"></div>
                        <div style="height: 20px; background: var(--border); width: 60%;"></div>
                    </div>
                </div>
            `;
        }
        return html;
    }
};

window.NawafidhRender = render;
