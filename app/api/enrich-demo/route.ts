import { connectDB } from '@/lib/mongodb'
import { Company } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/enrich-demo
 * Quick enrichment with predefined data (for testing/demo)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyId } = body

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const company = await Company.findById(companyId)
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Demo enriched data based on company name keywords
    const demoEnrichments: Record<string, any> = {
      openai: {
        summary:
          'OpenAI is an AI research company that develops large language models and AI systems. Known for creating GPT models and ChatGPT, serving millions of users worldwide.',
        keywords: ['LLM', 'Generative AI', 'API', 'Enterprise', 'N LPaaS'],
        foundingTeam: ['Sam Altman', 'Greg Brockman', 'Ilya Sutskever'],
        problemStatement: 'Making AI safe, powerful, and widely accessible',
        productStage: 'Production',
        explainedSignals:
          'Market leader in generative AI with massive adoption. Strong moat through model quality and scale. Huge TAM.',
      },
      anthropic: {
        summary:
          'Anthropic is an AI safety company building Claude, a more helpful, honest, andharmless AI assistant using Constitutional AI methods.',
        keywords: ['AI Safety', 'Claude', 'Constitutional AI', 'LLM', 'Research'],
        foundingTeam: ['Dario Amodei', 'Daniela Amodei', 'Chris Olah'],
        problemStatement: 'Building AI systems that are safe and aligned with human values',
        productStage: 'Production',
        explainedSignals:
          'Technical innovation in AI safety. Strong founding team from OpenAI. Growing enterprise demand for safe AI.',
      },
      stripe: {
        summary:
          'Stripe is a payment infrastructure platform enabling businesses to accept payments online and in-person with powerful APIs.',
        keywords: ['Payments', 'Financial Infrastructure', 'API', 'SaaS'],
        foundingTeam: ['Patrick Collison', 'John Collison'],
        problemStatement: 'Simplifying payment processing for internet businesses globally',
        productStage: 'Production',
        explainedSignals:
          'Dominant payment processor. Strong retention and expansion revenue. Global financial infrastructure play.',
      },
      default: {
        summary: `${company.name} is an innovative technology company solving important market problems with cutting-edge solutions.`,
        keywords: ['Technology', 'Innovation', 'SaaS', 'Enterprise', 'Growth'],
        foundingTeam: ['Founder Name'],
        problemStatement: `Transforming how businesses operate through advanced technology`,
        productStage: 'Production',
        explainedSignals: `Strong market potential with innovative approach. Growing adoption and clear value proposition.`,
      },
    }

    const key = company.name.toLowerCase()
    
    // Find matching demo data or use default
    let enrichedData
    let signals
    let stage = 'Growth'
    let industry = ['Technology', 'SaaS']
    let location = 'San Francisco, CA'

    if (demoEnrichments[key]) {
      enrichedData = demoEnrichments[key]
      // Add custom signals for known demo companies
      if (key === 'openai' || key === 'anthropic') {
         signals = {
            momentum: { value: 9, source: 'Press & Hype' },
            marketSize: { value: 10, description: 'Trillion dollar AI market' },
            thesisFit: { score: 10, reason: 'Core AI Infrastructure' }
         }
         industry = ['AI', 'LLM', 'Enterprise']
      } else if (key === 'stripe') {
         signals = {
            momentum: { value: 8, source: 'Revenue Growth' },
            marketSize: { value: 10, description: 'Global Payments' },
            thesisFit: { score: 7, reason: 'Fintech (adjacent)' }
         }
         industry = ['Fintech', 'Payments', 'SaaS']
      }
    } else {
      enrichedData = demoEnrichments.default
      // Generic signals for unknown companies
      signals = {
        momentum: { value: 7, source: 'Web Traffic' },
        marketSize: { value: 8, description: 'Large TAM' },
        thesisFit: { score: 6, reason: 'Needs deeper diligence' }
      }
    }

    // Update company with enriched data
    company.enrichedData = {
        summary: enrichedData.summary,
        keywords: enrichedData.keywords,
        foundingTeam: enrichedData.foundingTeam,
        problemStatement: enrichedData.problemStatement,
        productStage: enrichedData.productStage,
        explainedSignals: enrichedData.explainedSignals
    }
    
    // Update root fields
    company.signals = signals
    company.industry = industry
    company.stage = stage
    company.location = location
    
    company.status = 'enriched'
    company.lastEnrichedAt = new Date()

    await company.save()

    return NextResponse.json(
      {
        success: true,
        data: company,
        message: 'Company enriched with demo data',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in enrich-demo endpoint:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
