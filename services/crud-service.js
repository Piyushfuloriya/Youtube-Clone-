import {getVideos} from "../controllers/controller.js";

export const videoOperation={
    videos:[],
    search(value){
        console.log(value);
        const input=value.toLowerCase();
        const videos=this.videos.filter(video => {
            const title=video.snippet.channelTitle.toLowerCase();
            return (title.includes(input));
        });
        console.log(videos);
        getVideos(videos);
    }
}