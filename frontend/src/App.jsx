import React, { useState, useEffect } from 'react';

export default function App() {
  const [threshold, setThreshold] = useState(-2.0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/volatility?threshold=${threshold}`)
        .then((res) => res.json())
        .then((result) => {
          setData(result);
          setLoading(false);
          setLastUpdated(new Date().toLocaleTimeString());
        })
        .catch((err) => console.error('Error fetching live data:', err));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [threshold]);

  // Filter events based on search input
  const filteredEvents = data?.isolated_events?.filter(event => 
    event.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>📈</span>
              <span>VOLATILITY TERMINAL</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time equity drawdown isolation & search.</p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Sync ({lastUpdated})</span>
          </div>
        </header>

        {/* Threshold & Search Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Crash Threshold Isolation:</label>
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

          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Search Company / Ticker:</label>
            <input
              type="text"
              placeholder="e.g. Apple, Microsoft, ^IXIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Live Events Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <span>⚠️</span>
            <span>Isolated Volatility Events</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4 text-right">Drawdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-slate-400">Fetching live market data...</td>
                  </tr>
                ) : filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-300">{event.date}</td>
                      <td className="py-3 px-4 font-semibold text-white">{event.company}</td>
                      <td className="py-3 px-4 text-blue-400 font-mono text-xs">{event.ticker}</td>
                      <td className="py-3 px-4 text-right font-bold text-red-400">{event.drawdown}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-slate-400">No matching volatility events found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}