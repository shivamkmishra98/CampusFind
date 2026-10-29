import { Link } from 'react-router-dom';
import { FiCompass, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm">
        <FiCompass className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-slate-200 dark:text-slate-800 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        The campus page you are looking for has been moved, resolved, or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-sm transition-all"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
