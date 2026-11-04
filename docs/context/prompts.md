---
purpose: Ready-to-paste prompt templates for building lo-fi prototype demos fast on 4 Nov. Use with public or dummy data only
last_updated: 2026-11-02
---

# Prompt Templates

Each one is written so the output is **structured** (a table or JSON), **linked to its source**, and **leaves the decision to a human**. Work in Gemini (AI Studio), Claude, ChatGPT, or a local model through Ollama. Replace `{...}`.

## 1. Data and claim extractor with citations (pain point 1)

```
Kamu asisten riset untuk jurnalis. Kamu TIDAK menyimpulkan dan TIDAK menambah informasi.

Dari dokumen di bawah, ambil setiap angka, tanggal, nama lembaga/perusahaan, dan klaim faktual.
Keluarkan tabel dengan kolom:
| No | Klaim/angka (kutip persis) | Sumber (nama dokumen) | Halaman/bagian | Tanggal data | Masih mutakhir? (ya/tidak/tidak jelas) | Catatan untuk dicek jurnalis |

Aturan:
- Kutip persis dari dokumen. Jangan parafrase angka.
- Jika tanggal data tidak tertulis, isi "tidak tertulis".
- Jika dua dokumen berbeda angka untuk hal yang sama, tandai keduanya dengan "BERBEDA" di Catatan.
- Jangan menilai apakah klaim benar. Itu keputusan jurnalis.

Dokumen:
{tempel teks dokumen, beri label [Dok A], [Dok B], ...}
```

## 2. AI Judge, claim by claim (any idea with a draft or summary)

Use a **different model** than the one that wrote the draft.

```
Kamu pemeriksa fakta. Tugasmu hanya memeriksa apakah setiap klaim di DRAF didukung oleh SUMBER.
Kamu tidak memperbaiki draf dan tidak memberi skor keseluruhan.

Langkah:
1. Pecah DRAF menjadi klaim-klaim tunggal.
2. Untuk setiap klaim, cari bukti di SUMBER.
3. Beri verdict: DIDUKUNG / TIDAK DITEMUKAN / BERTENTANGAN.
4. Wajib kutip kalimat bukti persis dari SUMBER beserta labelnya. Jika TIDAK DITEMUKAN, tulis "-".

Keluarkan JSON:
{"klaim": [{"no": 1, "teks": "...", "verdict": "DIDUKUNG", "bukti": "...", "sumber": "[Dok A] hal. 3"}],
 "ringkasan": {"total": 0, "didukung": 0, "tidak_ditemukan": 0, "bertentangan": 0}}

Keputusan akhir ada di editor. Jika ragu, pilih TIDAK DITEMUKAN, jangan menebak.

SUMBER:
{...}

DRAF:
{...}
```

Show in the mockup as three columns: draft | verdict + evidence | editor action (Terima / Edit / Tolak / Perlu liputan tambahan). Header: "12 klaim, 9 didukung, 2 tidak ditemukan, 1 bertentangan".

## 3. Local redaction gate (pain point 2, run on Ollama)

```bash
ollama run qwen3:8b
```

```
Tandai semua informasi yang bisa mengidentifikasi orang di teks wawancara berikut:
nama orang, NIK, nomor telepon, alamat, nama desa/kampung kecil, nama tempat kerja, plat nomor, akun media sosial.

Keluarkan:
1. Tabel: | Teks asli | Jenis | Usulan pengganti |
   Contoh pengganti: [NARASUMBER-1], [DESA-1], [TELEPON].
2. Teks yang sudah diredaksi.

Jangan hapus isi wawancara selain yang ditandai. Jurnalis akan memeriksa setiap tanda sebelum teks dipakai di tools lain.

Teks:
{transkrip dummy}
```

Demo line: turn Wi-Fi off before running it.

## 4. Interview question reviewer (pain point 2)

```
Kamu editor senior yang berpengalaman meliput korban dan kelompok rentan (prinsip trauma-informed journalism).
Periksa daftar pertanyaan wawancara berikut untuk narasumber: {deskripsi umum narasumber, tanpa identitas}.

Untuk setiap pertanyaan, isi tabel:
| No | Pertanyaan | Risiko (menggiring / memicu trauma / menyalahkan / aman) | Alasan singkat | Usulan kalimat yang lebih aman |

Lalu beri 3 saran: cara membuka wawancara, cara menawarkan anonimitas/nama samaran, kapan sebaiknya berhenti bertanya.
Jurnalis yang memutuskan pertanyaan mana yang dipakai.

Pertanyaan:
{...}
```

## 5. Transcript checker (pain point 3)

```
Ini transkrip otomatis wawancara berbahasa Indonesia yang bercampur bahasa Sunda/Jawa.
Jangan menulis ulang transkrip.

Tandai bagian yang perlu didengar ulang oleh jurnalis:
| Timestamp | Teks | Alasan (kata tidak jelas / kemungkinan salah dengar / bahasa daerah / nama orang atau tempat / angka) | Kemungkinan maksud (jika ada) |

Lalu daftar kutipan kuat yang bisa dipakai di berita, masing-masing dengan timestamp, dan beri label "WAJIB DENGAR ULANG" pada kutipan yang mengandung bagian yang ditandai.

Transkrip:
{transkrip dengan timestamp}
```

## 6. "Lanjutkan dari terakhir" story brief (pain point 4)

Works best in NotebookLM (sources become citations automatically). Otherwise:

```
Kamu membantu jurnalis yang kembali ke liputan panjang setelah terputus oleh tugas lain.
Dari bahan-bahan di bawah, buat ringkasan maksimal 10 baris:
1. Yang sudah diketahui (dengan rujukan [label bahan])
2. Pertanyaan yang masih terbuka
3. Narasumber yang sudah dan belum dihubungi
4. Klaim yang statusnya: terverifikasi / belum / dibantah
5. Langkah berikutnya yang tercatat di catatan jurnalis

Setiap baris wajib punya rujukan. Baris tanpa rujukan tulis dengan awalan "[TANPA SUMBER]".
Jangan menambah analisis atau sudut berita baru.

Bahan:
{[Catatan 12 Okt] ..., [Wawancara A] ..., [Dok AMDAL] ...}
```

## 7. Traceable repurposer (pain point 5)

```
Ubah artikel berikut menjadi:
A. Carousel Instagram 5 slide (maks 25 kata per slide)
B. Naskah Reels 30 detik
C. Teks newsletter WhatsApp (maks 80 kata) dengan ajakan membaca artikel lengkap di {URL}

Aturan:
- Setiap kalimat output diakhiri rujukan paragraf sumber, contoh: (P3).
- Angka, nama, jabatan, dan kutipan langsung TIDAK boleh diubah.
- Tidak boleh ada informasi yang tidak ada di artikel. Jika butuh konteks tambahan, tulis "[PERLU KONFIRMASI EDITOR]".
- Di akhir, buat daftar "Yang saya sederhanakan" dan "Yang saya hilangkan" supaya editor tahu apa yang berubah.

Artikel (paragraf diberi nomor):
{P1 ..., P2 ..., ...}
```

Pair it with prompt 2 (AI judge) to block anything not in the article.

## 8. Grant report builder (pain point 6)

```
Susun draf bagian "Capaian Program" untuk laporan ke donor, berdasarkan tabel di bawah.
Format: {format donor, misalnya: Output, Outcome, Bukti}.

Aturan:
- Setiap angka wajib menyebut baris sumbernya, contoh: (baris 4).
- Klaim dampak yang tidak bisa ditelusuri ke tabel diberi label "[BUTUH BUKTI]".
- Jangan melebih-lebihkan. Gunakan bahasa netral.

Tabel:
{tempel tabel dummy: judul liputan, tanggal terbit, views, shares, respons kebijakan, ...}
```

## 9. Receipt extractor (pain point 7)

Gemini or Claude with an image, or a local vision model:

```
Baca foto kuitansi/invoice ini. Keluarkan JSON:
{"nama_penerima": "", "nama_vendor": "", "tanggal": "YYYY-MM-DD", "jumlah_rupiah": 0, "keperluan": "", "npwp": "", "nomor_kuitansi": "",
 "keyakinan": {"nama_vendor": "tinggi|sedang|rendah", "tanggal": "...", "jumlah_rupiah": "..."}}

Jika ada kolom yang tidak terbaca, isi null dan keyakinan "rendah". Jangan menebak angka.
Data ini akan dicek koordinator sebelum dicatat untuk pembayaran.
```

## 10. Feasibility check, for me during ideation

Quick private sanity check when a journalist pitches an idea and I'm unsure:

```
Saya AI developer di workshop prototyping 3 jam. Ide dari jurnalis: "{ide}".
Dalam 5 baris: (1) apakah ini bisa dibuat versi lo-fi dalam 2 jam dengan data publik/dummy,
(2) satu langkah AI yang paling inti untuk dibuat nyata, (3) bagian yang sebaiknya di-fake,
(4) risiko akurasi dan keamanan data, (5) di mana titik keputusan manusia.
```
