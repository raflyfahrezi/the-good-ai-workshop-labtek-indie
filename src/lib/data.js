// DUMMY DATA ONLY. Every place, company, person and number here is fictional.
// Edit text freely; components read everything from this file.
// Audit status: 'hijau' = kutipan ditemukan, 'kuning' = parafrase (cek makna), 'merah' = tidak ada di sumber.

export const story = {
  title: 'Sungai Cilayung Berubah Warna, Warga Mekarwangi Kehilangan Air Bersih',
  author: 'Raka Pradipta (jurnalis fiktif)',
  newsroom: 'Redaksi Contoh',
}

// Step 1: Bank Informasi. Every item has an ID so output can point back to it.
// sensitivity is set by the journalist: 'publik' may go to a cloud model, 'sensitif' is processed locally.
export const bank = {
  karyaUtama: [
    {
      id: 'ART',
      type: 'artikel',
      label: 'Draf artikel',
      sensitivity: 'publik',
      parts: [
        { id: 'ART-P1', text: 'Sejak Agustus 2026, air Sungai Cilayung di Desa Mekarwangi berubah warna menjadi kebiruan setiap Selasa dan Jumat malam.' },
        { id: 'ART-P2', text: 'Warga menduga perubahan warna itu berasal dari saluran pembuangan PT Warna Kain Lestari, pabrik pencelupan kain yang berjarak sekitar 800 meter dari permukiman.' },
        { id: 'ART-P3', text: 'Sekitar 140 keluarga di dua RW kini membeli air galon untuk minum dan memasak, dengan biaya rata-rata Rp 180.000 per bulan.' },
        { id: 'ART-P4', text: 'Uji laboratorium independen pada September 2026 menemukan kadar COD di titik pengambilan kedua tiga kali di atas baku mutu.' },
        { id: 'ART-P5', text: 'Dinas Lingkungan Hidup kabupaten menyatakan sudah menerima laporan warga dan akan melakukan verifikasi lapangan.' },
        { id: 'ART-P6', text: 'Hingga artikel ini terbit, PT Warna Kain Lestari belum menjawab permintaan konfirmasi yang dikirim pada 20 Oktober 2026.' },
      ],
    },
  ],
  dataMentah: [
    {
      id: 'TR1',
      type: 'transkrip',
      label: 'Wawancara warga, "Bu Sari" (nama samaran)',
      sensitivity: 'sensitif',
      parts: [
        { id: 'TR1-S1', time: '00:42', text: 'Kalau malam Selasa sama Jumat, airnya biru, baunya kayak cat. Anak saya gatal-gatal habis mandi.' },
        { id: 'TR1-S2', time: '02:15', text: 'Sekarang kami beli galon. Sebulan bisa seratus delapan puluh ribu, itu berat buat kami.' },
        { id: 'TR1-S3', time: '04:30', text: 'Saya nggak berani sebut nama, takut nanti suami saya susah cari kerja di pabrik.' },
      ],
    },
    {
      id: 'TR2',
      type: 'transkrip',
      label: 'Pernyataan Kabid DLH kabupaten (konferensi pers)',
      sensitivity: 'publik',
      parts: [
        { id: 'TR2-S1', time: '01:05', text: 'Laporan warga sudah kami terima dan akan kami verifikasi di lapangan dalam waktu dekat.' },
        { id: 'TR2-S2', time: '03:20', text: 'Kami belum bisa menyimpulkan sumber pencemarannya sebelum ada hasil uji resmi.' },
      ],
    },
    {
      id: 'LAB',
      type: 'pdf',
      label: 'Laporan uji laboratorium independen (PDF riset)',
      sensitivity: 'publik',
      parts: [
        { id: 'LAB-H3', page: 3, text: 'Titik 2 (hilir saluran): COD 312 mg/L, baku mutu 100 mg/L.' },
        { id: 'LAB-H4', page: 4, text: 'Titik 1 (hulu) dan Titik 3 (muara desa) berada di bawah baku mutu.' },
      ],
    },
    { id: 'FOTO-1', type: 'foto', label: 'Air sungai kebiruan di bawah jembatan desa, malam hari', sensitivity: 'publik' },
    { id: 'FOTO-2', type: 'foto', label: 'Tumpukan galon di teras rumah warga', sensitivity: 'publik' },
    { id: 'FOTO-3', type: 'foto', label: 'Wajah Bu Sari saat diwawancara', sensitivity: 'sensitif' },
    { id: 'VIDEO-1', type: 'video', label: 'Rekaman 30 detik aliran saluran pembuangan', sensitivity: 'publik' },
  ],
}

// Step 2: Brief & Guardrails
export const formats = [
  { id: 'carousel', label: 'Carousel Instagram', hint: '5-8 slide, teks pendek per slide' },
  { id: 'reels', label: 'Naskah Reels', hint: '30-60 detik, narasi + visual' },
  { id: 'newsletter', label: 'Newsletter', hint: '150-250 kata, satu tautan ke artikel' },
]

export const guardrails = [
  { id: 'no-new-facts', label: 'Tidak boleh menambah fakta baru di luar bank informasi', default: true },
  { id: 'exact-quotes', label: 'Kutipan harus persis sama dengan sumber', default: true },
  { id: 'protect-sources', label: 'Narasumber sensitif tetap disamarkan, foto wajah tidak dipakai', default: true },
  { id: 'no-photo-edit', label: 'Foto tidak boleh diubah isinya', default: true },
  { id: 'link-back', label: 'Slide terakhir mengarahkan ke artikel lengkap', default: true },
]

export const defaultBrief = {
  format: 'carousel',
  audience: 'Warga Jawa Barat usia 18-35 di Instagram',
  tone: 'Lugas, tidak sensasional',
  length: 10,
}

// Step 3: Saran & Masukan AI
export const briefFeedback = [
  'Materi di bank cukup untuk 7 slide, bukan 10. Slide tambahan berisiko diisi hal di luar sumber.',
  'Pihak pabrik belum memberi tanggapan. Sebaiknya disebut di carousel agar berimbang.',
  'FOTO-3 berlabel sensitif dan menampilkan wajah narasumber, jadi tidak akan dipakai.',
]

export const angles = [
  { id: 'warga', title: 'Dari sudut warga', hook: '140 keluarga kini membeli air untuk minum. Kenapa?' },
  { id: 'data', title: 'Dari data lab', hook: 'Di satu titik, kadar COD tiga kali di atas baku mutu.' },
  { id: 'tanya', title: 'Pertanyaan yang belum terjawab', hook: 'Air berubah biru tiap Selasa dan Jumat. Siapa yang bertanggung jawab?' },
]

// Step 3b: Verifikasi Konsep & Naskah. One line per slide for the carousel.
export const script = [
  {
    id: 'L1', slide: 1,
    text: '140 keluarga di Desa Mekarwangi kini membeli air untuk minum.',
    sources: ['ART-P3'], audit: 'hijau',
  },
  {
    id: 'L2', slide: 2,
    text: 'Sejak Agustus 2026, Sungai Cilayung berubah kebiruan setiap Selasa dan Jumat malam.',
    sources: ['ART-P1', 'FOTO-1'], audit: 'hijau',
  },
  {
    id: 'L3', slide: 3,
    text: '"Kalau malam Selasa sama Jumat, airnya biru, baunya kayak cat." (Bu Sari, nama samaran)',
    sources: ['TR1-S1'], audit: 'hijau',
  },
  {
    id: 'L4', slide: 4,
    text: 'Hasil lab: air sungai tiga kali lebih kotor dari batas aman.',
    sources: ['LAB-H3', 'ART-P4'], audit: 'kuning',
    note: 'Sumber hanya menyebut kadar COD di Titik 2. Titik lain di bawah baku mutu (LAB-H4). "Seluruh sungai" dan "lebih kotor" bisa menyesatkan.',
  },
  {
    id: 'L5', slide: 5,
    text: 'Pencemaran ini disebut yang terparah di Jawa Barat tahun ini.',
    sources: [], audit: 'merah',
    note: 'Tidak ada di bank informasi. Melanggar guardrail "tidak boleh menambah fakta baru".',
  },
  {
    id: 'L6', slide: 6,
    text: 'DLH kabupaten akan memverifikasi laporan warga. Pabrik belum menjawab konfirmasi.',
    sources: ['TR2-S1', 'ART-P6'], audit: 'hijau',
  },
  {
    id: 'L7', slide: 7,
    text: 'Baca liputan lengkapnya di situs Redaksi Contoh.',
    sources: ['ART'], audit: 'hijau',
  },
]

// Step 4: Generate Media. Auto QC flags raised after rendering.
export const autoQcFlags = [
  { slide: 4, level: 'kuning', text: 'Parafrase data lab berpotensi melebih-lebihkan. Cek makna terhadap LAB-H3 dan LAB-H4.' },
  { slide: 5, level: 'merah', text: 'Klaim tanpa sumber. Hapus atau tambahkan sumber ke bank informasi.' },
  { slide: 2, level: 'info', text: 'FOTO-1 dipakai sesuai keterangan aslinya (malam hari, jembatan desa).' },
]

// Step 4: which bank image each slide uses (null = text only)
export const slideVisuals = { 1: 'FOTO-2', 2: 'FOTO-1', 3: null, 4: null, 5: null, 6: 'VIDEO-1', 7: null }
