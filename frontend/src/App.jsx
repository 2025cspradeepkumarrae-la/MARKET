import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function App() {
  const [data, setData] = useState(null);
  const [threshold, setThreshold] = useState(-1.5);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/market-summary?threshold=${threshold}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Connection dropped:", err);
        setLoading(false);
      });
  }, [threshold]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-950 text-emerald-400 font-mono text-lg animate-pulse">Initializing API Stream Nodes...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">📈 VOLATILITY TERMINAL</h1>
        <p className="text-sm text-slate-400">Tracking historic equity drawdowns.</p>
      </header>

      <div className="mb-8 p-4 bg-slate-900 border border-slate-800 rounded-xl max-w-sm">
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          Crash Threshold Isolation: {threshold}%
        </label>
        <input 
          type="range" min="-5.0" max="-0.5" step="0.1" value={threshold} 
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Normalized Value Index</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={['dataMin - 1', 'dataMax + 1']} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="^IXIC" stroke="#ef4444" name="NASDAQ" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="^GSPC" stroke="#3b82f6" name="S&P 500" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Cumulative October Returns</h2>
            {data?.summary && Object.entries(data.summary).map(([ticker, val]) => (
              <div key={ticker} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                <span className="font-mono text-sm font-semibold text-slate-300">{ticker === '^IXIC' ? 'NASDAQ' : 'S&P 500'}</span>
                <span className={`font-mono font-bold ${val >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{val}%</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-h-64 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4">⚠️ Isolated Volatility Days</h2>
            {data?.crashDays?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No threshold excursions mapped during this cycle.</p>
            ) : (
              <div className="space-y-2">
                {data?.crashDays?.map((day, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-950 rounded border border-slate-800 font-mono">
                    <span className="text-slate-400">{day.date}</span>
                    <span className="font-bold text-slate-200">{day.ticker}</span>
                    <span className="text-red-500 font-black">{day.drop}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
