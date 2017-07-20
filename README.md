## My Mithril Notes Editor

> A note taking app, based on Mithril.

## Runtime environment setup
```bash
# Install our data server, made by the remarkable people at typicode.
yarn global add json-server
```

## App Run

```bash
# From project directory
# Start `json-server` to serve our database. It listens on port 3000.
json-server --watch data/db.json

# There's no need for a separate http server.
# It turns out that `json-server` handles the http server functionality too!
# json-server will serve files from ./public/index.html
# Our app (notes.js) will be a one-file app for a long time to come- thanks to Mithril. :o)
```

[Your notes will be available at this page.](http://127.0.0.1:3000)
