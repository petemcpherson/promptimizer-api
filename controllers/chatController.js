const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatCompletion = async (req, res) => {

  const { messages } = req.body;

  // console.log(messages)

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { 'role': 'system', 'content': 'You are blogGPT, a helpful assistant to write blog posts' },
      ...messages.map(({ role, content }) => ({ role, content }))
    ]
  });

  const totalTokens = completion.data.usage.total_tokens;

  res.json({
    completion: completion.data.choices[0].message,
    totalTokens: totalTokens
  })

}

module.exports = { chatCompletion };