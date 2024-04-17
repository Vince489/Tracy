const fs = require('fs');

// Read the text corpus from a file
const corpus = fs.readFileSync('corpus.txt', 'utf8');

// Tokenization
const text = corpus;

// Function to create a sentence list from a text document
function createSentenceList(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);

  return sentences;
}

const sentenceList = createSentenceList(text); 

fs.writeFileSync('sentenceList.txt', sentenceList.join('\n'));

class DocumentVectorizer {
  constructor(documents) {
    // Check if documents is an array
    if (!Array.isArray(documents)) {
      throw new Error('Documents must be an array');
    }

    // Check if all elements of documents are strings
    if (!documents.every(doc => typeof doc === 'string')) {
      throw new Error('All elements of documents must be strings');
    }
    this.documents = documents;
    this.vocabulary = {};
    this.vectors = [];

    this.tokenize();
    this.convertToVectors();
  }

  tokenize() {
    this.documents.forEach(doc => {
      const words = this._tokenize(doc);
      words.forEach(word => {
        if (!this.vocabulary[word]) {
          this.vocabulary[word] = Object.keys(this.vocabulary).length;
        }
      });
    });
  }

  convertToVectors() {
    this.documents.forEach(doc => {
      const words = this._tokenize(doc);
      const vector = new Map();
      words.forEach(word => {
        const index = this.vocabulary[word];
        vector.set(index, (vector.get(index) || 0) + 1);
      });
      this.vectors.push(vector);
    });
  }

  dotProduct(vector1, vector2) {
    if (!(vector1 instanceof Map) || !(vector2 instanceof Map)) {
      throw new Error('Vectors must be instances of Map');
    }
    let dot = 0;
    vector1.forEach((value, key) => {
      dot += value * (vector2.get(key) || 0);
    });
    return dot;
  }

  magnitude(vector) {
    if (!(vector instanceof Map)) {
      throw new Error('Vector must be an instance of Map');
    }
    return Math.sqrt(Array.from(vector.values()).reduce((acc, val) => acc + val ** 2, 0));
  }

  cosineSimilarity(vector1, vector2) {
    const dot = this.dotProduct(vector1, vector2);
    const mag1 = this.magnitude(vector1);
    const mag2 = this.magnitude(vector2);
    if (mag1 === 0 || mag2 === 0) {
      return 0;
    }
    return dot / (mag1 * mag2);
  }

  calculateSimilarity() {
    for (let i = 0; i < this.vectors.length; i++) {
      for (let j = i + 1; j < this.vectors.length; j++) {
        const similarity = this.cosineSimilarity(this.vectors[i], this.vectors[j]);
        // console.log(`Cosine similarity between document ${i + 1} and document ${j + 1}:`, similarity);
      }
    }
  }

  _tokenize(text) {
    return text.toLowerCase().split(/[^\w]+/).filter(Boolean);
  }
}

class CountVectorizer {
  constructor() {
    this.vocabulary = [];
  }

  fit_transform(documents) {
    this.vocabulary = Array.from(new Set(documents.flatMap(sentence => this.tokenize(sentence))));
    // Ensure that the output is an array of documents represented as maps
    return documents.map(doc => new Map(this.tokenize(doc).map(word => [word, 1])));
  }

  tokenize(document) {
    const tokens = document.toLowerCase().match(/\b\w+\b/g) || [];
    return tokens;
  }
}

function botResponse(userInput) {
  userInput = userInput.toLowerCase();
  // Append the user input to the sentence list
  sentenceList.push(userInput);
  let botResponse = '';

  // Create count matrix vectorizer
  const cm = new CountVectorizer().fit_transform(sentenceList);

  // Create an instance of DocumentVectorizer
  const vectorizer = new DocumentVectorizer(sentenceList);

  // Use the vectorizer to calculate cosine similarity for each pair of documents
  const similarityScores = cm.map(doc => vectorizer.cosineSimilarity(cm[cm.length - 1], doc));

  // Find the indices of the first three sentences with non-zero similarity scores
  const similarIndices = [];
  for (let i = 0; i < similarityScores.length; i++) {
    if (similarityScores[i] > 0) {
      similarIndices.push(i);
      if (similarIndices.length === 2) {
        break;
      }
    }
  }

  // Get the corresponding sentences for the similar indices
  const similarSentences = similarIndices.map(index => sentenceList[index + 1]);

  // Combine the similar sentences into a single response
  botResponse = similarSentences.join('\n');

  // Check if no relevant response is found or the bot response is empty
  if (botResponse.trim() === '') {
      botResponse = "I am sorry! I don't understand you";
  }

  // Remove the user input from the sentence list
  sentenceList.pop();

  return botResponse.trim(); // Trim the response to remove leading and trailing spaces
}




// Example usage
// User input
const userInput = "Brian";

// Get bot's response
const response = botResponse(userInput);

console.log("User Input:", userInput); // Outputs the bot's response
console.log(response); // Outputs the bot's response

