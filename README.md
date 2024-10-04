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