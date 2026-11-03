from fastapi import FastAPI, Query
import yfinance as yf
import pandas as pd
import numpy as np

app = FastAPI()

# Map tickers to friendly company names
COMPANY_NAMES = {
    "^IXIC": "NASDAQ Composite",
    "^GSPC": "S&P 500",
    "AAPL": "Apple Inc.",
    "MSFT": "Microsoft Corp.",
    "GOOGL": "Alphabet Inc.",
    "AMZN": "Amazon.com Inc.",
    "TSLA": "Tesla Inc."
}

@app.get("/api/volatility")
def get_volatility(threshold: float = Query(-2.0)):
    tickers = list(COMPANY_NAMES.keys())
    
    try:
        # Fetch live intraday data and define 'df' explicitly
        df = yf.download(tickers, period="5d", interval="1m", progress=False)
        
        # Check if the DataFrame is empty
        if df is None or df.empty:
            return {
                "threshold": threshold,
                "status": "operational",
                "isolated_events": []
            }

        # Safely extract 'Close' prices using defined DataFrame columns
        if isinstance(df.columns, pd.MultiIndex):
            if 'Close' in df.columns.levels[0]:
                data = df['Close']
            else:
                data = df.xs('Close', axis=1, level=1, drop_level=True)
        else:
            data = df[['Close']] if 'Close' in df.columns else df
            
        if isinstance(data, pd.Series):
            data = data.to_frame()
            
        # Calculate percentage returns
        returns = data.pct_change() * 100
        isolated_events = []
        
        # Iterate safely over rows
        for date, row in returns.iterrows():
            row_dict = row.to_dict()
            for ticker in tickers:
                try:
                    val = row_dict.get(ticker, np.nan)
                    if pd.notna(val) and val <= threshold:
                        isolated_events.append({
                            "date": str(date).split()[0],
                            "ticker": ticker,
                            "company": COMPANY_NAMES.get(ticker, ticker),
                            "drawdown": round(float(val), 2)
                        })
                except Exception:
                    continue
        
        return {
            "threshold": threshold,
            "status": "operational",
            "isolated_events": isolated_events
        }
    except Exception as e:
        return {
            "threshold": threshold,
            "status": "error",
            "message": str(e),
            "isolated_events": []
        }