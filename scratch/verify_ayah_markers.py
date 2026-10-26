import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

def verify_surah_files(directory):
    total_files = 0
    total_sections = 0
    total_markers = 0
    errors = []

    for filename in sorted(os.listdir(directory)):
        if filename.endswith('.json'):
            file_path = os.path.join(directory, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    total_files += 1
                    for section in data.get('sections', []):
                        total_sections += 1
                        if 'translation' not in section:
                            errors.append(f"Missing translation in {file_path}, section {section['id']}")
                            continue

                        translation = section['translation']
                        marker_count = translation.count('\u06DD')
                        total_markers += marker_count

                        verse_range = section.get('verseRange', [])
                        if len(verse_range) != 2:
                            errors.append(f"Invalid verseRange in {file_path}, section {section['id']}")
                            continue

                        start_verse, end_verse = verse_range
                        expected_count = end_verse - start_verse + 1

                        if marker_count == 0 or marker_count != expected_count:
                            errors.append(f"Mismatched markers in {file_path}, section {section['id']}: found {marker_count}, expected {expected_count}")

            except json.JSONDecodeError as e:
                errors.append(f"Invalid JSON in {file_path}: {e}")

    print(f"Total files checked: {total_files}")
    print(f"Total sections checked: {total_sections}")
    print(f"Total '۝' markers found: {total_markers}")

    if errors:
        for error in errors:
            print(error)
        sys.exit(1)
    else:
        print("All sections match verse ranges with 100% data integrity!")
        sys.exit(0)

if __name__ == "__main__":
    verify_surah_files('public/data/surahs')
