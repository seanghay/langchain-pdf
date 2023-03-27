# langchain-pdf

It reads PDF files and let you ask what those files are about.

## Environment

Make sure you've created a pinecone index called `docs` with

<img alt="image" src="https://user-images.githubusercontent.com/15277233/227839582-aa87a966-4c04-43ec-87cf-e6464928b357.png">

```sh
OPENAI_API_KEY=sk-xxxx
PINECONE_API_KEY=xxxx
PINECONE_ENVIRONMENT=xxxx
```

## Usage

Place PDFs inside `./datasets/` and run

```sh
node ingest.js
```

## Chat

```sh
node chat.js "Summarize the document with reference"
```
