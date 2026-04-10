import csv
import json
import os


def convert_csv_to_json(csv_filepath, output_filepath):
    # Dictionary to hold the grouped stories
    stories_map = {}

    with open(csv_filepath, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            story_title = row['story']
            # Convert index to 2-digit string for the UUID format
            idx_int = int(row['index'])
            idx_str = f"{idx_int:02}"
            tense_name = row['tense']

            if story_title not in stories_map:
                stories_map[story_title] = {}

            if idx_int not in stories_map[story_title]:
                stories_map[story_title][idx_int] = {
                    "id": f"s{idx_int}",
                    # Pattern: {title} {01}.webp
                    "image_uuid": f"{story_title} {idx_str}.webp",
                    "tenses": {}
                }

            # Map CSV columns to the Technical Blueprint JSON structure
            stories_map[story_title][idx_int]["tenses"][tense_name] = {
                "georgian": row['ka'],
                "english": row['en'],
                "verb": row['correct'],
                "distractors": [d.strip() for d in row['distractors'].split(',')],
                "audio_url": f"assets/audio/s{idx_int}_{tense_name[:4]}.mp3"
            }

    # Format into the final monolithic structure
    final_output = []
    for title, sentences_dict in stories_map.items():
        # Sort sentences by integer key to ensure s1 comes before s10
        sorted_indices = sorted(sentences_dict.keys())

        story_obj = {
            # Consistent with your pattern
            "image_uuid": f"{title} cover.webp",
            "tier": "free",  # Default tier as per spec
            "sentences": [sentences_dict[i] for i in sorted_indices]
        }
        final_output.append(story_obj)

    # Ensure the directory exists before writing
    os.makedirs(os.path.dirname(output_filepath), exist_ok=True)

    with open(output_filepath, 'w', encoding='utf-8') as out_f:
        json.dump(final_output, out_f, ensure_ascii=False, indent=2)

    print(f"Successfully generated: {output_filepath}")


if __name__ == "__main__":
    # Ensure stories.csv is in the same directory as this script
    convert_csv_to_json('stories.csv', '../src/assets/dummy-data.json')
