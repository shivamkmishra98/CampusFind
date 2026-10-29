import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../utils/api';
import { FiUploadCloud, FiX, FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'ID Cards', 'Keys', 'Accessories', 'Other'];

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  type: z.enum(['lost', 'found']),
  category: z.enum(CATEGORIES),
  location: z.string().min(2, 'Location is required'),
  dateLostOrFound: z.string().min(1, 'Date is required'),
  contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  contactPhone: z.string().optional()
});

const PostItem = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: searchParams.get('type') === 'found' ? 'found' : 'lost'
    }
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (isEdit) {
      const fetchItem = async () => {
        try {
          const res = await api.get(`/items/${id}`);
          const item = res.data.data;
          reset({
            title: item.title,
            description: item.description,
            type: item.type,
            category: item.category,
            location: item.location,
            dateLostOrFound: item.dateLostOrFound?.split('T')[0] || '',
            contactEmail: item.contactInfo?.email || '',
            contactPhone: item.contactInfo?.phone || ''
          });
          if (item.images) {
            setExistingImages(item.images);
          }
        } catch (err) {
          navigate('/dashboard');
        }
      };
      fetchItem();
    }
  }, [id, isEdit, reset, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.type);
      formData.append('category', data.category);
      formData.append('location', data.location);
      formData.append('dateLostOrFound', data.dateLostOrFound);

      if (data.contactEmail || data.contactPhone) {
        formData.append('contactInfo[email]', data.contactEmail || '');
        formData.append('contactInfo[phone]', data.contactPhone || '');
      }

      images.forEach(img => {
        formData.append('images', img);
      });

      if (isEdit) {
        await api.put(`/items/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong while saving the item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Back button */}
      <Link
        to={isEdit ? `/items/${id}` : '/items'}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition-colors group"
      >
        <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>{isEdit ? 'Back to item details' : 'Back to listings'}</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEdit ? 'Edit Item Details' : 'Report an Item'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Fill in the information below to broadcast your report to the campus network
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 p-4 rounded-2xl mb-6 text-sm">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Segmented Type Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Item Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input type="radio" value="lost" {...register('type')} className="sr-only" />
                <div
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    selectedType === 'lost'
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 shadow-sm ring-2 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>I Lost Something</span>
                </div>
              </label>

              <label className="cursor-pointer">
                <input type="radio" value="found" {...register('type')} className="sr-only" />
                <div
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    selectedType === 'found'
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>I Found Something</span>
                </div>
              </label>
            </div>
            {errors.type && <p className="text-rose-500 text-xs mt-1.5">{errors.type.message}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('title')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
              placeholder="e.g., Midnight Blue MacBook Air 13-inch"
            />
            {errors.title && <p className="text-rose-500 text-xs mt-1.5">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all placeholder-slate-400"
              placeholder="Describe distinguishing marks, brand, stickers, accessories, conditions..."
            />
            {errors.description && <p className="text-rose-500 text-xs mt-1.5">{errors.description.message}</p>}
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-rose-500 text-xs mt-1.5">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                {...register('location')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                placeholder="e.g., Campus Library 2nd Floor"
              />
              {errors.location && <p className="text-rose-500 text-xs mt-1.5">{errors.location.message}</p>}
            </div>
          </div>

          {/* Date Lost/Found */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Date {selectedType === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              {...register('dateLostOrFound')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer"
            />
            {errors.dateLostOrFound && <p className="text-rose-500 text-xs mt-1.5">{errors.dateLostOrFound.message}</p>}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Email <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                {...register('contactEmail')}
                type="email"
                placeholder="you@campus.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Phone <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                {...register('contactPhone')}
                type="tel"
                placeholder="(555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Photos <span className="text-slate-400 font-normal lowercase">(up to 5 images)</span>
            </label>

            {/* Existing images (edit mode) */}
            {existingImages.length > 0 && (
              <div className="flex gap-3 mb-3 flex-wrap">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center shadow-md hover:bg-rose-700 transition-all"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New images */}
            {previewUrls.length > 0 && (
              <div className="flex gap-3 mb-3 flex-wrap">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center shadow-md hover:bg-rose-700 transition-all"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center mb-2 transition-colors">
                <FiUploadCloud className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click to upload images
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                PNG, JPG, WEBP up to 5MB
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all text-sm flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span>Saving details...</span>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                <span>{isEdit ? 'Save Changes' : 'Broadcast Listing'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
