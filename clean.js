const fs = require('fs');

// read the txt file
const stories = fs.readFileSync('corpus.txt', 'utf-8');

// clean the stories by converting to lowercase, removing punctuation, and tokenize
const cleanedStories = stories
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .split(" ");

    

// save the cleaned stories to a json file
fs.writeFileSync('cleanedStories.json', JSON.stringify(cleanedStories));

