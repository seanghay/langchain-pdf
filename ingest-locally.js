import 'dotenv/config.js';
import fg from 'fast-glob';
import { PDFLoader } from 'langchain/document_loaders';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { HNSWLib } from 'langchain/vectorstores';

const embeddings = new OpenAIEmbeddings();

for await (const file of fg.stream("./datasets/**/*.pdf")) {
  const loader = new PDFLoader(file);
  const rawDocuments = await loader.loadAndSplit();
  const vectorStore = new HNSWLib(embeddings, { space: 'cosine' })
  await vectorStore.addDocuments(rawDocuments);
  await vectorStore.save('./output');
}