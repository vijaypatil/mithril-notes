### My Tech Notes - A Mithril based notes editor

> A notes taking app, based on Mithril.

### Runtime environment setup
```bash
# Install our data server, made by the remarkable people at typicode.
yarn global add json-server
```

### App Run

```bash
# From project directory
# Start `json-server` to serve our database. It listens on port 3000.
json-server --watch data/db.json

# There's no need for a separate http server.
# It turns out that `json-server` handles the http server functionality too!
# json-server will serve files from ./public/index.html
# Our app (notes.js) will be a one-file app for a long time to come- thanks to Mithril. :o)
```

[Your notes will be available here.](http://127.0.0.1:3000)

## App Goals

1. [ ] Used to maintain a development diary / journal.
1. [ ] Notes about different projects can be captured.
1. [ ] The notes are ordered by creation timestamp.
1. [ ] There's an exact & fuzzy search available, that can search over titles, tags & text of notes.
1. [ ] Notes have tags.
1. [ ] Tags can be used to filter Notes.
1. [ ] Tags are specified as comma separated single words.
1. [ ] Tags can have hyphens, periods, hashes or underscores.
1. [ ] A note is markdown based - via Marked.
1. [ ] A note is TeX enabled - via MathJax.
1. [ ] There are visualizations about stats for the Notes - via D3 charts.

By the time the app does all of the above, I'll have a non-trivial understanding of how to put Mithril to good use.
