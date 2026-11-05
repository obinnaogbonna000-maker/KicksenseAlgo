// ============================================================================
// Kicksense — Kenyan Premier League Draw-Backtesting Strategy
// ============================================================================
// Models a 6-season historical dataset for a flat-staked draw-trading strategy
// and computes per-season + aggregate portfolio performance metrics.
//
// Usage:  node kpl-backtest.js
// ============================================================================

'use strict';

// ---------------------------------------------------------------------------
// 1. Historical Dataset (clean model: array of objects, one per season)
// ---------------------------------------------------------------------------
const seasons = [
  { season: '2025/26', selections: 172, successfulDraws: 76 },
  { season: '2024/25', selections: 158, successfulDraws: 68 },
  { season: '2023/24', selections: 164, successfulDraws: 69 },
  { season: '2022/23', selections: 150, successfulDraws: 58 },
  { season: '2021/22', selections: 178, successfulDraws: 79 },
  { season: '2019/20*', selections: 98, successfulDraws: 41 },
];

const STRATEGY = {
  averageOddsFloor: 3.00,
  stakePerBet: 1.0, // flat stake in units
};

// ---------------------------------------------------------------------------
// 2. Calculation Function
// ---------------------------------------------------------------------------
function backtestSeason(seasonData, params = STRATEGY) {
  const { season, selections, successfulDraws } = seasonData;
  const { averageOddsFloor, stakePerBet } = params;

  const wins = successfulDraws;
  const losses = selections - successfulDraws;

  const winRate = selections > 0 ? (wins / selections) * 100 : 0;

  const totalStaked = selections * stakePerBet;
  const totalReturned = wins * (stakePerBet * averageOddsFloor);
  const netProfit = totalReturned - totalStaked;
  const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0;

  return {
    season,
    selections,
    successfulDraws: wins,
    losses,
    winRate,
    totalStaked,
    totalReturned,
    netProfit,
    roi,
  };
}

function aggregatePortfolio(results) {
  const totals = results.reduce(
    (acc, r) => {
      acc.selections += r.selections;
      acc.successfulDraws += r.successfulDraws;
      acc.losses += r.losses;
      acc.totalStaked += r.totalStaked;
      acc.totalReturned += r.totalReturned;
      acc.netProfit += r.netProfit;
      return acc;
    },
    {
      selections: 0,
      successfulDraws: 0,
      losses: 0,
      totalStaked: 0,
      totalReturned: 0,
      netProfit: 0,
    }
  );

  const winRate = totals.selections > 0
    ? (totals.successfulDraws / totals.selections) * 100
    : 0;
  const roi = totals.totalStaked > 0
    ? (totals.netProfit / totals.totalStaked) * 100
    : 0;

  return {
    season: 'TOTAL (6 seasons)',
    selections: totals.selections,
    successfulDraws: totals.successfulDraws,
    losses: totals.losses,
    winRate,
    totalStaked: totals.totalStaked,
    totalReturned: totals.totalReturned,
    netProfit: totals.netProfit,
    roi,
  };
}

// ---------------------------------------------------------------------------
// 3. Run backtest
// ---------------------------------------------------------------------------
const seasonResults = seasons.map((s) => backtestSeason(s));
const portfolio = aggregatePortfolio(seasonResults);

// ---------------------------------------------------------------------------
// 4. Console Output — scannable plain-text table
// ---------------------------------------------------------------------------
const W = {
  season: 13,
  sel: 11,
  wins: 11,
  losses: 9,
  winRate: 10,
  staked: 11,
  returned: 11,
  net: 11,
  roi: 9,
};

function pad(str, width, align = 'right') {
  const s = String(str);
  if (align === 'left') return s.padEnd(width);
  return s.padStart(width);
}

function formatNumber(n, decimals = 2) {
  return Number(n).toFixed(decimals);
}

function printDivider(char = '-', width = 100) {
  console.log(char.repeat(width));
}

function printHeader() {
  console.log('');
  console.log('='.repeat(100));
  console.log('  KICKSENSE — KENYAN PREMIER LEAGUE DRAW STRATEGY BACKTEST');
  console.log('  Staking: Flat 1.0 unit/bet  |  Average Odds Floor: 3.00  |  Seasons: 6');
  console.log('='.repeat(100));
  console.log('');
}

function printTable(results) {
  const header =
    pad('Season', W.season, 'left') +
    pad('Selections', W.sel) +
    pad('Wins (Draws)', W.wins) +
    pad('Losses', W.losses) +
    pad('Win Rate %', W.winRate) +
    pad('Staked (u)', W.staked) +
    pad('Returned (u)', W.returned) +
    pad('Net P/L (u)', W.net) +
    pad('ROI %', W.roi);

  console.log(header);
  printDivider('-', 100);

  results.forEach((r) => {
    const row =
      pad(r.season, W.season, 'left') +
      pad(r.selections, W.sel) +
      pad(r.successfulDraws, W.wins) +
      pad(r.losses, W.losses) +
      pad(formatNumber(r.winRate, 2) + '%', W.winRate) +
      pad(formatNumber(r.totalStaked, 2), W.staked) +
      pad(formatNumber(r.totalReturned, 2), W.returned) +
      pad((r.netProfit >= 0 ? '+' : '') + formatNumber(r.netProfit, 2), W.net) +
      pad(formatNumber(r.roi, 2) + '%', W.roi);
    console.log(row);
  });

  printDivider('=', 100);

  const totalRow =
    pad(portfolio.season, W.season, 'left') +
    pad(portfolio.selections, W.sel) +
    pad(portfolio.successfulDraws, W.wins) +
    pad(portfolio.losses, W.losses) +
    pad(formatNumber(portfolio.winRate, 2) + '%', W.winRate) +
    pad(formatNumber(portfolio.totalStaked, 2), W.staked) +
    pad(formatNumber(portfolio.totalReturned, 2), W.returned) +
    pad((portfolio.netProfit >= 0 ? '+' : '') + formatNumber(portfolio.netProfit, 2), W.net) +
    pad(formatNumber(portfolio.roi, 2) + '%', W.roi);
  console.log(totalRow);
  printDivider('=', 100);
}

function printSummary() {
  console.log('');
  console.log('  PORTFOLIO SUMMARY');
  printDivider('-', 40);
  console.log(`  Total Selections       : ${portfolio.selections}`);
  console.log(`  Successful Draws       : ${portfolio.successfulDraws}`);
  console.log(`  Losses                 : ${portfolio.losses}`);
  console.log(`  Aggregate Win Rate     : ${formatNumber(portfolio.winRate, 2)}%`);
  console.log(`  Total Units Staked     : ${formatNumber(portfolio.totalStaked, 2)}`);
  console.log(`  Total Units Returned   : ${formatNumber(portfolio.totalReturned, 2)}`);
  console.log(`  Net Profit / Loss      : ${portfolio.netProfit >= 0 ? '+' : ''}${formatNumber(portfolio.netProfit, 2)} units`);
  console.log(`  Aggregate ROI          : ${formatNumber(portfolio.roi, 2)}%`);
  console.log(`  Average Odds Floor     : ${formatNumber(STRATEGY.averageOddsFloor, 2)}`);
  console.log(`  Stake per Bet          : ${formatNumber(STRATEGY.stakePerBet, 2)} unit(s)`);
  printDivider('-', 40);
  console.log('');
}

printHeader();
printTable(seasonResults);
printSummary();
