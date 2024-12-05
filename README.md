<div style="text-align: center">
    <a href="https://spotify-lyrics-viewer.nitratine.net/"><img src="./client/src/img/banner.png" alt="Spotify Lyrics Viewer Banner" style="background: white;"></a>
</div>
<p align="center">View the lyrics of the current playing Spotify song in your browser.</p>
<p align="center"><a href="https://spotify-lyrics-viewer.nitratine.net/">🌐: spotify-lyrics-viewer.nitratine.net</a></p>

## 📷 Screenshots

![Spotify Lyrics Viewer showing lyrics](https://nitratine.net/posts/spotify-lyrics-viewer/sample.jpg)
![Spotify Lyrics Viewer showing lyrics in dark mode](https://nitratine.net/posts/spotify-lyrics-viewer/sample-dark.jpg)

## 📝 Features

- **Spotify sign-in for current song identification**
- **[lrclib.net](https://lrclib.net/) lyric fetching ([GENIUS](https://genius.com/) backup)**
- **Lyrics sync with audio**
- **Dark theme**
- **Tokens stored in a session-like object**
  - Session is in a cookie due to server restrictions

## 🛠️ Setup

Currently, Node 17 and above is the only dependency.

1. Clone the repo
2. Setup the server
   - Execute `npm install` to install dependencies
   - Execute `cp .env.example .env` (or `copy` for Windows) and populate `.env`
     - `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` can be obtained by [making a new Spotify application](https://developer.spotify.com/dashboard/applications)
     - `SERVER_SESSION_KEYS` is random text used to sign & verify cookie values (use spaces to separate)
     - `GENIUS_ACCESS_TOKEN` can be obtained by [creating a new API client](https://genius.com/developers) (optional - if this is not provided, Genius will not be used as a backup to lrclib.net)
   - Execute `npm run build` to build the server
3. Setup the client
   - `cd client` to change directories to the client project
   - Execute `npm install` to install dependencies
   - Execute `cp .env.example .env` (or `copy` for Windows)
   - Execute `npm run build` to build the client (the server will host these built files)
   - Go back to the project root: `cd ..`
4. Execute `npm start` to start the server

### 🧪 Development Setup

#### Client

The client will use the `REACT_APP_API_ROOT` environment variable value to decide where to send requests. If this is not provided, the current hosted URL will be used.

The client can be started by executing `npm run start` in `./client`.

#### Server

`npm run dev` in the root can be used for development of the server; this allows for hot-reloading.

Running the client using `npm start` in `./client` and setting `REACT_APP_API_ROOT` on the client to where the server is running will allow for a development setup with hot-reloading.

> The "Debug Server" launch configuration in vs code can be used to debug the server

#### SSL

When running the server locally, HTTPS needs to be setup due to the use of Secure=true on cookies (due to SameSite="none"). The server will look for `server.cert` and `server.key` in the current working directory to use for SSL. When first setting up the server, do the following:

1. Generate `server.cert` and `server.key` by execute `openssl req -nodes -new -x509 -keyout server.key -out server.cert` in the root directory.
2. Start the server by executing `npm run dev` in the root directory.
3. Go to `https://localhost:5000/` and click "Advanced" -> "Proceed to localhost (unsafe)", this solves ERR_CERT_AUTHORITY_INVALID for development.

## ❓ Why?

I often get curious of what the lyrics of the current playing song is. I use Spotify a lot so having somewhere where I could login and it immediately provide the lyrics of the current playing song would be very helpful and save a lot of time.

Spotify has added lyrics back into their application, but if you don't have access to their app and do have access to a web-browser, this can be used to view lyrics.

## 🌐 Hosting

The backend can be deployed on any host with Node.js. The frontend can be hosted on any web server that can serve static files (like GitHub Pages).

If you are not hosting the application at the root path, for example `https://www.example.com/my-app`, some extra config needs to be set:

- The .env.example in the root of the repo outlines the environment variables for the server. You will need to set `CLIENT_DEPLOYMENT_SUBDIRECTORY`.
- The .env.example in the /client directory in the repo outlines the environment variables for the client. You will need to set `REACT_APP_BASENAME` and `PUBLIC_URL`.
