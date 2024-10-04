// with websocket


// Import necessary libraries
const express = require('express');
const WebSocket = require('ws');

// Initialize Express app
const app = express();

// Initialize trading variables
let balance = 1000;  // Starting balance
let stockHeld = 0;
let buyPrice = null;
let tradeHistory = [];

// Initialize 24-hour high and low prices
let dayHigh = -Infinity;
let dayLow = Infinity;

// Specify the trading pair
const tradingPair = 'BTCUSDT'; // Change this to any trading pair, e.g., 'ETHUSDT', 'BNBUSDT', etc.

// Function to update the 24-hour high and low
function updateDayHighLow(currentPrice, high, low) {
    if (high > dayHigh) {
        dayHigh = high;
    }
    if (low < dayLow) {
        dayLow = low;
    }
}

// Function to simulate buying stocks
function buy(price) {
    if (!stockHeld && balance >= price) {
        stockHeld = Math.floor(balance / price);
        balance -= stockHeld * price;
        buyPrice = price;
        console.log(`Bought ${stockHeld} stocks of ${tradingPair} at $${price}`);
        tradeHistory.push({ type: 'buy', price, balance });
    }
}

// Function to simulate selling stocks
function sell(price) {
    if (stockHeld > 0) {
        balance += stockHeld * price;
        console.log(`Sold ${stockHeld} stocks of ${tradingPair} at $${price}`);
        stockHeld = 0;
        buyPrice = null;
        tradeHistory.push({ type: 'sell', price, balance });
    }
}

// WebSocket connection to Binance
const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

// Handle WebSocket connection open event
ws.on('open', () => {
    console.log('Connected to Binance WebSocket');
});

// Handle incoming WebSocket messages
ws.on('message', (data) => {
    const prices = JSON.parse(data);
    // Find the price for the specified trading pair
    const cryptoPriceData = prices.find(ticker => ticker.s === tradingPair);

    if (cryptoPriceData) {
        const currentPrice = parseFloat(cryptoPriceData.c); // Current price
        const highPrice = parseFloat(cryptoPriceData.h); // 24-hour high price
        const lowPrice = parseFloat(cryptoPriceData.l); // 24-hour low price

        // Update the 24-hour high and low
        updateDayHighLow(currentPrice, highPrice, lowPrice);

        console.log(`Current price for ${tradingPair}: $${currentPrice}`);
        console.log(`24-Hour High: $${dayHigh}, 24-Hour Low: $${dayLow}`);

        // Trading conditions
        if (!stockHeld && currentPrice <= dayLow * 1.01) { // Buy if price is near 1% above the 24-hour low
            buy(currentPrice);
        } else if (stockHeld && currentPrice >= dayHigh * 0.99) { // Sell if price is near 1% below the 24-hour high
            sell(currentPrice);
        }
    }
});

// Function to handle errors during WebSocket connection
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

// API endpoint to get the trade history
app.get('/api/trades', (req, res) => {
    const profit = balance - 1000;  // Profit based on initial balance
    res.json({ tradeHistory, profit });
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
