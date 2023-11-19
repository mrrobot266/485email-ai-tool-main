import { OPENAI_KEY } from '$env/static/private'
import { oneLine, stripIndent } from 'common-tags'
import type { RequestHandler } from './$types'
import type { CreateCompletionRequest } from 'openai'
import { error, type Config } from '@sveltejs/kit'

export const config: Config = {
	runtime: 'edge'
}


export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!OPENAI_KEY) {
			throw new Error('OPENAI_KEY env var not set')
		}

		const requestData = await request.json()

		if (!requestData) {
			throw new Error('Request data missing')
		}

		const { context } = requestData

		if (!context) {
			throw new Error('No context provided')
		}

		const prompt = stripIndent`
        ${oneLine`
		You will help me write sections of an article in markdown syntax. You will be provided with an outline for a section of an article(delimited with ###). Generate the article in markdown syntax.
        `}

        Context:"""${context.trim()}"""

        Answer:
        `


		const response = await fetch('https://api.openai.com/v1/completions', {
			headers: {
				Authorization: `Bearer ${OPENAI_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				model: 'gpt-3.5-turbo-instruct',
				prompt,
				max_tokens: 1024,
				temperature: 0.5,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
				stream: true,
			})
		})

    

		if (!response.ok) {
			const err = await response.json()
			console.error(err)
			throw new Error('Failed to create completion', err)
		}

		return new Response(response.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		})
	} catch (err) {
		console.error(err)
		throw error(500, 'An error occurred')
	}
}
