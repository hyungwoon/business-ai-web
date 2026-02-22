---
name: financial-analysis
description: Perform ratio analysis, financial modeling, valuation, and investment analysis with structured frameworks. Use when evaluating company performance, building financial models, calculating ROI/IRR, running scenario analysis, or benchmarking against industry peers.
---

# Financial Analysis

**Important**: This skill assists with financial analysis workflows but does not provide financial advice. All analyses should be reviewed by qualified financial professionals before use in decision-making.

Frameworks for ratio analysis, financial modeling, valuation, investment analysis, and benchmarking. Complements financial-statements (GAAP presentation) and variance-analysis (budget vs actual decomposition).

## Ratio Analysis

### Profitability Ratios

```
Gross Margin           = Gross Profit / Revenue
Operating Margin       = Operating Income / Revenue
Net Margin             = Net Income / Revenue
EBITDA Margin          = EBITDA / Revenue
Return on Assets (ROA) = Net Income / Average Total Assets
Return on Equity (ROE) = Net Income / Average Shareholders' Equity
Return on Invested Capital (ROIC) = NOPAT / Average Invested Capital
  where NOPAT = Operating Income x (1 - Tax Rate)
  where Invested Capital = Total Equity + Total Debt - Cash
```

### DuPont Analysis (ROE Decomposition)

```
3-Factor DuPont:
  ROE = Net Margin x Asset Turnover x Equity Multiplier
      = (Net Income / Revenue) x (Revenue / Assets) x (Assets / Equity)

5-Factor DuPont:
  ROE = Tax Burden x Interest Burden x Operating Margin x Asset Turnover x Equity Multiplier
      = (NI / EBT) x (EBT / EBIT) x (EBIT / Revenue) x (Revenue / Assets) x (Assets / Equity)
```

Use DuPont to diagnose whether ROE is driven by profitability, efficiency, or leverage.

### Liquidity Ratios

```
Current Ratio          = Current Assets / Current Liabilities
Quick Ratio            = (Cash + Short-term Investments + Receivables) / Current Liabilities
Cash Ratio             = (Cash + Short-term Investments) / Current Liabilities
Operating Cash Ratio   = Operating Cash Flow / Current Liabilities
```

### Solvency Ratios

```
Debt-to-Equity         = Total Debt / Total Equity
Debt-to-Assets         = Total Debt / Total Assets
Net Debt-to-EBITDA     = (Total Debt - Cash) / EBITDA
Interest Coverage      = EBIT / Interest Expense
Debt Service Coverage  = EBITDA / (Interest + Principal Payments)
```

### Efficiency Ratios

```
Asset Turnover         = Revenue / Average Total Assets
Inventory Turnover     = COGS / Average Inventory
Days Inventory Outstanding (DIO) = 365 / Inventory Turnover
Receivables Turnover   = Revenue / Average Accounts Receivable
Days Sales Outstanding (DSO) = 365 / Receivables Turnover
Payables Turnover      = COGS / Average Accounts Payable
Days Payable Outstanding (DPO) = 365 / Payables Turnover
Cash Conversion Cycle  = DIO + DSO - DPO
```

### Ratio Analysis Output Template

```
RATIO ANALYSIS: [Company Name] — [Period]

                            Current    Prior    Change    Industry Avg
Profitability
  Gross Margin              XX.X%      XX.X%    +X.Xpp    XX.X%
  Operating Margin          XX.X%      XX.X%    +X.Xpp    XX.X%
  Net Margin                XX.X%      XX.X%    +X.Xpp    XX.X%
  ROE                       XX.X%      XX.X%    +X.Xpp    XX.X%
  ROIC                      XX.X%      XX.X%    +X.Xpp    XX.X%

Liquidity
  Current Ratio             X.Xx       X.Xx     +X.Xx     X.Xx
  Quick Ratio               X.Xx       X.Xx     +X.Xx     X.Xx

Solvency
  Debt-to-Equity            X.Xx       X.Xx     +X.Xx     X.Xx
  Net Debt/EBITDA           X.Xx       X.Xx     +X.Xx     X.Xx
  Interest Coverage         X.Xx       X.Xx     +X.Xx     X.Xx

Efficiency
  Asset Turnover            X.Xx       X.Xx     +X.Xx     X.Xx
  DSO                       XX days    XX days  +XX days   XX days
  Cash Conversion Cycle     XX days    XX days  +XX days   XX days

Key Findings:
1. [Most significant finding with quantification]
2. [Second finding]
3. [Third finding]

Areas of Concern:
- [Ratio significantly below industry average or deteriorating trend]
```

## Financial Modeling

### Three-Statement Model Structure

```
INPUT ASSUMPTIONS
├── Revenue drivers (volume, price, growth rates)
├── Cost structure (COGS %, OpEx by category)
├── Working capital assumptions (DSO, DIO, DPO)
├── CapEx and depreciation schedules
├── Debt schedule (interest rates, repayment terms)
└── Tax rate assumptions

INCOME STATEMENT (builds from revenue assumptions)
    ↓
BALANCE SHEET (builds from working capital + CapEx + debt assumptions)
    ↓
CASH FLOW STATEMENT (derived from IS changes + BS changes)
    ↓
VERIFICATION: BS balances, CF reconciles to cash change
```

### Revenue Build Methods

**Top-Down:**
```
Total Addressable Market (TAM)
  x Market Share %
  = Addressable Revenue
  x Penetration Rate
  = Revenue Estimate
```

**Bottom-Up:**
```
Number of Customers (or Units)
  x Average Revenue Per Customer (ARPU) or Average Selling Price (ASP)
  = Revenue Estimate

For subscription businesses:
  Beginning ARR
  + New ARR (new customers x ACV)
  + Expansion ARR (upsell + cross-sell)
  - Contraction ARR (downgrades)
  - Churned ARR
  = Ending ARR
```

**Cohort-Based:**
```
For each customer cohort (by acquisition period):
  Cohort Size x Retention Rate(t) x Revenue Per User(t)
  Sum across all active cohorts = Total Revenue
```

### Scenario Analysis Framework

```
SCENARIO COMPARISON: [Analysis Subject]

                    Bear Case    Base Case    Bull Case
Revenue Growth      X%           X%           X%
Gross Margin        X%           X%           X%
OpEx Growth         X%           X%           X%
CapEx               $X           $X           $X

Projected Outcomes
  Revenue (Yr 1)    $X           $X           $X
  EBITDA (Yr 1)     $X           $X           $X
  Free Cash Flow    $X           $X           $X
  Net Debt/EBITDA   X.Xx         X.Xx         X.Xx

Key Assumptions
  Bear: [Primary risk factors]
  Base: [Expected trajectory]
  Bull: [Upside catalysts]

Probability Weighting
  Bear: XX%  Base: XX%  Bull: XX%
  Expected Value = Sum of (Probability x Outcome)
```

### Sensitivity Analysis

```
SENSITIVITY TABLE: [Output Metric]

              Revenue Growth Rate
              -2%    0%     +2%    +4%    +6%
Gross    60%  $XX    $XX    $XX    $XX    $XX
Margin   62%  $XX    $XX    $XX    $XX    $XX
         64%  $XX    $XX    $XX    $XX    $XX
         66%  $XX    $XX    $XX    $XX    $XX
         68%  $XX    $XX    $XX    $XX    $XX

Base case highlighted: [Row, Column]
Break-even threshold: [Value where output crosses zero or target]
```

## Valuation

### DCF (Discounted Cash Flow)

```
Enterprise Value = Sum of [FCF(t) / (1 + WACC)^t] + Terminal Value / (1 + WACC)^n

Free Cash Flow (FCF):
  EBIT x (1 - Tax Rate)
  + Depreciation & Amortization
  - Capital Expenditures
  - Change in Net Working Capital
  = Unlevered Free Cash Flow

Terminal Value (Gordon Growth):
  TV = FCF(n+1) / (WACC - g)
  where g = long-term growth rate (typically 2-3%, should not exceed GDP growth)

Terminal Value (Exit Multiple):
  TV = EBITDA(n) x Exit EV/EBITDA Multiple

WACC:
  WACC = (E/V) x Re + (D/V) x Rd x (1 - Tax Rate)
  where Re = Risk-free Rate + Beta x Equity Risk Premium
```

### Comparable Company Analysis

```
TRADING COMPARABLES: [Target Company] vs Peers

Company          EV/Revenue  EV/EBITDA  P/E    EV/FCF   Growth
[Peer 1]         X.Xx        X.Xx       X.Xx   X.Xx     X%
[Peer 2]         X.Xx        X.Xx       X.Xx   X.Xx     X%
[Peer 3]         X.Xx        X.Xx       X.Xx   X.Xx     X%
[Peer 4]         X.Xx        X.Xx       X.Xx   X.Xx     X%

Median           X.Xx        X.Xx       X.Xx   X.Xx     X%
Mean             X.Xx        X.Xx       X.Xx   X.Xx     X%

[Target] Metric  $X          $X         $X     $X       X%

Implied Valuation Range:
  EV/Revenue:  $X - $X  (at median-mean range)
  EV/EBITDA:   $X - $X
  P/E:         $X - $X

Selection Criteria for Peers:
- Same industry / sub-sector
- Similar size (revenue within 0.5x-2x)
- Similar growth profile
- Similar margin structure
- Similar geographic exposure
```

### Valuation Summary (Football Field)

```
VALUATION SUMMARY: [Company Name]

Method              Low         Mid         High        Weight
DCF                 $XXM        $XXM        $XXM        XX%
EV/Revenue Comps    $XXM        $XXM        $XXM        XX%
EV/EBITDA Comps     $XXM        $XXM        $XXM        XX%
Precedent Txns      $XXM        $XXM        $XXM        XX%

Weighted Range:     $XXM    ——————————————    $XXM
Central Estimate:                $XXM

Per Share (if applicable):
  Share Count:      XX.XM (fully diluted)
  Price Range:      $XX.XX - $XX.XX
```

## Investment Analysis

### ROI / IRR / Payback

```
ROI = (Net Benefit - Cost) / Cost x 100%

NPV = Sum of [Cash Flow(t) / (1 + r)^t] - Initial Investment
  Decision rule: NPV > 0 → Invest

IRR = Discount rate where NPV = 0
  Decision rule: IRR > Hurdle Rate → Invest

Payback Period = Time until cumulative cash flows recover initial investment
  Simple payback: ignores time value of money
  Discounted payback: uses discounted cash flows
```

### Investment Decision Template

```
INVESTMENT ANALYSIS: [Project / Initiative Name]

Initial Investment:     $X
Time Horizon:           X years
Discount Rate:          X% (WACC or hurdle rate)

                Year 0   Year 1   Year 2   Year 3   Year 4   Year 5
Investment      ($X)
Revenue                  $X       $X       $X       $X       $X
Operating Cost           ($X)     ($X)     ($X)     ($X)     ($X)
Net Cash Flow   ($X)     $X       $X       $X       $X       $X
Cumulative CF   ($X)     ($X)     ($X)     $X       $X       $X

Key Metrics:
  NPV:              $X
  IRR:              X%
  Payback Period:   X.X years
  ROI (5-year):     X%

Risk Factors:
1. [Risk with probability and impact estimate]
2. [Risk with probability and impact estimate]

Recommendation: [Invest / Do Not Invest / Conditional]
Rationale: [2-3 sentences]
```

### Break-Even Analysis

```
Break-Even Volume  = Fixed Costs / (Price - Variable Cost per Unit)
Break-Even Revenue = Fixed Costs / Contribution Margin %
  where Contribution Margin % = (Price - Variable Cost) / Price

Margin of Safety   = (Actual Sales - Break-Even Sales) / Actual Sales x 100%
Operating Leverage = Contribution Margin / Operating Income
  Higher operating leverage → more sensitive to volume changes
```

## Working Capital Analysis

```
WORKING CAPITAL ANALYSIS: [Company Name] — [Period]

                    Current    Prior    Change    Benchmark
Accounts Receivable $X         $X       $X        —
  DSO               XX days    XX days  +XX       XX days
Inventory           $X         $X       $X        —
  DIO               XX days    XX days  +XX       XX days
Accounts Payable    $X         $X       $X        —
  DPO               XX days    XX days  +XX       XX days

Cash Conversion Cycle  XX days  XX days  +XX      XX days

Net Working Capital    $X       $X       $X
NWC as % of Revenue    X%       X%       +Xpp

Cash Impact of WC Change: ($X)
  AR increase (cash used):     ($X)
  Inventory increase (cash used): ($X)
  AP increase (cash source):    $X

Optimization Opportunities:
1. [Specific area with quantified potential improvement]
2. [Specific area with quantified potential improvement]
```

## Analysis Quality Checklist

Before delivering any financial analysis:

- [ ] All formulas verified and cross-referenced
- [ ] Assumptions clearly stated and reasonable
- [ ] Time periods consistent across all metrics
- [ ] Industry benchmarks sourced and cited
- [ ] Scenario/sensitivity analysis included for key assumptions
- [ ] Limitations and caveats noted
- [ ] Actionable recommendations provided
- [ ] Numbers reconcile (BS balances, CF ties to cash change)
