# Kenyan Premier League (KPL) Algorithmic Draw-Betting Backtest Model

A clean, dependency-free Node.js backtesting model that evaluates an **investment-grade sports trading strategy** targeting draw-market inefficiencies in the Kenyan Premier League (KPL).

## Strategy Thesis

The KPL is well known for its **low-scoring profile**, **long-distance travel fatigue**, and **defensive tactical structures**. These dynamics create a structurally mispriced draw market where the true probability of a draw is often higher than the implied probability priced by bookmakers. This model quantifies that edge across a 6-season historical dataset using flat staking.

## Strategy Configuration

| Parameter | Value |
|---|---|
| Fixed Odds Floor | `3.00` |
| Staking | Flat `1.0` unit per bet |
| Break-Even Target | `33.33%` win rate (1 / 3.00) |
| Historical Seasons | 6 (2025/26 → 2019/20*) |

> With an average odds floor of `3.00`, the strategy only needs to hit draws at a rate above `33.33%` to be profitable. The backtest confirms an aggregate draw rate of `42.50%`, producing a positive expected value.

## Dataset

| Season | Selections | Successful Draws |
|---|---|---|
| 2025/26 | 172 | 76 |
| 2024/25 | 158 | 68 |
| 2023/24 | 164 | 69 |
| 2022/23 | 150 | 58 |
| 2021/22 | 178 | 79 |
| 2019/20* | 98 | 41 |

## Installation & Usage

No external npm packages are required — the script uses only the Node.js standard library.

```bash
# Clone the repository
git clone https://github.com/<your-username>/kicksense.git
cd kicksense

# Run the backtest
node kpl-backtest.js
```

## Output

The script prints a scannable plain-text table with per-season and aggregate portfolio metrics:

- Win Rate (%)
- Total Units Staked / Total Units Returned
- Net Profit / Loss (units)
- ROI (%)

## Project Structure

```
kicksense/
├── kpl-backtest.js          # Backtest engine & console reporter
├── .github/
│   └── workflows/
│       └── run-backtest.yml # CI automation
├── .gitignore
└── README.md
```

## License

MIT
