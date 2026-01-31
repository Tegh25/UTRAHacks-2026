import { useEffect, useState } from 'react';
import { useRobotStore } from '../hooks/useRobotModel';
import { getPartDetails } from '../services/api';
import type { RobotPart, PartCategory } from '../types/robot';

const categoryColors: Record<PartCategory, string> = {
  motion: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  sensors: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  power: 'bg-red-500/20 text-red-300 border-red-500/30',
  control: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  structure: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  communication: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

export default function PartInfoPanel() {
  const selectedPart = useRobotStore((s) => s.selectedPart);
  const highlightedParts = useRobotStore((s) => s.highlightedParts);
  const parts = useRobotStore((s) => s.parts);
  const clearHighlights = useRobotStore((s) => s.clearHighlights);
  const selectPart = useRobotStore((s) => s.selectPart);
  const highlightParts = useRobotStore((s) => s.highlightParts);

  const [detail, setDetail] = useState<{ part: RobotPart; relatedParts: RobotPart[] } | null>(null);

  useEffect(() => {
    if (!selectedPart) {
      setDetail(null);
      return;
    }
    getPartDetails(selectedPart)
      .then(setDetail)
      .catch(() => setDetail(null));
  }, [selectedPart]);

  if (!selectedPart && highlightedParts.length === 0) return null;

  const highlightedPartObjects = parts.filter((p) => highlightedParts.includes(p.id));

  return (
    <div className="fixed top-4 right-4 z-20 w-72 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <h3 className="text-white text-sm font-semibold">
          {detail ? 'Part Details' : `${highlightedParts.length} Part(s) Found`}
        </h3>
        <button
          onClick={clearHighlights}
          className="text-slate-400 hover:text-white text-xs transition-colors"
        >
          Close
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {detail ? (
          <>
            {/* Category badge */}
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded border ${categoryColors[detail.part.category]}`}
            >
              {detail.part.category}
            </span>

            <h4 className="text-white font-semibold text-lg leading-tight">{detail.part.name}</h4>
            <p className="text-slate-400 text-xs font-mono">{detail.part.id}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{detail.part.description}</p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5">
              {detail.part.keywords.map((kw) => (
                <span
                  key={kw}
                  className="bg-slate-700/50 text-slate-400 text-[10px] px-1.5 py-0.5 rounded"
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* Related parts */}
            {detail.relatedParts.length > 0 && (
              <div>
                <p className="text-slate-500 text-xs mb-1.5">Related parts:</p>
                <div className="flex flex-col gap-1">
                  {detail.relatedParts.map((rp) => (
                    <button
                      key={rp.id}
                      onClick={() => {
                        highlightParts([rp.id]);
                        selectPart(rp.id);
                      }}
                      className="text-left text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {rp.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Highlighted parts list */
          <div className="flex flex-col gap-1.5">
            {highlightedPartObjects.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPart(p.id)}
                className="flex items-center gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${categoryColors[p.category]}`}
                >
                  {p.category}
                </span>
                <span className="text-white text-sm">{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
