import http from 'http';

const PORT = 9000;

// --- MOCK DATA ---
const STUDENTS_COUNT = 200;
const ANGKATAN_DIST = [2020, 2021, 2022, 2023];

const generateStudents = () => {
  return Array.from({ length: STUDENTS_COUNT }, (_, i) => {
    const angkatan = ANGKATAN_DIST[Math.floor(Math.random() * ANGKATAN_DIST.length)];
    // Higher semester (lower angkatan) has more SKS and higher chance of being 'Siap TA'
    const semester = (2024 - angkatan) * 2; 
    const baseSks = semester * 18; 
    const sks = Math.min(148, Math.max(0, baseSks + Math.floor(Math.random() * 20 - 10)));
    
    const isEligible = sks >= 110;
    
    return {
      id: `5025${angkatan}${String(i).padStart(3, '0')}`,
      nama: `Mahasiswa ${i + 1}`,
      angkatan: angkatan,
      ipk: parseFloat((2.5 + Math.random() * 1.5).toFixed(2)),
      sks: sks,
      ready: isEligible ? 'Siap TA' : 'Belum Siap'
    };
  });
};

const STUDENTS_DATA = generateStudents();
const ELIGIBLE_COUNT = STUDENTS_DATA.filter(s => s.ready === 'Siap TA').length;

const DATA = {
  overall: { 
    totalMhs: STUDENTS_COUNT, 
    eligibleMhs: ELIGIBLE_COUNT 
  },
  labDistribution: [
    { label: "RPL", percentage: 35 },
    { label: "NCC", percentage: 25 },
    { label: "KCV", percentage: 20 },
    { label: "AJK", percentage: 15 },
    { label: "IGS", percentage: 5 }
  ],
  students: STUDENTS_DATA,
  trends: [
    { semester: 1, 2020: 3.4, 2021: 3.5, 2022: 3.6, 2023: 3.55 },
    { semester: 2, 2020: 3.45, 2021: 3.52, 2022: 3.62, 2023: 3.58 },
    { semester: 3, 2020: 3.5, 2021: 3.55, 2022: 3.58, 2023: 3.6 },
    { semester: 4, 2020: 3.55, 2021: 3.58, 2022: 3.55, 2023: null },
    { semester: 5, 2020: 3.6, 2021: 3.6, 2022: null, 2023: null },
    { semester: 6, 2020: 3.65, 2021: null, 2022: null, 2023: null },
  ]
};

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  console.log(`[MockServer] ${req.method} ${req.url}`);

  if (req.url === '/api/stats/overall') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(DATA.overall));
  } 
  else if (req.url === '/api/stats/lab-distribution') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(DATA.labDistribution));
  } 
  else if (req.url === '/api/students') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(DATA.students));
  } 
  else if (req.url === '/api/stats/trends') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(DATA.trends));
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`
🚀 Mock API Server running at http://localhost:${PORT}`);
  console.log(`   Endpoints available:`);
  console.log(`   - /api/stats/overall`);
  console.log(`   - /api/stats/lab-distribution`);
  console.log(`   - /api/students`);
  console.log(`   - /api/stats/trends\n`);
});
