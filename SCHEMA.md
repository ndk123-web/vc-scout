# MongoDB Schema Design - VC Scouting Platform

## LEVEL 1: Core Data Model

---

## Collection: `companies`

**Purpose:** Store startup data + AI enrichment

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: String,
  website: String,
  
  // Classification
  industry: [String],        // e.g., ["SaaS", "AI", "Enterprise"]
  stage: String,             // "Seed", "Series A", "Series B", etc.
  location: String,          // "San Francisco, CA" or "Remote"
  
  // Raw Data (from web scrape)
  rawData: {
    htmlContent: String,     // Page content (for re-analysis)
    scrapedAt: Date,
    sources: [String]        // URLs scraped
  },
  
  // Enriched Data (from Gemini)
  enrichedData: {
    summary: String,         // 2-3 sentence company description
    keywords: [String],      // ["AI", "Enterprise", "B2B"]
    foundingTeam: [String],  // Extracted names if available
    problemStatement: String, // What problem do they solve?
    productStage: String,    // MVP, Beta, Production
    explainedSignals: String // Human explanation of why this matters
  },
  
  // Signals (for scoring)
  signals: {
    momentum: {
      value: Number,         // 1-10
      source: String         // "Hiring growth" | "News mentions" etc
    },
    marketSize: {
      value: Number,         // 1-10
      description: String
    },
    thesisFit: {
      score: Number,         // 1-10 (wait for thesis definition)
      reason: String
    }
  },
  
  // User Actions
  notes: [ObjectId],         // References to Notes collection
  lists: [ObjectId],         // References to Lists collection
  
  // Tracking
  addedBy: String,           // User ID (or "system")
  addedAt: Date,
  lastEnrichedAt: Date,
  status: String             // "new" | "enriching" | "enriched" | "archived"
}
```

---

## Collection: `lists`

**Purpose:** Organize companies by thesis/category

```javascript
{
  _id: ObjectId,
  
  name: String,              // "AI SaaS B2B" | "Climate Tech Series A"
  description: String,       // Optional context
  companyIds: [ObjectId],    // References to companies collection
  
  // Metadata
  owner: String,             // User ID
  createdAt: Date,
  updatedAt: Date,
  
  // Optional: Thesis definition
  thesis: {
    industries: [String],
    stages: [String],
    regions: [String]
  }
}
```

---

## Collection: `notes`

**Purpose:** User annotations on companies

```javascript
{
  _id: ObjectId,
  
  companyId: ObjectId,       // Reference to company
  text: String,              // User note (e.g., "Met founder at Disrupt")
  
  // Metadata
  author: String,            // User ID
  createdAt: Date,
  updatedAt: Date,
  
  type: String               // "meeting" | "research" | "signal" | "todo"
}
```

---

## Collection: `savedsearches`

**Purpose:** Store reusable filter combinations

```javascript
{
  _id: ObjectId,
  
  name: String,              // "Series A Cloud"
  filters: {
    industries: [String],
    stages: [String],
    locations: [String],
    minSignalScore: Number,
    createdAfter: Date
  },
  
  owner: String,             // User ID
  createdAt: Date
}
```

---

## Relationships

```
User (implicit - no User collection yet)
  ↓
  ├── Company (adds companies)
  │   ├── Notes (user adds)
  │   └── Enriched Data (from Gemini)
  │
  ├── List (organizes companies)
  │   └── Companies (many-to-many via companyIds)
  │
  └── SavedSearch (saves filter combos)
```

---

## Database Design Principles

✅ **Denormalization OK for Enriched Data**
- Store AI results in company doc (no separate collection) = faster reads

✅ **References for Large Collections**
- Use companyIds in lists (don't duplicate company data) = efficient updates

✅ **Timestamps Everywhere**
- `createdAt`, `lastEnrichedAt` = auditing + re-enrichment logic

✅ **Status Field for Async Operations**
- `status: "enriching"` = know when API call is in progress

---

## Indexes (Create Later, But Plan Now)

```javascript
// companies
db.companies.createIndex({ website: 1 }, { unique: true })
db.companies.createIndex({ stage: 1, industry: 1 })
db.companies.createIndex({ addedAt: -1 })

// lists
db.lists.createIndex({ owner: 1 })

// notes  
db.notes.createIndex({ companyId: 1 })

// savedsearches
db.savedsearches.createIndex({ owner: 1 })
```

---

## Migration Notes

- Start with just `Company`, `List`, `Notes` (SavedSearch is optional for V1)
- `enrichedData` grows as we add more AI signals
- All timestamps in UTC

