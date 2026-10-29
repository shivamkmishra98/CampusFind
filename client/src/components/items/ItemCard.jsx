import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiMapPin, FiCalendar, FiArrowRight, FiImage } from 'react-icons/fi';

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  const badgeClasses = isLost
    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/50 flex flex-col h-full overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
      {/* Thumbnail Area */}
      <div className="relative h-48 bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0].url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-1.5">
            <FiImage className="w-8 h-8 stroke-1" />
            <span className="text-xs font-medium">No photo uploaded</span>
          </div>
        )}

        {/* Status Chip */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${badgeClasses}`}>
            {item.type}
          </span>
        </div>

        {/* Category Pill */}
        {item.category && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/70 backdrop-blur-md text-white">
              {item.category}
            </span>
          </div>
        )}
      </div>

      {/* Body Area */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
          {item.description}
        </p>

        {/* Metadata Details */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <FiMapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCalendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{new Date(item.dateLostOrFound).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
          <Link
            to={`/items/${item._id}`}
            className="inline-flex items-center space-x-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors"
          >
            <span>View</span>
            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
