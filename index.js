const express = require('express');
const axios = require('axios');

const app = express();

// Initialize trading variables
let balance = 10000;  // Starting balance
let stockHeld = 0;
let buyPrice = null;
let cp = 0;

let tradeHistory = [];
let stockPrice = 100;  // Initial mock stock price
const prices = [];      // Array to hold recent stock prices
const movingAveragePeriod = 50;  // Number of periods for moving average

// Function to simulate buying stocks
function buy(price) {
    if (!stockHeld && balance >= price) {
        stockHeld = Math.floor(balance / price);
        balance -= stockHeld * price;
        buyPrice = price;
        console.log(`Bought ${stockHeld} stocks at $${price}`);
        tradeHistory.push({ type: 'buy', price, balance });
    }
}

// Function to simulate selling stocks
function sell(price) {
    if (stockHeld > 0) {  // Sell if holding stocks
        balance += stockHeld * price;
        console.log(`Sold ${stockHeld} stocks at $${price}`);
        stockHeld = 0;
        buyPrice = null;
        tradeHistory.push({ type: 'sell', price, balance, date:new Date() });
    }
}

// Axios instance with decreased timeout setting
const axiosInstance = axios.create({
    timeout: 5000,  // Decrease timeout to 5 seconds
    headers: { 'Connection': 'keep-alive' }
});

// Function to fetch stock price and execute trade logic
async function tradeBot() {
    try {
        const response = await axiosInstance.get('http://localhost:3000/api/stock-price');
        const currentPrice = parseFloat(response.data.price);
        cp = currentPrice
        console.log(`Current stock price: $${currentPrice}`);

        // Store the current price for moving average calculation
        prices.push(currentPrice);
        if (prices.length > movingAveragePeriod) {
            prices.shift();  // Remove oldest price to maintain the moving average period
        }

        // Calculate moving average
        const movingAverage = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        console.log(`Current Moving Average: $${movingAverage.toFixed(2)}`);

        if (stockHeld > 0) {
            const potentialProfit = (currentPrice * stockHeld) - (buyPrice * stockHeld);
            console.log(`Potential profit if sold now: $${potentialProfit.toFixed(2)}`);
        }

        // Trading logic based on moving average
        if (!stockHeld && currentPrice < movingAverage) {  // Buy if current price is below moving average
            buy(currentPrice);
        } else if (stockHeld && currentPrice > movingAverage) {  // Sell if current price is above moving average
            sell(currentPrice);
        }
    } catch (error) {
        handleError(error);
    }
}

// Error handling function
function handleError(error) {
    console.error('Error fetching stock price:', error);
    if (error.code === 'ECONNRESET') {
        console.error('Connection was reset. Retrying...');
    } else if (error.response) {
        console.error(`Server responded with status ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
        console.error('No response received from server:', error.request);
    } else {
        console.error('Error setting up request:', error.message);
    }
}

// Set interval for trading bot execution
setInterval(tradeBot, 10000);  // Simulate trading every 10 seconds

// Mock API endpoint for stock price
app.get('/api/stock-price', (req, res) => {
    const priceChange = (Math.random() - 0.5) * 5;  // Random price fluctuation
    stockPrice = Math.max(90, stockPrice + priceChange);  // Ensure price doesn't drop below $90
    console.log(`Serving stock price: $${stockPrice.toFixed(2)}`);
    res.json({ price: stockPrice.toFixed(2) });
});

// API endpoint to get the trade history
app.get('/api/trades', (req, res) => {
    const profit = balance - 1000;
    res.json({ tradeHistory, profit, balance});
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
