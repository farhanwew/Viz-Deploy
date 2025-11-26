import pandas as pd
import numpy as np
import random

def get_grade_letter(score):
    if 86 <= score <= 100:
        return 'A'
    elif 76 <= score <= 85:
        return 'AB'
    elif 66 <= score <= 75:
        return 'B'
    elif 61 <= score <= 65:
        return 'BC'
    elif 56 <= score <= 60:
        return 'C'
    elif 41 <= score <= 55:
        return 'D'
    else:
        return 'E'

def generate_dummy_data():
    # Load Data
    # Using mangle_dupe_cols=True (default) to handle duplicate 'Course Code' in Matkul Wajib
    # The second 'Course Code' usually becomes 'Course Code.1'
    try:
        df_wajib = pd.read_csv('Matkul Wajib with RMK.csv')
        # Rename columns to be consistent if needed or drop duplicates
        # Based on file content: Semester, Course Code, Course Name, Credit, Course Code, RMK
        # Pandas usually names the second one "Course Code.1"
        if 'Course Code.1' in df_wajib.columns:
             df_wajib = df_wajib.drop(columns=['Course Code.1'])
        
        # Standardize column names
        df_wajib.rename(columns={'Course Code': 'kode_mk', 'Course Name': 'nama_mk', 'Credit': 'sks', 'RMK': 'RMK', 'Semester': 'semester_wajib'}, inplace=True)
        
        df_pilihan = pd.read_csv('Matkul Pilihan with RMK.csv')
        df_pilihan.rename(columns={'Course Code': 'kode_mk', 'Course Name': 'nama_mk', 'Credit': 'sks', 'RMK': 'RMK'}, inplace=True)
        # Fix potential typo in Credit column name for elective
        if 'Credit' in df_pilihan.columns: # In case it was named Credit in one and something else in other
            df_pilihan.rename(columns={'Credit': 'sks'}, inplace=True)
            
    except Exception as e:
        print(f"Error reading CSV files: {e}")
        return

    records = []
    
    # Configuration
    cohorts = {
        2021: {'students': 40, 'semesters': range(1, 9)}, # 1 to 8
        2022: {'students': 300, 'semesters': range(1, 8)}, # 1 to 7
        2023: {'students': 300, 'semesters': range(1, 6)}, # 1 to 5
        2024: {'students': 300, 'semesters': range(1, 4)}, # 1 to 3
        2025: {'students': 300, 'semesters': range(1, 2)}, # 1 only
    }
    
    prodi = "Teknik Informatika"
    
    # Deduplicate electives by 'kode_mk' to avoid selecting the same course twice (if it has multiple RMKs)
    # We keep the first RMK found.
    df_pilihan_unique = df_pilihan.drop_duplicates(subset=['kode_mk'])

    print("Generating data...")
    
    for year, config in cohorts.items():
        num_students = config['students']
        semesters_taken_list = list(config['semesters'])
        # Set Semester_sekarang to the highest semester in the list
        # If the user wants "Current Semester (Odd)", and 2021 has 8 (Even), 
        # we might need to adjust, but we'll strictly follow the data present.
        # If they have data for Sem 8, they are essentially "in" or "finished" Sem 8.
        # Given "Semester saat ini (udah pasti ganjil)", 
        # but 2021 has 8 (Genap). We will just use the max semester number for the data row.
        current_semester_val = semesters_taken_list[-1] 
        
        for i in range(1, num_students + 1):
            # Generate NRP: 5025 + YY + 1 + NNN
            yy = str(year)[-2:]
            nrp = f"5025{yy}1{i:03d}"
            
            for sem in semesters_taken_list:
                # 1. Mandatory Courses for this semester
                wajib_sem = df_wajib[df_wajib['semester_wajib'] == sem]
                
                # Filter out "Elective Course" and "Enrichment Course" placeholders from mandatory list
                # as they are handled in the elective section below or are generic placeholders
                wajib_sem = wajib_sem[~wajib_sem['nama_mk'].str.contains('Elective', case=False, na=False)]
                wajib_sem = wajib_sem[~wajib_sem['nama_mk'].str.contains('Enrichment', case=False, na=False)]
                
                # Add mandatory courses
                for _, row in wajib_sem.iterrows():
                    # Generate "Good" grades: Weighted random choice
                    grade_range = random.choices(
                        [(86, 100), (76, 85), (66, 75), (61, 65), (56, 60), (0, 55)],
                        weights=[40, 30, 15, 5, 5, 5]
                    )[0]
                    score = random.randint(grade_range[0], grade_range[1])
                    letter = get_grade_letter(score)
                    
                    rmk = row['RMK']
                    if pd.isna(rmk) or rmk == '':
                        rmk = "Non-Rumpun"
                    
                    records.append({
                        'kode_mhs': nrp,
                        'nama_prodi': prodi,
                        'id_smt': sem,
                        'kode_mk': row['kode_mk'],
                        'nama_mk': row['nama_mk'],
                        'RMK': rmk,
                        'sks': row['sks'],
                        'nilai_akhir': score,
                        'nilai_huruf': letter,
                        'Tahun angkatan': year,
                        'Semester_sekarang': current_semester_val,
                        'Deskripsi Matkul': 'wajib'
                    })
                
                # 2. Elective Courses (Only Sem 5 and 7)
                if sem in [5, 7]:
                    # Randomly select 2 unique elective courses from the deduplicated list
                    selected_electives = df_pilihan_unique.sample(n=2)
                    
                    for _, row in selected_electives.iterrows():
                        grade_range = random.choices(
                            [(86, 100), (76, 85), (66, 75), (61, 65), (56, 60), (0, 55)],
                            weights=[40, 30, 15, 5, 5, 5]
                        )[0]
                        score = random.randint(grade_range[0], grade_range[1])
                        letter = get_grade_letter(score)
                        
                        rmk = row['RMK']
                        if pd.isna(rmk) or rmk == '':
                            rmk = "Non-Rumpun"
                        
                        records.append({
                            'kode_mhs': nrp,
                            'nama_prodi': prodi,
                            'id_smt': sem,
                            'kode_mk': row['kode_mk'],
                            'nama_mk': row['nama_mk'],
                            'RMK': rmk,
                            'sks': row['sks'],
                            'nilai_akhir': score,
                            'nilai_huruf': letter,
                            'Tahun angkatan': year,
                            'Semester_sekarang': current_semester_val,
                            'Deskripsi Matkul': 'pilihan'
                        })
    
    # Create DataFrame
    df_result = pd.DataFrame(records)
    
    # Output file
    output_filename = 'generated_dummy_data.csv'
    df_result.to_csv(output_filename, index=False)
    print(f"Data generation complete. Saved to {output_filename}")
    print(f"Total records generated: {len(df_result)}")

if __name__ == "__main__":
    generate_dummy_data()
