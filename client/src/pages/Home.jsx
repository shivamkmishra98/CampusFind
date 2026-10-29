import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ItemCard from '../components/items/ItemCard';
import { FiSearch, FiPlusCircle, FiArrowRight, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const res = await api.get('/items?limit=6');
        setItems(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/items');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-16 pb-10 px-4 max-w-5xl mx-auto text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Badge Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span>Official Campus Lost &amp; Found Portal</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
          Find what you lost, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400">
            return what you found.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          The verified marketplace connecting students, faculty, and staff. Report missing belongings and submit verified ownership claims in seconds.
        </p>

        {/* Quick Search Bar */}
        <form onSubmit={handleQuickSearch} className="max-w-xl mx-auto mb-10">
          <div className="relative flex items-center shadow-lg shadow-indigo-500/5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <FiSearch className="w-5 h-5 text-slate-400 ml-3.5 flex-shrink-0" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Search for keys, student ID, laptop, water bottle..."
              className="w-full px-3.5 py-2.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/items/new?type=lost"
            className="flex-1 flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-rose-600/20 active:scale-[0.98] transition-all"
          >
            <FiSearch className="w-4 h-4" />
            <span>I Lost Something</span>
          </Link>
          <Link
            to="/items/new?type=found"
            className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>I Found Something</span>
          </Link>
        </div>

        {/* Value Prop Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-14 pt-8 border-t border-slate-200/70 dark:border-slate-800/80 text-left">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FiShield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Verified Campus ID</p>
              <p className="text-[11px] text-slate-500">Only verified campus members</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Claim Verification</p>
              <p className="text-[11px] text-slate-500">Approve or reject inquiries</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FiClock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Real-Time Alerts</p>
              <p className="text-[11px] text-slate-500">Fast community resolution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recently Reported
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Latest items posted by students and campus departments
            </p>
          </div>
          <Link
            to="/items"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group"
          >
            <span>View All Listings</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 h-[380px] p-4 flex flex-col space-y-4 animate-pulse"
              >
                <div className="h-44 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FiSearch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              No items reported yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Be the first to report a lost or found item for the campus.
            </p>
            <Link
              to="/items/new"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
