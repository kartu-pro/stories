import json
import os
from supabase import create_client

# Initialize Supabase
url = ""
key = ""
supabase = create_client(url, key)

with open('dummy-data.json', 'r') as f:
    data = json.load(f)


def migrate_data():
    for story_data in data:
        # 1. Insert Story
        raw_title = story_data["image_uuid"].replace(" cover.webp", "")
        story_res = supabase.table("stories").insert({
            "title": raw_title,
            "tier": story_data["tier"],
            "sentence_count": len(story_data["sentences"])
        }).execute()

        story_id = story_res.data[0]["id"]
        print(f"Processing: {raw_title}")

        for index, sentence_data in enumerate(story_data["sentences"]):
            # 2. Insert Scene
            scene_res = supabase.table("scenes").insert({
                "story_id": story_id,
                "image_uuid": sentence_data["image_uuid"],
                "order": index
            }).execute()

            scene_id = scene_res.data[0]["id"]

            for tense_name, content in sentence_data["tenses"].items():
                # 3. Insert Georgian Translation (Target)
                ka_trans = supabase.table("translations").insert({
                    "scene_id": scene_id,
                    "lang": "ka",
                    "tense": tense_name,
                    "full_text": content["georgian"]
                }).execute()

                ka_trans_id = ka_trans.data[0]["id"]

                # 4. Insert English Translation (Reference)
                supabase.table("translations").insert({
                    "scene_id": scene_id,
                    "lang": "en",
                    "tense": tense_name,
                    "full_text": content["english"]
                }).execute()

                # 5. Insert Quiz with Distractor Array
                supabase.table("quizzes").insert({
                    "translation_id": ka_trans_id,
                    "type": "Verb",
                    "answer": content["verb"],
                    # Passing the list directly
                    "distractors": content["distractors"],
                    # Optional helper text
                    "hint": f"Focus on the {tense_name} form"
                }).execute()

    print("Migration complete with distractors!")


if __name__ == "__main__":
    migrate_data()
