const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const chatGPT = async (req, res) => {
  console.log('TEST CONTROLLER OUTSIDE TRY - Received request with messages:', JSON.stringify(req.body));

  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Missing messages in the request body.' });
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages.map(message => ({ role: message.role, content: message.content })),
    });

    const chatGPTResponse = response.data.choices[0].message.content.trim();
    res.status(200).json({ message: { role: 'chatgpt', content: chatGPTResponse } });
  } catch (error) {
    console.error('Error with ChatGPT API:', error);
    res.status(500).json({ error: 'Failed to process ChatGPT API request.' });
  }
};

module.exports = { chatGPT };