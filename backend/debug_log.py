
try:
    with open('build.log', 'r', encoding='utf-16') as f:
        lines = f.readlines()
except:
    with open('build.log', 'r', encoding='utf-8') as f:
        lines = f.readlines()

for i, line in enumerate(lines):
    if "[ERROR]" in line:
        print(f"Line {i}: {line.strip()}")
        # Print next 5 lines for context
        for j in range(1, 6):
            if i+j < len(lines):
                print(f"    {lines[i+j].strip()}")
