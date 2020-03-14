import SpotifyWebApi from "spotify-web-api-js";

declare global {
  namespace SpotifyApi {
    export interface CurrentlyPlayingObject extends React.HTMLProps<Popover> {
      actions: {
        disallows: { [key: string]: boolean };
      };
      context: SpotifyApi.ContextObject | null;
      currently_playing_type: "track" | "ad";
      is_playing: boolean;
      item: SpotifyApi.TrackObjectFull | null;
      progress_ms: number | null;
      timestamp: number;
    }
  }
}
