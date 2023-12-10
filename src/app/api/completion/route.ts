import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

export async function POST(req:Request) {
    const { prompt } = await req.json()

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo', 
        messages: [
            {
                role: 'system',
                content: 'you are a helpful AI embedded within a notes app that is tasked to autocomplete sentences that add insightful and meaningful information to whatever the user is providing.'
            }, 
            {
                role: 'user', 
                content: `I am writing a piece of text in a notes text editor. Help me complete my train of thought here ##${prompt}##. Make sure the tone of the text is consistent with the rest of the text and keep the response short and sweet`
            }
        ],
        stream: true
    })
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
}