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
# The script:
./journal.sh

# The above command server our app & data with: `json-server --watch data/db.json`
# json-server serves our app & files from ./public/index.html
```

Your journal will be at this address: [http://localhost:3000](http://localhost:3000)

## App Goals

  - [ ] Used to maintain a development diary / journal.
  - [ ] Notes about different projects can be captured.
  - [ ] The notes are ordered by creation timestamp.
  - [ ] There's an exact & fuzzy search available, that can search over titles, tags & text of notes.
  - [ ] Notes have tags.
  - [ ] Tags can be used to filter Notes.
  - [ ] Tags are specified as comma separated single words.
  - [ ] Tags can have hyphens, periods, hashes or underscores.
  - [ ] A note is markdown based - via Marked.
  - [ ] A note is TeX enabled - via MathJax.
  - [ ] There are visualizations about stats for the Notes - via D3 charts.

By the time the app does all of the above, I'll have a non-trivial understanding of how to put Mithril to good use.
