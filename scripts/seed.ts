import { connectDB } from '@/lib/mongodb'
import { Company, List, Note } from '@/lib/models'

async function seed() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    await Company.deleteMany({})
    await List.deleteMany({})
    await Note.deleteMany({})
    console.log('Cleared existing data')

    // Sample companies
    const companies = await Company.insertMany([
      {
        name: 'OpenAI',
        website: 'https://openai.com',
        industry: ['AI', 'LLMs', 'Enterprise'],
        stage: 'Growth',
        location: 'San Francisco, CA',
        enrichedData: {
          summary:
            'AI research company developing large language models. Known for GPT series and ChatGPT.',
          keywords: ['LLM', 'Generative AI', 'API', 'Enterprise'],
          foundingTeam: ['Sam Altman', 'Greg Brockman', 'Ilya Sutskever'],
          problemStatement: 'Making AI safe and beneficial at scale',
          productStage: 'Production',
          explainedSignals: 'Strong tech + large market + clear business model',
        },
        signals: {
          momentum: { value: 9, source: 'Market adoption' },
          marketSize: { value: 10, description: 'Trillion dollar opportunity' },
          thesisFit: { score: 10, reason: 'Perfect alignment with AI thesis' },
        },
        status: 'enriched',
      },
      {
        name: 'Anthropic',
        website: 'https://anthropic.com',
        industry: ['AI', 'LLMs', 'Safety'],
        stage: 'Series B',
        location: 'San Francisco, CA',
        enrichedData: {
          summary:
            'AI safety company building Claude, a responsible AI assistant. Focused on interpretability and alignment.',
          keywords: ['Constitutional AI', 'Safety', 'Claude', 'LLMs'],
          foundingTeam: ['Dario Amodei', 'Daniela Amodei', 'Chris Olah'],
          problemStatement: 'Building safe, beneficial AI systems',
          productStage: 'Production',
          explainedSignals: 'Strong founding team + clear differentiation in safety',
        },
        signals: {
          momentum: { value: 9, source: 'User growth' },
          marketSize: { value: 9, description: 'Multi-billion opportunity' },
          thesisFit: { score: 9, reason: 'Strong alignment with AI safety focus' },
        },
        status: 'enriched',
      },
      {
        name: 'Stripe',
        website: 'https://stripe.com',
        industry: ['Fintech', 'SaaS', 'Payments'],
        stage: 'Late Stage',
        location: 'San Francisco, CA',
        enrichedData: {
          summary:
            'Payment infrastructure for internet businesses. Powers payments for millions of companies.',
          keywords: ['Payments', 'API', 'Global', 'Developer-friendly'],
          foundingTeam: ['Patrick Collison', 'John Collison'],
          problemStatement: 'Making payments frictionless for the internet',
          productStage: 'Production',
          explainedSignals: 'Massive TAM + best-in-class product + strong unit economics',
        },
        signals: {
          momentum: { value: 8, source: 'Revenue run rate' },
          marketSize: { value: 10, description: 'Trillion dollar market' },
          thesisFit: { score: 6, reason: 'Not pure AI, but great infrastructure company' },
        },
        status: 'enriched',
      },
      {
        name: 'Hugging Face',
        website: 'https://huggingface.co',
        industry: ['AI', 'ML Ops', 'Open Source'],
        stage: 'Series D',
        location: 'New York, NY',
        enrichedData: {
          summary:
            'Open source ML community and model hub. Building tools for ML practitioners.',
          keywords: ['Open Source', 'Transformers', 'ML Community', 'Models'],
          foundingTeam: ['Clément Delangue', 'Julien Chaumond', 'Thomas Wolf'],
          problemStatement: 'Democratizing ML and making models accessible',
          productStage: 'Production',
          explainedSignals: 'Large developer community + strategic partnerships',
        },
        signals: {
          momentum: { value: 8, source: 'Community growth' },
          marketSize: { value: 8, description: 'Emerging ML infrastructure market' },
          thesisFit: { score: 8, reason: 'Core AI infrastructure play' },
        },
        status: 'enriched',
      },
      {
        name: 'Scale AI',
        website: 'https://scale.com',
        industry: ['AI', 'Data', 'Enterprise'],
        stage: 'Series D',
        location: 'San Francisco, CA',
        enrichedData: {
          summary:
            'Data infrastructure for AI. Provides high-quality training data for ML models.',
          keywords: ['Data Labeling', 'AI Data', 'Enterprise', 'Infrastructure'],
          foundingTeam: ['Alexandr Wang', 'Lucy Guo'],
          problemStatement: 'Making high-quality training data accessible for AI teams',
          productStage: 'Production',
          explainedSignals: 'Solving critical problem in AI pipeline. Strong enterprise traction.',
        },
        signals: {
          momentum: { value: 8, source: 'Enterprise contracts' },
          marketSize: { value: 8, description: 'Multi-billion training data market' },
          thesisFit: { score: 9, reason: 'Enables other AI companies to succeed' },
        },
        status: 'enriched',
      },
      {
        name: 'Retool',
        website: 'https://retool.com',
        industry: ['SaaS', 'Low Code', 'Enterprise'],
        stage: 'Series C',
        location: 'San Francisco, CA',
        enrichedData: {
          summary:
            'Low code platform for building internal tools quickly. Used by thousands of enterprises.',
          keywords: ['Low Code', 'Internal Tools', 'Enterprise SaaS', 'Productivity'],
          foundingTeam: ['David Hsu'],
          problemStatement: 'Reducing time to build internal business applications',
          productStage: 'Production',
          explainedSignals: 'Product-market fit + strong retention + clear unit economics',
        },
        signals: {
          momentum: { value: 7, source: 'ARR growth' },
          marketSize: { value: 7, description: 'Eight billion internal tools market' },
          thesisFit: { score: 5, reason: 'Good company but not primary AI focus' },
        },
        status: 'enriched',
      },
      {
        name: 'Runway',
        website: 'https://runway.com',
        industry: ['AI', 'Creative Tools', 'Video'],
        stage: 'Series C',
        location: 'New York, NY',
        enrichedData: {
          summary:
            'AI-powered creative tools for video and design. Making video production accessible.',
          keywords: ['Gen AI', 'Video', 'Creative', 'Real-time'],
          foundingTeam: ['Cristobal Valenzuela', 'Alejandro Matamala'],
          problemStatement: 'Making professional video production 10x faster with AI',
          productStage: 'Production',
          explainedSignals: 'Consumer adoption + business model pivot + creator economy tailwinds',
        },
        signals: {
          momentum: { value: 8, source: 'Creator adoption' },
          marketSize: { value: 8, description: 'Multi-billion creator economy' },
          thesisFit: { score: 9, reason: 'Direct Gen AI application' },
        },
        status: 'enriched',
      },
      {
        name: 'Axiom',
        website: 'https://axiom.co',
        industry: ['Data', 'Analytics', 'SaaS'],
        stage: 'Series A',
        location: 'Berlin, Germany',
        enrichedData: {
          summary:
            'Serverless data platform. Making data infrastructure simple for developers.',
          keywords: ['Data', 'Serverless', 'Analytics', 'Developer tools'],
          foundingTeam: ['Raul Mészáros', 'Szymon Kulpa'],
          problemStatement: 'Simplifying data infrastructure for modern teams',
          productStage: 'Beta',
          explainedSignals: 'Strong developer experience + growing adoption + good founders',
        },
        signals: {
          momentum: { value: 6, source: 'User growth' },
          marketSize: { value: 7, description: 'Data infrastructure market' },
          thesisFit: { score: 4, reason: 'Supporting but not core AI' },
        },
        status: 'enriched',
      },
    ])

    console.log(`Created ${companies.length} companies`)

    // Sample lists
    const lists = await List.insertMany([
      {
        name: 'AI + LLMs - Series A+',
        description:
          'Companies building on top of LLMs or advancing the frontier of generative AI',
        companyIds: [companies[0]._id, companies[1]._id, companies[3]._id],
        owner: 'investor1',
        thesis: {
          industries: ['AI', 'LLMs'],
          stages: ['Series A', 'Series B', 'Series C', 'Series D'],
          regions: ['US', 'EU'],
        },
      },
      {
        name: 'Enterprise SaaS B2B',
        description: 'High-growth SaaS companies with strong enterprise traction',
        companyIds: [companies[2]._id, companies[4]._id, companies[5]._id],
        owner: 'investor1',
        thesis: {
          industries: ['SaaS', 'Enterprise'],
          stages: ['Series B', 'Series C'],
          regions: ['US'],
        },
      },
      {
        name: 'Creative Economy + Gen AI',
        description: 'Tools empowering creators with generative AI capabilities',
        companyIds: [companies[6]._id],
        owner: 'investor2',
        thesis: {
          industries: ['AI', 'Creative Tools'],
          stages: ['Series B', 'Series C'],
          regions: ['US'],
        },
      },
    ])

    console.log(`Created ${lists.length} lists`)

    // Sample notes
    const sampleNotes = [
      {
        companyId: companies[0]._id,
        text: 'Met Sam at SXSW. Incredible vision for AI. Market opportunity is massive.',
        author: 'investor1',
        type: 'meeting',
      },
      {
        companyId: companies[0]._id,
        text: 'Check: GPT-4 API adoption metrics. Need to understand competitive moat vs Claude.',
        author: 'investor1',
        type: 'research',
      },
      {
        companyId: companies[1]._id,
        text: 'Constitutional AI approach is novel. Dario + Daniela are top tier founders.',
        author: 'investor1',
        type: 'signal',
      },
      {
        companyId: companies[3]._id,
        text: 'Hugging Face is the npm for ML. Community moat is real.',
        author: 'investor2',
        type: 'research',
      },
      {
        companyId: companies[4]._id,
        text: 'Follow up on Series E timing. Very interested in participating.',
        author: 'investor1',
        type: 'todo',
      },
    ]

    await Note.insertMany(sampleNotes)
    console.log(`Created ${sampleNotes.length} notes`)

    console.log('✅ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
