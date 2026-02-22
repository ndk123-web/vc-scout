import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Fetch and clean website content
 */
export async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Add protocol if missing
    let fullUrl = url
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl
    }

    // Different user agents to try
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    ]

    let lastError: any = null

    for (const userAgent of userAgents) {
      try {
        const response = await axios.get(fullUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          maxRedirects: 5,
        })

        const html = response.data
        const $ = cheerio.load(html)

        // Remove script and style tags
        $('script, style, iframe, noscript').remove()

        // Extract main text content
        let text = ''

        // Priority: Try to find main content areas first
        const mainSelectors = [
          'main',
          'article',
          '[role="main"]',
          '.content',
          '#content',
          '.main',
        ]

        for (const selector of mainSelectors) {
          const element = $(selector)
          if (element.length > 0) {
            text = element.text()
            break
          }
        }

        // Fallback to body if nothing found
        if (!text) {
          text = $('body').text()
        }

        // Clean up text
        text = text
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\n+/g, '\n') // Replace multiple newlines
          .trim()
          .substring(0, 5000) // Limit to first 5000 chars (important for API costs)

        if (text && text.length > 100) {
          return text
        }
      } catch (err: any) {
        lastError = err
        continue // Try next user agent
      }
    }

    // If all user agents failed, throw the last error
    throw lastError || new Error('Failed to scrape website with any user agent')
  } catch (error: any) {
    console.error(`Error scraping ${url}:`, error.message)
    throw new Error(`Failed to scrape website: ${error.message}`)
  }
}

/**
 * Extract key information from website using Gemini
 */
export async function enrichWithGemini(
  companyName: string,
  websiteContent: string
) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable')
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

  const prompt = `You are analyzing a startup's website content to determine if it's a good investment opportunity. Extract key information about the company "${companyName}".

Website Content:
${websiteContent}

Please provide a JSON response with exactly this structure (no markdown, just raw JSON):
{
  "summary": "2-3 sentence description of what the company does",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "foundingTeam": ["Founder Name 1", "Founder Name 2"],
  "problemStatement": "The main problem the company is solving",
  "productStage": "MVP|Beta|Production",
  "explainedSignals": "Brief explanation of why this company is interesting (2-3 sentences)",
  "location": "City, Country (e.g. San Francisco, CA)",
  "industries": ["Industry1", "Industry2"],
  "stage": "Pre-Seed|Seed|Series A|Series B|Growth|Late Stage",
  "signals": {
    "momentum": {
      "value": 1-10,
      "source": "Reason for score (e.g. hiring, user growth, press)"
    },
    "marketSize": {
      "value": 1-10,
      "description": "Short description of market opportunity"
    },
    "thesisFit": {
      "score": 1-10,
      "reason": "Why it fits into a general VC thesis (team, market, product)"
    }
  }
}

Important:
- All fields must be present
- Keep descriptions concise
- Keywords should be relevant to the business
- If information is not found, use reasonable inferences based on the content
- Return ONLY valid JSON, no markdown or extra text`

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Gemini response')
    }

    const enrichedData = JSON.parse(jsonMatch[0])

    // Validate required fields
    const requiredFields = [
      'summary',
      'keywords',
      'foundingTeam',
      'problemStatement',
      'productStage',
      'explainedSignals',
      'location',
      'industries',
      'stage',
      'signals'
    ]
    for (const field of requiredFields) {
      if (!enrichedData[field]) {
        // Allow partial failure but log it
        console.warn(`Missing field in Gemini response: ${field}`)
      }
    }

    return enrichedData
  } catch (error: any) {
    console.error('Error enriching with Gemini:', error.message)
    throw new Error(`Failed to enrich with Gemini: ${error.message}`)
  }
}
