import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              LF
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Campus Lost &amp; Found
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
              — A peer-to-peer campus recovery network
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/items" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Browse Listings
            </Link>
            <Link to="/items/new?type=lost" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Report Lost
            </Link>
            <Link to="/items/new?type=found" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Report Found
            </Link>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Campus Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
