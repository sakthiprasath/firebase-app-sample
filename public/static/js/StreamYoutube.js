

export default class StreamYoutube{
    cache_elems(){
        let self = this;
        self.video_link =  $('#youtube-video-link');
        self.stream_button = $('#stream-youtube-video');
    }

    get_youtube_embed_iframe(link){
        if (link.indexOf('youtu.be') > -1){
            let q1 = link.split('youtu.be');
            let q2 = q1[1].split('?');
            if(q2.length == 2)
                return q2[0]
            return q1[1];
        }
        else if(link.indexOf('<iframe') > -1){
            return get_youtube_embed_iframe($(link).attr('src'));
        }
        else if(link.indexOf('embed') > -1){
            let q1 = link.split('embed');
            return q1[1]
        }
        else if(link.indexOf('&') > -1){
                    let link_contents = link.split('&');
                    let watch_splits = link_contents[0].split('watch');
                    let actual_link = watch_splits[1].split('=')[1];
                    return actual_link
        }
    }

    CallingYoutubeShortcuts(player) {
        let q1 = document.getElementById("quick-file-editor");
        $(q1).on("keydown", function(e) {
            if (e.ctrlKey == false) return;
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 77:
                    {
                        // Mute / Unmute
                        if (player.isMuted()) {
                            player.unMute();
                        } else {
                            player.mute();
                        }
                        break;
                    }
                case 75:
                case 32:
                    {
                        // play / pause
                        if (player.getPlayerState() === 1) {
                            player.pauseVideo();
                        } else if (player.getPlayerState() === 2) {
                            player.playVideo();
                        }
                    }
                case 39:
                    {
                        //forward
                        player.seekTo(player.getCurrentTime() + 5);
                        break;
                    }
                case 37:
                    {
                        //backward
                        player.seekTo(player.getCurrentTime() - 5);
                        break;
                    }
                case 38:
                    {
                        // volume Up
                        if (player.getVolume() >= 95) {
                            player.setVolume(100);
                        } else {
                            player.setVolume(player.getVolume() + 5);
                        }
                        break;
                    }

                case 40:
                    {
                        // volume Down
                        if (player.getVolume() <= 5) {
                            player.setVolume(0);
                        } else {
                            player.setVolume(player.getVolume() - 5);
                        }
                        break;
                    }

            }
        });
    }

    loadVideo(video_code) {
        let self = this;
        let player = Object;
        window.YT.ready(function() {
            player = new window.YT.Player("video-stream-in-file-factory", {
                height: "390",
                width: "640",
                videoId: video_code,
                events: {
                    onReady: onPlayerReady
                }
            });
        });

        function onPlayerReady(event) {
            event.target.playVideo();
            self.CallingYoutubeShortcuts(player);
        }
    }

    initializa_youtube_api(){
        let self = this;
        $.getScript("https://www.youtube.com/iframe_api", function() {
            self.loadVideo();
        });

    }

    events(){
        let self = this;
        let event_map ={
            stream_event : function(){
                self.stream_button.on('click', function(){
                    let video_code = self.get_youtube_embed_iframe(self.video_link.val());
                    self.loadVideo(video_code);
                });
            }
        }
        /* initializing eventlistners by calling above event_map in a loop*/
        for (let key in event_map) {
          event_map[key]();
        }
    }

    init(tsp, to_return_Values){
        tsp.StreamYoutube = this;
        this.tsp = tsp;
        this.event_map = {};
        this.cache_elems();
        this.initializa_youtube_api();
        this.events();
        return $.Deferred().resolve(tsp, to_return_Values);
    }

}
