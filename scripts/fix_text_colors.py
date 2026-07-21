from pathlib import Path

replacements = [
    ("color: colors.primary", "color: colors.brown"),
    ("color={colors.primary}", "color={colors.brown}"),
    (
        "color={done ? colors.disabled : colors.primary}",
        "color={done ? colors.disabled : colors.brown}",
    ),
    ("{ color: colors.primary }", "{ color: colors.brown }"),
    ("&& { color: colors.primary }", "&& { color: colors.brown }"),
    ("!user.birthday && { color: colors.primary }", "!user.birthday && { color: colors.brown }"),
    ("on && { color: colors.primary }", "on && { color: colors.brown }"),
]

root = Path("src")
for p in root.rglob("*.tsx"):
    if "RootNavigator" in str(p):
        continue
    text = p.read_text(encoding="utf-8")
    orig = text
    for a, b in replacements:
        text = text.replace(a, b)
    if text != orig:
        p.write_text(text, encoding="utf-8")
        print("updated", p)

print("done")
