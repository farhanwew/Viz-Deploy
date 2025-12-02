import React, { useState, useMemo } from 'react';
import { ArrowLeft, Info, Filter, Search, Users, User } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const CompetencyDashboard = ({ onBack }) => {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'batch', 'individual'
  const [selectedBatch, setSelectedBatch] = useState('2021');
  const [searchNrp, setSearchNrp] = useState('');
  const [activeData, setActiveData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Color Map for Each RMK (Lab)
  const rmkColors = {
    "RPL": "#3b82f6",    // Blue 500
    "KCV": "#10b981",    // Emerald 500
    "KBJ": "#06b6d4",    // Cyan 500
    "NETICS": "#6366f1", // Indigo 500
    "GIGA": "#d946ef",   // Fuchsia 500
    "MCI": "#f97316",    // Orange 500
    "PKT": "#ef4444",    // Red 500
    "ALPRO": "#eab308"   // Yellow 500
  };

  // --- MOCK DATA GENERATOR ---
  // In a real app, this would be replaced by an API call or CSV parsing logic
  
  const rmkList = [
    { id: "RPL", name: "Rekayasa Perangkat Lunak" },
    { id: "KCV", name: "Komputasi Cerdas Visi" },
    { id: "KBJ", name: "Komputasi Berbasis Jaringan" },
    { id: "NETICS", name: "Teknologi Jaringan & Keamanan" },
    { id: "GIGA", name: "Grafika, Interaksi, & Gim" },
    { id: "MCI", name: "Manajemen Cerdas Informasi" },
    { id: "PKT", name: "Pemodelan & Komputasi Terapan" },
    { id: "ALPRO", name: "Algoritma Pemrograman" },
  ];

  // Base scores to manipulate for simulation
  const generateScores = (biasRMK, variance = 10) => {
    return rmkList.map(rmk => {
      let base = 75; // Average base
      if (biasRMK === rmk.id) base += 15; // Strong in this area
      if (biasRMK === 'ALL_GOOD') base += 10;
      
      // Randomize slightly
      const score = Math.min(100, Math.max(0, Math.floor(base + (Math.random() * variance) - (variance/2))));
      
      return {
        rmk: rmk.id,
        fullName: rmk.name,
        score: score,
        fullMark: 100,
        color: rmkColors[rmk.id]
      };
    });
  };

  // Simulated Database
  const database = useMemo(() => {
    return {
      all: generateScores('ALL_GOOD', 5), // Overall Average
      batches: {
        '2020': generateScores('RPL', 15),
        '2021': generateScores('KCV', 15),
        '2022': generateScores('GIGA', 15),
        '2023': generateScores('ALPRO', 15),
      },
      individuals: {
        '5025211001': { name: 'Budi Santoso', scores: generateScores('NETICS', 5), batch: '2021' },
        '5025211002': { name: 'Siti Aminah', scores: generateScores('MCI', 5), batch: '2021' },
        '5025221015': { name: 'Kevin Sanjaya', scores: generateScores('KCV', 5), batch: '2022' },
      }
    };
  }, []);

  // Data Selection Logic
  const currentData = useMemo(() => {
    setErrorMsg('');
    
    if (filterMode === 'all') {
      return database.all;
    }
    
    if (filterMode === 'batch') {
      return database.batches[selectedBatch] || database.all;
    }
    
    if (filterMode === 'individual') {
      if (!searchNrp) return database.all; // Default if empty
      
      const student = database.individuals[searchNrp];
      if (student) {
        return student.scores;
      } else {
        // If looking for a specific NRP that doesn't exist in mock DB, 
        // we generate a random consistent one for demo purposes
        // based on the NRP string to make it deterministic
        if (searchNrp.length >= 10) {
             // Deterministic mock for demo
            const lastDigit = parseInt(searchNrp.slice(-1));
            const biases = ['RPL', 'KCV', 'KBJ', 'NETICS', 'GIGA', 'MCI', 'PKT', 'ALPRO'];
            return generateScores(biases[lastDigit % 8], 20);
        }
        return null;
      }
    }
    return database.all;
  }, [filterMode, selectedBatch, searchNrp, database]);

  // Helper to get current context title
  const getContextTitle = () => {
    if (filterMode === 'all') return "Rata-rata Keseluruhan Mahasiswa";
    if (filterMode === 'batch') return `Rata-rata Angkatan ${selectedBatch}`;
    if (filterMode === 'individual') {
       const student = database.individuals[searchNrp];
       return student ? `${student.name} (${searchNrp})` : (searchNrp.length >= 10 ? `Mahasiswa ${searchNrp}` : "Pencarian Mahasiswa...");
    }
  };

  const getRecommendation = (data) => {
    if (!data) return "-";
    const sorted = [...data].sort((a,b) => b.score - a.score);
    return sorted[0].fullName;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* HEADER & CONTROLS */}
        <div className="p-6 md:p-8 border-b border-slate-100">
            <button
              onClick={onBack}
              className="group flex items-center text-slate-500 hover:text-[#013880] transition-colors mb-6"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Profil Kompetensi</h1>
                    <p className="text-slate-500 mt-2 max-w-2xl">
                        Analisis peta kekuatan akademik berdasarkan Rumpun Mata Kuliah (RMK). Gunakan filter di bawah untuk melihat data per angkatan atau individu.
                    </p>
                </div>

                {/* Recommendation Badge */}
                {currentData && (
                <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                    <div className="p-2 bg-blue-100 rounded-lg">
                    <Info size={20} className="text-blue-600" />
                    </div>
                    <div>
                    <p className="text-xs font-bold text-blue-800 uppercase">Top Recommendation</p>
                    <p className="text-sm font-semibold text-blue-900">{getRecommendation(currentData)}</p>
                    </div>
                </div>
                )}
            </div>

            {/* FILTER BAR */}
            <div className="mt-8 flex flex-col md:flex-row gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {/* Filter Type Selector */}
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                    <button 
                        onClick={() => setFilterMode('all')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${filterMode === 'all' ? 'bg-[#013880] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Users size={16} />
                        Keseluruhan
                    </button>
                    <button 
                        onClick={() => setFilterMode('batch')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${filterMode === 'batch' ? 'bg-[#013880] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter size={16} />
                        Angkatan
                    </button>
                    <button 
                        onClick={() => setFilterMode('individual')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${filterMode === 'individual' ? 'bg-[#013880] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <User size={16} />
                        Individu
                    </button>
                </div>

                {/* Dynamic Inputs */}
                <div className="flex-1">
                    {filterMode === 'batch' && (
                        <select 
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full md:w-48 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option value="2020">Angkatan 2020</option>
                            <option value="2021">Angkatan 2021</option>
                            <option value="2022">Angkatan 2022</option>
                            <option value="2023">Angkatan 2023</option>
                        </select>
                    )}

                    {filterMode === 'individual' && (
                        <div className="relative w-full md:w-64">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Cari NRP (e.g., 5025211001)" 
                                value={searchNrp}
                                onChange={(e) => setSearchNrp(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-6 md:p-8">
            {!currentData ? (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <User size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-semibold">Data Mahasiswa Tidak Ditemukan</p>
                    <p className="text-sm">Silakan masukkan NRP yang valid.</p>
                 </div>
            ) : (
                <div className="grid lg:grid-cols-5 gap-8">
                
                {/* Chart Section */}
                <div className="lg:col-span-3 bg-slate-50 rounded-2xl border border-slate-200 p-4 relative">
                    <div className="absolute top-6 left-6 z-10">
                        <h3 className="text-lg font-bold text-slate-700">Peta Keahlian (Radar Chart)</h3>
                        <p className="text-xs font-bold text-blue-600 uppercase mt-1">{getContextTitle()}</p>
                    </div>
                    
                    <div className="h-[400px] w-full flex items-center justify-center mt-8 md:mt-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={currentData}>
                        <PolarGrid gridType="polygon" stroke="#e2e8f0" />
                        <PolarAngleAxis 
                            dataKey="rmk" 
                            tick={({ payload, x, y, textAnchor, stroke, radius }) => (
                                <text
                                  x={x}
                                  y={y}
                                  textAnchor={textAnchor}
                                  stroke={stroke}
                                  fill={rmkColors[payload.value]} // Apply Lab Color to Label
                                  fontSize={12}
                                  fontWeight={700}
                                >
                                  {payload.value}
                                </text>
                            )} 
                        />
                        <PolarRadiusAxis 
                            angle={30} 
                            domain={[0, 100]} 
                            tick={{ fill: '#94a3b8', fontSize: 10 }} 
                            axisLine={false}
                        />
                        <Radar
                            name="Score Kompetensi"
                            dataKey="score"
                            stroke="#013880"
                            strokeWidth={3}
                            fill="#3b82f6"
                            fillOpacity={0.4}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                        />
                        </RadarChart>
                    </ResponsiveContainer>
                    </div>
                </div>

                {/* Detail List Section */}
                <div className="lg:col-span-2 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    Detail Performa RMK
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md font-normal">Sorted by Score</span>
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[400px]">
                    {[...currentData].sort((a, b) => b.score - a.score).map((item, index) => (
                        <div 
                        key={item.rmk} 
                        className="group p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all flex justify-between items-center"
                        style={{ borderLeft: `4px solid ${item.color}` }} // Apply Lab Color to Left Border
                        >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                            <span 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }} // Apply Lab Color to Dot
                            ></span>
                            <span className="font-bold text-slate-700" style={{ color: item.color }}>{item.rmk}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">{item.fullName}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-lg font-black text-slate-700">
                            {item.score}
                            </span>
                        </div>
                        </div>
                    ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-800 leading-relaxed">
                        <span className="font-bold">Insight:</span> 
                        {filterMode === 'individual' 
                            ? " Mahasiswa ini menunjukkan dominasi di bidang "
                            : " Rata-rata kelompok ini kuat di bidang "
                        }
                        <span className="font-bold">{getRecommendation(currentData)}</span>.
                    </p>
                    </div>
                </div>
                </div>
            )}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
            }
        `}} />
      </div>
    </div>
  );
};

export default CompetencyDashboard;