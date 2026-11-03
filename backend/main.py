
from fastapi import FastAPI, Query
import yfinance as yf
import pandas as pd
import numpy as np

app = FastAPI(title="Stock Market Volatility API")

# Company watchlist with sector information
COMPANIES = {
    "^IXIC": {"name": "NASDAQ Composite", "sector": "Index"},
    "^GSPC": {"name": "S&P 500", "sector": "Index"},
    "AAPL": {"name": "Apple Inc.", "sector": "Technology"},
    "MSFT": {"name": "Microsoft Corp.", "sector": "Technology"},
    "GOOGL": {"name": "Alphabet Inc.", "sector": "Technology"},
    "AMZN": {"name": "Amazon.com Inc.", "sector": "Consumer Cyclical"},
    "TSLA": {"name": "Tesla Inc.", "sector": "Automotive"},
    "NVDA": {"name": "NVIDIA Corp.", "sector": "Semiconductors"},
    "META": {"name": "Meta Platforms", "sector": "Technology"}
}


@app.get("/")
def home():
    return {
        "message": "Stock Market Volatility API is running",
        "status": "operational"
    }


@app.get("/api/volatility")
def get_volatility(threshold: float = Query(default=-2.0)):

    tickers = list(COMPANIES.keys())

    try:
        # Download one year of stock market data
        df = yf.download(
            tickers,
            period="1y",
            interval="1d",
            auto_adjust=True,
            group_by="ticker",
            threads=True,
            progress=False
        )

        # Check whether data is available
        if df.empty:
            return {
                "status": "error",
                "message": "No stock data available",
                "market_overview": [],
                "isolated_events": []
            }

        # Extract closing prices safely
        if isinstance(df.columns, pd.MultiIndex):
            close_data = pd.DataFrame({
                ticker: df[(ticker, "Close")]
                for ticker in tickers
                if (ticker, "Close") in df.columns
            })
        else:
            close_data = df[["Close"]].copy()
            close_data.columns = [tickers[0]]

        if close_data.empty:
            return {
                "status": "error",
                "message": "Closing price data unavailable",
                "market_overview": [],
                "isolated_events": []
            }

        # Calculate daily percentage returns
        returns = close_data.pct_change(fill_method=None) * 100

        market_overview = []
        isolated_events = []

        # Get latest and previous available prices
        latest_row = close_data.iloc[-1]
        previous_row = close_data.iloc[-2] if len(close_data) > 1 else latest_row

        # Build market overview
        for ticker, meta in COMPANIES.items():

            curr_price = latest_row.get(ticker, np.nan)
            prev_price = previous_row.get(ticker, np.nan)

            change_pct = 0.0

            if pd.notna(curr_price) and pd.notna(prev_price) and prev_price != 0:
                change_pct = ((curr_price - prev_price) / prev_price) * 100

            market_overview.append({
                "ticker": ticker,
                "name": meta["name"],
                "sector": meta["sector"],
                "price": round(float(curr_price), 2)
                    if pd.notna(curr_price) else None,
                "change_pct": round(float(change_pct), 2)
            })

        # Identify isolated daily drawdowns
        for date, row in returns.iterrows():

            for ticker in tickers:

                value = row.get(ticker, np.nan)

                if pd.notna(value) and value <= threshold:

                    isolated_events.append({
                        "date": str(date.date()),
                        "ticker": ticker,
                        "company": COMPANIES[ticker]["name"],
                        "sector": COMPANIES[ticker]["sector"],
                        "drawdown": round(float(value), 2)
                    })

        # Return API response
        return {
            "status": "operational",
            "threshold": threshold,
            "market_overview": market_overview,
            "isolated_events": isolated_events
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e),
            "market_overview": [],
            "isolated_events": []
        }
