import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2 
} from 'lucide-react';

interface Step7Props {
  portfolio: Array<{
    title: string;
    service_type: string;
    description?: string;
    image_url: string;
    before_image_url?: string;
    work_date?: string;
  }>;
  onChange: (items: Step7Props['portfolio']) => void;
}

const SAMPLE_PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=500&auto=format&fit=crop&q=80',
];

export const Step7Portfolio: React.FC<Step7Props> = ({
  portfolio,
  onChange,
}) => {
  const [title, setTitle] = useState('');
  const [serviceType, setServiceType] = useState('Installation');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PORTFOLIO_IMAGES[0]);
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [workDate, setWorkDate] = useState('Jan 2024');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && imageUrl.trim()) {
      onChange([
        ...portfolio,
        {
          title: title.trim(),
          service_type: serviceType,
          description: description.trim(),
          image_url: imageUrl.trim(),
          before_image_url: beforeImageUrl.trim() || undefined,
          work_date: workDate,
        },
      ]);
      setTitle('');
      setDescription('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(portfolio.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-gov-green" />
          <span>Step 7: Previous Work Portfolio Gallery</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          Add photos of your completed projects and craftsmanship to build trust with citizens
        </p>
      </div>

      {/* Existing Portfolio Grid */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {portfolio.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs relative group flex flex-col justify-between"
            >
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 shadow-md z-10 transition-opacity"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div>
                <div className="h-36 overflow-hidden bg-slate-100">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="p-3.5 space-y-1">
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                    {item.service_type}
                  </span>
                  <h4 className="font-extrabold text-xs text-gov-navy truncate">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[11px] text-gov-muted line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-3.5 py-2 border-t border-slate-100 text-[10px] text-slate-400">
                Completed: {item.work_date}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Work Project Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
          <Plus className="w-4 h-4 text-gov-green" />
          <span>Add a Previous Work Project</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Project / Repair Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3BHK Main Distribution Board Wiring"
              className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            />
          </div>

          {/* Service Type Tag */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Service Category Tag *
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            >
              <option value="Installation">Installation</option>
              <option value="Repair">Repair & Maintenance</option>
              <option value="Wiring">Wiring & Circuit</option>
              <option value="Renovation">Renovation / Fitting</option>
              <option value="Deep Clean">Deep Clean</option>
            </select>
          </div>

        </div>

        {/* Image Selection */}
        <div className="space-y-2 text-xs">
          <label className="block font-bold text-slate-700">
            Work Photo (Select sample photo or enter URL) *
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PORTFOLIO_IMAGES.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(url)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  imageUrl === url
                    ? 'border-gov-green scale-105 shadow-xs'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste external image URL..."
            className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green text-xs"
          />
        </div>

        {/* Optional Before Photo & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Optional "Before" Photo URL (Before/After comparison)
            </label>
            <input
              type="text"
              value={beforeImageUrl}
              onChange={(e) => setBeforeImageUrl(e.target.value)}
              placeholder="e.g. https://... (Optional)"
              className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Work Date / Month
            </label>
            <input
              type="text"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              placeholder="e.g. Jan 2024"
              className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green text-xs"
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-xs">
          <label className="block font-bold text-slate-700 mb-1">
            Brief Project Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Installed modular MCB, surge protectors, and completed earthing test."
            className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
          />
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="px-5 py-2.5 rounded-xl bg-gov-navy text-white text-xs font-bold hover:bg-blue-900 transition-colors"
        >
          + Save to Portfolio
        </button>
      </div>

    </div>
  );
};
