import tarfile
import json
import collections
import io

def generate_weights_from_tar(archive_path):
    char_counts = collections.Counter()
    total_chars = 0
    
    with tarfile.open(archive_path, "r:gz") as tar:
        # Find the -words.txt file inside the archive
        words_file_member = next((m for m in tar.getmembers() if m.name.endswith("-words.txt")), None)
        
        if not words_file_member:
            print("Could not find a -words.txt file in the archive.")
            return

        # Extract and read the file in-memory
        f = tar.extractfile(words_file_member)
        content = io.TextIOWrapper(f, encoding='utf-8')

        for line in content:
            parts = line.strip().split('\t')
            if len(parts) < 3: continue
            
            word = parts[1]
            frequency = int(parts[2])
            
            # Filter for Georgian Mkhedruli script
            georgian_chars = [c for c in word if '\u10d0' <= c <= '\u10ff']
            
            for char in georgian_chars:
                char_counts[char] += frequency
                total_chars += frequency

    # Normalize to 100%
    weights = {char: round((count / total_chars) * 100, 2) 
               for char, count in char_counts.items()}
    
    # Save to src/utils for the Vue app to import
    output_path = "../src/utils/letter-weights.json"
    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(dict(sorted(weights.items(), key=lambda x: x[1], reverse=True)), 
                  out, ensure_ascii=False, indent=2)
    
    print(f"Success! Weights exported to {output_path}")

if __name__ == "__main__":
    # Update this filename to match exactly what you downloaded
    generate_weights_from_tar("/mnt/chromeos/MyFiles/Downloads/kat-ge_web_2019_10K.tar.gz")
