import path from "path"
import { fileURLToPath } from "url"

import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { s3Storage } from "@payloadcms/storage-s3"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Payload CMS embedded in the storefront Next app (admin at /admin).
 * Postgres: separate `payload` database on the project's Railway instance.
 * Media: the project's S3-compatible bucket (same credentials as Medusa).
 *
 * Owns the Learn blog (posts) and the editable globals (site settings,
 * homepage reviews). Art-directed pages keep their approved copy in the
 * repo (src/lib/content/*).
 */

const s3Configured =
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_BUCKET &&
  process.env.S3_ENDPOINT

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "ah-dev-secret-do-not-use",
  editor: lexicalEditor(),
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, "src/migrations"),
    pool: {
      connectionString:
        process.env.PAYLOAD_DATABASE_URL ||
        process.env.PAYLOAD_DATABASE_PUBLIC_URL ||
        "postgresql://localhost:5432/payload",
    },
  }),
  admin: {
    user: "users",
    meta: {
      titleSuffix: " — Ascended Health CMS",
    },
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email" },
      fields: [{ name: "name", type: "text" }],
    },
    {
      slug: "media",
      upload: true,
      fields: [{ name: "alt", type: "text" }],
    },
    {
      slug: "posts",
      admin: { useAsTitle: "title", defaultColumns: ["title", "tag", "_status"] },
      versions: { drafts: true },
      access: { read: () => true },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "slug", type: "text", required: true, unique: true, index: true },
        {
          name: "tag",
          type: "select",
          required: true,
          options: ["Our mission", "Science", "Ingredients", "Rituals", "Learn"],
        },
        { name: "byline", type: "text", admin: { description: "e.g. by Compton Rom" } },
        { name: "excerpt", type: "textarea" },
        { name: "heroImage", type: "upload", relationTo: "media" },
        {
          name: "sections",
          type: "array",
          admin: {
            description:
              "Roman-numeraled article sections (heading + paragraphs), as on the concept article.",
          },
          fields: [
            { name: "heading", type: "text", required: true },
            { name: "body", type: "textarea", required: true },
          ],
        },
        { name: "intro", type: "textarea" },
      ],
    },
  ],
  globals: [
    {
      slug: "site-settings",
      access: { read: () => true },
      fields: [
        {
          name: "announcement",
          type: "text",
          defaultValue: "Free shipping on US orders over $250.",
        },
        { name: "freeShippingThreshold", type: "number", defaultValue: 250 },
        {
          name: "communityLine",
          type: "textarea",
          defaultValue:
            "FOLLOW. ENGAGE. FLOURISH.\nFind our community online @ascendedhealth.",
        },
      ],
    },
    {
      slug: "reviews",
      access: { read: () => true },
      fields: [
        {
          name: "items",
          type: "array",
          fields: [
            { name: "author", type: "text", required: true },
            { name: "date", type: "text" },
            { name: "rating", type: "number", defaultValue: 5, min: 1, max: 5 },
            { name: "body", type: "textarea", required: true },
          ],
        },
      ],
    },
  ],
  plugins: [
    // Always registered (so its client components are in the importMap);
    // only active when the bucket credentials exist in the environment.
    s3Storage({
      enabled: Boolean(s3Configured),
      collections: { media: true },
      bucket: process.env.S3_BUCKET || "payload-media",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || "us-east-1",
        forcePathStyle: true,
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, "src/types/payload-types.ts"),
  },
})
