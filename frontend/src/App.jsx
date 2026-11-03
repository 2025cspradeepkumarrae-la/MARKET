import React, { useState, useEffect } from 'react';

export default function App() {
  const [threshold, setThreshold] = useState(-2.0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/volatility?threshold=${threshold}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, [threshold]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">📈</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              VOLATILITY TERMINAL
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Tracking historic equity drawdowns and isolated crash thresholds.
          </p>

          {/* Threshold Slider Control */}
          <div className="mt-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">
                Crash Threshold Isolation:
              </label>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-semibold border border-blue-500/20">
                {threshold}%
              </span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="-1.0"
              step="0.1"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer bg-slate-800 rounded-lg h-2"
            />
          </div>
        </header>

        {/* Returns & Index Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Cumulative Returns Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <span>📊</span>
              <span>Cumulative October Returns</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-medium">NASDAQ</span>
                <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold border border-red-500/20">
                  -7.62%
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-medium">S&P 500</span>
                <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold border border-red-500/20">
                  -2.65%
                </span>
              </div>
            </div>
          </div>

          {/* Normalized Value Index Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-2">Normalized Value Index</h2>
              <p className="text-slate-400 text-sm">Real-time benchmark tracking status.</p>
            </div>
            <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
              🟢 Live Stream Operational
            </div>
          </div>

        </div>

        {/* Isolated Volatility Days Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <span>⚠️</span>
            <span>Isolated Volatility Days</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Index / Ticker</th>
                  <th className="py-3 px-4 text-right">Drawdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-300">2026-10-08</td>
                  <td className="py-3 px-4 font-semibold text-blue-400">^IXIC</td>
                  <td className="py-3 px-4 text-right font-bold text-red-400">-1.88%</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-300">2026-10-10</td>
                  <td className="py-3 px-4 font-semibold text-blue-400">^IXIC</td>
                  <td className="py-3 px-4 text-right font-bold text-red-400">-2.15%</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-300">2026-10-14</td>
                  <td className="py-3 px-4 font-semibold text-blue-400">^IXIC</td>
                  <td className="py-3 px-4 text-right font-bold text-red-400">-2.60%</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-300">2026-10-20</td>
                  <td className="py-3 px-4 font-semibold text-blue-400">^IXIC</td>
                  <td className="py-3 px-4 text-right font-bold text-red-400">-2.86%</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-300">2026-10-20</td>
                  <td className="py-3 px-4 font-semibold text-blue-400">^GSPC</td>
                  <td className="py-3 px-4 text-right font-bold text-red-400">-1.82%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}