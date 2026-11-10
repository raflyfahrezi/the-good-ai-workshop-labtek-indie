// DUMMY DATA ONLY. Every place, company, person and number here is fictional.
// Edit text freely; components read everything from this file.
// Audit status: 'hijau' = kutipan ditemukan, 'kuning' = parafrase (cek makna), 'merah' = tidak ada di sumber.

export const story = {
  title: 'Sungai Cilayung Berubah Warna, Warga Mekarwangi Kehilangan Air Bersih',
  author: 'Faris Zakaria (persona fiktif)',
  newsroom: 'Redaksi Contoh',
  desk: 'Lingkungan',
  deadline: 'Kamis, 5 Nov 2026, 17.00',
  deadlineRelative: 'Besok', // the demo is presented the day before the deadline
}

// The signed-in journalist (fictional persona from the Phase 1 research)
export const journalist = { name: 'Faris' }

// Project Saya and Dashboard: other projects of the same journalist. Display only, all fictional.
// Newest first. step is the index of the furthest workflow step reached; note is the next human decision.
export const otherProjects = [
  {
    id: 'puskesmas',
    title: 'Antrean Pasien Mengular di Puskesmas Tanjungsari Hilir',
    desk: 'Kesehatan',
    formats: 'Image Slides, Audio',
    status: 'Perlu Review',
    step: 4,
    updated: '3 Nov 2026',
    deadline: 'Jumat, 6 Nov 2026',
    note: 'Menunggu persetujuan jurnalis di QC Editorial. 2 flag auto QC terbuka.',
  },
  {
    id: 'jembatan',
    title: 'Jembatan Gantung Desa Karangwaru Belum Juga Diperbaiki',
    desk: 'Infrastruktur',
    formats: 'Video Reels',
    status: 'Revisi',
    step: 2,
    updated: '3 Nov 2026',
    deadline: 'Senin, 9 Nov 2026',
    note: 'Dikembalikan jurnalis ke Script & Sumber: kutipan kepala desa perlu dicek ulang.',
  },
  {
    id: 'sekolah',
    title: 'Sekolah Darurat di Lereng Gunung Sirna',
    desk: 'Pendidikan',
    formats: 'Video Reels',
    status: 'Draf',
    step: 1,
    updated: '2 Nov 2026',
    deadline: 'Rabu, 11 Nov 2026',
    note: 'Brief belum dikirim. Guideline belum dipilih.',
  },
  {
    id: 'pasar',
    title: 'Pasar Kalibening Sepi Setelah Relokasi',
    desk: 'Ekonomi',
    formats: 'Audio',
    status: 'Disetujui',
    step: 5,
    updated: '30 Okt 2026',
    deadline: 'Selasa, 10 Nov 2026',
    note: 'Disetujui jurnalis. Tinggal ekspor dan cek credit foto.',
  },
  {
    id: 'cabai',
    title: 'Harga Cabai Naik Jelang Musim Hujan',
    desk: 'Ekonomi',
    formats: 'Image Slides',
    status: 'Diekspor',
    step: 5,
    updated: '28 Okt 2026',
    deadline: 'Selesai',
    note: 'Diekspor dengan Jejak Sumber untuk editor.',
  },
]

// Riwayat Konten: earlier exports of other projects, newest first. All fictional.
export const contentHistory = [
  {
    title: 'Harga Cabai Naik Jelang Musim Hujan', desk: 'Ekonomi', format: 'Image Slides', version: 2,
    files: ['image-slide-01-07.png', 'caption.txt', 'jejak-sumber.csv'], status: 'Diekspor', date: '28 Okt 2026', at: '16.10',
  },
  {
    title: 'Harga Cabai Naik Jelang Musim Hujan', desk: 'Ekonomi', format: 'Image Slides', version: 2,
    files: ['image-slides.pdf'], status: 'Gagal', date: '28 Okt 2026', at: '16.08', error: 'Render PDF terhenti di slide 5.',
  },
  {
    title: 'Harga Cabai Naik Jelang Musim Hujan', desk: 'Ekonomi', format: 'Image Slides', version: 1,
    files: ['image-slide-01-08.png', 'jejak-sumber.csv'], status: 'Diekspor', date: '27 Okt 2026', at: '11.40',
  },
  {
    title: 'Nelayan Muara Gembong Beralih ke Rumput Laut', desk: 'Ekonomi', format: 'Image Slides', version: 1,
    files: ['image-slide-01-06.png', 'caption.txt', 'jejak-sumber.csv'], status: 'Diekspor', date: '21 Okt 2026', at: '09.25',
  },
]

// Step 1: Bank Informasi. Every item has an ID so output can point back to it.
// sensitivity is set by the journalist: 'publik' may go to a cloud model, 'sensitif' is processed locally.
export const bank = {
  karyaUtama: [
    {
      id: 'ART',
      type: 'artikel',
      label: 'Draf artikel',
      credit: 'Ditulis Faris Zakaria, draf 3 Nov 2026',
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
      credit: 'Direkam Faris Zakaria, 14 Sep 2026. Identitas asli hanya diketahui jurnalis',
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
      credit: 'Konferensi pers DLH kabupaten, 2 Okt 2026, terbuka untuk umum',
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
      credit: 'Laboratorium independen (fiktif), dokumen diberikan warga, 30 Sep 2026',
      sensitivity: 'publik',
      parts: [
        { id: 'LAB-H3', page: 3, text: 'Titik 2 (hilir saluran): COD 312 mg/L, baku mutu 100 mg/L.' },
        { id: 'LAB-H4', page: 4, text: 'Titik 1 (hulu) dan Titik 3 (muara desa) berada di bawah baku mutu.' },
      ],
    },
    { id: 'FOTO-1', type: 'foto', label: 'Air sungai kebiruan di bawah jembatan desa, malam hari', credit: 'Foto: Faris Zakaria, 13 Sep 2026', sensitivity: 'publik' },
    { id: 'FOTO-2', type: 'foto', label: 'Tumpukan galon di teras rumah warga', credit: 'Foto: Faris Zakaria, 14 Sep 2026', sensitivity: 'publik' },
    { id: 'FOTO-3', type: 'foto', label: 'Wajah Bu Sari saat diwawancara', credit: 'Foto: Faris Zakaria, 14 Sep 2026. Tidak untuk publikasi', sensitivity: 'sensitif' },
    {
      id: 'VIDEO-1',
      type: 'video',
      label: 'Rekaman 30 detik aliran saluran pembuangan',
      credit: 'Direkam Faris Zakaria, Jumat 13 Sep 2026',
      sensitivity: 'publik',
      // Video is analysed on two tracks: what is heard and what is seen. Here the sound carries no information.
      parts: [
        { id: 'VID1-A1', time: '00:00-00:30', kind: 'audio', text: 'Hanya suara air deras. Tidak ada percakapan.' },
        { id: 'VID1-V1', time: '00:04', kind: 'visual', text: 'Air berwarna kebiruan keluar dari pipa beton di tepi sungai.' },
        { id: 'VID1-V2', time: '00:13', kind: 'visual', text: 'Busa putih menumpuk di permukaan air dekat mulut pipa.' },
        { id: 'VID1-V3', time: '00:22', kind: 'visual', text: 'Penanda waktu di kamera menunjukkan Jumat, pukul 19.42.' },
      ],
    },
  ],
}

// Step 1: dummy upload. Each click on "Unggah" adds the next sample. Sensitivity starts empty: the journalist labels it.
export const uploadSamples = [
  {
    id: 'VIDEO-2',
    type: 'video',
    label: 'Warga menunjukkan air keran di dapurnya (45 detik)',
    credit: 'Dikirim warga lewat WhatsApp, 3 Nov 2026',
    parts: [
      { id: 'VID2-A1', time: '00:05', kind: 'audio', text: 'Warga: "Ini dari keran, Mas. Dari kemarin begini terus."' },
      { id: 'VID2-V1', time: '00:09', kind: 'visual', text: 'Air dari keran mengisi gelas bening, warnanya keruh kebiruan.' },
      { id: 'VID2-V2', time: '00:27', kind: 'visual', text: 'Tiga galon air minum kosong terlihat di lantai dapur.' },
    ],
  },
  { id: 'FOTO-4', type: 'foto', label: 'Warga mengantre air dari tangki bantuan di balai desa', credit: 'Foto: Faris Zakaria, 3 Nov 2026' },
  {
    id: 'TR3',
    type: 'transkrip',
    label: 'Wawancara Ketua RW 04',
    credit: 'Direkam Faris Zakaria, 2 Nov 2026',
    failOnce: true, // demo of a failed upload with retry
    parts: [
      { id: 'TR3-S1', time: '01:10', text: 'Sudah dua kali kami kirim surat ke desa, belum ada jawaban tertulis.' },
    ],
  },
]

// Step 2: Brief & Guardrails
// mvp: generated in this demo. Others can be picked but are marked as a later phase (PRD MVP scope).
export const formats = [
  { id: 'slides', label: 'Image Slides', hint: '5-8 slide gambar dengan teks pendek', mvp: true },
  { id: 'reels', label: 'Video Reels', hint: '30-60 detik, narasi + potongan video', mvp: false },
  { id: 'audio', label: 'Audio', hint: '1-3 menit, naskah narasi untuk siniar atau pesan suara', mvp: false },
]

// Guardrails are free text written by the journalist. These are example rules pre-filled in the brief.
export const guardrails = [
  'Tidak boleh menambah fakta baru di luar bank informasi',
  'Kutipan harus persis sama dengan sumber',
  'Narasumber sensitif tetap disamarkan, foto wajah tidak dipakai',
  'Foto dan video tidak boleh diubah isinya',
  'Slide terakhir mengarahkan ke artikel lengkap',
]

// Guideline templates the journalist can load, then edit
export const guidelineTemplates = [
  { id: 'standar', label: 'Standar redaksi', rules: guardrails },
  {
    id: 'lingkungan',
    label: 'Liputan lingkungan',
    rules: [
      'Tidak boleh menambah fakta baru di luar bank informasi',
      'Sebut titik pengambilan sampel setiap kali mengutip data lab',
      'Bedakan dugaan warga dengan hasil uji resmi',
      'Pihak yang dituduh harus disebut sudah dimintai konfirmasi',
    ],
  },
  {
    id: 'sensitif',
    label: 'Liputan sensitif atau investigasi',
    rules: [
      'Narasumber anonim tidak boleh bisa dikenali dari detail apa pun',
      'Tidak ada wajah, suara asli, atau lokasi rumah narasumber',
      'Semua bahan sensitif hanya diproses model lokal',
      'Kutipan harus persis sama dengan sumber',
    ],
  },
]

export const platforms = ['Instagram', 'TikTok', 'YouTube Shorts', 'Spotify', 'WhatsApp Channel']

export const defaultBrief = {
  objective: 'Mengajak warga muda memahami dampak pencemaran dan membaca liputan lengkap',
  formats: ['slides'],
  platforms: ['Instagram'],
  audience: 'Warga Jawa Barat usia 18-35 di Instagram',
  tone: 'Lugas, tidak sensasional',
  length: 10,
}

// Step 3: notes the AI writes at the top of the script document
export const briefFeedback = [
  'Materi di bank cukup untuk 7 paragraf. Paragraf tambahan berisiko diisi hal di luar sumber.',
  'Pihak pabrik belum memberi tanggapan. Ini disebut di paragraf 6 agar berimbang.',
  'FOTO-3 berlabel sensitif dan menampilkan wajah narasumber, jadi tidak akan dipakai.',
]

// Step 3: Script & Sumber. One paragraph per slide for the Image Slides format.
export const script = [
  {
    id: 'L1', slide: 1,
    text: '140 keluarga di Desa Mekarwangi kini membeli air untuk minum.',
    sources: ['ART-P3'], audit: 'hijau',
  },
  {
    id: 'L2', slide: 2,
    text: 'Sejak Agustus 2026, Sungai Cilayung berubah kebiruan setiap Selasa dan Jumat malam.',
    sources: ['ART-P1', 'FOTO-1', 'VID1-V1'], audit: 'hijau',
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

// Export formats the journalist can pick in step 6
export const exportFormats = [
  { id: 'png', label: 'PNG per slide', default: true },
  { id: 'pdf', label: 'PDF (satu berkas carousel)', default: false },
  { id: 'caption', label: 'Caption .txt', default: true },
  { id: 'csv', label: 'Jejak Sumber .csv (berkas asli, bisa diunduh)', default: true },
]

// Step 4: which bank image each slide uses (null = text only)
export const slideVisuals = { 1: 'FOTO-2', 2: 'FOTO-1', 3: null, 4: null, 5: null, 6: 'VIDEO-1', 7: null }
