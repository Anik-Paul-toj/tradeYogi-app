# **App Name**: StockSage

## Core Features:

- Market Analysis: Analyze current market conditions and price action using Gemini AI.
- Technical Analysis: Evaluate technical indicators (Moving averages, RSI, MACD, etc.) using Gemini AI.
- Sentiment Analysis: Assess market sentiment and news impact using Gemini AI. Use available tools to search for news.
- Trading Recommendations: Provide specific entry/exit points and risk management advice using Gemini AI, acting as a tool.
- Results Display: Display analysis results, recommendations, entry/exit points, and risk assessments in a clear and concise format.

## Style Guidelines:

- Primary color: White or light gray for a clean background.
- Secondary color: Dark gray or black for text and important elements.
- Accent color: Teal (#008080) for interactive elements and highlights.
- Use a clean and modern layout with clear sections for analysis, recommendations, and risk assessment.
- Use simple and professional icons to represent different aspects of the analysis (e.g., trends, risk, entry points).

## Original User Request:
# main.py
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import search_tool, wiki_tool, save_tool

# Load environment variables
load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")

# Define the output structure
class TradingAnalysis(BaseModel):
    symbol: str
    market_analysis: str
    technical_analysis: str
    fundamental_analysis: str
    risk_level: str
    recommendation: str
    entry_points: list[float]
    stop_loss: float
    take_profit: list[float]
    sources: list[str]
    tools_used: list[str]

# Initialize LLM
llm = ChatAnthropic(
    model="claude-3-5-sonnet-20241022",
    api_key=api_key
)

# Set up the output parser
parser = PydanticOutputParser(pydantic_object=TradingAnalysis)

# Create the prompt template
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are an expert trading analyst specializing in comprehensive market analysis.
            For each trading analysis:
            1. Analyze current market conditions and price action
            2. Evaluate technical indicators (Moving averages, RSI, MACD, etc.)
            3. Review fundamental factors (if applicable)
            4. Assess market sentiment and news impact
            5. Provide specific entry/exit points and risk management
            6. Set clear stop loss and take profit levels
            
            Use available tools to gather market data, news, and historical information.
            Wrap the output in this format and provide no other text\n{format_instructions}
            """,
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

# Set up the tools
tools = [search_tool, wiki_tool, save_tool]

# Create the agent
agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

# Create the agent executor
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

def main():
    # Get trading symbol from user
    query = input("Enter a trading symbol to analyze (e.g., 'AAPL' or 'BTC/USD'): ")
    
    try:
        # Run the agent
        raw_response = agent_executor.invoke({"query": query})
        
        # Parse the response
        structured_response = parser.parse(raw_response.get("output")[0]["text"])
        print(structured_response)
        
    except Exception as e:
        print("Error:", e)
        print("Raw Response:", raw_response if 'raw_response' in locals() else "Not available")

if __name__ == "__main__":
    main()   # tools.py
from langchain.tools import Tool
from langchain_community.utilities import WikipediaAPIWrapper
from duckduckgo_search import DDGS
import json
import os

# Wikipedia tool
wikipedia = WikipediaAPIWrapper()

def search_wikipedia(query):
    """Search Wikipedia for information about a topic."""
    try:
        results = wikipedia.run(query)
        return results
    except Exception as e:
        return f"Error searching Wikipedia: {str(e)}"

wiki_tool = Tool(
    name="Wikipedia",
    func=search_wikipedia,
    description="Search Wikipedia for information about a topic. Useful for historical data, company information, and general knowledge."
)

# DuckDuckGo search tool
def search_web(query):
    """Search the web for information about a topic."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
        return json.dumps(results, indent=2)
    except Exception as e:
        return f"Error searching the web: {str(e)}"

search_tool = Tool(
    name="WebSearch",
    func=search_web,
    description="Search the web for current information, news, and market data. Use this for up-to-date information on stocks, cryptocurrencies, and market conditions."
)

# Save results tool
def save_analysis(analysis):
    """Save the analysis to a file."""
    try:
        if not os.path.exists("analysis"):
            os.makedirs("analysis")
        
        # Extract symbol from the analysis if it's in JSON format
        try:
            data = json.loads(analysis)
            symbol = data.get("symbol", "unknown")
        except:
            # If not JSON, just use a timestamp
            from datetime import datetime
            symbol = datetime.now().strftime("%Y%m%d%H%M%S")
        
        filename = f"analysis/{symbol}_analysis.json"
        
        with open(filename, "w") as f:
            f.write(analysis)
        
        return f"Analysis saved to {filename}"
    except Exception as e:
        return f"Error saving analysis: {str(e)}"

save_tool = Tool(
    name="SaveAnalysis",
    func=save_analysis,
    description="Save the analysis to a file. The input should be the complete analysis in JSON format."
)  langchain
wikipedia
langchain-community
langchain-openai
langchain-anthropic
python-dotenv
pydantic
duckduckgo-search  turn this into apscript api using gemini api instead of anthropic
  