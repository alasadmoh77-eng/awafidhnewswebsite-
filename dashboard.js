/**
 * Nawafidh Admin Dashboard Logic
 */

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Auth Check
    currentUser = NawafidhGuard.protect();
    if (!currentUser) return;

    // Theme Init
    const savedTheme = localStorage.getItem('nawafidh_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    // UI Init
    document.getElementById('admin-name').textContent = currentUser.name;
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Load Initial Data
    await loadStats();
    await loadRecentArticles();
    await populateCategoryDropdown();

    // Form Submit
    document.getElementById('article-form').addEventListener('submit', handleArticleSubmit);
});

async function loadStats() {
    const articles = await NawafidhAPI.articles.getAll();
    const categories = await NawafidhAPI.categories.getAll();

    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const drafts = articles.filter(a => a.status === 'draft').length;

    document.getElementById('stat-articles').textContent = articles.length;
    document.getElementById('stat-views').textContent = totalViews.toLocaleString();
    document.getElementById('stat-categories').textContent = categories.length;
    document.getElementById('stat-drafts').textContent = drafts;
}

async function loadRecentArticles() {
    const articles = await NawafidhAPI.articles.getAll();
    const categories = await NawafidhAPI.categories.getAll();

    const container = document.getElementById('recent-articles-table');
    const tableContainer = document.getElementById('articles-list-container');

    const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>الخبر</th>
                    <th>القسم</th>
                    <th>بواسطة</th>
                    <th>الحالة</th>
                    <th>المشاهدات</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${articles.map(art => {
        const cat = categories.find(c => c.id === art.category_id);
        return `
                        <tr>
                            <td style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${art.title}</td>
                            <td>${cat ? cat.name : 'عام'}</td>
                            <td>${art.author_id}</td>
                            <td><span class="badge-status ${art.status}">${art.status === 'published' ? 'منشور' : 'مسودة'}</span></td>
                            <td>${art.views || 0}</td>
                            <td>
                                <button onclick="editArticle('${art.id}')" style="background:none; border:none; color: var(--primary); cursor:pointer;"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteArticle('${art.id}')" style="background:none; border:none; color: var(--accent); cursor:pointer;"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHtml;
    tableContainer.innerHTML = tableHtml;
}

async function populateCategoryDropdown() {
    const categories = await NawafidhAPI.categories.getAll();
    const select = document.getElementById('art-category');
    select.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function switchTab(tab) {
    document.querySelectorAll('.admin-content').forEach(el => el.style.display = 'none');
    document.getElementById(`tab-${tab}`).style.display = 'block';

    document.querySelectorAll('.sidebar-menu a').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.getElementById('tab-title').textContent = event.currentTarget.textContent.trim();
}

// Modal Logic
function openArticleModal() {
    document.getElementById('edit-id').value = '';
    document.getElementById('article-form').reset();
    document.getElementById('modal-title').textContent = 'إضافة خبر جديد';
    document.getElementById('article-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('article-modal').style.display = 'none';
}

async function editArticle(id) {
    const article = await NawafidhAPI.articles.getById(id);
    if (!article) return;

    document.getElementById('edit-id').value = article.id;
    document.getElementById('art-title').value = article.title;
    document.getElementById('art-category').value = article.category_id;
    document.getElementById('art-status').value = article.status;
    document.getElementById('art-image').value = article.image;
    document.getElementById('art-content').value = article.content;

    document.getElementById('modal-title').textContent = 'تعديل الخبر';
    document.getElementById('article-modal').style.display = 'flex';
}

async function handleArticleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const data = {
        title: document.getElementById('art-title').value,
        category_id: document.getElementById('art-category').value,
        status: document.getElementById('art-status').value,
        image: document.getElementById('art-image').value,
        content: document.getElementById('art-content').value,
        author_id: currentUser.id
    };

    if (id) {
        await NawafidhAPI.articles.update(id, data);
    } else {
        await NawafidhAPI.articles.create(data, currentUser.id);
    }

    closeModal();
    await loadStats();
    await loadRecentArticles();
    alert('تم الحفظ بنجاح');
}

async function deleteArticle(id) {
    if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
        await NawafidhAPI.articles.delete(id);
        await loadStats();
        await loadRecentArticles();
    }
}

function logout() {
    NawafidhAPI.auth.logout();
    window.location.href = 'login.html';
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('nawafidh_theme', newTheme);
}
