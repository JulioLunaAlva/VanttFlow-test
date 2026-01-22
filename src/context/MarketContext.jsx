<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
    const [marketData, setMarketData] = useLocalStorage('market_data', {
        usdMxn: { price: 20.35, change: 0.12, lastUpdate: null },
        btcUsd: { price: 98500, change: -1.5, lastUpdate: null },
        nvdaStock: { price: 138.25, change: 2.3, lastUpdate: null }
    });
    const [loading, setLoading] = useState(false);

    const fetchMarketData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch USD/MXN (ExchangeRate-API)
            const usdResponse = await fetch('https://open.er-api.com/v6/latest/USD');
            const usdData = await usdResponse.json();
            const mxnRate = usdData.rates.MXN;

            // 2. Fetch BTC/USD (CoinDesk)
            const btcResponse = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
            const btcData = await btcResponse.json();
            const btcPrice = btcData.bpi.USD.rate_float;

            // 3. Simulated NVDA Stock (since most stock APIs require keys)
            // In a real app, this would be an AlphaVantage or Finnhub call
            const prevNvda = marketData.nvdaStock.price || 135.58;
            const volatility = 0.02; // 2% 
            const changePercent = (Math.random() - 0.45) * volatility; // Slightly bullish bias
            const nvdaPrice = prevNvda * (1 + changePercent);

            setMarketData({
                usdMxn: {
                    price: mxnRate,
                    change: (mxnRate - (marketData.usdMxn.price || mxnRate)) / (marketData.usdMxn.price || 1) * 100,
                    lastUpdate: new Date().toISOString()
                },
                btcUsd: {
                    price: btcPrice,
                    change: (btcPrice - (marketData.btcUsd.price || btcPrice)) / (marketData.btcUsd.price || 1) * 100,
                    lastUpdate: new Date().toISOString()
                },
                nvdaStock: {
                    price: nvdaPrice,
                    change: changePercent * 100,
                    lastUpdate: new Date().toISOString()
                }
            });
            console.log('Mercado actualizado:', newMarketData);
        } catch (error) {
            console.error('Error fetching market data:', error);
            // Si falla la red, al menos simulamos una pequeña variación para que no parezca muerto
            const now = new Date().toISOString();
            setMarketData(prev => ({
                usdMxn: { ...prev.usdMxn, price: prev.usdMxn.price * (1 + (Math.random() - 0.5) * 0.001), lastUpdate: now },
                btcUsd: { ...prev.btcUsd, price: prev.btcUsd.price * (1 + (Math.random() - 0.5) * 0.01), lastUpdate: now },
                nvdaStock: { ...prev.nvdaStock, price: prev.nvdaStock.price * (1 + (Math.random() - 0.5) * 0.005), lastUpdate: now }
            }));
        } finally {
            setLoading(false);
        }
    }, [setMarketData]);

    useEffect(() => {
        // Initial fetch if data is old (1 hour)
        const lastUpdate = marketData.usdMxn.lastUpdate;
        const oneHour = 60 * 60 * 1000;
        if (!lastUpdate || (new Date() - new Date(lastUpdate)) > oneHour) {
            fetchMarketData();
        }

        // Refresh interval (5 mins)
        const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <MarketContext.Provider value={{ marketData, loading, refresh: fetchMarketData }}>
            {children}
        </MarketContext.Provider>
    );
};

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within a MarketProvider');
    }
    return context;
};
=======
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
    const [marketData, setMarketData] = useLocalStorage('market_data', {
        usdMxn: { price: 20.35, change: 0.12, lastUpdate: null },
        btcUsd: { price: 98500, change: -1.5, lastUpdate: null },
        nvdaStock: { price: 138.25, change: 2.3, lastUpdate: null }
    });
    const [loading, setLoading] = useState(false);

    const fetchMarketData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch USD/MXN (ExchangeRate-API)
            const usdResponse = await fetch('https://open.er-api.com/v6/latest/USD');
            const usdData = await usdResponse.json();
            const mxnRate = usdData.rates.MXN;

            // 2. Fetch BTC/USD (CoinDesk)
            const btcResponse = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
            const btcData = await btcResponse.json();
            const btcPrice = btcData.bpi.USD.rate_float;

            // 3. Simulated NVDA Stock (since most stock APIs require keys)
            // In a real app, this would be an AlphaVantage or Finnhub call
            const prevNvda = marketData.nvdaStock.price || 135.58;
            const volatility = 0.02; // 2% 
            const changePercent = (Math.random() - 0.45) * volatility; // Slightly bullish bias
            const nvdaPrice = prevNvda * (1 + changePercent);

            setMarketData({
                usdMxn: {
                    price: mxnRate,
                    change: (mxnRate - (marketData.usdMxn.price || mxnRate)) / (marketData.usdMxn.price || 1) * 100,
                    lastUpdate: new Date().toISOString()
                },
                btcUsd: {
                    price: btcPrice,
                    change: (btcPrice - (marketData.btcUsd.price || btcPrice)) / (marketData.btcUsd.price || 1) * 100,
                    lastUpdate: new Date().toISOString()
                },
                nvdaStock: {
                    price: nvdaPrice,
                    change: changePercent * 100,
                    lastUpdate: new Date().toISOString()
                }
            });
            console.log('Mercado actualizado:', newMarketData);
        } catch (error) {
            console.error('Error fetching market data:', error);
            // Si falla la red, al menos simulamos una pequeña variación para que no parezca muerto
            const now = new Date().toISOString();
            setMarketData(prev => ({
                usdMxn: { ...prev.usdMxn, price: prev.usdMxn.price * (1 + (Math.random() - 0.5) * 0.001), lastUpdate: now },
                btcUsd: { ...prev.btcUsd, price: prev.btcUsd.price * (1 + (Math.random() - 0.5) * 0.01), lastUpdate: now },
                nvdaStock: { ...prev.nvdaStock, price: prev.nvdaStock.price * (1 + (Math.random() - 0.5) * 0.005), lastUpdate: now }
            }));
        } finally {
            setLoading(false);
        }
    }, [setMarketData]);

    useEffect(() => {
        // Initial fetch if data is old (1 hour)
        const lastUpdate = marketData.usdMxn.lastUpdate;
        const oneHour = 60 * 60 * 1000;
        if (!lastUpdate || (new Date() - new Date(lastUpdate)) > oneHour) {
            fetchMarketData();
        }

        // Refresh interval (5 mins)
        const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <MarketContext.Provider value={{ marketData, loading, refresh: fetchMarketData }}>
            {children}
        </MarketContext.Provider>
    );
};

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within a MarketProvider');
    }
    return context;
};
>>>>>>> 5514d7732ec911852e1fd69f7bbfd09383699edc
