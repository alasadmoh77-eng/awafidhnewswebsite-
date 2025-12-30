/**
 * Nawafidh Storage System
 * Handles all LocalStorage operations and initial data seeding.
 */

const STORAGE_KEYS = {
    USERS: 'nawafidh_users',
    CATEGORIES: 'nawafidh_categories',
    ARTICLES: 'nawafidh_articles',
    BREAKING: 'nawafidh_breaking_news',
    SESSION: 'nawafidh_session'
};

const DEFAULT_CATEGORIES = [
    { id: '1', name: 'سياسة', slug: 'politics' },
    { id: '2', name: 'اقتصاد', slug: 'economy' },
    { id: '3', name: 'رياضة', slug: 'sports' },
    { id: '4', name: 'تقنية', slug: 'tech' },
    { id: '5', name: 'العالم', slug: 'world' },
    { id: '6', name: 'رأي', slug: 'opinion' }
];

const DEFAULT_AUTHORS = [
    { id: 'auth1', name: 'أحمد النجار', email: 'ahmed@nawafidh.com' },
    { id: 'auth2', name: 'سارة العامري', email: 'sara@nawafidh.com' },
    { id: 'auth3', name: 'محمد خالد', email: 'mohammed@nawafidh.com' }
];

class NawafidhStorage {
    constructor() {
        this.init();
    }

    async init() {
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        }

        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            // Default Admin
            const adminUser = {
                id: '1',
                name: 'مدير النظام',
                email: 'admin@nawafidh.com',
                password: 'Admin@123', // In a real app, this would be hashed
                role: 'admin',
                created_at: new Date().toISOString()
            };
            
            const editorUser = {
                id: '2',
                name: 'محرر الأخبار',
                email: 'editor@nawafidh.com',
                password: 'Editor@123',
                role: 'editor',
                created_at: new Date().toISOString()
            };

            const writerUser = {
                id: '3',
                name: 'كاتب محتوى',
                email: 'writer@nawafidh.com',
                password: 'Writer@123',
                role: 'writer',
                created_at: new Date().toISOString()
            };

            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser, editorUser, writerUser]));
        }

        if (!localStorage.getItem(STORAGE_KEYS.BREAKING)) {
            const breaking = [
                { id: '1', title: 'شبكة نوافذ الإعلامية تنطلق رسمياً بحلتها الجديدة', is_active: true },
                { id: '2', title: 'تغطية مستمرة لأحدث الفعاليات العالمية والمحلية', is_active: true }
            ];
            localStorage.setItem(STORAGE_KEYS.BREAKING, JSON.stringify(breaking));
        }

        if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
            this.seedArticles();
        }
    }

    seedArticles() {
        const articles = [
            {
                id: 'art1',
                title: 'مستقبل الذكاء الاصطناعي في الشرق الأوسط',
                content: 'يشهد قطاع الذكاء الاصطناعي نمواً متسارعاً في المنطقة العربية، حيث تستثمر الشركات والحكومات بشكل كبير في تطوير حلول مبتكرة لتحسين الكفاءة والإنتاجية. يتوقع الخبراء أن يساهم هذا التحول الرقمي في خلق فرص عمل جديدة وتعزيز الاقتصادات القائمة على المعرفة.',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
                category_id: '4',
                author_id: 'auth1',
                status: 'published',
                created_at: new Date().toISOString(),
                views: 1250,
                tags: ['ذكاء اصطناعي', 'تقنية', 'مستقبل']
            },
            {
                id: 'art2',
                title: 'تطورات الأسواق المالية العالمية هذا الأسبوع',
                content: 'شهدت الأسوق المالية تبايناً في الأداء خلال الأسبوع الجاري مع ترقب المستثمرين لبيانات التضخم الأمريكية وتصريحات الفيدرالي. سجلت العملات الرقمية انتعاشاً طفيفاً بينما استقر الذهب بالقرب من مستويات قياسية.',
                image: 'https://images.unsplash.com/photo-1611974714024-463ef4ed0562?auto=format&fit=crop&q=80&w=1000',
                category_id: '2',
                author_id: 'auth2',
                status: 'published',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                views: 840,
                tags: ['اقتصاد', 'أسواق', 'مال']
            },
            {
                id: 'art3',
                title: 'تزايد الاهتمام بالطاقة المتجددة في المدن الذكية',
                content: 'أصبحت الطاقة الشمسية والرياح ركيزة أساسية في بناء وتصميم المدن العصرية. تهدف هذه المبادرات إلى تقليل الانبعاثات الكربونية وتحقيق الاستدامة البيئية طويلة الأمد.',
                image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000',
                category_id: '5',
                author_id: 'auth3',
                status: 'published',
                created_at: new Date(Date.now() - 172800000).toISOString(),
                views: 520,
                tags: ['بيئة', 'طاقة', 'استدامة']
            },
            {
                id: 'art4',
                title: 'المنتخب الوطني يواصل استعداداته للبطولة الدولية',
                content: 'دخل المنتخب الوطني معسكراً تدريبياً مغلقاً استعداداً للمنافسات القادمة، حيث يركز الجهاز الفني على رفع مستوى اللياقة البدنية والانسجام التكتيكي بين اللاعبين.',
                image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000',
                category_id: '3',
                author_id: 'auth1',
                status: 'published',
                created_at: new Date(Date.now() - 3600000).toISOString(),
                views: 2100,
                tags: ['رياضة', 'قدم', 'بطولة']
            },
            {
                id: 'art5',
                title: 'تكنولوجيا الجيل السادس: ماذا ننتظر؟',
                content: 'بينما لا يزال العالم يتبنى تقنيات الجيل الخامس، بدأت الأبحاث بالفعل حول مواصفات الجيل السادس التي تعد بسرعات خيالية وزمن استجابة أقل بكثير، مما سيفتح آفاقاً جديدة لإنترنت الأشياء والميتافيرس.',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
                category_id: '4',
                author_id: 'auth2',
                status: 'draft',
                created_at: new Date().toISOString(),
                views: 0,
                tags: ['تقنية', 'اتصالات', 'مستقبل']
            }
        ];

        // Adding more to reach 10+
        for(let i=6; i<=15; i++) {
            articles.push({
                id: `art${i}`,
                title: `خبر إعلامي تجريبي رقم ${i}`,
                content: `هذا نص تجريبي للخبر رقم ${i}. شبكة نوافذ الإعلامية تسعى دائماً لتقديم أفضل محتوى إخباري لجمهورها في كافة المجالات.`,
                image: `https://picsum.photos/seed/nawafidh${i}/1000/600`,
                category_id: (Math.floor(Math.random() * 6) + 1).toString(),
                author_id: `auth${(i%3)+1}`,
                status: i > 10 ? 'draft' : 'published',
                created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
                views: Math.floor(Math.random() * 500),
                tags: ['أخبار', 'نوافذ']
            });
        }

        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    }

    // CRUD Methods
    getData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Helper for generating unique IDs
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}

const storage = new NawafidhStorage();
window.nawafidhStorage = storage; // Global access for testing
