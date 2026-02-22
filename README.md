# VC Scouting Platform - Setup & Quick Start

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** (Coming soon)
- **AI Enrichment:** Gemini API (Coming soon)

## Quick Start

### Installation

```bash
npm install
```

### Environment Variables

`.env.local` already configured with:
```
MONGODB_URI=mongodb+srv://Navnath:Navnath@first.rdvyx.mongodb.net/vc-scouting
MONGODB_DB=vc-scouting
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Server runs at: **http://localhost:3000**

---

## Project Structure

```
app/
├── api/
│   ├── companies/          # Company CRUD
│   ├── lists/              # List CRUD
│   ├── notes/              # Notes CRUD
│   ├── health/             # MongoDB health check
│   └── enrich/             # (Coming) AI enrichment
├── companies/              # Companies page
├── lists/                  # Lists page
├── saved/                  # Saved searches page
└── layout.tsx              # Root layout

components/
├── Navbar.tsx
└── Sidebar.tsx

lib/
├── mongodb.ts              # DB connection + caching
└── models.ts               # Mongoose schemas

public/                      # Static assets
```

---

## API Reference

### Companies

#### GET /api/companies
List all companies with pagination
```json
GET /api/companies?page=1&limit=10

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

#### POST /api/companies
Create a new company
```json
POST /api/companies
Content-Type: application/json

{
  "name": "Acme Inc",
  "website": "https://acme.com",
  "industry": ["SaaS", "Enterprise"],
  "stage": "Series A",
  "location": "San Francisco, CA"
}
```

#### GET /api/companies/[id]
Get single company details with notes & lists

#### PUT /api/companies/[id]
Update company

#### DELETE /api/companies/[id]
Delete company

---

### Lists

#### GET /api/lists
Get all lists (optionally filter by owner)
```json
GET /api/lists?owner=userid
```

#### POST /api/lists
Create a new list
```json
POST /api/lists
{
  "name": "AI SaaS Series A",
  "description": "Companies matching our AI thesis",
  "companyIds": [],
  "owner": "userid",
  "thesis": {
    "industries": ["AI", "SaaS"],
    "stages": ["Series A"]
  }
}
```

#### GET /api/lists/[id]
Get single list with populated companies

#### PUT /api/lists/[id]
Update list (add/remove companies)

#### DELETE /api/lists/[id]
Delete list

---

### Notes

#### GET /api/notes
Get notes (filter by companyId)
```json
GET /api/notes?companyId=<company_id>
```

#### POST /api/notes
Create a note
```json
POST /api/notes
{
  "companyId": "...",
  "text": "Met founder at Disrupt conference",
  "author": "userid",
  "type": "meeting"  // "meeting" | "research" | "signal" | "todo"
}
```

---

### Health Check

#### GET /api/health
Verify MongoDB connection
```json
{
  "success": true,
  "message": "Connected to MongoDB successfully"
}
```

---

## Project Roadmap

### ✅ Completed (LEVEL 0-4)
- Product definition & MongoDB schema
- Next.js 14 skeleton with routing
- Layout (navbar + sidebar navigation)
- Full CRUD APIs for Companies, Lists, Notes
- MongoDB connection with Mongoose

### 📋 Coming Soon (LEVEL 5-6)

**LEVEL 5 - AI Enrichment API**
- `POST /api/enrich` - Web scrape + Gemini analysis
- Extract: summary, keywords, founder names, signals
- Store enriched data in company doc

**LEVEL 6 - UI Magic**
- Connect Companies page to API
- Add company form + validation
- Show enriched data cards (summary, signals, keywords)
- Real-time loading states
- Notes interface on company detail page

**LEVEL 7 - Smart Extras**
- Thesis-based scoring
- Batch enrichment
- Export/share lists
- Auto re-enrichment scheduler

---

## Development Tips

### Test MongoDB Connection
```bash
curl http://localhost:3000/api/health
```

### Add a Company (CLI)
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Startup",
    "website": "https://test.com",
    "industry": ["AI"],
    "stage": "Seed",
    "location": "SF"
  }'
```

### VSCode Extensions Recommended
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- MongoDB for VS Code
- Thunder Client (API testing)

---

## Troubleshooting

### MongoDB Connection Failed
1. Check `.env.local` has correct URI
2. Verify network access in MongoDB Atlas
3. Test with: `curl http://localhost:3000/api/health`

### Port 3000 Already in Use
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Next Command

Once tested, run:
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.
