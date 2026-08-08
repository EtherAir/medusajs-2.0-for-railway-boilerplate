/**
 * Downloads every product image listed in ah-catalog.json from the legacy
 * site into the repo:
 *   public/images/ah/source/<handle>/NN-<role>.<ext>   (all 52, seed uploads these)
 *   public/images/ah/products/<handle>.<ext>           (main image copy, chrome map)
 *
 * Filenames with literal spaces are URL-encoded. Extensions are preserved.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs"
import path from "node:path"

const catalog = JSON.parse(
  readFileSync(path.join(process.cwd(), "scripts/data/ah-catalog.json"))
)

const SRC_ROOT = path.join(process.cwd(), "public/images/ah/source")
const CARD_ROOT = path.join(process.cwd(), "public/images/ah/products")
mkdirSync(CARD_ROOT, { recursive: true })

let ok = 0
const failures = []

for (const p of catalog.products) {
  if (!p.images.length) continue
  const dir = path.join(SRC_ROOT, p.handle)
  mkdirSync(dir, { recursive: true })

  for (const [i, img] of p.images.entries()) {
    const url = encodeURI(img.url)
    const ext = (path.extname(new URL(url).pathname) || ".jpg").toLowerCase()
    const file = path.join(
      dir,
      `${String(i + 1).padStart(2, "0")}-${img.role.toLowerCase()}${ext}`
    )
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (ah-migration)" },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 500) throw new Error(`suspiciously small (${buf.length}B)`)
      writeFileSync(file, buf)
      img.localPath = path.relative(process.cwd(), file)
      ok++
      if (img.role === "Main") {
        const card = path.join(CARD_ROOT, `${p.handle}${ext}`)
        copyFileSync(file, card)
        p.cardImage = `/images/ah/products/${p.handle}${ext}`
      }
    } catch (e) {
      failures.push(`${p.handle} ${img.url} → ${e.message}`)
    }
  }
}

// persist localPath/cardImage back into the catalog json
writeFileSync(
  path.join(process.cwd(), "scripts/data/ah-catalog.json"),
  JSON.stringify(catalog, null, 2)
)

console.log(`downloaded: ${ok}`)
if (failures.length) {
  console.log(`FAILURES (${failures.length}):`)
  failures.forEach((f) => console.log("  •", f))
  process.exitCode = 1
}
