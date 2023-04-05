const tectalicOpenai = require('@tectalic/openai').default;
const config = require('dotenv').config();

async function audioTransScriptionGenerator(fileURL) {
  try {
    const res = await tectalicOpenai(process.env.OPENAI_API_KEY)
    .audioTranscriptions.create({
      file: '/Users/pieropretto/Downloads/sample-0.mp3',
      model: 'whisper-1'
    })

    console.log(`\n\n${res.data.text.trim()}`);

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
  audioTransScriptionGenerator
};