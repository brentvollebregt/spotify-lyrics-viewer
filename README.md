<div style="text-align: center">
    <a href="https://spotify-lyrics-viewer.nitratine.net/"><img src="./client/src/img/banner.png" alt="Spotify Lyrics Viewer Banner" style="background: white;"></a>
</div>
<p align="center">View the lyrics of the current playing Spotify song in your browser.</p>
<p align="center"><a href="https://spotify-lyrics-viewer.nitratine.net/">🌐: spotify-lyrics-viewer.nitratine.net</a></p>

## 🛠️ Setup

1. Clone the repo.
2. Setup the server
   - Execute `npm install` to install dependencies
   - Execute `cp .env.example .env` (or `copy` for Windows) and populate `.env` by replacing XXXXXX's
     - `GENIUS_ACCESS_TOKEN` can be obtained by [creating a new API client](https://genius.com/developers)
     - `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` can be obtained by [making a new Spotify application](https://developer.spotify.com/dashboard/applications)
     - `SERVER_SESSION_KEYS` is random text used to sign & verify cookie values (use spaces to separate)
3. Setup the client
   - `cd client` to change directories to the client project
   - Execute `npm install` to install dependencies
   - Execute `cp .env.example .env` (or `copy` for Windows)
   - Execute `npm run build` to build the client (the server will host these built files)
   - Go back to the project root: `cd ..`
4. Execute `npm start` to start the server

### 🧪 Development Setup

#### Client

When running the client in development mode using `npm start`, the client will use the `REACT_APP_API_ROOT` environment variable value to decide where to send requests. If this is not provided, the current hosted URL will be used.

#### Server

`npm run dev` can also be used for development of the server; this allows for hot-reloading. Running the client using `npm start` and setting `REACT_APP_API_ROOT` to where the server is running will allow for a development setup with hot-reloading.

When running the server locally, HTTPS needs to be setup due to the use of Secure=true on cookies (due to SameSite="none"). The server will look for `server.cert` and `server.key` in the current working directory to use for SSL. When first setting up the server, do the following:

1. Generate `server.cert` and `server.key` by execute `openssl req -nodes -new -x509 -keyout server.key -out server.cert` in the root directory.
2. Start the server by executing `npm run dev` in the root directory.
3. Go to `https://localhost:5000/` and click "Advanced" -> "Proceed to localhost (unsafe)", this solves ERR_CERT_AUTHORITY_INVALID for development.

> `launch.json` offers the ability to connect and debug the the server when running `npm run dev`.

## Screenshot

![Spotify Lyrics Viewer showing lyrics](https://nitratine.net/posts/spotify-lyrics-viewer/sample.png)

## 📝 Features

- **Spotify authorization ([Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)) for current song identification**
- **[GENIUS](https://genius.com/) lyric fetching**
- **Tokens stored in a session-like object**
  - Session is in a cookie due to server restrictions
- **Dark theme**

## ❓ Why?

I often get curious of what the lyrics of the current playing song is. I use Spotify a lot so having somewhere where I could login and it immediately provide the lyrics of the current playing song would be very helpful and save a lot of time.
