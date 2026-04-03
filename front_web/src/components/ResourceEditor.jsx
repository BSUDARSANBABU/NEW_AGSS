import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Quote,
  Eye,
  MoreVertical,
  ChevronDown,
  UploadCloud,
  X,
  PanelRightClose,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const ResourceEditor = ({ onClose, initialData }) => {
  const [content, setContent] = useState(initialData?.content || '');
  const [title, setTitle] = useState(initialData?.title || 'The Modern Architectural Approach to Scalable Data Systems');
  const [category, setCategory] = useState(initialData?.category || 'Guide');
  const [author, setAuthor] = useState(initialData?.author || 'Alex Chen');
  const [tags, setTags] = useState(initialData?.tags || ['ARCHITECTURE', 'SYSTEMS']);
  const [slug, setSlug] = useState(initialData?.slug || 'modern-architectural-approach');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || 'A deep dive into clinical architecture of modern distributed data systems and minimalist interface design.');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-surface flex flex-col font-sans"
    >
      {/* Top Action Bar */}
      <header className="h-16 border-b border-outline-variant/20 bg-white flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-black text-on-surface tracking-tighter">Editor Workspace</span>
          <nav className="flex gap-6 ml-8 text-sm font-medium">
            <button className="text-on-surface-variant hover:text-primary transition-colors">Drafts</button>
            <button className="text-primary border-b-2 border-primary pb-2">Published</button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">Scheduled</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors rounded-full">
            Save Draft
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">
            Publish
          </button>
          <div className="flex items-center gap-2 border-l border-outline-variant/20 ml-4 pl-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <Eye size={20} />
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <MoreVertical size={20} />
            </button>
            <img
              alt="Admin User"
              className="w-8 h-8 rounded-full ml-2 ring-2 ring-primary-fixed/30"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJuVWKY1W-exKtnFWrhH6Yk_E6ZzEFTvXpzh1aHJNum7dGvQjKoA0Q2yNbmTK2sQrtnMKmAJ7X74TrrAF8yHUss4_uARysaKhXOqthAsEVFsUKCP6-zJmMwjPL4WKXZhZoR9UBcjepZBoOP58OvFTVMOhd6mhz5W47f17fVFtkAJrBUmTvnzUGCnhn-KF5jekhrf6qr8w6O5G_DKlUPruB5r-oyqAf2PV9huLfF1FDYSL-IHT0JQQdjTzsNRGcpFUtuCd_AsSdAtA"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Editor Pane */}
        <section className="flex-1 flex flex-col bg-surface-container-lowest border-r border-outline-variant/10">
          {/* Toolbar */}
          <div className="h-12 flex items-center px-6 gap-2 bg-surface-container-low/50 border-b border-outline-variant/10">
            <div className="flex items-center gap-1 pr-4 border-r border-outline-variant/20">
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><Bold size={18} /></button>
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><Italic size={18} /></button>
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><Strikethrough size={18} /></button>
            </div>
            <div className="flex items-center gap-1 px-4 border-r border-outline-variant/20">
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><Code size={18} /></button>
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><LinkIcon size={18} /></button>
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><ImageIcon size={18} /></button>
            </div>
            <div className="flex items-center gap-1 pl-4">
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><List size={18} /></button>
              <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"><Quote size={18} /></button>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant/50 uppercase">Markdown Enabled</span>
            </div>
          </div>
          {/* Text Area */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
            <textarea
              className="w-full h-full border-none focus:ring-0 resize-none font-body text-lg text-on-surface placeholder:text-neutral-300 leading-relaxed bg-transparent"
              placeholder="Start crafting your resource here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>

        {/* Right Preview Pane */}
        <section className="flex-1 bg-surface overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 flex items-center gap-4">
              <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold tracking-widest uppercase rounded">Isoform Preview</span>
              <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
            </div>
            <article className="prose prose-neutral max-w-none">
              <h1 className="text-4xl font-extrabold text-on-surface mb-6 tracking-tight leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-4 mb-8">
                <img
                  alt="Author Avatar"
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXyLmQWIeeRgu1-Q2TN_4FUDI_UOCUMSIx2h9s3GqYXsAdq-V4wtB2PHT-VQ4n_qypcmV_AshCpjptY6x4goDkyFTjVQeBJ4JVRQdezIx3FBvUJCAk1gcNt86rjo_EULasP2_EaS3JvZZFYv12stdW3ES9IH5rqgpjnF2rEpHvslzncalpv8DBY_Qe0trabgbE5DFdrQKJHu95xBKvMcnwLHSF_Flv3BH336biwQIg0IB96une7Y0NAbv2p7SPFdIlaPFiTLOi588"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-sm font-bold text-on-surface">{author}</p>
                  <p className="text-xs text-on-surface-variant">Lead Architect • Oct 24, 2023</p>
                </div>
              </div>
              <img
                alt="Featured Image"
                className="w-full h-64 object-cover rounded-xl mb-10 shadow-sm border border-outline-variant/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA56OsuUBaJYyeohUxLbEQ627Hdhy-QpqC3nRXvEFRpwo5RqG-Og0sGG-Jg3Hpjs7VUUXf-LcPLwzJxxv9lssZeDZAJ3Agh1NN1EGIfhIfC2seQ1ImwuecHdSCqEK8FCr8cPdvQv6Ux7HnjtsBnWjG8vV_4HCZHoz6-X8SyRyceBMsQyocBshBVYy1HIj1-k-WVotBm0X_3jBXIH_8rf4qiEqBb9x1LNSu1BWN8QUQpzPdvEvRK4hpcXyk9aZIJ7jXpbPKbygDuCwQ"
                referrerPolicy="no-referrer"
              />
              <div className="text-lg leading-relaxed text-on-surface-variant space-y-6">
                <p>
                  In landscape of modern infrastructure, precision is not just a preference—it is a mandatory architectural primitive. As we transition from monolithic data silos to distributed event streams, mental model of engineer must shift from construction to clinical curation.
                </p>
                <p>
                  The "Clinical Architect" methodology emphasizes intentional void. By reducing noise in our visual interfaces and our underlying schemas, we allow signal—the data—to surface with maximum impact. This guide explores core tenets of technical minimalism in production environments...
                </p>
                {content && (
                  <div className="mt-8 pt-8 border-t border-outline-variant/10">
                    {content.split('\n').map((line, i) => (
                      <p key={i} className="mb-4">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* Metadata Sidebar */}
        <aside className="w-80 bg-surface-container-low border-l border-outline-variant/10 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Resource Metadata</h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <PanelRightClose size={18} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">Document Title</label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary-fixed/30 transition-all outline-none"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['Guide', 'Blog', 'Tool'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "py-2 text-[10px] font-bold uppercase tracking-wider rounded border transition-all",
                      category === cat
                        ? "border-primary text-primary bg-primary-fixed/20"
                        : "border-outline-variant/20 text-on-surface-variant hover:bg-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">Author</label>
              <div className="relative">
                <select
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3 text-sm appearance-none focus:border-primary outline-none"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                >
                  <option>Alex Chen</option>
                  <option>Sarah Miller</option>
                  <option>David Kroll</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-3 pointer-events-none text-on-surface-variant" />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">Featured Image</label>
              <div className="w-full aspect-video bg-surface-container-lowest border-2 border-dashed border-outline-variant/20 rounded-xl flex flex-col items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden">
                <img
                  alt="Preview thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp0JNfqrNPUHfPW_yEWHu6ZtpnQUR2ypz2rIXwLYx2nEdKrIjLbpwc8lXK8LdsYV87UNBjkWRO9WrtbldyuRha5XwCnuPeo7XIF8tqgMGoDQGQu2SND_3hy1SgrUZb4ksC_r1qT5IekPxSL5IZ7sNwt9PvKYxGFBK61_8Gwa11mRgsPJ8YLvTx9ZlSNKqeCFZg6rkKStqMnwd4gYyrrZH6QO3yHd0cB6ckqEMcWaHf8K9Tl68PZGkCupjlRT010LdD2RC_YWpXSjI"
                  referrerPolicy="no-referrer"
                />
                <UploadCloud size={32} className="text-on-surface-variant mb-2 group-hover:text-primary transition-colors relative z-10" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider relative z-10">Replace Asset</span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold">
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="hover:text-destructive transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-xs focus:border-primary outline-none"
                placeholder="Add tag..."
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.trim().toUpperCase();
                    if (val && !tags.includes(val)) {
                      setTags([...tags, val]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>

            {/* SEO */}
            <div className="space-y-4 pt-4 border-t border-outline-variant/10">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">SEO Configuration</label>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <X size={16} /> {/* Placeholder for settings icon */}
                </button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-medium text-on-surface-variant/50 uppercase">URL Slug</label>
                  <div className="flex items-center bg-surface-container-lowest border border-outline-variant/20 rounded p-2 text-[11px]">
                    <span className="text-on-surface-variant/40">/resource/</span>
                    <input
                      className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-[11px] font-medium"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-medium text-on-surface-variant/50 uppercase">Meta Description</label>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded p-2 text-[11px] focus:ring-0 outline-none resize-none"
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eeeeee; border-radius: 10px; }
      `}</style>
    </motion.div>
  );
};
