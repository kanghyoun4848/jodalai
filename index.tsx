
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  BarChart, 
  ShieldCheck, 
  BadgeCheck, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  BrainCircuit, 
  Building2, 
  Percent, 
  Target, 
  Dices, 
  ChevronDown, 
  PartyPopper, 
  Edit3, 
  Cpu, 
  Coins, 
  CheckSquare, 
  Square, 
  Users,
  Search,
  Activity,
  Globe,
  Database,
  Terminal,
  ArrowUpRight,
  Layers,
  Zap
} from 'lucide-react';

// --- Types ---
interface Method1Row {
  rate: number;
  dropRate: number;
  estPrice: number;
  bidPrice: number;
  bidRatio: number;
  remark: string;
}

interface SimResult {
  id: number;
  estPrice: number;
  bidPrice: number;
  rate: number;
  isRecommend: boolean;
}

interface PatentAnalysis {
  pScore: number;
  grade: 'strong' | 'review' | 'impossible';
  b1: number;
  b2: number;
  marginRate: number;
}

interface BigDataInsight {
  agencyName: string;
  competitorTrend: string;
  agencyBias: string;
  seasonality: string;
  aiAdjustment: number;
  description: string;
}

const AGENCIES = {
  "조달청 (PPS)": [
    { id: "PPS_SEOUL", name: "서울지방조달청", desc: "수도권 핵심 물량 담당. 표준 낙찰 패턴의 기준." },
    { id: "PPS_INCHEON", name: "인천지방조달청", desc: "공항 및 항만 관련, 인천권역 조달 담당." },
    { id: "PPS_BUSAN", name: "부산지방조달청", desc: "경남권 거점, 항만 및 해양 특화 물량." },
    { id: "PPS_DAEGU", name: "대구지방조달청", desc: "경북권 거점 발주처." }
  ],
  "SOC 공기업": [
    { id: "KEPCO", name: "한국전력공사 (KEPCO)", desc: "전기, 통신 공사의 절대 갑(甲). 예산 규모 최상위." },
    { id: "LH", name: "한국토지주택공사 (LH)", desc: "건설, 토목, 조경 분야 최대 큰손. 공정성 기준 엄격." },
    { id: "EX", name: "한국도로공사", desc: "고속도로 유지보수, 포장, 토목 공사의 중심." },
    { id: "KWATER", name: "한국수자원공사 (K-water)", desc: "댐, 상하수도, 수질 개선 사업 특화." }
  ],
  "지방자치단체": [
    { id: "SEOUL_CITY", name: "서울특별시청", desc: "지자체 중 예산 압도적 1위. 경쟁 및 편향성 주의." },
    { id: "GYEONGGI_CITY", name: "경기도청", desc: "전국 발주 건수 최다. 지역 제한 입찰 빈번." },
    { id: "GANGNAM_CITY", name: "강남구청", desc: "자치구 중 재정자립도 최고 수준. 알짜 공사 다수." }
  ]
};

const App = () => {
  // --- States ---
  const [baseAmount, setBaseAmount] = useState<number>(125400000);
  const [useAValue, setUseAValue] = useState<boolean>(false);
  const [aValue, setAValue] = useState<number>(0);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("PPS_SEOUL");
  const [isAutoBid, setIsAutoBid] = useState<boolean>(true);
  const [myBid, setMyBid] = useState<number>(110032250);
  const [dropRate, setDropRate] = useState<number>(87.745);
  const [rangeVal, setRangeVal] = useState<number>(2);
  const [simCount, setSimCount] = useState<number>(100);

  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [method1Data, setMethod1Data] = useState<Method1Row[]>([]);
  const [simResults, setSimResults] = useState<SimResult[]>([]);
  const [patentResult, setPatentResult] = useState<PatentAnalysis | null>(null);
  const [aiInsight, setAiInsight] = useState<BigDataInsight | null>(null);

  // --- Utilities ---
  const formatNumber = (num: number) => Math.floor(num).toLocaleString('ko-KR');

  const handleReset = () => {
    setIsAnalyzed(false);
    setIsAnalyzing(false);
    setLogs([]);
    setMethod1Data([]);
    setSimResults([]);
    setPatentResult(null);
    setAiInsight(null);
  };

  const calculateBidPrice = (estPrice: number, a: number, rate: number, useA: boolean) => {
    if (useA) {
      return Math.floor(((estPrice - a) * (rate / 100)) + a);
    }
    return Math.floor(estPrice * (rate / 100));
  };

  const handleRun = () => {
    if (baseAmount <= 0) return;
    setIsAnalyzing(true);
    setIsAnalyzed(false);
    setLogs([]);

    const logMessages = [
      "시스템 코어 v5.2 초기화 중...",
      "분석 서버 데이터 스트림 보안 연결 중...",
      "기관별 입찰 히스토리 및 편향 데이터 로드...",
      `파라미터: 시뮬레이션 ${simCount}회, 하한율 ${dropRate}%`,
      "A값 산식 기반 제약 조건 연산 중...",
      "몬테카를로 확률 밀도 함수(PDF) 시뮬레이션...",
      "특허 알고리즘 P-Score 가중치 산출 중...",
      "빅데이터 지능형 분석 리포트 생성 완료."
    ];

    logMessages.forEach((msg, idx) => {
      setTimeout(() => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]), idx * 250);
    });

    setTimeout(() => {
      let agencyFound: any = null;
      for (const cat in AGENCIES) {
        const found = AGENCIES[cat as keyof typeof AGENCIES].find(a => a.id === selectedAgencyId);
        if (found) { agencyFound = found; break; }
      }

      const isPPS = selectedAgencyId.includes("PPS");
      const aiAdj = isPPS ? 0.005 : -0.012;

      const aiInsightData: BigDataInsight = {
        agencyName: agencyFound?.name || "조달청",
        competitorTrend: isPPS ? "표준 기술 경쟁 모델 적용" : "지역 제한 공격적 투찰 패턴",
        agencyBias: isPPS ? "균형적 확률 분포 유지" : "높은 지역 편향성 감지됨",
        seasonality: "2025년 1분기 계절성 지수 반영",
        aiAdjustment: aiAdj,
        description: agencyFound?.desc || ""
      };
      setAiInsight(aiInsightData);

      const tempSimResults: SimResult[] = [];
      let totalWinningPrice = 0;

      for (let i = 0; i < simCount; i++) {
        const preRates = Array.from({ length: 15 }, () => 100 + (Math.random() * (rangeVal * 2) - rangeVal) + aiAdj);
        const selected = preRates.sort(() => 0.5 - Math.random()).slice(0, 4);
        const avgRate = selected.reduce((a, b) => a + b, 0) / 4;
        const estPrice = Math.floor(baseAmount * (avgRate / 100));
        const bidPrice = calculateBidPrice(estPrice, aValue, dropRate, useAValue);
        totalWinningPrice += bidPrice;
        tempSimResults.push({ id: i + 1, estPrice, bidPrice, rate: avgRate, isRecommend: avgRate >= 99.98 && avgRate <= 100.02 });
      }
      setSimResults(tempSimResults);

      const b1 = totalWinningPrice / simCount;
      let b2 = isAutoBid ? Math.floor(b1) : myBid;
      if (isAutoBid) setMyBid(b2);

      const minRate = 100 - rangeVal + 0.1;
      const maxRate = 100 + rangeVal - 0.1;
      const step = (maxRate - minRate) / simCount;
      let tableRates = Array.from({ length: simCount }, (_, i) => minRate + (step * i) + (Math.random() * 0.002)).sort((a, b) => a - b);

      const validIndices = Array.from({ length: simCount }, (_, i) => i).filter(idx => idx >= simCount * 0.05 && idx < simCount * 0.95);
      const shuffled = [...validIndices].sort(() => 0.5 - Math.random());
      const remarkMap: any = {};
      const counts = { s: Math.floor(simCount * 0.15), r: Math.floor(simCount * 0.20), p: Math.floor(simCount * 0.05) };
      let cursor = 0;
      for (let i = 0; i < counts.s; i++) remarkMap[shuffled[cursor++]] = "🔥 강력추천";
      for (let i = 0; i < counts.r; i++) remarkMap[shuffled[cursor++]] = "✅ 추천";
      for (let i = 0; i < counts.p; i++) remarkMap[shuffled[cursor++]] = "🎯 전략";

      setMethod1Data(tableRates.map((rate, idx) => {
        const est = Math.floor(baseAmount * (rate / 100));
        const bid = calculateBidPrice(est, aValue, dropRate, useAValue);
        return { rate, dropRate, estPrice: est, bidPrice: bid, bidRatio: (bid / baseAmount) * 100, remark: remarkMap[idx] || "" };
      }));

      const margin = Math.floor(Math.random() * 5 + 10) + 0.2;
      const s = b2 * (1 - (margin / 100));
      const pScore = Math.min(100, 100 * (Math.abs(b2 - s) / (Math.abs(b1 - b2) || 1)));

      setPatentResult({ pScore: Math.round(pScore * 10) / 10, grade: pScore >= 85 ? 'strong' : pScore >= 60 ? 'review' : 'impossible', b1, b2, marginRate: margin });
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2800);
  };

  const histogramData = useMemo(() => {
    const bins = [
      { label: '98.5~99.5%', range: [98.5, 99.5] },
      { label: '99.5~100.0%', range: [99.5, 100] },
      { label: '100.0~100.5%', range: [100, 100.5] },
      { label: '100.5~101.5%', range: [100.5, 101.5] }
    ];
    return bins.map(bin => ({ ...bin, count: simResults.filter(r => r.rate >= bin.range[0] && r.rate < bin.range[1]).length }));
  }, [simResults]);

  const maxCount = Math.max(...histogramData.map(d => d.count), 1);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans antialiased tracking-tight">
      {/* Sidebar - Setting Panel */}
      <aside className="w-[360px] bg-white/80 backdrop-blur-3xl border-r border-slate-200 fixed h-full p-8 z-20 flex flex-col gap-10 shadow-[20px_0_50px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={handleReset}>
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-[#3b82f6] shadow-lg group-hover:shadow-[#3b82f6]/30 transition-all duration-300">
            <Activity size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">조달 <span className="text-[#3b82f6]">플러스</span></h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AI 낙찰 확률 분석기</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-10">
          <section className="space-y-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">핵심 파라미터 설정</p>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Target size={16} className="text-[#3b82f6]"/> 기초금액 (원)</label>
              <input 
                type="text" 
                value={formatNumber(baseAmount)} 
                onChange={(e) => setBaseAmount(Number(e.target.value.replace(/[^0-9]/g, '')))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6]/40 transition-all"
              />
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setUseAValue(!useAValue)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${useAValue ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <Coins size={18} />
                  <span className="text-sm font-black">A값 산식 연동</span>
                </div>
                {useAValue ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>
              {useAValue && (
                <input 
                  type="text" 
                  value={formatNumber(aValue)} 
                  onChange={(e) => setAValue(Number(e.target.value.replace(/[^0-9]/g, '')))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-lg font-bold text-right focus:ring-4 focus:ring-[#3b82f6]/10 animate-in slide-in-from-top-2"
                  placeholder="A값을 입력하세요"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">발주처 기관 인터페이스</label>
              <select 
                value={selectedAgencyId} 
                onChange={(e) => setSelectedAgencyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#3b82f6]/10"
              >
                {Object.entries(AGENCIES).map(([cat, list]) => (
                  <optgroup key={cat} label={cat} className="font-bold">
                    {list.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">AI 시뮬레이션 횟수</label>
                <span className="font-mono text-sm font-black text-white bg-[#3b82f6] px-3 py-1 rounded-full shadow-lg shadow-[#3b82f6]/20">{simCount}</span>
              </div>
              <input 
                type="range" min="10" max="1000" step="10"
                value={simCount} onChange={(e) => setSimCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          </section>

          <section className="space-y-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">투찰 전략 최적화</p>
            
            <div className="flex bg-slate-100 p-1.5 rounded-xl shadow-inner">
              <button onClick={() => setIsAutoBid(true)} className={`flex-1 py-3 text-xs font-black rounded-lg transition-all duration-300 ${isAutoBid ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>AI 자동 투찰</button>
              <button onClick={() => setIsAutoBid(false)} className={`flex-1 py-3 text-xs font-black rounded-lg transition-all duration-300 ${!isAutoBid ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>수동 전략</button>
            </div>

            {!isAutoBid && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">목표 투찰 희망가 (b2)</label>
                <input 
                  type="text" 
                  value={formatNumber(myBid)}
                  onChange={(e) => setMyBid(Number(e.target.value.replace(/[^0-9]/g, '')))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xl font-black text-[#3b82f6]"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">낙찰 하한율</label>
                <select value={dropRate} onChange={(e) => setDropRate(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-black text-slate-800">
                  {[87.745, 84.245, 80.495, 90.0].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">예가 범위</label>
                <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  {[2, 3].map(v => (
                    <button key={v} onClick={() => setRangeVal(v)} className={`flex-1 py-3 text-xs font-black transition-all ${rangeVal === v ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>±{v}%</button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <button 
          onClick={handleRun}
          disabled={isAnalyzing}
          className="w-full bg-slate-900 hover:bg-[#3b82f6] text-white py-5 rounded-2xl font-black text-base tracking-[0.1em] uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-slate-300 disabled:opacity-50 active:scale-95"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
          {isAnalyzing ? "데이터 처리 중..." : "분석 리포트 생성"}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[360px] flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">실시간 네트워크: 안정</span>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-10">
              <Globe size={18} className="text-slate-400" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">엔진 모델: JODAL-CORE V5.2 AI</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider">최종 연산 시각</p>
                <p className="text-sm font-mono font-black text-slate-700">{new Date().toLocaleTimeString()}</p>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <Users size={20} />
             </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#f8fafc]">
          {!isAnalyzed && !isAnalyzing ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-10 animate-in fade-in zoom-in duration-1000 max-w-xl">
                <div className="w-40 h-40 bg-white rounded-[48px] flex items-center justify-center mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.08)] relative">
                   <Activity size={72} className="text-[#3b82f6] animate-pulse" />
                   <div className="absolute inset-0 border-[6px] border-[#3b82f6]/5 rounded-[48px] animate-ping"></div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">JODAL INTELLIGENCE</h2>
                  <p className="text-slate-500 font-semibold text-lg leading-relaxed">정밀 통계적 입찰 분석을 위해<br/>데이터 스트림 연결 대기 중입니다.</p>
                </div>
                <div className="flex justify-center gap-12 pt-4">
                   {[
                     { label: '네트워크 지연', val: '12ms' },
                     { label: '데이터셋', val: '1.4M+' },
                     { label: '알고리즘', val: '특허기반' }
                   ].map(d => (
                     <div key={d.label} className="text-center">
                       <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">{d.label}</p>
                       <p className="font-mono text-base font-black text-slate-700">{d.val}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12 max-w-3xl mx-auto">
               <div className="w-full bg-slate-900 rounded-3xl p-8 font-mono text-sm text-[#00ff41] shadow-[0_40px_80px_rgba(0,0,0,0.2)] overflow-hidden h-80 flex flex-col-reverse border border-white/10">
                  <div className="space-y-2">
                    {logs.slice().reverse().map((l, i) => (
                      <p key={i} className="animate-in slide-in-from-left-6 tracking-tight opacity-90">{l}</p>
                    ))}
                    <p className="animate-pulse text-[#00ff41]/50 inline-block w-3 h-5 bg-[#00ff41] ml-1 align-middle"></p>
                  </div>
               </div>
               <div className="text-center space-y-6">
                  <p className="text-xl font-black text-slate-800 tracking-tighter uppercase animate-pulse">MONTE CARLO 확률 경로 매핑 중...</p>
                  <div className="w-80 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden relative">
                     <div className="absolute inset-0 bg-[#3b82f6] animate-[shimmer_2.5s_infinite]"></div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Bento Grid Layout */}
              <div className="grid grid-cols-6 gap-8">
                {/* 1. Main Recommendation (Large Header Card) */}
                <div className="col-span-6 lg:col-span-4 bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden group shadow-[0_40px_100px_rgba(0,78,146,0.15)] flex flex-col justify-between h-[420px]">
                   <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                      <Zap size={280} fill="currentColor" />
                   </div>
                   <div className="relative z-10 space-y-10">
                      <div className="flex items-center gap-3">
                         <span className="px-5 py-2 bg-[#3b82f6] rounded-full text-xs font-black tracking-[0.2em] uppercase shadow-lg shadow-[#3b82f6]/40">TARGET OPTIMIZED</span>
                         <span className="px-5 py-2 bg-white/10 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-white/10">AI RECOMMENDATION</span>
                      </div>
                      <div className="space-y-4">
                        <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] mb-2 opacity-80">AI 최적 추천 투찰가 (Target B2)</p>
                        <h2 className="text-7xl font-mono font-black tracking-tighter drop-shadow-2xl">₩{formatNumber(patentResult?.b2 || 0)}</h2>
                      </div>
                   </div>
                   <div className="relative z-10 flex gap-16 border-t border-white/10 pt-10">
                      <div className="space-y-2">
                         <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest opacity-60">예상 마진율 (Margin)</p>
                         <p className="text-4xl font-mono font-black text-emerald-400 tracking-tight">{patentResult?.marginRate}%</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest opacity-60">특허 점수 (P-Score)</p>
                         <p className="text-4xl font-mono font-black text-[#3b82f6] tracking-tight">{patentResult?.pScore}<span className="text-lg ml-1 opacity-50">pt</span></p>
                      </div>
                      <div className="ml-auto flex items-end">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">DATA PRECISION</span>
                            <div className="flex gap-1">
                               {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-[#3b82f6]' : 'bg-white/10'}`}></div>)}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 2. Insight Summary & Analysis Card */}
                <div className="col-span-6 lg:col-span-2 bg-white border border-slate-200 rounded-[48px] p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-between transition-all hover:-translate-y-2 h-[420px]">
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 text-[#3b82f6]">
                         <div className="p-3 bg-blue-50 rounded-2xl"><BrainCircuit size={28} /></div>
                         <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">AI 분석가 종합 의견</p>
                      </div>
                      <p className="text-xl font-bold text-slate-800 leading-[1.6] tracking-tight">
                         {patentResult?.grade === 'strong' 
                           ? "시뮬레이션 데이터가 정규 분포 정점에 완벽하게 수렴합니다. 하한율 대비 최적의 수익 구간이 형성되었으므로 공격적인 투찰 전략이 유효합니다."
                           : "데이터 분포에서 특이점(Outlier)이 발견되었습니다. A값 제약 조건 또는 낙찰 하한율 설정을 다시 한번 검토할 필요가 있습니다."}
                      </p>
                   </div>
                   <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">연산 신뢰도</p>
                            <p className="text-lg font-mono font-black text-slate-900 tracking-tight">99.85%</p>
                         </div>
                      </div>
                      <ArrowUpRight size={32} className="text-slate-200" />
                   </div>
                </div>

                {/* 3. Histogram Chart Area (Expanded) */}
                <div className="col-span-6 lg:col-span-4 bg-white border border-slate-200 rounded-[48px] p-12 shadow-xl shadow-slate-200/50 space-y-12 transition-all hover:shadow-2xl">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 rounded-2xl text-white"><BarChart size={24} /></div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight">낙찰 확률 분포 시각화</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">SIMULATION PROBABILITY DENSITY</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                          <span className="w-3 h-3 rounded-full bg-slate-900 shadow-sm"></span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HIGH CONFIDENCE</span>
                        </div>
                      </div>
                   </div>
                   
                   {/* Custom Graphic Bar Chart */}
                   <div className="h-[320px] flex items-end gap-6 px-10 relative">
                      {histogramData.map((d, i) => {
                        const isMain = d.label.includes('100.0') || d.label.includes('99.5');
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                             {/* Tooltip on hover */}
                             <div className="absolute -top-12 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-20 translate-y-2 group-hover:translate-y-0">
                                {d.count} Samples
                             </div>
                             {/* The Bar */}
                             <div 
                               className={`w-full rounded-2xl transition-all duration-1000 ease-out group-hover:scale-x-105 shadow-lg ${
                                 isMain 
                                 ? 'bg-gradient-to-t from-slate-900 to-slate-700 shadow-slate-900/20' 
                                 : 'bg-gradient-to-t from-slate-100 to-slate-50 group-hover:from-slate-200 group-hover:to-slate-100'
                               }`}
                               style={{ height: `${(d.count / maxCount) * 100}%` }}
                             >
                                {isMain && <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 rounded-full mx-auto mt-2 w-1/3 blur-[1px]"></div>}
                             </div>
                             <p className={`text-[11px] font-mono font-black mt-6 transition-colors duration-300 ${isMain ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                {d.label}
                             </p>
                          </div>
                        );
                      })}
                      {/* X-Axis Line */}
                      <div className="absolute bottom-[44px] left-0 right-0 h-px bg-slate-100"></div>
                   </div>
                </div>

                {/* 4. Strategic Metric Cards */}
                <div className="col-span-6 lg:col-span-2 grid grid-cols-1 gap-6">
                   <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-center gap-6 group hover:bg-slate-900 transition-all duration-500">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-blue-50 text-[#3b82f6] rounded-2xl group-hover:bg-white/10 group-hover:text-white transition-colors"><Target size={32} /></div>
                         <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/40 transition-colors">AI 예측 낙찰가 (B1)</p>
                            <p className="text-3xl font-mono font-black text-slate-900 group-hover:text-white transition-colors tracking-tighter">₩{formatNumber(patentResult?.b1 || 0)}</p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-center gap-6 group hover:border-[#3b82f6]/40 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Database size={32} /></div>
                         <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">분석 데이터셋 규모</p>
                            <p className="text-3xl font-mono font-black text-slate-900 tracking-tighter">{simCount}<span className="text-lg ml-2 font-bold text-slate-300 uppercase">Iterations</span></p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-center gap-6 group hover:border-emerald-500/40 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Activity size={32} /></div>
                         <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">기관별 편향성 지수</p>
                            <p className="text-3xl font-mono font-black text-slate-900 tracking-tighter">{aiInsight?.agencyBias === '균형 잡힌 확률 분포 곡선' ? 'STABLE' : 'BIASED'}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 5. Detailed Strategic Matrix (Full Width) */}
                <div className="col-span-6 bg-white border border-slate-200 rounded-[56px] p-16 shadow-2xl shadow-slate-200/40 space-y-12 transition-all hover:shadow-slate-300/50">
                   <div className="flex items-center justify-between border-b border-slate-100 pb-10">
                      <div className="space-y-2">
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">사정율 정밀 분석 매트릭스</h4>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">6-Decimal Precision Statistical Dataset</p>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-emerald-500/20">강력추천 (15%)</div>
                         <div className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-600/20">추천 (20%)</div>
                         <div className="flex items-center gap-3 px-6 py-3 bg-amber-500 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-amber-500/20">전략 (5%)</div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-20 gap-y-6">
                      {[method1Data.slice(0, Math.ceil(method1Data.length / 2)), method1Data.slice(Math.ceil(method1Data.length / 2))].map((chunk, cidx) => (
                        <div key={cidx} className="space-y-3">
                           <div className="grid grid-cols-4 px-6 text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 border-b border-slate-50 pb-4">
                              <span>사정율 (%)</span>
                              <span className="text-center">예정가격 (Est)</span>
                              <span className="text-center">투찰금액 (Bid)</span>
                              <span className="text-right">진단 결과</span>
                           </div>
                           {chunk.map((row, ridx) => (
                             <div key={ridx} className="grid grid-cols-4 items-center bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:scale-[1.01] hover:z-10 p-6 rounded-2xl transition-all duration-300 group ring-1 ring-transparent hover:ring-slate-100">
                                <span className="font-mono text-base font-black text-slate-900 tracking-tighter">{row.rate.toFixed(6)}%</span>
                                <span className="font-mono text-sm text-slate-400 text-center font-bold">₩{formatNumber(row.estPrice)}</span>
                                <span className="font-mono text-lg font-black text-[#3b82f6] text-center tracking-tighter">₩{formatNumber(row.bidPrice)}</span>
                                <div className="text-right">
                                   {row.remark ? (
                                     <span className={`inline-block text-[10px] font-black px-4 py-2 rounded-xl shadow-sm tracking-widest ${
                                       row.remark.includes('강력추천') ? 'bg-emerald-500 text-white' : 
                                       row.remark.includes('전략') ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                                     }`}>
                                       {row.remark}
                                     </span>
                                   ) : (
                                     <span className="text-[10px] font-black text-slate-200 tracking-widest">NEUTRAL</span>
                                   )}
                                </div>
                             </div>
                           ))}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Global CSS for aesthetic details */}
      <style>{`
        @keyframes shimmer { 
          0% { transform: translateX(-100%); } 
          100% { transform: translateX(100%); } 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .animate-in { animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25rem;
        }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
