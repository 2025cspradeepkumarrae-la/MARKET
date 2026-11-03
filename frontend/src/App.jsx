import React, { useState, useEffect } from 'react';

export default function App() {
  const [threshold, setThreshold] = useState(-2.0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-mono selection:bg-blue-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Elite Terminal Header */}
        <header className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex justify-between items-center flex-wrap gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⚡</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white">
                VOLATILITY<span className="text-blue-500">.TERMINAL</span>
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-2">Institutional-grade real-time asset drawdown tracking & analytics.</p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl shadow-inner">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-xs font-semibold tracking-wide">LIVE SYNC ({lastUpdated})</span>
          </div>
        </header>

        {/* Threshold Control Center */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="text-sm font-bold text-slate-200 tracking-wide uppercase">Crash Threshold Isolation Parameter</label>
              <p className="text-xs text-slate-400 mt-0.5">Adjust sensitivity to filter high-velocity intraday equity drawdowns.</p>
            </div>
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-xl text-base font-black border border-blue-500/30 shadow-sm">
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
            className="w-full accent-blue-500 cursor-pointer bg-slate-950 rounded-xl h-3 border border-slate-800"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-semibold">
            <span>-5.0% (Extreme Volatility)</span>
            <span>-3.0% (Moderate)</span>
            <span>-1.0% (Sensitive)</span>
          </div>
        </div>

        {/* Real-Time Company Overview Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <span>📊</span>
              <span>Live Asset Watchlist Matrix</span>
            </h2>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              Auto-stream active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-500">Initializing market data streams...</div>
            ) : data?.market_overview?.length > 0 ? (
              data.market_overview.map((asset, index) => (
                <div key={index} className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {asset.ticker}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                        {asset.name}
                      </h3>
                      <p className="text-xs text-slate-500">{asset.sector}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-100">${asset.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400 font-medium">Intraday Delta</span>
                    <span className={`font-bold px-2.5 py-1 rounded-lg ${asset.change_pct >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {asset.change_pct >= 0 ? `+${asset.change_pct}%` : `${asset.change_pct}%`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">No market data available.</div>
            )}
          </div>
        </div>

        {/* Isolated Volatility Events Log */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
              <span>⚠️</span>
              <span>Isolated Volatility Breaches ({threshold}%)</span>
            </h2>
            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl font-semibold">
              {data?.isolated_events?.length || 0} Events Logged
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp Date</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-right">Drawdown Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">Scanning historical drawdown windows...</td>
                  </tr>
                ) : data?.isolated_events?.length > 0 ? (
                  data.isolated_events.map((event, index) => (
                    <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-300">{event.date}</td>
                      <td className="py-3 px-4 font-bold text-white">{event.company}</td>
                      <td className="py-3 px-4 font-mono text-xs text-blue-400">{event.ticker}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{event.sector}</td>
                      <td className="py-3 px-4 text-right font-black text-red-400">{event.drawdown}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">No equities have breached the {threshold}% threshold during this lookback window.</td>
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