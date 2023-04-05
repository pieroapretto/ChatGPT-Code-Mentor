const tectalicOpenai = require('@tectalic/openai').default;
const config = require('dotenv').config();

async function chatCompletion(input) {
  try {
    const res = await tectalicOpenai(process.env.OPENAI_API_KEY)
    .chatCompletions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }]
    });
    console.log(`\n\n${res.data.choices[0].message.content.trim()}`);
  } catch (err) {
    if (err?.response) {
      const { status = null, statusText = '' } = err.response;
      console.error(`${status} - ${statusText}`);
    } else {
      console.error(err);
    }
  }
}

module.exports = {
  chatCompletion
};