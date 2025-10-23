# A 股交易风险管理

## 一、仓位管理

### 1. 仓位控制原则

#### 固定风险仓位

```javascript
// 固定风险仓位计算
const calculateFixedRiskPosition = (
  accountSize,
  riskPercent,
  entryPrice,
  stopLoss
) => {
  const riskAmount = accountSize * riskPercent;
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  const maxShares = Math.floor(riskAmount / riskPerShare);

  return {
    maxShares,
    riskAmount,
    riskPerShare,
    positionValue: maxShares * entryPrice,
    positionRatio: (maxShares * entryPrice) / accountSize,
  };
};

// 示例：账户10万，风险2%，买入价10元，止损价9.5元
const position = calculateFixedRiskPosition(100000, 0.02, 10, 9.5);
console.log(position);
// 输出：最多买入400股，风险金额2000元
```

#### 凯利公式仓位

```javascript
// 凯利公式计算最优仓位
const calculateKellyPosition = (winRate, avgWin, avgLoss, accountSize) => {
  const b = avgWin / avgLoss; // 盈亏比
  const p = winRate; // 胜率
  const q = 1 - p; // 败率

  const kellyPercent = (b * p - q) / b;

  // 限制凯利百分比在合理范围内
  const maxKellyPercent = Math.min(kellyPercent, 0.25); // 最大25%
  const minKellyPercent = Math.max(maxKellyPercent, 0.01); // 最小1%

  return {
    kellyPercent: minKellyPercent,
    positionSize: accountSize * minKellyPercent,
    isOptimal: kellyPercent > 0,
  };
};

// 示例：胜率60%，平均盈利5%，平均亏损3%
const kelly = calculateKellyPosition(0.6, 0.05, 0.03, 100000);
console.log(kelly);
```

#### 波动率调整仓位

```javascript
// 基于波动率的仓位调整
const calculateVolatilityAdjustedPosition = (
  prices,
  accountSize,
  targetVolatility = 0.15
) => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const volatility = calculateStandardDeviation(returns, returns.length);
  const adjustmentFactor = targetVolatility / volatility;

  return {
    volatility,
    adjustmentFactor,
    adjustedPositionSize: accountSize * adjustmentFactor,
    recommendation:
      adjustmentFactor > 1
        ? "INCREASE"
        : adjustmentFactor < 0.5
        ? "DECREASE"
        : "MAINTAIN",
  };
};
```

### 2. 资金分配策略

#### 金字塔式加仓

```javascript
// 金字塔式加仓策略
const pyramidPositioning = (basePosition, levels, accountSize) => {
  const positions = [];
  let totalPosition = 0;

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const positionSize = basePosition * Math.pow(0.5, i); // 每次减半

    positions.push({
      level: level.price,
      quantity: Math.floor(positionSize / level.price),
      percentage: level.percentage,
      totalValue: Math.floor(positionSize / level.price) * level.price,
    });

    totalPosition += positions[i].totalValue;
  }

  return {
    positions,
    totalPosition,
    totalRatio: totalPosition / accountSize,
    isWithinLimit: totalPosition / accountSize <= 0.3, // 总仓位不超过30%
  };
};

// 示例：基础仓位1万，在9.5、9.0、8.5加仓
const pyramid = pyramidPositioning(
  10000,
  [
    { price: 9.5, percentage: 0.05 },
    { price: 9.0, percentage: 0.1 },
    { price: 8.5, percentage: 0.15 },
  ],
  100000
);
```

#### 等权重分配

```javascript
// 等权重投资组合
const equalWeightPortfolio = (stocks, accountSize) => {
  const positionPerStock = accountSize / stocks.length;

  return stocks.map((stock) => ({
    symbol: stock.symbol,
    targetValue: positionPerStock,
    targetQuantity: Math.floor(positionPerStock / stock.price),
    weight: 1 / stocks.length,
  }));
};
```

## 二、止损止盈

### 1. 止损策略

#### 固定止损

```javascript
// 固定百分比止损
const fixedStopLoss = (entryPrice, stopLossPercent = 0.05) => {
  return {
    stopLossPrice: entryPrice * (1 - stopLossPercent),
    stopLossAmount: entryPrice * stopLossPercent,
    stopLossPercent,
  };
};

// 固定金额止损
const fixedAmountStopLoss = (entryPrice, stopLossAmount) => {
  return {
    stopLossPrice: entryPrice - stopLossAmount,
    stopLossAmount,
    stopLossPercent: stopLossAmount / entryPrice,
  };
};
```

#### 移动止损

```javascript
// 移动止损
const trailingStopLoss = (entryPrice, currentPrice, trailPercent = 0.03) => {
  const profit = currentPrice - entryPrice;

  if (profit > 0) {
    // 有盈利时，止损价跟随价格上涨
    return {
      stopLossPrice: currentPrice * (1 - trailPercent),
      trailAmount: currentPrice * trailPercent,
      isTrailing: true,
    };
  } else {
    // 亏损时，保持固定止损
    return {
      stopLossPrice: entryPrice * (1 - trailPercent),
      trailAmount: entryPrice * trailPercent,
      isTrailing: false,
    };
  }
};

// ATR移动止损
const atrTrailingStop = (currentPrice, atr, multiplier = 2) => {
  return {
    stopLossPrice: currentPrice - atr * multiplier,
    atrDistance: atr * multiplier,
    isDynamic: true,
  };
};
```

#### 技术止损

```javascript
// 基于技术指标的止损
const technicalStopLoss = (prices, highs, lows, indicator = "support") => {
  const currentPrice = prices[prices.length - 1];

  switch (indicator) {
    case "support":
      // 跌破支撑位止损
      const supportLevel = findSupportLevel(lows);
      return {
        stopLossPrice: supportLevel * 0.98, // 支撑位下方2%
        reason: "Support break",
      };

    case "ma":
      // 跌破均线止损
      const ma20 = calculateSMA(prices, 20);
      return {
        stopLossPrice: ma20 * 0.98,
        reason: "MA break",
      };

    case "atr":
      // ATR止损
      const atr = calculateATR(highs, lows, prices, 14);
      return {
        stopLossPrice: currentPrice - atr * 2,
        reason: "ATR stop",
      };

    default:
      return {
        stopLossPrice: currentPrice * 0.95,
        reason: "Default 5% stop",
      };
  }
};

// 寻找支撑位
const findSupportLevel = (lows) => {
  const sortedLows = [...lows].sort((a, b) => a - b);
  return sortedLows[Math.floor(sortedLows.length * 0.2)]; // 20%分位数
};
```

### 2. 止盈策略

#### 固定止盈

```javascript
// 固定百分比止盈
const fixedTakeProfit = (entryPrice, takeProfitPercent = 0.15) => {
  return {
    takeProfitPrice: entryPrice * (1 + takeProfitPercent),
    takeProfitAmount: entryPrice * takeProfitPercent,
    takeProfitPercent,
  };
};

// 风险回报比止盈
const riskRewardTakeProfit = (
  entryPrice,
  stopLossPrice,
  riskRewardRatio = 2
) => {
  const risk = entryPrice - stopLossPrice;
  const reward = risk * riskRewardRatio;

  return {
    takeProfitPrice: entryPrice + reward,
    takeProfitAmount: reward,
    riskRewardRatio,
    risk,
  };
};
```

#### 分批止盈

```javascript
// 分批止盈策略
const partialTakeProfit = (entryPrice, quantity, levels) => {
  const takeProfitLevels = [];

  levels.forEach((level, index) => {
    const partialQuantity = Math.floor(quantity * level.percentage);
    const takeProfitPrice = entryPrice * (1 + level.profitPercent);

    takeProfitLevels.push({
      level: index + 1,
      quantity: partialQuantity,
      price: takeProfitPrice,
      profit: partialQuantity * (takeProfitPrice - entryPrice),
      percentage: level.percentage,
    });
  });

  return takeProfitLevels;
};

// 示例：50%在10%止盈，30%在20%止盈，20%在30%止盈
const partialTP = partialTakeProfit(10, 1000, [
  { percentage: 0.5, profitPercent: 0.1 },
  { percentage: 0.3, profitPercent: 0.2 },
  { percentage: 0.2, profitPercent: 0.3 },
]);
```

## 三、风险控制

### 1. 最大回撤控制

#### 回撤监控

```javascript
// 回撤监控系统
class DrawdownMonitor {
  constructor(maxDrawdown = 0.2) {
    this.maxDrawdown = maxDrawdown;
    this.peakCapital = 0;
    this.currentDrawdown = 0;
    this.maxDrawdownReached = 0;
  }

  updateCapital(currentCapital) {
    if (currentCapital > this.peakCapital) {
      this.peakCapital = currentCapital;
      this.currentDrawdown = 0;
    } else {
      this.currentDrawdown =
        (this.peakCapital - currentCapital) / this.peakCapital;
      if (this.currentDrawdown > this.maxDrawdownReached) {
        this.maxDrawdownReached = this.currentDrawdown;
      }
    }

    return this.checkDrawdownLimit();
  }

  checkDrawdownLimit() {
    if (this.currentDrawdown > this.maxDrawdown) {
      return {
        exceeded: true,
        currentDrawdown: this.currentDrawdown,
        action: "REDUCE_POSITIONS",
      };
    }

    return {
      exceeded: false,
      currentDrawdown: this.currentDrawdown,
      action: "CONTINUE",
    };
  }
}
```

#### 回撤恢复策略

```javascript
// 回撤恢复策略
const drawdownRecoveryStrategy = (currentCapital, peakCapital, maxDrawdown) => {
  const currentDrawdown = (peakCapital - currentCapital) / peakCapital;

  if (currentDrawdown > maxDrawdown) {
    // 回撤超过限制，减少仓位
    const reductionFactor = 1 - (currentDrawdown - maxDrawdown);

    return {
      action: "REDUCE_POSITIONS",
      reductionFactor: Math.max(reductionFactor, 0.5), // 最多减少50%
      reason: "Drawdown limit exceeded",
    };
  }

  if (currentDrawdown > maxDrawdown * 0.8) {
    // 接近回撤限制，谨慎操作
    return {
      action: "CAUTION",
      reductionFactor: 0.8,
      reason: "Approaching drawdown limit",
    };
  }

  return {
    action: "NORMAL",
    reductionFactor: 1.0,
    reason: "Within normal range",
  };
};
```

### 2. 相关性风险控制

#### 相关性分析

```javascript
// 计算股票相关性
const calculateCorrelation = (returns1, returns2) => {
  const n = returns1.length;
  const mean1 = returns1.reduce((sum, ret) => sum + ret, 0) / n;
  const mean2 = returns2.reduce((sum, ret) => sum + ret, 0) / n;

  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;

    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return numerator / denominator;
};

// 投资组合相关性检查
const checkPortfolioCorrelation = (portfolio) => {
  const correlations = [];

  for (let i = 0; i < portfolio.length; i++) {
    for (let j = i + 1; j < portfolio.length; j++) {
      const correlation = calculateCorrelation(
        portfolio[i].returns,
        portfolio[j].returns
      );

      correlations.push({
        stock1: portfolio[i].symbol,
        stock2: portfolio[j].symbol,
        correlation: correlation,
      });
    }
  }

  const highCorrelations = correlations.filter(
    (c) => Math.abs(c.correlation) > 0.7
  );

  return {
    correlations,
    highCorrelations,
    averageCorrelation:
      correlations.reduce((sum, c) => sum + Math.abs(c.correlation), 0) /
      correlations.length,
    riskLevel:
      highCorrelations.length > 2
        ? "HIGH"
        : highCorrelations.length > 0
        ? "MEDIUM"
        : "LOW",
  };
};
```

### 3. 流动性风险控制

#### 流动性评估

```javascript
// 流动性评估
const assessLiquidity = (volume, price, marketCap) => {
  const avgVolume = volume.slice(-20).reduce((sum, v) => sum + v, 0) / 20;
  const turnoverRate = avgVolume / marketCap;

  let liquidityScore = 0;

  // 成交量评分
  if (avgVolume > 10000000) liquidityScore += 40; // 1000万以上
  else if (avgVolume > 5000000) liquidityScore += 30; // 500万以上
  else if (avgVolume > 1000000) liquidityScore += 20; // 100万以上
  else liquidityScore += 10;

  // 换手率评分
  if (turnoverRate > 0.05) liquidityScore += 30; // 5%以上
  else if (turnoverRate > 0.02) liquidityScore += 20; // 2%以上
  else if (turnoverRate > 0.01) liquidityScore += 10; // 1%以上

  // 市值评分
  if (marketCap > 100000000000) liquidityScore += 30; // 1000亿以上
  else if (marketCap > 50000000000) liquidityScore += 20; // 500亿以上
  else if (marketCap > 10000000000) liquidityScore += 10; // 100亿以上

  return {
    liquidityScore,
    avgVolume,
    turnoverRate,
    marketCap,
    liquidityLevel:
      liquidityScore > 70 ? "HIGH" : liquidityScore > 40 ? "MEDIUM" : "LOW",
  };
};
```

## 四、心理风险管理

### 1. 情绪控制

#### 交易情绪监控

```javascript
// 交易情绪监控
class EmotionMonitor {
  constructor() {
    this.tradeHistory = [];
    this.emotionState = "NEUTRAL";
    this.consecutiveLosses = 0;
    this.consecutiveWins = 0;
  }

  recordTrade(trade) {
    this.tradeHistory.push({
      ...trade,
      timestamp: new Date(),
      emotion: this.assessEmotion(),
    });

    this.updateEmotionState(trade);
  }

  assessEmotion() {
    if (this.consecutiveLosses >= 3) {
      return "FRUSTRATED";
    } else if (this.consecutiveWins >= 3) {
      return "OVERCONFIDENT";
    } else if (this.tradeHistory.length < 5) {
      return "NERVOUS";
    } else {
      return "CONFIDENT";
    }
  }

  updateEmotionState(trade) {
    if (trade.profit > 0) {
      this.consecutiveWins++;
      this.consecutiveLosses = 0;
    } else {
      this.consecutiveLosses++;
      this.consecutiveWins = 0;
    }

    this.emotionState = this.assessEmotion();
  }

  shouldPauseTrading() {
    return (
      this.emotionState === "FRUSTRATED" ||
      this.emotionState === "OVERCONFIDENT"
    );
  }

  getEmotionAdvice() {
    switch (this.emotionState) {
      case "FRUSTRATED":
        return "Take a break, review your strategy";
      case "OVERCONFIDENT":
        return "Reduce position size, stay disciplined";
      case "NERVOUS":
        return "Start with smaller positions";
      case "CONFIDENT":
        return "Continue with current approach";
      default:
        return "Monitor your emotions";
    }
  }
}
```

### 2. 纪律执行

#### 交易纪律检查

```javascript
// 交易纪律检查
const checkTradingDiscipline = (trade, rules) => {
  const violations = [];

  // 检查止损执行
  if (trade.stopLoss && trade.exitPrice > trade.stopLoss) {
    violations.push("Stop loss not executed");
  }

  // 检查仓位限制
  if (trade.positionSize > rules.maxPositionSize) {
    violations.push("Position size exceeded limit");
  }

  // 检查交易频率
  if (trade.frequency > rules.maxTradesPerDay) {
    violations.push("Trading frequency exceeded");
  }

  // 检查风险限制
  if (trade.riskAmount > rules.maxRiskPerTrade) {
    violations.push("Risk amount exceeded limit");
  }

  return {
    violations,
    isDisciplined: violations.length === 0,
    disciplineScore: Math.max(0, 100 - violations.length * 20),
  };
};
```

## 五、风险监控系统

### 1. 实时风险监控

#### 综合风险监控

```javascript
// 综合风险监控系统
class RiskMonitor {
  constructor(accountSize) {
    this.accountSize = accountSize;
    this.positions = {};
    this.riskLimits = {
      maxPositionSize: 0.1,      // 单仓位最大10%
      maxTotalExposure: 0.8,     // 总敞口最大80%
      maxDrawdown: 0.15,         // 最大回撤15%
      maxCorrelation: 0.7,      // 最大相关性70%
      maxDailyLoss: 0.05         // 单日最大亏损5%
    };
  }

  // 检查新交易风险
  checkTradeRisk(symbol, quantity, price, side) => {
    const positionValue = quantity * price;
    const positionRatio = positionValue / this.accountSize;

    const risks = {
      positionSize: positionRatio > this.riskLimits.maxPositionSize,
      totalExposure: this.getTotalExposure() + positionRatio > this.riskLimits.maxTotalExposure,
      correlation: this.checkCorrelationRisk(symbol),
      dailyLoss: this.checkDailyLossLimit()
    };

    const hasRisk = Object.values(risks).some(risk => risk);

    return {
      allowed: !hasRisk,
      risks,
      positionRatio,
      recommendation: hasRisk ? 'REJECT' : 'APPROVE'
    };
  }

  // 获取总敞口
  getTotalExposure() {
    const totalValue = Object.values(this.positions)
      .reduce((sum, pos) => sum + pos.quantity * pos.currentPrice, 0);
    return totalValue / this.accountSize;
  }

  // 检查相关性风险
  checkCorrelationRisk(symbol) {
    // 简化实现，实际需要计算相关性
    return false;
  }

  // 检查单日亏损限制
  checkDailyLossLimit() {
    const todayLoss = this.calculateDailyLoss();
    return todayLoss > this.riskLimits.maxDailyLoss;
  }

  // 计算单日亏损
  calculateDailyLoss() {
    // 简化实现
    return 0;
  }

  // 更新持仓
  updatePosition(symbol, quantity, price) {
    if (!this.positions[symbol]) {
      this.positions[symbol] = { quantity: 0, avgPrice: 0 };
    }

    const position = this.positions[symbol];
    const totalValue = position.quantity * position.avgPrice;
    const newValue = quantity * price;

    position.quantity += quantity;
    position.avgPrice = (totalValue + newValue) / position.quantity;
    position.currentPrice = price;
  }
}
```

### 2. 风险报告

#### 生成风险报告

```javascript
// 生成风险报告
const generateRiskReport = (portfolio, accountSize) => {
  const totalValue = portfolio.reduce((sum, pos) => sum + pos.value, 0);
  const totalExposure = totalValue / accountSize;

  const report = {
    summary: {
      totalValue,
      totalExposure,
      positionCount: portfolio.length,
      riskLevel:
        totalExposure > 0.8 ? "HIGH" : totalExposure > 0.5 ? "MEDIUM" : "LOW",
    },
    positions: portfolio.map((pos) => ({
      symbol: pos.symbol,
      value: pos.value,
      ratio: pos.value / accountSize,
      risk: pos.value / accountSize > 0.1 ? "HIGH" : "NORMAL",
    })),
    recommendations: [],
  };

  // 生成建议
  if (totalExposure > 0.8) {
    report.recommendations.push("Reduce total exposure");
  }

  const highRiskPositions = report.positions.filter((p) => p.risk === "HIGH");
  if (highRiskPositions.length > 0) {
    report.recommendations.push("Reduce high-risk positions");
  }

  return report;
};
```

## 六、应急预案

### 1. 市场异常处理

#### 异常市场检测

```javascript
// 异常市场检测
const detectMarketAnomaly = (marketData) => {
  const anomalies = [];

  // 检测异常波动
  const volatility = calculateVolatility(marketData.returns);
  if (volatility > 0.05) {
    // 5%以上波动
    anomalies.push({
      type: "HIGH_VOLATILITY",
      severity: "HIGH",
      action: "REDUCE_POSITIONS",
    });
  }

  // 检测异常成交量
  const volumeRatio = marketData.currentVolume / marketData.avgVolume;
  if (volumeRatio > 3) {
    // 成交量放大3倍以上
    anomalies.push({
      type: "HIGH_VOLUME",
      severity: "MEDIUM",
      action: "MONITOR_CLOSELY",
    });
  }

  // 检测异常价格变动
  const priceChange = Math.abs(marketData.priceChange);
  if (priceChange > 0.1) {
    // 10%以上变动
    anomalies.push({
      type: "LARGE_PRICE_MOVE",
      severity: "HIGH",
      action: "REVIEW_POSITIONS",
    });
  }

  return {
    anomalies,
    hasAnomaly: anomalies.length > 0,
    maxSeverity:
      anomalies.length > 0
        ? Math.max(
            ...anomalies.map((a) =>
              a.severity === "HIGH" ? 3 : a.severity === "MEDIUM" ? 2 : 1
            )
          )
        : 0,
  };
};
```

#### 应急处理流程

```javascript
// 应急处理流程
const emergencyResponse = (anomaly) => {
  const responses = {
    HIGH_VOLATILITY: {
      immediate: ["Close high-risk positions", "Reduce position sizes"],
      shortTerm: ["Review all positions", "Adjust stop losses"],
      longTerm: ["Update risk parameters", "Review strategy"],
    },
    HIGH_VOLUME: {
      immediate: ["Monitor price action", "Check news"],
      shortTerm: ["Verify positions", "Adjust targets"],
      longTerm: ["Analyze volume patterns"],
    },
    LARGE_PRICE_MOVE: {
      immediate: ["Check stop losses", "Review positions"],
      shortTerm: ["Analyze market impact", "Adjust strategy"],
      longTerm: ["Update risk models"],
    },
  };

  return (
    responses[anomaly.type] || {
      immediate: ["Monitor situation"],
      shortTerm: ["Review strategy"],
      longTerm: ["Update risk management"],
    }
  );
};
```

## 总结

A 股交易风险管理的核心要素：

1. **仓位管理** - 固定风险、凯利公式、波动率调整
2. **止损止盈** - 固定止损、移动止损、技术止损
3. **风险控制** - 回撤控制、相关性控制、流动性控制
4. **心理管理** - 情绪监控、纪律执行
5. **实时监控** - 风险监控、异常检测
6. **应急预案** - 异常处理、应急流程

风险管理的关键原则：

- **预防为主** - 提前识别和控制风险
- **分散投资** - 不要集中投资单一标的
- **严格止损** - 设置合理的止损位
- **仓位控制** - 控制单笔和总仓位
- **情绪管理** - 保持冷静和纪律
- **持续监控** - 实时监控风险状况
- **应急预案** - 准备应对异常情况

记住：风险管理比盈利更重要，保护资金是交易成功的基础。
