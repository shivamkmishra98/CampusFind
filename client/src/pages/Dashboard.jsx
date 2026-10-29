import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FiPlus,
  FiLayers,
  FiCheckCircle,
  FiInbox,
  FiSend,
  FiEdit3,
  FiTrash2
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalItems: 0, resolvedItems: 0, activeClaims: 0 });
  const [myItems, setMyItems] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [sentClaims, setSentClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, itemsRes, receivedRes, sentRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/items/my-items'),
          api.get('/claims/received'),
          api.get('/claims/sent')
        ]);
        setStats(statsRes.data.data);
        setMyItems(itemsRes.data.data);
        setReceivedClaims(receivedRes.data.data);
        setSentClaims(sentRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleClaimResponse = async (claimId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this claim?`)) return;
    try {
      await api.patch(`/claims/${claimId}/respond`, { status });
      const res = await api.get('/claims/received');
      setReceivedClaims(res.data.data);
      const statsRes = await api.get('/users/stats');
      setStats(statsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update claim');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${itemId}`);
      setMyItems(prev => prev.filter(item => item._id !== itemId));
      const statsRes = await api.get('/users/stats');
      setStats(statsRes.data.data);
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-8">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl h-32 border border-slate-200/80 dark:border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60">
              Campus Member
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>. Manage your reported items and incoming claims.
          </p>
        </div>

        <Link
          to="/items/new"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
        >
          <FiPlus className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Items Posted
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {stats.totalItems}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60">
            <FiLayers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Items Resolved
            </p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5">
              {stats.resolvedItems}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/60">
            <FiCheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Claims
            </p>
            <p className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 mt-1.5">
              {stats.activeClaims}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/60">
            <FiInbox className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl mb-8 space-x-1">
        {[
          { key: 'items', label: 'My Posted Items', count: myItems.length, icon: FiLayers },
          { key: 'received', label: 'Claims Received', count: receivedClaims.length, icon: FiInbox },
          { key: 'sent', label: 'Claims Sent', count: sentClaims.length, icon: FiSend }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab: My Items */}
      {activeTab === 'items' && (
        <div className="space-y-3.5">
          {myItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FiLayers className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                You haven't posted any items yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Have you lost or found something around campus? Create your first listing.
              </p>
              <Link
                to="/items/new"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <FiPlus className="w-4 h-4" />
                <span>Post Item Now</span>
              </Link>
            </div>
          ) : (
            myItems.map(item => (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                    {item.images?.[0] ? (
                      <img src={item.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/items/${item._id}`}
                      className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-sm sm:text-base truncate block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          item.type === 'lost'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          item.status === 'active'
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : item.status === 'claimed'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        📍 {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                  <Link
                    to={`/items/${item._id}/edit`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <FiEdit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Received Claims */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedClaims.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FiInbox className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                No claims received yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                When another user submits a claim on one of your posted items, it will appear here for your review.
              </p>
            </div>
          ) : (
            receivedClaims.map(claim => (
              <div
                key={claim._id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3.5 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        {claim.claimant?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {claim.claimant?.name}
                      </p>
                      <span className="text-xs text-slate-400">wants to claim</span>
                      <Link
                        to={`/items/${claim.item?._id}`}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {claim.item?.title}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-9">
                      {claim.claimant?.email}
                    </p>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      claim.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : claim.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 border border-slate-200/60 dark:border-slate-800/80 italic">
                  "{claim.message}"
                </div>

                {claim.status === 'pending' && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleClaimResponse(claim._id, 'approved')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                    >
                      Approve Claim
                    </button>
                    <button
                      onClick={() => handleClaimResponse(claim._id, 'rejected')}
                      className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold rounded-xl transition-all"
                    >
                      Reject Claim
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Sent Claims */}
      {activeTab === 'sent' && (
        <div className="space-y-3.5">
          {sentClaims.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FiSend className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                You haven't submitted any claims yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Found your lost item in the public listings? Submit a claim with proof of ownership.
              </p>
              <Link
                to="/items"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <span>Browse Listings</span>
              </Link>
            </div>
          ) : (
            sentClaims.map(claim => (
              <div
                key={claim._id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Claim on</span>
                    <Link
                      to={`/items/${claim.item?._id}`}
                      className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
                    >
                      {claim.item?.title}
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    📍 {claim.item?.location}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex-shrink-0 ${
                    claim.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : claim.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {claim.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
