import { useState, useEffect } from 'react';
import { useRobotStore } from '../hooks/useRobotModel';
import { getAllParts, getApiStatus } from '../services/api';
import type { PartCategory } from '../types/robot';

const categories: { label: string; value: PartCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Motion', value: 'motion' },
  { label: 'Sensors', value: 'sensors' },
  { label: 'Power', value: 'power' },
  { label: 'Control', value: 'control' },
  { label: 'Structure', value: 'structure' },
  { label: 'Comms', value: 'communication' },
];

const catBadgeColors: Record<PartCategory, string> = {
  motion: 'bg-orange-500/30 text-orange-300',
  sensors: 'bg-purple-500/30 text-purple-300',
  power: 'bg-red-500/30 text-red-300',
  control: 'bg-blue-500/30 text-blue-300',
  structure: 'bg-slate-500/30 text-slate-300',
  communication: 'bg-teal-500/30 text-teal-300',
};

export default function ControlPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<PartCategory | 'all'>('all');

  const parts = useRobotStore((s) => s.parts);
  const highlightedParts = useRobotStore((s) => s.highlightedParts);
  const setParts = useRobotStore((s) => s.setParts);
  const setApiStatus = useRobotStore((s) => s.setApiStatus);
  const highlightParts = useRobotStore((s) => s.highlightParts);
  const selectPart = useRobotStore((s) => s.selectPart);
  const clearHighlights = useRobotStore((s) => s.clearHighlights);

  useEffect(() => {
    getAllParts().then(setParts).catch(console.error);
    getApiStatus().then(setApiStatus).catch(console.error);
  }, [setParts, setApiStatus]);

  const filtered = parts.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      !search ||
      [p.name, p.id, ...p.keywords].join(' ').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed top-4 left-4 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-800/90 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-slate-700/50 text-sm font-medium hover:bg-slate-700/90 transition-colors shadow-lg mb-2"
      >
        {isOpen ? 'Hide Parts' : 'Show Parts'}
      </button>

      {isOpen && (
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl w-64 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-slate-700/50">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search parts..."
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Category filters */}
          <div className="px-3 py-2 flex flex-wrap gap-1 border-b border-slate-700/50">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Parts list */}
          <div className="max-h-[45vh] overflow-y-auto custom-scrollbar">
            {filtered.map((part) => {
              const isActive = highlightedParts.includes(part.id);
              return (
                <button
                  key={part.id}
                  onClick={() => {
                    highlightParts([part.id]);
                    selectPart(part.id);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-700/40 transition-colors border-b border-slate-700/20 ${
                    isActive ? 'bg-yellow-500/10' : ''
                  }`}
                >
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${catBadgeColors[part.category]}`}>
                    {part.category}
                  </span>
                  <span className={`text-sm ${isActive ? 'text-yellow-300' : 'text-white'}`}>
                    {part.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Clear */}
          {highlightedParts.length > 0 && (
            <div className="p-2 border-t border-slate-700/50">
              <button
                onClick={clearHighlights}
                className="w-full text-xs text-slate-400 hover:text-white py-1 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
