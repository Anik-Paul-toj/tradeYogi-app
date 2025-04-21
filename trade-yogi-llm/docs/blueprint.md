# **App Name**: TrendWise Investor

## Core Features:

- User Input Form: Collect user input through a web form matching the original script's questions, ensuring data type and range validation.
- User Categorization: Categorize the user into a trading style (e.g., Long-Term Investor, Day Trader) based on their input, using the same logic as the original script.
- Stock Data Fetching: Fetch stock data using yfinance for the stocks relevant to the user's category.
- Trend Analysis: Analyze if the stock is in an upward trend based on moving averages, as per the original script's logic.
- Recommendation Display: Display stock recommendations with their trend status (Uptrend, Not Trending, or Error) in a user-friendly format.

## Style Guidelines:

- Primary color: A calm teal (#4DB6AC) for a sense of stability and growth.
- Secondary color: Light gray (#EEEEEE) for clean backgrounds and content separation.
- Accent: A vibrant lime green (#AEEA00) to highlight positive trends and interactive elements.
- Clean, sans-serif font for readability on investment-related content.
- Clear sections for user input, category display, and stock recommendations.
- Use simple, consistent icons to represent stock trends and categories.

## Original User Request:
import numpy as np
import yfinance as yf

# -------------------------------
# Asset Options and Category Mapping
# -------------------------------
asset_options = [
    "Stocks (Large-cap)",     # 0
    "Stocks (Mid-cap)", # 1
    "Stocks (Small-cap)" # 2
]

category_stocks = {
    "Long-Term Investor": ["AAPL", "MSFT", "TCS.NS", "INFY.NS", "RELIANCE.NS"],
    "Swing Trader": ["SBIN.NS", "HDFCBANK.NS", "AXISBANK.NS", "ITC.NS"],
    "Day Trader": ["ADANIENT.NS", "TATAMOTORS.NS", "VEDL.NS", "YESBANK.NS"],
    "Experimental Trader": ["DOGE-USD", "BTC-USD", "MATIC-USD"],
    "Balanced Investor": ["NIFTYBEES.NS", "ICICIBANK.NS", "HCLTECH.NS"]
}

# -------------------------------
# User Input Function
# -------------------------------
def get_user_input():
    print("Answer the following questions by entering the number or multiple numbers (comma-separated):\n")

    goal = int(input("1. Primary goal?\n0: Wealth Creation\n1: Passive Income\n2: Short-Term Gains\n3: Learning\n> "))
    risk = int(input("\n2. Risk tolerance?\n0: Conservative\n1: Moderate\n2: Aggressive\n3: Speculative\n> "))
    freq = int(input("\n3. How often do you trade?\n0: Daily\n1: Weekly\n2: Monthly\n3: Occasionally\n> "))

    print("\n4. Select interested assets (comma-separated numbers):")
    for i, option in enumerate(asset_options):
        print(f"{i}: {option}")
    assets_input = input("> ")
    assets_indices = list(map(int, assets_input.split(",")))
    assets_vector = [1 if i in assets_indices else 0 for i in range(len(asset_options))]

    vol = int(input("\n5. Reaction to volatility?\n0: Hold\n1: Buy the dip\n2: Sell to cut losses\n3: Hedge\n> "))
    horizon = int(input("\n6. Investment horizon?\n0: <1 month\n1: 1–6 months\n2: 6m–3yrs\n3: 3+ years\n> "))
    decision = int(input("\n7. How do you make trading decisions?\n0: Technical\n1: Fundamental\n2: News\n3: Social Media\n4: Algo/Bot\n> "))
    emotion = int(input("\n8. Emotion driving trades?\n0: Confidence\n1: Fear\n2: Greed\n3: FOMO\n> "))
    capital = int(input("\n9. Capital to start?\n0: <10k\n1: 10k–50k\n2: 50k–2L\n3: >2L\n> "))
    style = int(input("\n10. Manual or automated?\n0: Fully Auto\n1: Semi-Auto\n2: Manual\n> "))

    # Combine all into one flat vector
    user_vector = [
        goal, risk, freq, *assets_vector,
        vol, horizon, decision, emotion,
        capital, style
    ]

    return user_vector

# -------------------------------
# Categorize User Type
# -------------------------------
def categorize_user(user_vector):
    goal = user_vector[0]
    risk = user_vector[1]
    freq = user_vector[2]
    horizon = user_vector[len(asset_options)+4]
    capital = user_vector[-2]

    if goal == 0 and risk <= 1 and horizon == 3:
        return "Long-Term Investor"
    elif goal == 2 and risk >= 2:
        return "Day Trader"
    elif freq == 1 and risk == 1:
        return "Swing Trader"
    elif capital == 0 and risk >= 2:
        return "Experimental Trader"
    else:
        return "Balanced Investor"

# -------------------------------
# Fetch Stock Data + Analyze Trend
# -------------------------------
def fetch_stock_data(ticker, period="3mo"):
    df = yf.download(ticker, period=period, interval="1d", progress=False)
    return df[['Open', 'Close', 'Volume']]

def is_stock_upward_trending(df):
    df['MA20'] = df['Close'].rolling(20).mean()
    df['MA50'] = df['Close'].rolling(50).mean()
    latest_ma20 = df['MA20'].iloc[-1]
    latest_ma50 = df['MA50'].iloc[-1]
    return latest_ma20 > latest_ma50

# -------------------------------
# Recommend Stocks with Status
# -------------------------------
def recommend_stocks(category):
    tickers = category_stocks.get(category, [])
    print(f"\n🔍 Checking trends for category: {category}...\n")

    results = []
    for ticker in tickers:
        try:
            df = fetch_stock_data(ticker)
            trending = is_stock_upward_trending(df)
            status = "⬆ Uptrend" if trending else "⬇ Not Trending"
        except Exception as e:
            status = "⚠ Error fetching data"
        results.append((ticker, status))
    return results

# -------------------------------
# RUN EVERYTHING
# -------------------------------
user_vector = get_user_input()
category = categorize_user(user_vector)
print(f"\n🧠 You are categorized as: *{category}*")
  i want to convert this into fast api so that after deploying my freind can fetched the data based on that input
  