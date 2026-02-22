import { connectDB } from '@/lib/mongodb'
import { Company } from '@/lib/models'
import { scrapeWebsite, enrichWithGemini } from '@/lib/enrichment'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyId, website } = body

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Fetch company
    const company = await Company.findById(companyId)
    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Use provided website or company's website
    const urlToScrape = website || company.website

    if (!urlToScrape) {
      return NextResponse.json(
        { success: false, error: 'No website URL provided' },
        { status: 400 }
      )
    }

    // Update status to enriching
    company.status = 'enriching'
    await company.save()

    try {
      // Step 1: Scrape website
      console.log(`Scraping ${urlToScrape}...`)
      const websiteContent = await scrapeWebsite(urlToScrape)

      // Step 2: Enrich with Gemini
      console.log(`Enriching ${company.name} with Gemini...`)
      const geminiResult = await enrichWithGemini(company.name, websiteContent)

      // Step 3: Map data to schema
      
      // Update core fields
      if (geminiResult.industries) company.industry = geminiResult.industries
      if (geminiResult.stage) company.stage = geminiResult.stage
      if (geminiResult.location) company.location = geminiResult.location

      // Update signals
      if (geminiResult.signals) {
        company.signals = {
          momentum: {
            value: geminiResult.signals.momentum?.value || 0,
            source: geminiResult.signals.momentum?.source || 'AI Analysis'
          },
          marketSize: {
             value: geminiResult.signals.marketSize?.value || 0,
             description: geminiResult.signals.marketSize?.description || 'AI Analysis'
          },
          thesisFit: {
             score: geminiResult.signals.thesisFit?.score || 0,
             reason: geminiResult.signals.thesisFit?.reason || 'AI Analysis'
          }
        }
      }

      // Update enrichedData sub-document
      company.enrichedData = {
        summary: geminiResult.summary,
        keywords: geminiResult.keywords,
        foundingTeam: geminiResult.foundingTeam,
        problemStatement: geminiResult.problemStatement,
        productStage: geminiResult.productStage,
        explainedSignals: geminiResult.explainedSignals
      }

      company.status = 'enriched'
      company.lastEnrichedAt = new Date()

      // Also store raw data for reference
      if (!company.rawData) {
        company.rawData = {}
      }
      company.rawData.htmlContent = websiteContent.substring(0, 10000) // Store first 10k chars
      company.rawData.scrapedAt = new Date()
      company.rawData.sources = [urlToScrape]

      await company.save()

      return NextResponse.json(
        {
          success: true,
          data: company,
          message: 'Company enriched successfully',
        },
        { status: 200 }
      )
    } catch (enrichError: any) {
      console.error('Enrichment error details:', enrichError)
      // Mark as failed to enrich
      company.status = 'new'
      await company.save()

      return NextResponse.json(
        {
          success: false,
          error: enrichError.message,
          message: 'Failed to enrich company',
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error in enrich endpoint:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/enrich?companyId=<id>
 * Check enrichment status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId')

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

    return NextResponse.json({
      success: true,
      data: {
        id: company._id,
        name: company.name,
        status: company.status,
        enrichedAt: company.lastEnrichedAt,
        hasEnrichedData: !!company.enrichedData?.summary,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
