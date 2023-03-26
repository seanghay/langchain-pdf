import { PineconeClient } from "@pinecone-database/pinecone";
import 'dotenv/config.js';
import fg from 'fast-glob';
import { Document } from 'langchain/document';
import { PDFLoader } from 'langchain/document_loaders';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';

const pinecone = new PineconeClient();

await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const embeddings = new OpenAIEmbeddings();

for await (const file of fg.stream("./datasets/**/*.pdf")) {
  const loader = new PDFLoader(file);
  const rawDocuments = await loader.loadAndSplit();
  const documents  = rawDocuments.map(doc => new Document({
    metadata: { source: doc.metadata.source },
    pageContent: doc.pageContent,
  }));
  const index = pinecone.Index("docs");
  await PineconeStore.fromDocuments(documents, embeddings, {
    pineconeIndex: index, 
  })
}