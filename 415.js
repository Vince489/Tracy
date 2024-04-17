const fs = require('fs');

// load the text file
let txt = fs.readFileSync('corpus.txt', 'utf8');

// let txt = "This book is for ambitious people who want to get ahead faster. If this is the way you think and feel, you are the person for whom this book is written. The ideas contained in the pages ahead will save you years of hard work in achieving the goals that are most important to you. I have spoken more than 2000 times before audiences of as many as 23,000 people, in 24 countries. My seminars and talks have varied in length from five minutes to five days. In every case, I have focused on sharing the best ideas I could find on the particular subject with that audience at that moment. After countless talks on various themes, if I was only given five minutes to speak to you, and I could only convey one thought that would help you to be more successful, I would tell you."

let order = 6
let ngrams = {}

function setup() {
  
  for (let i = 0; i <= txt.length - order; i++) {
    let gram = txt.substring(i, i + order)

    if (!ngrams[gram]) {
      ngrams[gram] = []
    } 
    ngrams[gram].push(txt.charAt(i + order))
  }
}

// Function to generate story based on Markov model and input
function markovIt() {
  let currentGram = txt.substring(0, order)
  let result = currentGram

  for (let i = 0; i < 130; i++) {
    let possibilities = ngrams[currentGram]
    if (!possibilities) {
      break
    }
    let next = possibilities[Math.floor(Math.random() * possibilities.length)]
    result += next

    currentGram = result.substring(result.length - order, result.length)
  }
  console.log(result)
}


setup()
markovIt()



