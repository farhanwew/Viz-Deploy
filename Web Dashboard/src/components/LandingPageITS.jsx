import React, { useMemo, useState } from 'react';
import { 
  Users, 
  Network, 
  Search, 
  BarChart3, 
  Activity, 
  GraduationCap,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Target
} from 'lucide-react';

const LandingPage = ({ onEnterDashboard }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [stats, setStats] = useState({ totalMhs: 0, eligibleMhs: 0 });
  const [labData, setLabData] = useState([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      // Static/Mock data for Lab Distribution (always used as API doesn't support it)
      const labDist = [
        { label: "RPL", percentage: 35 },
        { label: "NCC", percentage: 25 },
        { label: "KCV", percentage: 20 },
        { label: "AJK", percentage: 15 },
        { label: "IGS", percentage: 5 }
      ];
      
      const colors = ["bg-[#013880]", "bg-blue-500", "bg-teal-400", "bg-indigo-400", "bg-purple-400"];
      const icons = ["🤖", "💻", "🌐", "🎮", "📊"];
      
      const formattedLabData = labDist.slice(0, 5).map((item, idx) => ({
        label: item.label,
        val: `${item.percentage}%`,
        color: colors[idx % colors.length],
        score: `${item.percentage}%`,
        icon: icons[idx % icons.length]
      }));
      
      setLabData(formattedLabData);

      try {
        const response = await fetch('https://farwew-tc.hf.space/dashboard_summary');
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        setStats({
          totalMhs: data.total_mahasiswa,
          eligibleMhs: data.eligible_ta.jumlah
        });

      } catch (error) {
        console.warn("Failed to fetch stats, using fallback data:", error);
        // Fallback data if API fails
        setStats({
          totalMhs: 1250,
          eligibleMhs: 450
        });
      }
    };
    fetchStats();
  }, []);

  const { totalMhs, eligibleMhs } = stats;

  const dashboards = [
    {
      id: 1,
      title: "Overview Populasi",
      subtitle: "Macro Academic Analytics",
      desc: "Pemetaan komprehensif status akademik per angkatan. Identifikasi kandidat Tugas Akhir yang eligible secara real-time untuk perencanaan kuota bimbingan.",
      icon: <TrendingUp size={32} className="text-white" />,
      color: "bg-blue-600",
      stats: "Academic Health Check",
      chartType: "Interactive Bar & Gauge"
    },
    {
      id: 2,
      title: "Profil Kompetensi",
      subtitle: "Talent & Skill Mapping",
      desc: "Bedah mendalam potensi individu. Visualisasi keahlian spesifik mahasiswa menggunakan Radar Chart untuk rekomendasi topik TA yang presisi. Jadi ini dilihat berdasarkan mata kuliah pilihan saja.",
      icon: <Target size={32} className="text-white" />,
      color: "bg-indigo-500",
      stats: "Personalized Recommendation",
      chartType: "Radar Chart (Spider Plot)"
    }
  ];

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#013880] to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              IF
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#013880] leading-tight">Informatics Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium">Academic Monitoring System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#013880] transition-colors">
              Panduan
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#013880] transition-colors">
              Laporan
            </a>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-700">System Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Hero Image */}
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-t from-[#013880] via-[#013880]/50 to-transparent z-10"></div>
          <img 
            src="https://www.its.ac.id/informatika/wp-content/uploads/sites/44/2018/03/IFl.jpg" 
            alt="Gedung Teknik Informatika ITS" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute bottom-8 left-8 z-20">
            <div className="inline-block px-3 py-1 bg-yellow-400 text-[#013880] text-xs font-bold uppercase rounded mb-3">
              Departemen
            </div>
            <h2 className="text-white text-5xl font-extrabold leading-tight">
              Teknik Informatika ITS
            </h2>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 mb-12">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-[#013880]/10 rounded-xl">
              <LayoutDashboard size={40} className="text-[#013880]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Control Center</p>
              <h3 className="text-3xl font-bold text-slate-800 mb-3">
                Executive <span className="text-[#013880]">Dashboard</span>
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Platform terintegrasi untuk pemantauan <span className="font-semibold text-[#013880]">Kinerja Akademik</span> dan optimasi distribusi <span className="font-semibold text-[#013880]">Tugas Akhir</span> berbasis Data Science.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const element = document.getElementById('dashboard-selection');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group px-8 py-4 bg-[#013880] text-white rounded-xl font-bold hover:bg-blue-900 transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center gap-3"
                >
                  <Activity size={20} />
                  Mulai Monitoring
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold hover:border-[#013880] hover:text-[#013880] transition-all flex items-center gap-3">
                  <GraduationCap size={20} />
                  Database Angkatan
                </button>
              </div>
            </div>
          </div>
        </div>



      </header>

      {/* DASHBOARD SELECTION GRID */}
      <section id="dashboard-selection" className="px-6 py-20 bg-white/50 backdrop-blur-sm scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full font-bold uppercase text-xs mb-4 inline-block border border-blue-200">
              Navigasi Modul
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Pilih <span className="text-[#013880]">Lensa Analitik</span> Anda
            </h2>
            <p className="text-slate-600 text-lg">
              Akses modul visualisasi terintegrasi untuk mendukung pengambilan keputusan akademik yang presisi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {dashboards.map((dash) => (
              <div 
                key={dash.id}
                onMouseEnter={() => setActiveCard(dash.id)}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => {
                  if (dash.id === 1 && onEnterDashboard) {
                    onEnterDashboard("population");
                  } else if (dash.id === 2 && onEnterDashboard) {
                    onEnterDashboard("competency");
                  }
                }}
                className={`
                  group relative bg-white rounded-3xl p-8 transition-all duration-500 cursor-pointer border-2
                  ${activeCard === dash.id ? 'shadow-2xl -translate-y-2 border-[#013880]' : 'shadow-lg hover:shadow-xl border-slate-100'}
                `}
              >
                
                {/* Header Icon */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 rounded-2xl shadow-lg ${dash.color} text-white flex items-center justify-center transform transition-all duration-500 ${activeCard === dash.id ? 'scale-110 rotate-6' : ''}`}>
                    {dash.icon}
                  </div>
                  <div className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-bold text-slate-500 uppercase">
                    Modul 0{dash.id}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {dash.title}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 uppercase mb-4">
                    {dash.subtitle}
                  </p>
                  <div className={`h-1 bg-slate-100 mb-4 rounded-full transition-all duration-500 ${activeCard === dash.id ? 'w-full bg-gradient-to-r from-blue-400 to-teal-400' : 'w-12'}`}></div>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6">
                    {dash.desc}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold block mb-1">Output Visual</span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg inline-block">{dash.chartType}</span>
                  </div>
                  <button className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                    ${activeCard === dash.id ? 'bg-[#013880] text-white scale-110' : 'bg-slate-100 text-slate-400'}
                  `}>
                    <ArrowRight size={20} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#013880] rounded-xl flex items-center justify-center text-white font-black text-lg">
                  IF
                </div>
                <span className="font-bold text-lg text-slate-900">Informatics Dashboard</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Platform monitoring akademik terpadu untuk optimalisasi distribusi tugas akhir dan pemetaan kompetensi mahasiswa Teknik Informatika ITS.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase">Tautan Cepat</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#013880] transition-colors">Panduan Administrator</a></li>
                <li><a href="#" className="hover:text-[#013880] transition-colors">Database Laboratorium</a></li>
                <li><a href="#" className="hover:text-[#013880] transition-colors">Arsip Laporan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase">Kontak</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Gedung Teknik Informatika</li>
                <li>Kampus ITS Sukolilo</li>
                <li>Surabaya, Indonesia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; 2025 Departemen Teknik Informatika ITS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#013880] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#013880] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#013880] transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}} />

    </div>
  );
};

export default LandingPage; 