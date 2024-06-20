export default class UrlValidator {
    static isValidHttpUrl(string: string): boolean {
      try {
        const newUrl = new URL(string);
        return newUrl.protocol === "http:" || newUrl.protocol === "https:";
      } catch (err) {
        return false;
      }
    }
  
    static isValidYoutubeUrl(url: URL): boolean {
      const validHosts = ["www.youtube.com", "youtu.be", "music.youtube.com"];
      return validHosts.includes(url.hostname);
    }

    static isPlaylistUrl(url: URL): boolean {
        // Every playlist has a list parameter
        if (!url.searchParams.has("list"))
            return false;

        // If there is a list parameter and the host is not music.youtube.com,
        // it should be treated as a playlist
        if (url.hostname !== "music.youtube.com")
            return true;
        
        // If the host is music.youtube.com, the pathname should start with /playlist
        // We ignore the list parameter in this case (ignoring possible autoplay lists)
        return url.pathname.startsWith("/playlist");
    }
}