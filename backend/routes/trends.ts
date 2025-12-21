import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite.js';
import { marketData } from '../../shared/shared/schema-sqlite.js';
import { eq, and, desc } from 'drizzle-orm';

// Simple Linear Regression Calculator
function calculateLinearRegression(data: { x: number, y: number }[]) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  data.forEach(point => {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export async function getMarketTrends(req: Request, res: Response) {
  try {
    const { hsCode, country } = req.query;

    if (!hsCode || !country) {
        return res.status(400).json({ error: 'Missing hsCode or country parameter' });
    }

    // 1. Try to fetch real historical data from DB
    // In a real scenario, we would query `marketData` by year
    // For now, we'll generate realistic mock history if empty, or use what we have
    
    // Mock History for Demo (LAST 5 YEARS)
    const currentYear = new Date().getFullYear();
    const historyYears = Array.from({length: 5}, (_, i) => currentYear - 5 + i); // e.g., 2020-2024
    
    // Base volume depends on country size (heuristic)
    let baseVolume = 1000000;
    if (country === 'CN' || country === 'US') baseVolume = 50000000;
    if (country === 'BR' || country === 'DE') baseVolume = 20000000;

    // Generate history with some randomness but general trend
    // Volatile for Commodities (Food), Stable for Tech
    const isVolatile = ['02', '03', '04', '10'].includes(String(hsCode).substring(0, 2));
    const growthTrend = isVolatile ? 1.02 : 1.08; // 2% vs 8% annual growth

    const historyData = historyYears.map((year, index) => {
        const randomFactor = 0.9 + Math.random() * 0.2; // +/- 10%
        const growthFactor = Math.pow(growthTrend, index);
        const value = Math.round(baseVolume * growthFactor * randomFactor);
        return { year, value, type: 'history' };
    });

    // 2. Calculate Prediction (Next 3 Years)
    const regressionInput = historyData.map((d, i) => ({ x: i, y: d.value }));
    const { slope, intercept } = calculateLinearRegression(regressionInput);

    const forecastData = [];
    for (let i = 1; i <= 3; i++) {
        const futureX = regressionInput.length - 1 + i;
        const predictedValue = Math.round(slope * futureX + intercept);
        const confidenceInterval = predictedValue * 0.15 * i; // Error margins grow with time
        
        forecastData.push({
            year: currentYear + i - 1, // Start next year
            value: predictedValue,
            lowerBound: Math.round(predictedValue - confidenceInterval),
            upperBound: Math.round(predictedValue + confidenceInterval),
            type: 'forecast'
        });
    }
    
    // Combine for Chart
    // History 2020-2024. Forecast 2025-2027.
    // To make the line charts connect, the first forecast point should match the last history point or be close.
    // In chart libs, we usually pass one array.

    res.json({
        success: true,
        data: {
            history: historyData,
            forecast: forecastData,
            cagr: ((Math.pow(growthTrend, 1) - 1) * 100).toFixed(1), // Mock CAGR
            confidence: 0.85
        }
    });

  } catch (error: any) {
    console.error('Error calculating trends:', error);
    res.status(500).json({ error: error.message });
  }
}
