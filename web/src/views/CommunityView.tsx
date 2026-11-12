import React, { useState } from 'react';
import {
  Users,
  HandHeart,
  Share2,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle,
  MapPin,
  Phone,
  Sparkles,
  Award,
} from 'lucide-react';
import { CommunityPost, CommunitySummary } from '../types';

interface CommunityViewProps {
  posts: CommunityPost[];
  summary: CommunitySummary | null;
  onCreatePost: (post: Omit<CommunityPost, 'id'>) => void;
  onUpdateStatus: (id: number, status: string) => void;
  onDeletePost: (id: number) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  summary,
  onCreatePost,
  onUpdateStatus,
  onDeletePost,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [postType, setPostType] = useState<'lend_borrow' | 'volunteer' | 'skill_share' | 'alert'>('lend_borrow');
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [karmaOffered, setKarmaOffered] = useState(15);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !authorName.trim()) return;
    onCreatePost({
      type: postType,
      title: postTitle.trim(),
      description: postDesc.trim(),
      author_name: authorName.trim(),
      contact: contact.trim(),
      location: location.trim() || 'Neighborhood Block',
      status: 'open',
      karma_offered: karmaOffered,
    });
    setPostTitle('');
    setPostDesc('');
    setIsModalOpen(false);
  };

  const filteredPosts = posts.filter((p) => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
    lend_borrow: { label: 'Lend & Borrow', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: Share2 },
    volunteer: { label: 'Volunteer Aid', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: HandHeart },
    skill_share: { label: 'Skill Exchange', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', icon: Sparkles },
    alert: { label: 'Local Notice', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertCircle },
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Posts */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Active Community Posts
            </span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {summary?.active_posts || 0}
            </div>
          </div>
        </div>

        {/* Items to Borrow */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Items for Loan / Share
            </span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
              {summary?.items_available_to_borrow || 0}
            </div>
          </div>
        </div>

        {/* Volunteer Ops */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <HandHeart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Volunteer Opportunities
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {summary?.volunteer_opportunities || 0}
            </div>
          </div>
        </div>

        {/* Community Karma Points */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Neighborhood Karma
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {summary?.community_karma_points || 0} pts
            </div>
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-violet-400" />
              <span>Neighborhood Bulletin & Mutual Aid</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Borrow heavy tools, exchange skills, and support local community initiatives.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Type Filters */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs space-x-1 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'lend_borrow', label: 'Borrow/Lend' },
                { id: 'volunteer', label: 'Volunteering' },
                { id: 'skill_share', label: 'Skills' },
                { id: 'alert', label: 'Alerts' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilterType(item.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    filterType === item.id
                      ? 'bg-violet-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post to Board</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => {
            const config = typeConfig[post.type] || typeConfig.lend_borrow;
            const Icon = config.icon;
            const isClaimed = post.status === 'claimed';
            const isCompleted = post.status === 'completed';

            return (
              <div
                key={post.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : isClaimed
                    ? 'bg-slate-850/90 border-violet-500/40'
                    : 'bg-slate-850 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1.5 ${config.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{config.label}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        +{post.karma_offered} Karma
                      </span>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white">{post.title}</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold text-slate-200">{post.author_name}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{post.location}</span>
                    </div>
                    {post.contact && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-cyan-400 font-mono">
                        <Phone className="w-3 h-3" />
                        <span>{post.contact}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs capitalize font-semibold text-slate-400">
                    Status: <span className={isCompleted ? 'text-emerald-400' : isClaimed ? 'text-amber-400' : 'text-cyan-400'}>{post.status}</span>
                  </span>

                  <div className="flex space-x-2">
                    {post.status === 'open' && (
                      <button
                        onClick={() => onUpdateStatus(post.id, 'claimed')}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        {post.type === 'lend_borrow' ? 'Request to Borrow' : 'Volunteer to Help'}
                      </button>
                    )}

                    {post.status === 'claimed' && (
                      <button
                        onClick={() => onUpdateStatus(post.id, 'completed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    {post.status === 'completed' && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolved ✓</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create Neighborhood Post</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post Type</label>
                <select
                  value={postType}
                  onChange={(e: any) => setPostType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-400"
                >
                  <option value="lend_borrow">Lend / Borrow Equipment or Item</option>
                  <option value="volunteer">Volunteer Aid Request</option>
                  <option value="skill_share">Skill Exchange / Teaching</option>
                  <option value="alert">Neighborhood Notice / Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Lawn Mower Available to Borrow for Weekend"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  placeholder="Item details, schedule, or request specifics..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Subrat K."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact (Phone/Email)
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. +91-98765-XXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location / Apartment
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Tower B, Flat 302"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
