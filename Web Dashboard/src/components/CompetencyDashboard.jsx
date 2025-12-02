import { useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Search, FileText, Award,
  GraduationCap, ChevronRight, BookOpen, Bookmark,
  TrendingUp, CheckCircle
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CompetencyDashboard = ({ onBack }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('All');
  const INITIAL_DISPLAY_LIMIT = 10;
  const [visibleStudentCount, setVisibleStudentCount] = useState(INITIAL_DISPLAY_LIMIT);


  // --- MOCK DATA GENERATOR ---
  const rmkList = useMemo(() => [
    { id: "RPL", name: "Rekayasa Perangkat Lunak" },
    { id: "KCV", name: "Komputasi Cerdas Visi" },
    { id: "KBJ", name: "Komputasi Berbasis Jaringan" },
    { id: "NETICS", name: "Teknologi Jaringan & Keamanan" },
    { id: "GIGA", name: "Grafika, Interaksi, & Gim" },
    { id: "MCI", name: "Manajemen Cerdas Informasi" },
    { id: "PKT", name: "Pemodelan & Komputasi Terapan" },
    { id: "ALPRO", name: "Algoritma Pemrograman" },
  ], []);

  const rmkColors = useMemo(() => ({
    "RPL": "#3b82f6", "KCV": "#10b981", "KBJ": "#06b6d4", "NETICS": "#6366f1",
    "GIGA": "#d946ef", "MCI": "#f97316", "PKT": "#ef4444", "ALPRO": "#eab308"
  }), []);

  const generateScores = useCallback((biasRMK, variance = 10) => {
    return rmkList.map(rmk => {
      let base = 75;
      if (biasRMK === rmk.id) base += 15;
      if (biasRMK === 'ALL_GOOD') base += 10;
      const score = Math.min(100, Math.max(0, Math.floor(base + (Math.random() * variance) - (variance/2))));
      return {
        rmk: rmk.id,
        fullName: rmk.name,
        score: score,
        fullMark: 100,
        color: rmkColors[rmk.id]
      };
    });
  }, [rmkList, rmkColors]);

  const generateTranscript = (scores) => {
    const getGrade = (score) => {
        const s = Math.max(0, Math.min(100, score + (Math.random() * 10 - 5))); // Variance
        if(s >= 86) return 'A';
        if(s >= 76) return 'AB';
        if(s >= 66) return 'B';
        if(s >= 61) return 'BC';
        if(s >= 56) return 'C';
        return 'D';
    };

    return scores.flatMap(s => {
        return [
            { code: `IF${Math.floor(Math.random()*4000)+1000}`, name: `Topik Lanjut ${s.rmk}`, credit: 3, grade: getGrade(s.score), type: 'Pilihan' },
            { code: `IF${Math.floor(Math.random()*4000)+1000}`, name: `Proyek ${s.rmk}`, credit: 4, grade: getGrade(s.score), type: 'Pilihan' }
        ];
    });
  };

  // Mock Student List
  const students = useMemo(() => {
    const list = [];
    const batches = [2020, 2021, 2022, 2023];
    const names = ["Budi Santoso", "Siti Aminah", "Kevin Sanjaya", "Dewi Lestari", "Rian Ardianto", "Fajar Alfian", "Hendra Setiawan", "Mohammad Ahsan", "Greysia Polii", "Apriyani Rahayu"];
    const dosenWali = ["Rizky Januar Akbar, S.Kom., M.Eng.", "Dini Adni Navastara, S.Kom., M.Sc.", "Baskoro Adi Pratomo, S.Kom., M.Kom."];

    let counter = 1;
    batches.forEach(batch => {
        names.forEach((name, idx) => {
            const nrp = `5025${batch}${String(counter).padStart(3, '0')}`;
            const bias = rmkList[idx % rmkList.length].id;
            const scores = generateScores(bias, 15);
            const sks = 100 + Math.floor(Math.random() * 45);
            const currentSemester = (2024 - batch) * 2 + (Math.random() > 0.5 ? 1 : 0);

            list.push({
                nrp,
                name: `${name}`,
                batch: String(batch),
                program: "Teknik Informatika",
                dosen: dosenWali[idx % dosenWali.length],
                status: "AKTIF",
                semester: `Semester ${Math.min(14, Math.max(1, currentSemester))} (Ganjil)`,
                ipk: (3.0 + Math.random()).toFixed(2),
                sks: sks,
                maxSks: 144,
                mkWajib: 40 + Math.floor(Math.random() * 10),
                mkPilihan: 4 + Math.floor(Math.random() * 6),
                scores: scores,
                transcript: generateTranscript(scores),
                bias: bias
            });
            counter++;
        });
    });
    return list;
  }, [generateScores, rmkList]);

  const filteredStudents = useMemo(() => {
    setVisibleStudentCount(INITIAL_DISPLAY_LIMIT); // Reset visible count on filter/search change
    return students.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nrp.includes(searchTerm);
        const matchBatch = filterBatch === 'All' || s.batch === filterBatch;
        return matchSearch && matchBatch;
    });
  }, [students, searchTerm, filterBatch]);

  // Modified to return top 3 recommendations
  const getTopRecommendations = (data) => {
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a,b) => b.score - a.score);
    return sorted.slice(0, 3).map(item => ({ 
      name: item.fullName, 
      score: item.score, 
      id: item.rmk,
      color: rmkColors[item.rmk] // Add color for radar fill
    }));
  };

  // --- COMPONENT VIEWS ---

  const StudentListView = () => (
    <div className="animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-end">
            <div className="w-full md:w-auto">
                <h2 className="text-xl font-bold text-slate-800">Daftar Mahasiswa</h2>
                <p className="text-slate-500 text-sm">Pilih mahasiswa untuk melihat detail profil kompetensi.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari Nama / NRP..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <select 
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 outline-none"
                >
                    <option value="All">Semua Angkatan</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">NRP</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama Mahasiswa</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Angkatan</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">IPK</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">SKS</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Dominasi RMK</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.slice(0, visibleStudentCount).map((student) => (
                            <tr 
                                key={student.nrp} 
                                onClick={() => setSelectedStudent(student)}
                                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                            >
                                <td className="px-6 py-4 text-sm font-mono text-slate-600">{student.nrp}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">{student.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{student.batch}</td>
                                <td className="px-6 py-4 text-sm text-center font-semibold text-slate-700">{student.ipk}</td>
                                <td className="px-6 py-4 text-sm text-center text-slate-600">{student.sks}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                        {student.bias}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                Data tidak ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {filteredStudents.length > visibleStudentCount && (
                <div className="p-4 text-center border-t border-slate-100 bg-slate-50">
                    <button 
                        onClick={() => setVisibleStudentCount(prevCount => prevCount + INITIAL_DISPLAY_LIMIT)}
                        className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Tampilkan Lebih Banyak ({filteredStudents.length - visibleStudentCount} lagi)
                    </button>
                </div>
            )}
        </div>
    </div>
  );

  const StudentDetailView = ({ student }) => {
    const [activeTab, setActiveTab] = useState('competency'); 
    const topRecommendations = getTopRecommendations(student.scores); // Get top 3 recommendations
    const primaryRecommendation = topRecommendations[0] || { name: '-', score: 0, color: '#013880' }; // First recommendation for radar fill
    const sksProgress = Math.min(100, (student.sks / student.maxSks) * 100);

    return (
        <div className="animate-fade-in-up space-y-6">
            
            {/* 1. BLUE HEADER CARD */}
            <div className="bg-[#009fb7] rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-5 rounded-full pointer-events-none"></div>
                <div className="absolute right-20 bottom-10 w-32 h-32 bg-white opacity-5 rounded-full pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold border border-white/30">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-blue-50 text-xs font-medium uppercase tracking-wider mb-1">Nama Mahasiswa</p>
                                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{student.name}</h1>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-6">
                            <div>
                                <p className="text-blue-100 text-xs uppercase font-semibold">NRP</p>
                                <p className="text-lg font-mono font-medium">{student.nrp}</p>
                            </div>
                             <div>
                                <p className="text-blue-100 text-xs uppercase font-semibold">Angkatan</p>
                                <p className="text-lg font-medium">{student.batch}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-xs uppercase font-semibold">Program Studi</p>
                                <p className="text-lg font-medium">{student.program}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-xs uppercase font-semibold">Semester Sekarang</p>
                                <p className="text-lg font-medium">{student.semester}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="flex flex-col items-end text-right">
                            <p className="text-blue-100 text-xs uppercase font-semibold mb-1">Dosen Wali</p>
                            <p className="font-medium text-sm md:text-base bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                                {student.dosen}
                            </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-50 border border-emerald-400/30 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                            STATUS: {student.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* IPK Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">IPK Kumulatif</p>
                        <GraduationCap size={18} className="text-blue-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-800">{student.ipk}</h3>
                        <p className="text-slate-400 text-xs mb-1.5 font-medium">dari 4.00</p>
                    </div>
                </div>

                {/* SKS Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">SKS Tempuh</p>
                        <TrendingUp size={18} className="text-emerald-500" />
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                        <h3 className="text-3xl font-bold text-slate-800">{student.sks}</h3>
                        <p className="text-slate-400 text-xs mb-1.5 font-medium">{sksProgress.toFixed(1)}% dari {student.maxSks}</p>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${sksProgress}%` }}></div>
                    </div>
                </div>

                 {/* MK Wajib */}
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">MK Wajib</p>
                        <BookOpen size={18} className="text-indigo-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-800">{student.mkWajib}</h3>
                        <p className="text-slate-400 text-xs mb-1.5 font-medium">Mata Kuliah</p>
                    </div>
                </div>

                 {/* MK Pilihan */}
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-bold uppercase">MK Pilihan</p>
                        <Bookmark size={18} className="text-amber-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-bold text-slate-800">{student.mkPilihan}</h3>
                        <p className="text-slate-400 text-xs mb-1.5 font-medium">Mata Kuliah</p>
                    </div>
                </div>
            </div>

            {/* 3. TABS NAVIGATION */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="flex border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('transcript')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-all border-b-2 ${activeTab === 'transcript' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        Transkrip Nilai
                    </button>
                    <button 
                        onClick={() => setActiveTab('competency')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-all border-b-2 ${activeTab === 'competency' ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        Peta Kompetensi & Rekomendasi TA
                    </button>
                </div>

                {/* 4. TAB CONTENT */}
                <div className="p-6 md:p-8">
                    
                    {/* TAB: TRANSCRIPT */}
                    {activeTab === 'transcript' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <FileText size={20} className="text-blue-600" />
                                    Daftar Mata Kuliah Pilihan
                                </h3>
                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Total: {student.transcript.length} MK</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {student.transcript.map((course, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex justify-between items-center group">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{course.code}</span>
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">{course.type}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{course.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{course.credit} SKS</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shadow-sm border ${
                                            course.grade === 'A' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            course.grade.includes('B') ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {course.grade}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: COMPETENCY (DEFAULT) */}
                    {activeTab === 'competency' && (
                        <div className="animate-fade-in">
                             <div className="flex items-center gap-2 mb-6">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <Radar size={20} className="text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Analisis Peminatan & Rekomendasi Laboratorium</h3>
                             </div>

                             <div className="grid lg:grid-cols-5 gap-8 items-start">
                                {/* Chart */}
                                <div className="lg:col-span-3 relative">
                                    <p className="text-sm font-bold text-slate-500 mb-4 pl-4 border-l-4 border-indigo-500">Peta Kompetensi Lab (8-Axis)</p>
                                    <div className="h-[350px] w-full border border-slate-100 rounded-2xl bg-slate-50/50 flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={student.scores}>
                                                <PolarGrid gridType="polygon" stroke="#cbd5e1" />
                                                <PolarAngleAxis 
                                                    dataKey="fullName" 
                                                    tick={({ payload, x, y, textAnchor, stroke }) => (
                                                        <text x={x} y={y} textAnchor={textAnchor} stroke={stroke} fill="#475569" fontSize={10} fontWeight={600}>
                                                            {payload.value}
                                                        </text>
                                                    )} 
                                                />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                                                <Radar 
                                                    name="Score" 
                                                    dataKey="score" 
                                                    stroke={primaryRecommendation.color} // Dynamic stroke color
                                                    strokeWidth={2} 
                                                    fill={primaryRecommendation.color} // Dynamic fill color
                                                    fillOpacity={0.5} 
                                                />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                                                    itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Recommendation Card */}
                                <div className="lg:col-span-2 space-y-4">
                                     <p className="text-sm font-bold text-slate-500 mb-4 pl-4 border-l-4 border-blue-500">Rekomendasi Utama</p>
                                    
                                    <div className="bg-[#0077b6] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                                        
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2 opacity-90">
                                                <Award size={16} className="text-yellow-300" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Top 3 Peminatan</span>
                                            </div>
                                            {topRecommendations.map((rec, index) => (
                                                <div key={rec.id} className="flex items-center justify-between py-2 border-b border-white/20 last:border-b-0">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl font-black">{index + 1}.</span>
                                                        <div>
                                                            <p className="text-lg font-bold">{rec.name}</p>
                                                            <p className="text-xs opacity-70">Rumpun Mata Kuliah</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xl font-black">{rec.score}%</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="w-full bg-black/20 rounded-full h-2">
                                            <div 
                                                className="bg-white h-2 rounded-full transition-all duration-1000" 
                                                style={{ width: `${primaryRecommendation.score}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs opacity-70 mt-2 text-right">{primaryRecommendation.score}% Match Score</p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-white p-2 rounded-full shadow-sm text-blue-600 mt-1">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 mb-1">Alasan Rekomendasi</p>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Mahasiswa memiliki nilai rata-rata tertinggi pada mata kuliah pilihan di rumpun ini dan telah menyelesaikan prasyarat dasar dengan predikat sangat baik.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* NAV */}
        <button
            onClick={() => selectedStudent ? setSelectedStudent(null) : onBack()}
            className="group flex items-center text-slate-500 hover:text-[#013880] transition-colors mb-8"
        >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {selectedStudent ? 'Kembali ke Daftar' : 'Kembali ke Beranda'}
        </button>

        {/* MAIN TITLE (Only on List) */}
        {!selectedStudent && (
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900">Profil Kompetensi & Rekomendasi</h1>
                <p className="text-slate-500 mt-2 max-w-2xl">
                    Portal analisis kemampuan akademik mahasiswa. Temukan bakat tersembunyi dan arahkan ke laboratorium yang tepat.
                </p>
            </div>
        )}

        {selectedStudent ? (
            <StudentDetailView student={selectedStudent} />
        ) : (
            <StudentListView />
        )}

      </div>
    </div>
  );
};

export default CompetencyDashboard;