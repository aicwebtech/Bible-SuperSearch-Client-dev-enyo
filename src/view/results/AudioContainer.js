var kind = require('enyo/kind');
var Signal = require('../../components/Signal');
var Ajax = require('enyo/Ajax');

module.exports = kind({
    name: 'AudioContainer',
    enabled: true,
    bible: null,
    passage: null,
    text: null,

    components: [
        {kind: Signal, onListen: 'handleListenSignal'},
        //{content: 'HERE'},
        {name: 'Container', showing: false, components: [
            {
                name: 'Audio', 
                tag: 'audio', 
                classes: 'bss_audio',
                attributes: { src: 'http://192.168.111.8/test_music.mp3', type: 'audio/mpeg', controls: true}
            }
        ]}
    ],
    handleListenSignal: function(inSender, inEvent) {
        
        if(!this.enabled || !this.bible || !this.passage) {
            return;
        }

        // this.log('Signal', inEvent);

        if(Array.isArray(this.bible)) {
            this.bible = this.bible[0];
        }

        // this.log('Internal', this.bible, this.passage);

        if(inEvent.cva || this.passage.chapter_verse_actual) {
            if(this.bible !== inEvent.bible || this.passage.book_id != inEvent.b || 
                this.passage.chapter_verse_actual != inEvent.cva && 
                this.passage.chapter_verse != inEvent.cva && 
                this.passage.chapter_verse_actual != inEvent.cv
            ) {
                return;
            }
        } else {
            if(this.bible !== inEvent.bible || this.passage.book_id != inEvent.b || this.passage.chapter_verse != inEvent.cv) {
                return;
            }
        }

        this.log('Play audio for', this.bible, this.passage);


        var audioEl = this.$.Audio.hasNode();

        if(this.$.Container.getShowing()) {
            this.$.Container.setShowing(false);
            
            // Stop audio if playing
            if(audioEl && !audioEl.paused) {
                audioEl.pause();
            }

            return;
        }

        this.log(this.getText())

        this.$.Container.setShowing(true);

        // Set audio to start
        if(audioEl) {
            audioEl.currentTime = 0;
            // audioEl.play();
        }

        // load audio file ... 
        this.buildRequest();
    },
    buildRequest: function() {
        //sk_9575226ba5fb3018e27a7f3ca3880cc9a1c5b6c7e6d84067

        // var url = 'https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb';

        if(this.bible == 'kjv') {
            var url = 'http://ui-dev.bss.plsv/assets/extras/test_text.mp3';
        } else {
            var url = 'http://ui-dev.bss.plsv/assets/extras/test_music.mp3';
        }

        const headers = {
            // 'Content-Type': 'application/json',
            // 'xi-api-key': 'sk_9575226ba5fb3018e27a7f3ca3880cc9a1c5b6c7e6d84067'
            // 'Content=Security-Policy': "default-src 'self'; script-src 'self' https://api.elevenlabs.io; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.elevenlabs.io",
            // allow CORS
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            // 'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };

        const body = {
            text: 'In the beginning',
            model_id: 'eleven_multilingual_v2', // Example voice
            output_format: 'mp3_44100_128'
        }

        var ajax = new Ajax({
            url: url,
            // method: 'POST',
            // postBody: JSON.stringify(body),
            headers: headers,
            handleAs: 'binary'
        });


        ajax.go(); // for GET
        // ajax.go(body); // for GET
        ajax.response(this, function(inSender, inResponse) {
            this.log('Sender', inSender);
            this.log('Response', inResponse);

            var audioEl = this.$.Audio.hasNode();

            if(audioEl) {
                // Set source to new audio file
                // audioEl.src = inResponse.audio_url; // Example response field
                // audioEl.src = URL.createObjectURL(inResponse); // Example response field
                // const mediaSource = new MediaSource();
                // const Stream = new MediaStream(inResponse);

                // play audio from binary data
                // Create media stream from binary data
                const stream = new MediaStream();
                const audioTrack = new MediaStreamTrack(inResponse);
                stream.addTrack(audioTrack); 
                //




                audioEl.srcObject = stream;


                const blob = new Blob([inResponse], { type: 'audio/mpeg' });
                const url = URL.createObjectURL(blob);

                this.log('A-Blob', blob);
                this.log('A-URL', url);

                audioEl.srcObject = stream;
                // audioEl.srcObject = blob;
                audioEl.src = null;
                // audioEl.src = url;

                audioEl.currentTime = 0;
                // audioEl.play();
            }

        });

        ajax.error(this, function(inSender, inError) {
            this.log('Error', inError);
        });
    },
    getText: function() {
        if(this.text) {
            return this.text;
        }
        
        var text = '';
        var chapter = null;
        var verse = null;

        if(this.passage) {
            if(this.passage.chapter_verse_actual) {
                var cva = this.passage.chapter_verse_actual.split(':');
                chapter = cva[0];
                verse = cva[1];
            }

            this.log('Get text for', this.bible, chapter, verse);
            
            for(var c in this.passage.verse_index) {
                if(chapter && c != chapter) {
                    continue;
                }
                
                for(var vi in this.passage.verse_index[c]) {
                    var v = this.passage.verse_index[c][vi];

                    if(verse && v != verse) {
                        continue;
                    }
                    
                    text += this.passage.verses[this.bible][c][v].text + ' ';
                }
            }
        }

        this.text = text.trim();

        return text;
    }
});