# Trading Bot

## Overview
This trading bot simulates buying and selling stocks based on the moving average of the stock prices. It tracks the bot's positions, balance, and overall profit/loss. The bot uses a mock API to fetch stock prices and performs trading actions at regular intervals.

## Features
- Simulates buying stocks when the current price is below the moving average.
- Sells stocks when the current price is above the moving average.
- Tracks trade history, including profits and losses.
- Provides a summary report of trades made, including the final balance.

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation
1. Clone the repository or download the project files.
   ```bash
   git clone https://github.com/dragl1295/trading_bot.git

2. Navigate to the project directory in your terminal.
    ```bash
    cd trading-bot

3. Install the required packages:   

    ```bash
    npm install express axios


### Running the Application

1. Start the application:

   ```bash
   node index.js

 ## API Usage

### Get Current Stock Price
- **Endpoint**: `GET http://localhost:3000/api/stock-price`
- **Description**: Retrieves the current stock price from the mock API.

### Get Trade History and Summary
- **Endpoint**: `GET http://localhost:3000/api/trades`
- **Description**: Provides the trade history, profit/loss summary, and final balance.

## Trading Logic
- **Buying Condition**: The bot buys stocks when the current stock price is lower than the moving average of the last `N` prices (default is 5).
- **Selling Condition**: The bot sells stocks when the current stock price is higher than the moving average.

## Example Output
When running the bot, you may see output similar to the following in the console:


## Profit/Loss Tracking
The bot tracks each trade's profit and loss. The summary report includes:
- The history of trades made.
- The current profit/loss based on the starting balance.
- The total profit from all trades.
- The final balance of the trading bot.

## Example Summary Report
- **Total Trades**: 5
- **Total Profit**: $150
- **Final Balance**: $1150

## Contribution
Feel free to contribute by submitting issues or pull requests.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements
- [Express.js](https://expressjs.com/) for the web framework.
- [Axios](https://axios-http.com/) for HTTP requests.

## Contact
For any inquiries, please reach out to [dhemantgoyal@gmail.com](mailto:dhemantgoyal@gmail.com).


