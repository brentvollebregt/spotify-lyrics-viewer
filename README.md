# Spotify Lyrics Viewer Online
View the lyrics of the current playing Spotify song in your browser

## Plan

### Frontend
- create-react-app (TypeScript)
- Bright fluorescent colours as the background with black/white text
    - Random on each entry but configurable in settings.
    - Background colour pulse/transition option
- Album art, song name, the artist at top (option to hide this). Lyrics down the page vertically (middle).
- No need for a nav as there is only one page

### Server
- NodeJS Express TypeScript
- Host build react app from `/`
- API:
    - [Spotify Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)
    - [Genius search for lyrics](https://docs.genius.com/#search-h2)
- Database interaction: [sequelize](https://www.npmjs.com/package/sequelize)

### Hosting
[www.heroku.com](https://www.heroku.com/)

### Flow
- Wait for one second over the song and poll every 5 seconds? (can increase/decrease this)
    - Also provide a refresh button

### Examples
- [sequelize + express](https://github.com/sequelize/express-example)
- [react-express-starter](https://github.com/philnash/react-express-starter) - maybe a non-ideal layout but I will start with it

```javascript
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

> For development, use [nodemon](https://www.npmjs.com/package/nodemon)
