var kind = require('enyo/kind');
var Signal = require('../../components/Signal');
var i18n = require('../../components/Locale/i18nComponent');

module.exports = kind({
    name: 'AudioContainer',
    enabled: true,
    bible: null,
    passage: null,
    text: null,
    loaded: false,

    components: [
        {kind: Signal, onListen: 'handleListenSignal'},
        //{content: 'HERE'},
        {name: 'Container', showing: false, classes: 'bss_audio', components: [
            {
                name: 'Audio', 
                tag: 'audio', 
                attributes: { type: 'audio/mpeg', controls: true},
            },
            {
                name: 'Loading', 
                kind: i18n,
                titleString: 'Loading, please wait', 
                showing: true, 
                classes: 'bss_audio_loading'
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
        this.fetchRequest();
    },
    fetchRequest: function() {
        var audioEl = this.$.Audio.hasNode();

        if(!audioEl) {
            return;
        }
        
        if(this.loaded) {
            audioEl.play();
            return;
        }

        // return;
        
        var self = this;
        

        var type = 'elevenlabs';
        // var type = 'murfai';
        // var type = 'test';

        var request = this.buildRequest(type);
        
        var xhr = new XMLHttpRequest();
        xhr.open('post', request.url, true);
        xhr.responseType = request.responseType; // Load the data directly as a Blob.

        for(var h in request.headers) {
            xhr.setRequestHeader(h, request.headers[h]);
        }

        xhr.onload = function() {
            if(request.returnType == 'blob') {
                audioEl.src = URL.createObjectURL(this.response);
                audioEl.play();
                self.loaded = true;
                self.$.Loading.setShowing(false);
            } else if(request.returnType == 'url') {
                var resp = JSON.parse(this.responseText);
                audioEl.src = resp.audioFile;
                audioEl.play();
                self.loaded = true;
                self.$.Loading.setShowing(false);
            }
        };

        xhr.send(JSON.stringify(request.body)); 
    },
    buildRequest: function(type) {
        var request = {
            url: null,
            returnType: 'blob',
            responseType: 'blob',
            method: 'POST',
            body: {},
            headers: {}
        };

        if(type == 'elevenlabs') {
            request.url = 'https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb';
            request.headers = { 
                'Content-Type': 'application/json',
                'xi-api-key': 'sk_9575226ba5fb3018e27a7f3ca3880cc9a1c5b6c7e6d84067'
            };
            request.body = {
                text: this.getText(),
                model_id: 'eleven_multilingual_v2', // Example voice
                output_format: 'mp3_44100_128'
            };
        } else if(type == 'murfai') {
            request.url = 'https://api.murf.ai/v1/speech/generate';
            request.returnType = 'url';
            request.responseType = 'text';
            request.headers = { 
                'Content-Type': 'application/json',
                'api-key': 'ap2_71dafa1c-31d0-41e1-8025-d8c63b3e276b'
            };  
            request.body = {
                "text": this.getText(),
                "voiceId": "en-US-natalie",
                // 'voiceId': 'en-US-charles'
            };
        } else {
            request.url = '/assets/extras/test_music.mp3';
            request.method = 'GET';
        }

        return request;

        if(this.bible == 'kjv') {
            var url = 'assets/extras/test_text.mp3';
        } else {
            var url = 'assets/extras/test_music.mp3';
        }

        var audioEl = this.$.Audio.hasNode();
        
        // murf.ad
        var murfAIKey = 'ap2_71dafa1c-31d0-41e1-8025-d8c63b3e276b';

        //sk_9575226ba5fb3018e27a7f3ca3880cc9a1c5b6c7e6d84067   // elevenlabs

        var url = 'https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb';

        const headers = {
            //'api-key': murfAIKey,
            'Content-Type': 'application/json',
            'xi-api-key': 'sk_9575226ba5fb3018e27a7f3ca3880cc9a1c5b6c7e6d84067'
            // 'Content=Security-Policy': "default-src 'self'; script-src 'self' https://api.elevenlabs.io; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.elevenlabs.io",
            // allow CORS
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            // 'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
        };

        const body = {
            text: this.getText(),
            model_id: 'eleven_multilingual_v2', // Example voice
            output_format: 'mp3_44100_128'
            // "voiceId": "en-US-natalie",
            // 'voiceId': 'en-US-charles'

        };

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
                    
                    text += this.processVerseText(this.passage.verses[this.bible][c][v].text);
                }
            }
        }

        this.text = '        ' + text.trim();

        return text;
    },
    processVerseText: function(text) {
        text = text.replace(/[‹›]/g, ''); // remove red letter markers
        text = text.replace(/[\[\]{}]/g, ''); // remove brackets (italic markers)
        text = text.replace(/\} \{/g, ''); // remove Strongs numbers
        text = text.replace(/\{[^\}]+\}/g, ''); // remove Strongs numbers
        text = text.replace('¶', ''); // remove paragraph markers
        text = text.replace(/<[^>]*>/g, ''); // remove HTML tags

        return text.trim() + ' ';
    }
});