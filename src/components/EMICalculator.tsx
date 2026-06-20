import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { RATE_CONFIG } from '@/config/nrbRateConfig';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

/* ─────────────────────────── helpers ─────────────────────────── */
const fmt = (n: number) =>
  'Rs. ' +
  n
    .toFixed(0)
    .replace(/(\d)(?=(\d\d)+\d$)/g, '$1,'); // Nepali lakh-crore comma style

const fmtInt = (n: number) =>
  n
    .toFixed(0)
    .replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');

function calcEMI(principal: number, annualRate: number, tenureYears: number) {
  const P = principal;
  const R = annualRate / 12 / 100;
  const N = tenureYears * 12;
  if (R === 0) return { emi: P / N, totalInterest: 0, totalPayable: P };
  const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  const totalPayable = emi * N;
  const totalInterest = totalPayable - P;
  return { emi, totalInterest, totalPayable };
}

function buildAmortization(principal: number, annualRate: number, tenureYears: number) {
  const R = annualRate / 12 / 100;
  const N = tenureYears * 12;
  const emi = R === 0 ? principal / N : (principal * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  const schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
  let balance = principal;
  for (let yr = 1; yr <= tenureYears; yr++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      const interest = balance * R;
      const princ = Math.min(emi - interest, balance);
      yearInterest += interest;
      yearPrincipal += princ;
      balance = Math.max(0, balance - princ);
    }
    schedule.push({ year: yr, principalPaid: yearPrincipal, interestPaid: yearInterest, balance });
  }
  return schedule;
}

/* ─────────────────── Animated counter hook ─────────────────────── */
function useCountUp(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (Math.abs(target - from) < 1) { setDisplay(target); return; }
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return display;
}

/* ────────────────── Donut chart component ─────────────────────── */
function DonutChart({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  if (total <= 0) return null;
  const pPct = (principal / total) * 100;
  const iPct = (interest / total) * 100;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const pDash = (pPct / 100) * circ;
  const iDash = (iPct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 120 120" className="w-32 h-32" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="18" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke="#2E7D32" strokeWidth="18"
          strokeDasharray={`${pDash} ${circ - pDash}`}
          strokeLinecap="round"
        />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke="#F9A825" strokeWidth="18"
          strokeDasharray={`${iDash} ${circ - iDash}`}
          strokeDashoffset={-pDash}
          strokeLinecap="round"
        />
      </svg>
      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#2E7D32' }} />
          Principal ({pPct.toFixed(1)}%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#F9A825' }} />
          Interest ({iPct.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}

/* ─────────────────── Slider + input pair ───────────────────────── */
function SliderInput({
  label, value, min, max, step = 1, format,
  onChange, suffix = '', readOnly = false, highlight = false,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  format?: (v: number) => string; onChange: (v: number) => void;
  suffix?: string; readOnly?: boolean; highlight?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm font-medium text-gray-700">
        <span>{label}</span>
        {readOnly ? (
          <span className="font-bold text-[#2E7D32]">{format ? format(value) : `${fmtInt(value)}${suffix}`}</span>
        ) : (
          <input
            type="number"
            value={value}
            min={min} max={max} step={step}
            onChange={e => onChange(Math.min(max, Math.max(min, parseFloat(e.target.value) || 0)))}
            className={`w-28 text-right border rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2E7D32] ${highlight ? 'text-[#F9A825]' : 'text-[#2E7D32]'}`}
          />
        )}
      </div>
      {!readOnly && (
        <div className="relative h-2">
          <div className="absolute inset-0 rounded-full bg-gray-200" />
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${pct}%`, background: highlight ? '#F9A825' : '#2E7D32' }}
          />
          <input
            type="range"
            min={min} max={max} step={step} value={value}
            onChange={e => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            style={{ zIndex: 2 }}
          />
        </div>
      )}
      {!readOnly && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{format ? format(min) : `${fmtInt(min)}${suffix}`}</span>
          <span>{format ? format(max) : `${fmtInt(max)}${suffix}`}</span>
        </div>
      )}
    </div>
  );
}

/* ════════════════════ MAIN COMPONENT ════════════════════ */
interface EMICalculatorProps {
  propertyPrice: number;
  defaultDownPaymentPercent?: number;
  defaultBaseRate?: number;
  defaultPremium?: number;
  defaultTenure?: number;
}

const EMICalculator = ({
  propertyPrice,
  defaultDownPaymentPercent = RATE_CONFIG.defaultDownPaymentPercent,
  defaultBaseRate = RATE_CONFIG.defaultBankBaseRate,
  defaultPremium = RATE_CONFIG.defaultBankPremium,
  defaultTenure = RATE_CONFIG.defaultTenureYears,
}: EMICalculatorProps) => {
  const [downPct, setDownPct] = useState(defaultDownPaymentPercent);
  const [baseRate, setBaseRate] = useState(defaultBaseRate);
  const [premium, setPremium] = useState(defaultPremium);
  const [effectiveRate, setEffectiveRate] = useState(defaultBaseRate + defaultPremium);
  const [tenure, setTenure] = useState(defaultTenure);
  const [showAmortization, setShowAmortization] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Keep effective rate synced with base+premium unless user overrides directly
  const handleBaseRateChange = useCallback((v: number) => {
    setBaseRate(v);
    setEffectiveRate(parseFloat((v + premium).toFixed(2)));
  }, [premium]);

  const handlePremiumChange = useCallback((v: number) => {
    setPremium(v);
    setEffectiveRate(parseFloat((baseRate + v).toFixed(2)));
  }, [baseRate]);

  const handleEffectiveRateChange = useCallback((v: number) => {
    setEffectiveRate(v);
    // distribute delta back into base and keep premium untouched
    setBaseRate(parseFloat((v - premium).toFixed(2)));
  }, [premium]);

  const downPaymentAmt = (downPct / 100) * propertyPrice;
  const loanAmount = propertyPrice - downPaymentAmt;

  const { emi, totalInterest, totalPayable } = useMemo(
    () => calcEMI(loanAmount, effectiveRate, tenure),
    [loanAmount, effectiveRate, tenure]
  );

  const animatedEMI = useCountUp(emi);

  const amortization = useMemo(
    () => showAmortization ? buildAmortization(loanAmount, effectiveRate, tenure) : [],
    [loanAmount, effectiveRate, tenure, showAmortization]
  );

  return (
    <div
      className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      style={{ background: '#FAFAF7' }}
    >
      {/* Header */}
      <div className="px-6 py-4" style={{ background: 'linear-gradient(135deg, #2E7D32, #1565C0)' }}>
        <h3 className="text-xl font-bold text-white">🏦 EMI Calculator</h3>
        <p className="text-white/80 text-sm mt-0.5">Estimate your monthly home loan payment</p>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Inputs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Property Price (locked) */}
            <SliderInput
              label="Property Price"
              value={propertyPrice}
              min={propertyPrice} max={propertyPrice}
              format={fmt}
              onChange={() => {}}
              readOnly
            />

            {/* Down Payment % */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Down Payment</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={90} step={1}
                    value={downPct}
                    onChange={e => setDownPct(Math.min(90, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-16 text-right border rounded-lg px-2 py-1 text-sm font-bold text-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                  <span className="text-[#2E7D32] font-bold">%</span>
                </div>
              </div>
              <div className="relative h-2">
                <div className="absolute inset-0 rounded-full bg-gray-200" />
                <div className="absolute inset-y-0 left-0 rounded-full bg-[#2E7D32]" style={{ width: `${(downPct / 90) * 100}%` }} />
                <input type="range" min={0} max={90} step={1} value={downPct}
                  onChange={e => setDownPct(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer" style={{ zIndex: 2 }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">0%</span>
                <span className="text-[#1565C0] font-semibold">{fmt(downPaymentAmt)} ({downPct}%)</span>
                <span className="text-gray-400">90%</span>
              </div>
            </div>

            {/* Loan Amount (auto-calc) */}
            <div className="rounded-xl p-3 bg-[#2E7D32]/5 border border-[#2E7D32]/20">
              <div className="text-xs text-gray-500 mb-1">Loan Amount (Principal)</div>
              <div className="text-xl font-extrabold text-[#2E7D32]">{fmt(loanAmount)}</div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Rate Inputs */}
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                Interest Rate
                <span className="relative">
                  <Info
                    className="h-3.5 w-3.5 text-gray-400 cursor-pointer ml-1"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && (
                    <div className="absolute left-0 bottom-6 z-50 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-xl">
                      Rates shown are indicative reference values. Actual bank base rate + premium vary by lender and borrower eligibility. Confirm with your bank before finalizing.
                    </div>
                  )}
                </span>
              </div>
              <div className="text-xs text-[#1565C0] font-medium">
                NRB Policy Rate: {RATE_CONFIG.nrbPolicyRate}% | Bank Rate: {RATE_CONFIG.nrbBankRate}%
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Base Rate %</label>
                  <input type="number" min={1} max={30} step={0.25} value={baseRate}
                    onChange={e => handleBaseRateChange(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm font-bold text-center text-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Premium %</label>
                  <input type="number" min={0} max={10} step={0.25} value={premium}
                    onChange={e => handlePremiumChange(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm font-bold text-center text-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Effective %</label>
                  <input type="number" min={1} max={40} step={0.25} value={effectiveRate}
                    onChange={e => handleEffectiveRateChange(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm font-bold text-center text-[#F9A825] focus:outline-none focus:ring-2 focus:ring-[#F9A825]" />
                </div>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Loan Tenure (Years)</label>
              <div className="flex flex-wrap gap-2">
                {RATE_CONFIG.tenureOptions.map(yr => (
                  <button key={yr} onClick={() => setTenure(yr)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                      tenure === yr
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-md'
                        : 'border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]'
                    }`}>
                    {yr}yr
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg,#2E7D3210,#1565C010)' }}>
          {/* Main EMI */}
          <div className="text-center mb-5">
            <div className="text-sm text-gray-500 mb-1">Monthly EMI</div>
            <div className="text-4xl md:text-5xl font-extrabold" style={{ color: '#F9A825', letterSpacing: '-1px' }}>
              {fmt(animatedEMI)}
            </div>
            <div className="text-xs text-gray-400 mt-1">per month for {tenure} years</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Down Payment', value: fmt(downPaymentAmt), sub: `${downPct}% of price`, color: '#2E7D32' },
                { label: 'Loan Amount', value: fmt(loanAmount), sub: 'Principal', color: '#1565C0' },
                { label: 'Total Interest', value: fmt(totalInterest), sub: 'Over full tenure', color: '#F9A825' },
                { label: 'Total Payable', value: fmt(totalPayable), sub: 'Principal + Interest', color: '#D32F2F' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                  <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Donut */}
            <DonutChart principal={loanAmount} interest={totalInterest} />
          </div>
        </div>

        {/* ── Amortization ── */}
        <div>
          <button
            onClick={() => setShowAmortization(v => !v)}
            className="flex items-center gap-2 text-[#1565C0] font-semibold text-sm hover:underline"
          >
            {showAmortization ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showAmortization ? 'Hide' : 'View'} full amortization schedule
          </button>

          {showAmortization && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#2E7D32] text-white">
                  <tr>
                    <th className="px-4 py-2.5">Year</th>
                    <th className="px-4 py-2.5">Principal Paid</th>
                    <th className="px-4 py-2.5">Interest Paid</th>
                    <th className="px-4 py-2.5">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortization.map((row, i) => (
                    <tr key={row.year} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2.5 font-medium text-gray-700">{row.year}</td>
                      <td className="px-4 py-2.5 text-[#2E7D32] font-semibold">{fmt(row.principalPaid)}</td>
                      <td className="px-4 py-2.5 text-[#F9A825] font-semibold">{fmt(row.interestPaid)}</td>
                      <td className="px-4 py-2.5 text-gray-600">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-gray-400 italic border-t pt-3">
          *Indicative only. Final EMI subject to bank approval, processing fees, and applicable NRB regulations at time of loan disbursement.
        </p>
      </div>
    </div>
  );
};

export default EMICalculator;
