import React, { useState } from 'react';
import { MOCK_WORKER_PROFILE } from '@/services/workerDashboardMockData';
import { Button } from '@/components/common/Button';
import { 
  Image as ImageIcon, 
  Plus, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';

export const WorkerPortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState(MOCK_WORKER_PROFILE.portfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Wiring & Circuit');
  const [newDesc, setNewDesc] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      setPortfolio([
        ...portfolio,
        {
          id: `p-${Date.now()}`,
          title: newTitle.trim(),
          tag: newTag,
          image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=500&auto=format&fit=crop&q=80',
          date: 'Just now',
          description: newDesc.trim() || 'Work evidence photo uploaded by worker.',
        },
      ]);
      setNewTitle('');
      setNewDesc('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-gov-green" />
            <span>Work Evidence & Portfolio Gallery</span>
          </h1>
          <p className="text-xs sm:text-sm text-gov-muted">
            Photographic proof of completed electrical installations and repair projects
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold shadow-xs"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Project Photo
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-gov-navy/90 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              <div className="p-5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[10px] text-gov-muted font-bold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.date}</span>
                  </span>
                  <span className="text-emerald-700">Verified Shift</span>
                </div>

                <h3 className="font-black text-base text-gov-navy leading-snug">
                  {item.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Cooperative Verified Proof</span>
              <CheckCircle2 className="w-4 h-4 text-gov-green" />
            </div>
          </div>
        ))}
      </div>

      {/* Upload Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gov-border shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-black text-lg text-gov-navy">Upload Work Evidence Photo</h3>
            
            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 5kVA Solar Inverter Setup"
                  className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category / Tag</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                >
                  <option value="Wiring & Circuit">Wiring & Circuit</option>
                  <option value="Inverter & Solar">Inverter & Solar</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Earthing & Safety">Earthing & Safety</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly describe the installation or repair..."
                  className="w-full font-medium border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1 py-2.5 text-xs font-bold">
                  Save to Portfolio
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
