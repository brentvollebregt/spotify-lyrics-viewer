# Spotify Lyrics Viewer Online
View the lyrics of the current playing Spotify song in your browser

## Plan
- In browser
    - Bright fluorescent colours as the background with black/white text
        - Random on each entry but configurable in settings. 
    - Album art, song name, the artist at top (option to hide this). Lyrics down the page vertically (middle).
    - No need for a nav as there is only one page
- Looks like we will need a server to hide API calls
    - Can also benefit from this to use auth flows in the Spotify API that give longer access
- Wait for one second over the song and poll every 5 seconds? (can increase/decrease this)
    - Also provide a refresh button