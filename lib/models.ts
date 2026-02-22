import mongoose from 'mongoose'

// Company Schema
const CompanySchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
      unique: true,
    },

    // Classification
    industry: [String],
    stage: String,
    location: String,

    // Raw Data (from web scrape)
    rawData: {
      htmlContent: String,
      scrapedAt: Date,
      sources: [String],
    },

    // Enriched Data (from Gemini)
    enrichedData: {
      summary: String,
      keywords: [String],
      foundingTeam: [String],
      problemStatement: String,
      productStage: String,
      explainedSignals: String,
    },

    // Signals (for scoring)
    signals: {
      momentum: {
        value: Number,
        source: String,
      },
      marketSize: {
        value: Number,
        description: String,
      },
      thesisFit: {
        score: Number,
        reason: String,
      },
    },

    // User Actions
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
      },
    ],

    // Tracking
    addedBy: String,
    lastEnrichedAt: Date,
    status: {
      type: String,
      enum: ['new', 'enriching', 'enriched', 'archived'],
      default: 'new',
    },
  },
  { timestamps: true }
)

// List Schema
const ListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    companyIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
    owner: String,
    thesis: {
      industries: [String],
      stages: [String],
      regions: [String],
    },
  },
  { timestamps: true }
)

// Notes Schema
const NoteSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: String,
    type: {
      type: String,
      enum: ['meeting', 'research', 'signal', 'todo'],
      default: 'research',
    },
  },
  { timestamps: true }
)

// SavedSearch Schema
const SavedSearchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    filters: {
      industries: [String],
      stages: [String],
      locations: [String],
      minSignalScore: Number,
      createdAfter: Date,
    },
    owner: String,
  },
  { timestamps: true }
)

export const Company =
  mongoose.models.Company || mongoose.model('Company', CompanySchema)
export const List =
  mongoose.models.List || mongoose.model('List', ListSchema)
export const Note =
  mongoose.models.Note || mongoose.model('Note', NoteSchema)
export const SavedSearch =
  mongoose.models.SavedSearch ||
  mongoose.model('SavedSearch', SavedSearchSchema)
