# Generator Data Dummy Mahasiswa Teknik Informatika ITS
data akademik dummy  bagi mahasiswa S1 TC ITS

### Karakteristik Data

Dataset yang dihasilkan mencakup fitur-fitur berikut:

*   **Informasi Mahasiswa:**
    *   **NRP:** Identitas unik dengan pola `5025[Tahun]1[NoUrut]` (contoh: 5025231001).
    *   **Prodi:** "Teknik Informatika".
    *   **Tahun Angkatan:** 2021, 2022, 2023, 2024, 2025.
    *   **Semester Sekarang:** Semester tertinggi yang sedang atau telah ditempuh oleh mahasiswa.

*   **Rekam Akademik:**
    *   **Semester Tempuh (id_smt):** Semester di mana mata kuliah tersebut diambil.
    *   **Detail Mata Kuliah:** Kode (`kode_mk`), Nama (`nama_mk`), SKS (`sks`), dan Rumpun Mata Kuliah (`RMK`).
    *   **Jenis Mata Kuliah (Deskripsi Matkul):**
        *   **Wajib:** Berdasarkan struktur kurikulum standar.
        *   **Pilihan:** Dipilih secara acak dari daftar mata kuliah pilihan yang tersedia (diambil pada Semester 5 dan 7).
    *   **Nilai:**
        *   **Angka (nilai_akhir):** 0-100.
        *   **Huruf (nilai_huruf):** A, AB, B, BC, C, D, E.
        *   **Distribusi:** Cenderung ke nilai "Baik" (dominan A/AB/B) 

### Konfigurasi Data

*   **Angkatan & Progresi:**
    *   **2025:** Semester 1
    *   **2024:** Semester 1-3
    *   **2023:** Semester 1-5
    *   **2022:** Semester 1-7
    *   **2021:** Semester 1-8 (termasuk mahasiswa yang belum lulus)
*   **Volume:** Sekitar 300 mahasiswa per angkatan aktif, ditambah ~40 mahasiswa tingkat akhir yang belum lulus.

## File

*   `generate_data.py`: Skrip Python utama untuk menghasilkan data.
*   `Matkul Wajib with RMK.csv`: File sumber untuk mata kuliah wajib.
*   `Matkul Pilihan with RMK.csv`: File sumber untuk mata kuliah pilihan.
*   `generated_dummy_data.csv`: File output yang berisi data hasil generate.

## Cara Menjalankan
1.  Jalankan skrip generator:
    ```bash
    python generate_data.py
    ```
2.  Output akan disimpan ke file `generated_dummy_data.csv`.