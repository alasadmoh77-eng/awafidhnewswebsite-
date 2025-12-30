/**
 * Nawafidh Fake API Service
 * Simulates a Backend API using LocalStorage.
 */

const API_DELAY = 300; // ms

const api = {
    // Auth Services
    auth: {
        login: async (email, password) => {
            await new Promise(r => setTimeout(r, API_DELAY));
            const users = window.nawafidhStorage.getData(STORAGE_KEYS.USERS);
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                const session = {
                    user: { id: user.id, name: user.name, email: user.email, role: user.role },
                    token: 'fake-jwt-token-' + Date.now()
                };
                window.nawafidhStorage.saveData(STORAGE_KEYS.SESSION, session);
                return { success: true, ...session };
            }
            return { success: false, message: 'بريد إلكتروني أو كلمة مرور خاطئة' };
        },
        logout: () => {
            localStorage.removeItem(STORAGE_KEYS.SESSION);
            return { success: true };
        },
        getCurrentUser: () => {
            const session = window.nawafidhStorage.getData(STORAGE_KEYS.SESSION);
            return session ? session.user : null;
        }
    },

    // Articles Services
    articles: {
        getAll: async (filters = {}) => {
            await new Promise(r => setTimeout(r, API_DELAY));
            let articles = window.nawafidhStorage.getData(STORAGE_KEYS.ARTICLES);

            // Apply Filters
            if (filters.status) articles = articles.filter(a => a.status === filters.status);
            if (filters.category_id) articles = articles.filter(a => a.category_id === filters.category_id);
            if (filters.author_id) articles = articles.filter(a => a.author_id === filters.author_id);
            if (filters.search) {
                const q = filters.search.toLowerCase();
                articles = articles.filter(a =>
                    a.title.toLowerCase().includes(q) ||
                    a.content.toLowerCase().includes(q)
                );
            }

            // Sort by Date (newest first)
            return articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        },
        getById: async (id) => {
            await new Promise(r => setTimeout(r, API_DELAY));
            const articles = window.nawafidhStorage.getData(STORAGE_KEYS.ARTICLES);
            const article = articles.find(a => a.id === id);

            if (article) {
                // Increment View
                article.views = (article.views || 0) + 1;
                window.nawafidhStorage.saveData(STORAGE_KEYS.ARTICLES, articles);
            }
            return article;
        },
        create: async (data, userId) => {
            await new Promise(r => setTimeout(r, API_DELAY));
            const articles = window.nawafidhStorage.getData(STORAGE_KEYS.ARTICLES);
            const newArticle = {
                id: window.nawafidhStorage.generateId(),
                created_at: new Date().toISOString(),
                views: 0,
                ...data
            };
            articles.push(newArticle);
            window.nawafidhStorage.saveData(STORAGE_KEYS.ARTICLES, articles);
            return newArticle;
        },
        update: async (id, data) => {
            await new Promise(r => setTimeout(r, API_DELAY));
            const articles = window.nawafidhStorage.getData(STORAGE_KEYS.ARTICLES);
            const index = articles.findIndex(a => a.id === id);
            if (index !== -1) {
                articles[index] = { ...articles[index], ...data };
                window.nawafidhStorage.saveData(STORAGE_KEYS.ARTICLES, articles);
                return articles[index];
            }
            return null;
        },
        delete: async (id) => {
            await new Promise(r => setTimeout(r, API_DELAY));
            let articles = window.nawafidhStorage.getData(STORAGE_KEYS.ARTICLES);
            articles = articles.filter(a => a.id !== id);
            window.nawafidhStorage.saveData(STORAGE_KEYS.ARTICLES, articles);
            return true;
        }
    },

    // Categories Services
    categories: {
        getAll: async () => {
            await new Promise(r => setTimeout(r, API_DELAY / 2));
            return window.nawafidhStorage.getData(STORAGE_KEYS.CATEGORIES);
        }
    },

    // Breaking News Services
    breaking: {
        getActive: async () => {
            const all = window.nawafidhStorage.getData(STORAGE_KEYS.BREAKING);
            return all.filter(b => b.is_active);
        },
        set: async (data) => {
            window.nawafidhStorage.saveData(STORAGE_KEYS.BREAKING, data);
        }
    }
};

window.NawafidhAPI = api;
