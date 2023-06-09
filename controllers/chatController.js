const { Configuration, OpenAIApi } = require("openai");
const User = require('../models/userModel');

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const countWords = (str) => str.trim().split(/\s+/).length;

const chatCompletion = async (req, res) => {

  const { messages, model } = req.body;

  // console.log(messages)

  const completion = await openai.createChatCompletion({
    model: model || 'gpt-3.5-turbo-16k',
    messages: [
      { 'role': 'system', 'content': 'You are blogGPT, a helpful assistant to write blog posts' },
      ...messages.map(({ role, content }) => ({ role, content }))
    ]
  });

  const totalTokens = completion.data.usage.total_tokens;
  const apiResponse = completion.data.choices[0].message.content;
  console.log('API response:', apiResponse);
  const totalWords = countWords(apiResponse);
  // console.log('Total words:', totalWords);
  // console.log('model used: ', completion.data.model)

  const user = req.user;

  // Update the user's token and word usage

  if (user) {
    await user.updateTokenUsage(totalTokens);
    await user.updateWordUsage(totalWords);
  } else {
    console.error('User not found');
  }
  const userId = user._id;
  const updatedUser = await User.findById(userId);
  console.log('Updated user:', updatedUser);


  res.json({
    completion: completion.data.choices[0].message,
    totalTokens: totalTokens,
    totalWords: totalWords,
  })

}

module.exports = { chatCompletion };