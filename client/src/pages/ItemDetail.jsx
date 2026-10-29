import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiMail,
  FiPhone,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiShield,
  FiX,
  FiImage
} from 'react-icons/fi';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleClaim = async () => {
    if (!claimMessage.trim()) {
      setClaimError('Please provide a descriptive message explaining your ownership');
      return;
    }
    try {
      setClaimError('');
      await api.post('/claims', { item: id, message: claimMessage });
      setClaimSuccess(true);
      setShowClaimModal(false);
      setClaimMessage('');
    } catch (err) {
      setClaimError(err.response?.data?.error || 'Failed to submit claim');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-32" />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <div className="h-96 bg-slate-100 dark:bg-slate-800" />
          <div className="p-8 space-y-4">
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <FiImage className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Item Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          The item you are searching for does not exist or has already been resolved and removed.
        </p>
        <Link
          to="/items"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && item.postedBy && user._id === item.postedBy._id;
  const isLost = item.type === 'lost';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Back Breadcrumb */}
      <Link
        to="/items"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition-colors group"
      >
        <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to listings</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* Image Gallery */}
        {item.images && item.images.length > 0 ? (
          <div>
            <div className="h-80 sm:h-96 md:h-[420px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <img
                src={item.images[activeImage]?.url}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === activeImage
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 bg-slate-100 dark:bg-slate-800/60 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
            <FiImage className="w-10 h-10 stroke-1" />
            <span className="text-sm font-medium">No images uploaded for this item</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Status & Category Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isLost
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {item.type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              {item.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                item.status === 'active'
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                  : item.status === 'claimed'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              Status: {item.status}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
            {item.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base mb-8 whitespace-pre-wrap">
            {item.description}
          </p>

          {/* Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800">
                <FiMapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Location
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {item.location}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800">
                <FiCalendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Date {isLost ? 'Lost' : 'Found'}
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {new Date(item.dateLostOrFound).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {item.contactInfo?.email && (
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800">
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Contact Email
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {item.contactInfo.email}
                  </p>
                </div>
              </div>
            )}

            {item.contactInfo?.phone && (
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800">
                  <FiPhone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Contact Phone
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {item.contactInfo.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Posted By User Pill */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {item.postedBy?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.postedBy?.name || 'Campus Member'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reported {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <FiShield className="w-4 h-4" />
              <span className="hidden sm:inline">Verified Member</span>
            </div>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            {isOwner ? (
              <>
                <Link
                  to={`/items/${item._id}/edit`}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>Edit Item</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-sm font-semibold transition-all"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete Listing</span>
                </button>
              </>
            ) : user && item.status === 'active' ? (
              claimSuccess ? (
                <div className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-sm font-semibold">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Claim submitted successfully! The owner will review your details.</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Submit Claim for this Item</span>
                </button>
              )
            ) : !user ? (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Sign in to Submit a Claim</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Claim Submission Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in duration-200">
            <button
              onClick={() => {
                setShowClaimModal(false);
                setClaimError('');
              }}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Submit Ownership Claim
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Describe unique identifying marks, serial numbers, wallpapers, contents, or circumstances to prove ownership to the item poster.
            </p>

            {claimError && (
              <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl mb-4 text-xs">
                {claimError}
              </div>
            )}

            <textarea
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              placeholder="e.g., The phone has a crack on the top left screen and a blue silicone case with a campus library card inside..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-36 placeholder-slate-400 transition-all"
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleClaim}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                Send Claim
              </button>
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setClaimError('');
                }}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
