import 'dotenv/config.js'
import { ChatVectorDBQAChain } from "langchain/chains"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { OpenAI } from "langchain/llms"
import { HNSWLib } from "langchain/vectorstores"

const prompt = process.argv[2];

if (!prompt) {
  process.exit(1);
}

const embeddings = new OpenAIEmbeddings();
const vectorStore = await HNSWLib.load("./output", embeddings);
const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.9 });
const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore);

const response = await chain.call({
  question: prompt,
  max_tokens: 1024,
  chat_history: [],
});

console.log(response)