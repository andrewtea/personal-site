// Covers fetch by ISBN from Open Library (Internet Archive's book catalogue) into public/assets/covers,
// which .gitignore keeps out of the repo since an ISBN can always fetch its cover again. A book with
// no cover there keeps a plain gel slot, and the build prints a warning.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

export async function coversFor(isbns: string[]): Promise<Map<string, string>> {
  const covers = new Map<string, string>();
  await Promise.all(isbns.map(async (isbn) => {
    const file = `public/assets/covers/${isbn}.jpg`;
    if (!existsSync(file)) {
      try {
        // default=false makes a missing cover a 404 instead of a silent blank image.
        const cover = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`);
        if (cover.ok && (cover.headers.get("content-type") ?? "").startsWith("image/")) {
          mkdirSync("public/assets/covers", { recursive: true });
          writeFileSync(file, Buffer.from(await cover.arrayBuffer()));
        }
      } catch {}
    }
    if (existsSync(file)) covers.set(isbn, `/assets/covers/${isbn}.jpg`);
    else console.warn(`library: no cover on open library for isbn ${isbn}`);
  }));
  return covers;
}
