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
		You love to help me write emails. Based on my writing style, tone and the information I provide, you will craft an email for me. Cut out any pre-text and just give me the email. 
        `}

        Context:"""${context.trim()}"""

        Answer:
        `

		const completionOpts: CreateCompletionRequest = {
			model: 'text-davinci-003',
			prompt,
			max_tokens: 1024,
			temperature: 0.7,
			stream: true
		}

		const response = await fetch('https://api.openai.com/v1/completions', {
			headers: {
				Authorization: `Bearer ${OPENAI_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(completionOpts)
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
