
import React, { useState, useEffect, useRef } from 'react';
import { Search, Book as BookIcon, Library, Sparkles, Star, Plus, Trash2, X, ChevronRight, Bookmark, CheckCircle2, Moon, Sun, Settings, Filter, Maximize2, Minimize2, Calendar, Languages, BookOpen, User, Globe, MoreHorizontal } from 'lucide-react';
import { Book, UserBook, Recommendation, SearchFilters, HomeConfig } from './types';
import { searchBooks, getBooksByCategory } from './services/booksService';
import { getRecommendations } from './services/geminiService';
import Button from './components/Button';

// --- Translations ---
type Language = 'tr' | 'en';

const TRANSLATIONS = {
  tr: {
    appName: 'MyShelf',
    searchPlaceholder: 'Kitap, yazar veya ISBN ara...',
    noImage: 'Görsel Yok',
    weeklyPick: 'Haftanın Seçkisi',
    discover: 'Keşfet',
    heroTitle: 'Gece Yarısı Kütüphanesi',
    heroDesc: '"Yaşamla ölüm arasında bir kütüphane vardır..."',
    heroBtn: 'Keşfet',
    searchResults: 'Arama Sonuçları',
    clear: 'Temizle',
    searching: 'Aranıyor...',
    inLibrary: 'Kitaplığında',
    add: 'Ekle',
    loading: 'Yükleniyor...',
    noBooksCategory: 'Bu kategoride kitap bulunamadı.',
    myLibrary: 'Kitaplığım',
    wantToRead: 'Okumak İstediklerim',
    wantToReadShort: 'İstek',
    read: 'Okuduklarım',
    readShort: 'Okunan',
    emptyWantToRead: 'Okumak istediğin kitaplar listesi boş.',
    emptyRead: 'Henüz bitirdiğin bir kitap eklemedin.',
    searchBookBtn: 'Kitap Ara',
    readStatus: 'Okundu',
    waitStatus: 'Beklemede',
    change: 'Değiştir',
    curatorDesk: 'AI Küratör Masası',
    curatorDesc: 'Okuma geçmişin ve istek listenin mükemmel uyumu.',
    addToWishlist: 'İstek Listesine Ekle',
    curatorEmpty: 'Okuduklarını ve istediklerini analiz ederek sana özel bir seçki hazırlayalım.',
    prepareCuration: 'Kürasyonu Hazırla',
    navDiscover: 'Keşfet',
    navLibrary: 'Kitaplığım',
    navRecs: 'Öneriler',
    settingsTitle: 'Ayarlar',
    settingsCategoryTitle: 'Ana Sayfa Kategorileri',
    settingsLanguageTitle: 'Dil Seçeneği',
    save: 'Kaydet',
    filterCategory: 'KATEGORİ',
    filterSort: 'SIRALAMA',
    filterAll: 'Tümü',
    filterRelevance: 'Alaka Düzeyi',
    filterNewest: 'En Yeni',
    filterBtn: 'Filtrele ve Ara',
    bookPages: 'Sayfa',
    bookPublisher: 'Yayıncı Yok',
    bookLanguage: 'Dil',
    addToLibrary: 'Kitaplığıma Ekle',
    addedToLibrary: 'Kitaplıkta Ekli',
    removeFromLibrary: 'Kitaplıktan Çıkar',
    remove: 'Kaldır',
    errorSearch: 'Arama yapılırken bir hata oluştu.',
    errorRecs: 'Öneriler alınırken bir hata oluştu.',
    alertAdded: 'İstek listesine eklendi!',
    cat_fiction: 'Kurgu',
    cat_science: 'Bilim & Teknoloji',
    cat_history: 'Tarih',
    cat_mystery: 'Gizem & Gerilim',
    cat_fantasy: 'Fantastik',
    cat_romance: 'Romantik',
    cat_biography: 'Biyografi',
    cat_philosophy: 'Felsefe',
    cat_art: 'Sanat & Tasarım',
    cat_business: 'İş & Ekonomi',
    cat_psychology: 'Psikoloji',
    cat_self_help: 'Kişisel Gelişim',
    cat_cooking: 'Yemek & Mutfak',
    cat_travel: 'Seyahat',
    cat_computers: 'Bilgisayar & Yazılım',
    cat_poetry: 'Şiir',
    cat_comics: 'Çizgi Roman',
    cat_health: 'Sağlık',
  },
  en: {
    appName: 'MyShelf',
    searchPlaceholder: 'Search books, authors or ISBN...',
    noImage: 'No Image',
    weeklyPick: 'Weekly Pick',
    discover: 'Discover',
    heroTitle: 'The Midnight Library',
    heroDesc: '"Between life and death there is a library..."',
    heroBtn: 'Explore',
    searchResults: 'Search Results',
    clear: 'Clear',
    searching: 'Searching...',
    inLibrary: 'In Library',
    add: 'Add',
    loading: 'Loading...',
    noBooksCategory: 'No books found in this category.',
    myLibrary: 'My Library',
    wantToRead: 'Want to Read',
    wantToReadShort: 'Wishlist',
    read: 'Read',
    readShort: 'Read',
    emptyWantToRead: 'Your want-to-read list is empty.',
    emptyRead: 'You haven\'t added any finished books yet.',
    searchBookBtn: 'Search Books',
    readStatus: 'Read',
    waitStatus: 'On List',
    change: 'Change',
    curatorDesk: 'AI Curator Desk',
    curatorDesc: 'Perfect harmony of your reading history and wishlist.',
    addToWishlist: 'Add to Wishlist',
    curatorEmpty: 'Let us analyze your lists to prepare a custom selection.',
    prepareCuration: 'Prepare Curation',
    navDiscover: 'Discover',
    navLibrary: 'Library',
    navRecs: 'For You',
    settingsTitle: 'Settings',
    settingsCategoryTitle: 'Home Categories',
    settingsLanguageTitle: 'Language',
    save: 'Save',
    filterCategory: 'CATEGORY',
    filterSort: 'SORT BY',
    filterAll: 'All',
    filterRelevance: 'Relevance',
    filterNewest: 'Newest',
    filterBtn: 'Filter & Search',
    bookPages: 'Pages',
    bookPublisher: 'No Publisher',
    bookLanguage: 'Language',
    addToLibrary: 'Add to Library',
    addedToLibrary: 'In Library',
    removeFromLibrary: 'Remove from Library',
    remove: 'Remove',
    errorSearch: 'An error occurred while searching.',
    errorRecs: 'An error occurred while getting recommendations.',
    alertAdded: 'Added to wishlist!',
    cat_fiction: 'Fiction',
    cat_science: 'Science & Tech',
    cat_history: 'History',
    cat_mystery: 'Mystery & Thriller',
    cat_fantasy: 'Fantasy',
    cat_romance: 'Romance',
    cat_biography: 'Biography',
    cat_philosophy: 'Philosophy',
    cat_art: 'Art & Design',
    cat_business: 'Business',
    cat_psychology: 'Psychology',
    cat_self_help: 'Self Help',
    cat_cooking: 'Cooking',
    cat_travel: 'Travel',
    cat_computers: 'Computers',
    cat_poetry: 'Poetry',
    cat_comics: 'Comics',
    cat_health: 'Health',
  }
};

interface CategoryData {
  id: string;
  titleKey: string;
  books: Book[];
}

const AVAILABLE_CATEGORIES = [
  'fiction', 'science', 'history', 'mystery', 'fantasy', 'romance', 
  'biography', 'philosophy', 'art', 'business', 'psychology', 
  'self_help', 'cooking', 'travel', 'computers', 'poetry', 'comics', 'health'
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') as Language || 'tr';
    }
    return 'tr';
  });

  const t = (key: keyof typeof TRANSLATIONS['tr']) => TRANSLATIONS[language][key] || key;
  const tCat = (id: string) => {
    const key = `cat_${id.replace('-', '_')}` as keyof typeof TRANSLATIONS['tr'];
    return TRANSLATIONS[language][key] || id;
  };

  const [activeTab, setActiveTab] = useState<'search' | 'shelf' | 'recommendations'>('search');
  const [shelfSubTab, setShelfSubTab] = useState<'read' | 'want_to_read'>('want_to_read');
  const [myShelf, setMyShelf] = useState<UserBook[]>([]);
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    orderBy: 'relevance',
    printType: 'all',
    category: ''
  });

  const [homeCategories, setHomeCategories] = useState<CategoryData[]>([]);
  const [isLoadingDiscovery, setIsLoadingDiscovery] = useState(false);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(() => {
    const saved = localStorage.getItem('homeConfig');
    return saved ? JSON.parse(saved) : { enabledCategories: ['fiction', 'science', 'history', 'mystery'] };
  });
  const [showSettings, setShowSettings] = useState(false);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const saved = localStorage.getItem('myShelf');
    if (saved) setMyShelf(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('myShelf', JSON.stringify(myShelf));
  }, [myShelf]);

  useEffect(() => {
    localStorage.setItem('homeConfig', JSON.stringify(homeConfig));
    loadDiscovery();
  }, [homeConfig]);

  const loadDiscovery = async () => {
    setIsLoadingDiscovery(true);
    try {
      const activeCatIds = AVAILABLE_CATEGORIES.filter(id => homeConfig.enabledCategories.includes(id));
      
      const results = await Promise.all(
        activeCatIds.map(async (id) => ({
          id: id,
          titleKey: id, 
          books: await getBooksByCategory(id)
        }))
      );
      setHomeCategories(results);
    } catch (err) {
      console.error("Discovery loading failed", err);
    } finally {
      setIsLoadingDiscovery(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleHomeCategory = (catId: string) => {
    setHomeConfig(prev => {
      const exists = prev.enabledCategories.includes(catId);
      if (exists) {
        if (prev.enabledCategories.length <= 1) return prev;
        return { enabledCategories: prev.enabledCategories.filter(id => id !== catId) };
      } else {
        return { enabledCategories: [...prev.enabledCategories, catId] };
      }
    });
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchBooks(searchQuery, filters);
      setSearchResults(results);
    } catch (err) {
      setError(t('errorSearch'));
    } finally {
      setIsSearching(false);
    }
  };

  const addToShelf = (book: Book, status: 'want_to_read' | 'read') => {
    if (myShelf.some(b => b.id === book.id)) {
        setMyShelf(prev => prev.map(b => b.id === book.id ? { ...b, status } : b));
        return;
    }
    const newUserBook: UserBook = {
      ...book,
      status: status,
      rating: 0,
      notes: ''
    };
    setMyShelf(prev => [newUserBook, ...prev]);
  };

  const toggleStatus = (id: string) => {
    setMyShelf(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: b.status === 'read' ? 'want_to_read' : 'read'
        };
      }
      return b;
    }));
  };

  const removeFromShelf = (id: string) => {
    setMyShelf(prev => prev.filter(b => b.id !== id));
  };

  const updateRating = (id: string, rating: number) => {
    setMyShelf(prev => prev.map(b => b.id === id ? { ...b, rating } : b));
  };

  const fetchAiRecommendations = async () => {
    setIsRecommending(true);
    setError(null);
    try {
      const recs = await getRecommendations(myShelf, language);
      setRecommendations(recs);
      setActiveTab('recommendations');
    } catch (err: any) {
      setError(err.message || t('errorRecs'));
    } finally {
      setIsRecommending(false);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailExpanded(false);
  };

  const closeBookDetail = () => {
    setSelectedBook(null);
    setIsDetailExpanded(false);
  };

  const BookCard: React.FC<{ book: Book }> = ({ book }) => {
    const isAdded = myShelf.some(b => b.id === book.id);
    const addedBook = myShelf.find(b => b.id === book.id);
    const [showOptions, setShowOptions] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setShowOptions(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleActionClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowOptions(!showOptions);
    };

    const handleAdd = (status: 'want_to_read' | 'read') => {
        addToShelf(book, status);
        setShowOptions(false);
    };

    const handleRemove = () => {
        removeFromShelf(book.id);
        setShowOptions(false);
    };

    return (
      <div className="flex-none w-32 sm:w-36 group cursor-pointer relative active:scale-95 transition-transform" onClick={() => handleBookClick(book)}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-sm mb-2 group-hover:shadow-lg transition-all bg-stone-200 dark:bg-stone-800">
          {book.thumbnailUrl ? (
            <img 
              src={book.thumbnailUrl} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-stone-400 dark:text-stone-600">{t('noImage')}</div>
          )}
          
          <button 
            className={`
              absolute top-2 right-2 p-1.5 rounded-full shadow-md z-10 transition-all duration-300
              ${isAdded || showOptions
                ? 'bg-amber-500 text-white opacity-100' 
                : 'bg-white/90 text-stone-600 opacity-0 group-hover:opacity-100 hover:bg-white'}
            `}
            onClick={handleActionClick}
          >
            {isAdded ? (
                addedBook?.status === 'read' ? <CheckCircle2 size={16} /> : <Bookmark size={16} />
            ) : (
                <Plus size={16} />
            )}
          </button>

          {showOptions && (
              <div ref={menuRef} className="absolute top-10 right-2 w-32 bg-white dark:bg-stone-900 shadow-xl rounded-xl border border-stone-100 dark:border-stone-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col p-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAdd('want_to_read'); }}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors text-left ${addedBook?.status === 'want_to_read' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                  >
                      <Bookmark size={14} /> {t('wantToReadShort')}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAdd('read'); }}
                     className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors text-left ${addedBook?.status === 'read' ? 'bg-green-50 dark:bg-green-900/30 text-green-600' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                  >
                      <CheckCircle2 size={14} /> {t('readShort')}
                  </button>
                  {isAdded && (
                    <div className="border-t border-stone-100 dark:border-stone-800 mt-1 pt-1">
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full text-left"
                        >
                            <Trash2 size={14} /> {t('remove')}
                        </button>
                    </div>
                  )}
              </div>
          )}
        </div>
        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400">{book.title}</h4>
        <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">{book.authors[0]}</p>
      </div>
    );
  };

  const BookDetailModal = () => {
    if (!selectedBook) return null;

    const isInShelf = myShelf.some(b => b.id === selectedBook.id);
    const bookStatus = myShelf.find(b => b.id === selectedBook.id)?.status;

    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeBookDetail}></div>
        
        {/* Modal Container - Bottom Sheet on Mobile, Centered on Desktop */}
        <div 
          className={`
            relative bg-white dark:bg-stone-900 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col
            w-full sm:w-full sm:max-w-sm
            ${isDetailExpanded 
              ? 'h-[90vh] rounded-t-3xl sm:rounded-3xl sm:w-[95vw] sm:h-[90vh]' 
              : 'max-h-[85vh] rounded-t-3xl sm:rounded-3xl'}
             animate-slide-up sm:animate-in sm:fade-in sm:zoom-in-95
          `}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              onClick={() => setIsDetailExpanded(!isDetailExpanded)} 
              className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-stone-800 dark:text-white transition-colors"
            >
              {isDetailExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
              onClick={closeBookDetail} 
              className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-stone-800 dark:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drag Handle for Mobile */}
          <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-3 mb-1 sm:hidden opacity-50"></div>

          {/* Content */}
          <div className={`flex flex-col h-full overflow-y-auto ${isDetailExpanded ? 'md:flex-row' : ''}`}>
            
            <div className={`
              relative bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0
              ${isDetailExpanded ? 'w-full md:w-1/3 h-64 md:h-full' : 'h-64 w-full'}
            `}>
              {selectedBook.thumbnailUrl && (
                <img 
                  src={selectedBook.thumbnailUrl} 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl" 
                  alt="" 
                />
              )}
              
              <div className="relative z-10 p-6 flex flex-col items-center text-center">
                 <img 
                  src={selectedBook.thumbnailUrl || 'https://via.placeholder.com/150'} 
                  alt={selectedBook.title} 
                  className={`object-cover shadow-2xl rounded-lg ${isDetailExpanded ? 'w-48 md:w-64' : 'w-32'}`}
                />
              </div>
            </div>

            <div className={`flex-1 p-6 md:p-10 flex flex-col ${isDetailExpanded ? 'overflow-y-auto' : ''}`}>
               <div className="mb-6">
                 <h2 className={`font-black serif text-stone-900 dark:text-stone-100 leading-tight mb-2 ${isDetailExpanded ? 'text-4xl' : 'text-2xl'}`}>
                   {selectedBook.title}
                 </h2>
                 <p className="text-amber-600 dark:text-amber-500 font-bold text-lg">{selectedBook.authors.join(', ')}</p>
                 <p className="text-stone-400 text-sm mt-1">{selectedBook.categories?.join(' • ')}</p>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-amber-500" />
                    <span>{selectedBook.pageCount || '?'} {t('bookPages')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-amber-500" />
                    <span>{selectedBook.publishedDate?.split('-')[0] || 'N/A'}</span>
                  </div>
                  {isDetailExpanded && (
                    <>
                       <div className="flex items-center gap-2">
                        <Languages size={16} className="text-amber-500" />
                        <span className="uppercase">{selectedBook.language || t('bookLanguage')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-amber-500" />
                        <span>{selectedBook.publisher || t('bookPublisher')}</span>
                      </div>
                    </>
                  )}
               </div>

               <div className={`prose dark:prose-invert prose-stone max-w-none text-stone-600 dark:text-stone-300 leading-relaxed ${!isDetailExpanded ? 'line-clamp-4' : ''}`}>
                 <div dangerouslySetInnerHTML={{ __html: selectedBook.description }} />
               </div>

               {/* Actions in Modal */}
               <div className="mt-auto pt-8 flex flex-col gap-3 pb-8 sm:pb-0">
                 {isInShelf ? (
                   <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40 py-3"
                        onClick={() => removeFromShelf(selectedBook.id)}
                      >
                         <Trash2 size={18} /> {t('removeFromLibrary')}
                      </Button>
                      <Button 
                        className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 py-3"
                        onClick={() => addToShelf(selectedBook, bookStatus === 'read' ? 'want_to_read' : 'read')}
                      >
                         {bookStatus === 'read' ? t('wantToRead') : t('read')}
                      </Button>
                   </div>
                 ) : (
                    <div className="flex gap-2">
                        <Button 
                            className="flex-1 bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200 dark:shadow-none shadow-lg border-2 border-transparent py-3"
                            onClick={() => addToShelf(selectedBook, 'want_to_read')}
                        >
                            <Bookmark size={18} className="fill-current" /> {t('wantToRead')}
                        </Button>
                        <Button 
                            className="flex-1 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-2 border-stone-200 dark:border-stone-700 hover:border-green-500 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 py-3"
                            onClick={() => addToShelf(selectedBook, 'read')}
                        >
                            <CheckCircle2 size={18} /> {t('read')}
                        </Button>
                    </div>
                 )}
                 
                 {!isDetailExpanded && (
                   <button 
                    onClick={() => setIsDetailExpanded(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                   >
                     <Maximize2 size={16} /> Detaylar
                   </button>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsModal = () => {
    if (!showSettings) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 serif">{t('settingsTitle')}</h3>
            <button onClick={() => setShowSettings(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"><X /></button>
          </div>
          
          <div className="mb-6 space-y-2 flex-shrink-0">
             <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">{t('settingsLanguageTitle')}</h4>
             <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                <button 
                    onClick={() => setLanguage('tr')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${language === 'tr' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
                >
                    Türkçe
                </button>
                <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
                >
                    English
                </button>
             </div>
          </div>

          <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">{t('settingsCategoryTitle')}</h4>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            {AVAILABLE_CATEGORIES.map(id => (
              <label key={id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors active:bg-stone-100 dark:active:bg-stone-700">
                <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${homeConfig.enabledCategories.includes(id) ? 'bg-amber-500 border-amber-500' : 'border-stone-300 dark:border-stone-600'}`}>
                   {homeConfig.enabledCategories.includes(id) && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={homeConfig.enabledCategories.includes(id)}
                  onChange={() => toggleHomeCategory(id)}
                />
                <span className="text-stone-700 dark:text-stone-300 font-medium">{tCat(id)}</span>
              </label>
            ))}
          </div>
          <Button className="w-full mt-6 flex-shrink-0 py-3" onClick={() => setShowSettings(false)}>{t('save')}</Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col w-full mx-auto bg-white dark:bg-stone-950 shadow-2xl relative pb-24 transition-colors duration-300 max-w-2xl sm:border-x border-stone-100 dark:border-stone-800`}>
      <SettingsModal />
      <BookDetailModal />

      {/* Header */}
      <header className="p-6 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md z-30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-black serif text-stone-800 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <BookIcon className="text-amber-600 dark:text-amber-500" size={28} />
            {t('appName')}
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              className="rounded-full w-10 h-10 p-0 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-90"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            {activeTab === 'search' && (
               <Button 
                variant="secondary" 
                className="rounded-full w-10 h-10 p-0 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-90"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={18} />
              </Button>
            )}
            <Button 
              variant="secondary" 
              className="rounded-full w-10 h-10 p-0 active:scale-90"
              onClick={fetchAiRecommendations}
              loading={isRecommending}
            >
              <Sparkles size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm flex justify-between items-center animate-in fade-in slide-in-from-top-4">
            {error}
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-8 py-6">
            <div className="px-6 space-y-4">
              <form onSubmit={handleSearch} className="relative z-20">
                <input 
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-none rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none shadow-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value) setSearchResults([]);
                  }}
                />
                <Search className="absolute left-4 top-4 text-stone-400" size={20} />
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-4 top-4 transition-colors ${showFilters ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
                >
                  <Filter size={20} />
                </button>
              </form>
              
              {/* Search Filters */}
              {showFilters && (
                <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 animate-in slide-in-from-top-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider ml-1">{t('filterCategory')}</label>
                      <select 
                        className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-sm outline-none"
                        value={filters.category || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="">{t('filterAll')}</option>
                        {AVAILABLE_CATEGORIES.map(id => <option key={id} value={id}>{tCat(id)}</option>)}
                      </select>
                    </div>
                     <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider ml-1">{t('filterSort')}</label>
                      <select 
                        className="w-full p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-sm outline-none"
                        value={filters.orderBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, orderBy: e.target.value as any }))}
                      >
                        <option value="relevance">{t('filterRelevance')}</option>
                        <option value="newest">{t('filterNewest')}</option>
                      </select>
                    </div>
                  </div>
                   <div className="flex justify-end pt-2">
                     <Button size="sm" onClick={() => handleSearch()} className="text-xs h-8">{t('filterBtn')}</Button>
                   </div>
                </div>
              )}
            </div>

            {searchQuery && searchResults.length > 0 ? (
              <div className="px-6 space-y-4">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center justify-between">
                  {t('searchResults')}
                  <button onClick={() => { setSearchQuery(''); setShowFilters(false); }} className="text-xs text-stone-400 font-normal hover:text-stone-600 dark:hover:text-stone-300">{t('clear')}</button>
                </h3>
                <div className="grid gap-4">
                  {isSearching ? (
                    <div className="text-center py-10 text-stone-400 animate-pulse">{t('searching')}</div>
                  ) : (
                    searchResults.map(book => (
                      <div key={book.id} className="flex gap-4 bg-stone-50 dark:bg-stone-900 p-3 rounded-2xl border border-transparent hover:border-amber-200 dark:hover:border-amber-800 transition-all cursor-pointer group active:scale-[0.98]" onClick={() => handleBookClick(book)}>
                        <img src={book.thumbnailUrl} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm bg-stone-200 dark:bg-stone-800" />
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="font-bold text-stone-800 dark:text-stone-100 line-clamp-1">{book.title}</h3>
                          <p className="text-stone-500 dark:text-stone-400 text-xs mb-2">{book.authors.join(', ')}</p>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/30 w-fit px-2 py-0.5 rounded uppercase">
                            {myShelf.some(b => b.id === book.id) ? t('inLibrary') : t('add')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : !searchQuery && (
              <div className="space-y-10 pb-10">
                {isLoadingDiscovery ? (
                  <div className="space-y-8 px-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-4">
                        <div className="h-6 w-40 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse" />
                        <div className="flex gap-4 overflow-hidden">
                          {[1, 2, 3, 4].map(j => (
                            <div key={j} className="h-48 w-32 bg-stone-100 dark:bg-stone-800 rounded-xl animate-pulse flex-none" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  homeCategories.map((cat) => (
                    <div key={cat.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="px-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 serif">{tCat(cat.id)}</h3>
                        <ChevronRight className="text-stone-400 dark:text-stone-600" size={20} />
                      </div>
                      <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar pb-2 snap-x snap-mandatory">
                        {cat.books.length > 0 ? (
                           cat.books.map(book => (
                            <div key={book.id} className="snap-start">
                              <BookCard book={book} />
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-stone-400 dark:text-stone-600 px-2">{t('noBooksCategory')}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shelf' && (
          <section className="p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 serif">{t('myLibrary')}</h2>
              
              {/* Shelf Sub-Navigation */}
              <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setShelfSubTab('want_to_read')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${shelfSubTab === 'want_to_read' ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-500 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                >
                  <Bookmark size={16} /> <span className="hidden sm:inline">{t('wantToRead')}</span> <span className="sm:hidden">{t('wantToReadShort')}</span>
                </button>
                <button 
                  onClick={() => setShelfSubTab('read')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${shelfSubTab === 'read' ? 'bg-white dark:bg-stone-800 text-green-600 dark:text-green-500 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                >
                  <CheckCircle2 size={16} /> <span className="hidden sm:inline">{t('read')}</span> <span className="sm:hidden">{t('readShort')}</span>
                </button>
              </div>
            </div>

            {myShelf.filter(b => b.status === shelfSubTab).length === 0 ? (
              <div className="text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-[3rem] border-2 border-dashed border-stone-200 dark:border-stone-800">
                <Library size={48} className="mx-auto mb-4 opacity-20 dark:opacity-40 dark:text-stone-500" />
                <p className="text-stone-400 dark:text-stone-500 font-medium px-10">
                  {shelfSubTab === 'read' ? t('emptyRead') : t('emptyWantToRead')}
                </p>
                <Button variant="outline" className="mt-4 mx-auto rounded-full dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800" onClick={() => setActiveTab('search')}>{t('searchBookBtn')}</Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {myShelf.filter(b => b.status === shelfSubTab).map(book => (
                  <div key={book.id} className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 p-6 space-y-4 shadow-sm active:scale-[0.98] transition-all group relative overflow-hidden">
                    <div className="flex gap-5 relative z-10" onClick={() => handleBookClick(book)}>
                      <img src={book.thumbnailUrl} alt={book.title} className="w-24 h-36 object-cover rounded-2xl shadow-xl transform bg-stone-200 dark:bg-stone-800 cursor-pointer" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-xl leading-tight line-clamp-2 cursor-pointer hover:text-amber-600 dark:hover:text-amber-500 transition-colors">{book.title}</h3>
                          <button onClick={(e) => { e.stopPropagation(); removeFromShelf(book.id); }} className="text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 mb-3">{book.authors.join(', ')}</p>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          {shelfSubTab === 'read' && (
                            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                  key={star} 
                                  onClick={() => updateRating(book.id, star)}
                                  className="transition-transform active:scale-90"
                                >
                                  <Star 
                                    size={20} 
                                    fill={star <= book.rating ? "#f59e0b" : "none"} 
                                    color={star <= book.rating ? "#f59e0b" : "#3f3f46"} 
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleStatus(book.id); }}
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 border transition-all ${shelfSubTab === 'read' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40'}`}
                          >
                            {shelfSubTab === 'read' ? <CheckCircle2 size={12} /> : <Bookmark size={12} />}
                            {shelfSubTab === 'read' ? t('readStatus') : t('waitStatus')}
                            <span className="opacity-40 font-normal">| {t('change')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {book.description && (
                      <div className="bg-stone-50/50 dark:bg-stone-800/50 p-4 rounded-2xl text-[13px] text-stone-600 dark:text-stone-400 italic line-clamp-2 leading-relaxed border border-stone-100/50 dark:border-stone-800/50">
                        {book.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'recommendations' && (
          <section className="p-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 serif flex items-center gap-2">
                <Sparkles className="text-amber-500" /> {t('curatorDesk')}
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm">{t('curatorDesc')}</p>
            </div>
            
            <div className="space-y-6">
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => (
                  <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900 p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] p-4 opacity-5 dark:opacity-10 pointer-events-none">
                      <Sparkles size={120} className="text-amber-900 dark:text-amber-100" />
                    </div>
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 serif leading-tight">{rec.title}</h3>
                      <p className="text-amber-700 dark:text-amber-500 font-bold text-xs uppercase tracking-widest mt-1">{rec.author}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm p-5 rounded-2xl border border-white/40 dark:border-white/10">
                      <p className="text-stone-700 dark:text-stone-300 text-[14px] leading-relaxed italic font-medium">"{rec.reason}"</p>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-amber-900/10 dark:shadow-none bg-stone-900 dark:bg-amber-600 dark:hover:bg-amber-700 dark:text-white"
                      onClick={async () => {
                        const results = await searchBooks(rec.title);
                        if (results.length > 0) {
                          addToShelf(results[0], 'want_to_read');
                          alert(t('alertAdded'));
                        }
                      }}
                    >
                      {t('addToWishlist')}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-[3rem] border-2 border-dashed border-stone-200 dark:border-stone-800">
                  <Sparkles size={48} className="mx-auto mb-4 text-stone-200 dark:text-stone-700" />
                  <p className="text-stone-400 dark:text-stone-500 font-medium max-w-[200px] mx-auto">{t('curatorEmpty')}</p>
                  <Button variant="primary" className="mt-6 mx-auto rounded-full px-8 dark:bg-stone-800 dark:hover:bg-stone-700" onClick={fetchAiRecommendations} loading={isRecommending}>
                    {t('prepareCuration')}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto min-w-[280px] max-w-[320px] bg-stone-900/70 dark:bg-stone-950/70 backdrop-blur-xl border border-white/10 dark:border-white/5 p-1.5 rounded-full flex justify-between items-center shadow-2xl z-50 gap-1 transition-all duration-300 safe-pb">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all duration-300 active:scale-95 ${activeTab === 'search' ? 'bg-amber-500 text-stone-950 shadow-md flex-grow-[1.5]' : 'text-stone-400 hover:text-stone-200 hover:bg-white/10 flex-grow'}`}
        >
          <Search size={20} strokeWidth={2.5} />
          <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 overflow-hidden transition-all duration-300 ${activeTab === 'search' ? 'max-h-4 opacity-100 block' : 'max-h-0 opacity-0 hidden'}`}>{t('navDiscover')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('shelf')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all duration-300 active:scale-95 ${activeTab === 'shelf' ? 'bg-amber-500 text-stone-950 shadow-md flex-grow-[1.5]' : 'text-stone-400 hover:text-stone-200 hover:bg-white/10 flex-grow'}`}
        >
          <Library size={20} strokeWidth={2.5} />
          <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 overflow-hidden transition-all duration-300 ${activeTab === 'shelf' ? 'max-h-4 opacity-100 block' : 'max-h-0 opacity-0 hidden'}`}>{t('navLibrary')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('recommendations')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all duration-300 active:scale-95 ${activeTab === 'recommendations' ? 'bg-amber-500 text-stone-950 shadow-md flex-grow-[1.5]' : 'text-stone-400 hover:text-stone-200 hover:bg-white/10 flex-grow'}`}
        >
          <Sparkles size={20} strokeWidth={2.5} />
          <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 overflow-hidden transition-all duration-300 ${activeTab === 'recommendations' ? 'max-h-4 opacity-100 block' : 'max-h-0 opacity-0 hidden'}`}>{t('navRecs')}</span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-pb {
            margin-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default App;
