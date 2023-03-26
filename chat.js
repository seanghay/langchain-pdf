import 'dotenv/config.js'
import { ChatVectorDBQAChain } from "langchain/chains"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { OpenAI } from "langchain/llms"
import { PineconeStore } from "langchain/vectorstores"
import { PineconeClient } from "@pinecone-database/pinecone"

const prompt = process.argv[2];

if (!prompt) {
  process.exit(1);
}

const pinecone = new PineconeClient();

await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const index = pinecone.Index("docs");
const embeddings = new OpenAIEmbeddings();

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index,
});

const model = new OpenAI({ modelName: "gpt-3.5-turbo" });
const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore);
const response = await chain.call({
  question: prompt,
  max_tokens: 1024, // todo: pick up a sensible value
  chat_history: [],
});

console.log(response.text)