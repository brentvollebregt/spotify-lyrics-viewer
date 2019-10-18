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

### Flow
- Wait for one second over the song and poll every 5 seconds? (can increase/decrease this)
    - Also provide a refresh button

### Examples
- [TypeScript Server](https://developer.okta.com/blog/2018/11/15/node-express-typescript)
- [Express Layout](https://github.com/sequelize/express-example)

```python
import requests
r = requests.get('https://api.genius.com/search', params={'q': 'Clocks Coldplay'}, headers={'Authorization': 'Bearer XXXXXXXXXXXXXXXXXXXX'})
```
