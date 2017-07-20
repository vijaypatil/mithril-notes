## My Mithril Notes Editor

> A note taking app, based on Mithril.

## Runtime environment
```bash
# Install our data server, made by the remarkable people at typicode.
yarn global add json-server

# Install a web server, to serve some our app.
yarn gloabl add http-server
```

## App Run

```bash
# Move to our data directory
cd data

# Start `json-server` from a console to serve our datbase. It listens on port 3000.
json-server --watch db.json

# From another cosole, move back to data's parent directory
cd ..

# Start the http-server to server our app
hs .

# The app is available at, port 8080
```
[App is served in your browser at port 8080](http://127.0.0.1:8080)
