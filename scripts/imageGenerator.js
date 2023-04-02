const tectalicOpenai = require('@tectalic/openai').default;
const config = require('dotenv').config();
const readline = require('readline');

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

userInterface.prompt();

userInterface.on("line", async (input) => {
  try {
    // const res = await tectalicOpenai(API_KEY)
    //   .chatCompletions.create({
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'user', content: input }]
    // })

    // console.log(`\n${res.data.choices[0].message.content.trim()}`);

    const res = await tectalicOpenai(process.env.OPENAI_API_KEY)
    .imagesGenerations.create({
      prompt: input,
      size: '256x256',
      n: 3
    })
    
    res.data.data.forEach((image) => console.log(image.url));

  } catch (err) {   
    const { status=null, statusText='' } = err?.response;
    console.error(`${status} - ${statusText}`);
  }

  userInterface.prompt();
});