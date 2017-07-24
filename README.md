### A Journal editor built using Mithril

> The intent is to manage dev notes.

### Runtime environment setup
```bash
# Install our data server, made by the remarkable people at typicode.
yarn global add json-server
```

### App Run

```bash
# From project directory
# json-server serves our app & files from ./public/index.html
json-server --watch data/db.json
```

Your journal will be at this address: [http://localhost:3000](http://localhost:3000)

## App Goals

  - [ ] Used to maintain a development diary / journal.
  - [ ] The notes are ordered by creation timestamp.
  - [ ] Search notes on titles, tags & text.
  - [ ] Notes have tags.
  - [ ] Tags can be used to filter Notes.
  - [ ] Tags are specified as comma separated single words.
  - [ ] A note is markdown based - via Marked.
  - [ ] A note is TeX enabled - via MathJax.
  - [ ] Stats for Notes - via D3 charts.
