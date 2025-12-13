var kind = require('enyo/kind');
var Signal = require('../../components/Signal');
var i18n = require('../../components/Locale/i18nComponent');

module.exports = kind({
    name: 'AudioContainer',
    enabled: true,
    bible: null, // set to 'all' to respond to any Bible
    bibleAny: false,
    bibleInfo: null,
    bibleQueried: null,
    language: null,
    passage: null,
    text: null,
    loaded: false,

    components: [
        {kind: Signal, onListen: 'handleListenSignal'},
        //{content: 'HERE'},
        {name: 'Container', showing: false, classes: 'bss_audio', components: [
            // {
            //     name: 'BibleLabel'
            // },
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

        if(this.bible == 'all') {
            this.bibleAny = true;
        }

        if(this.bibleAny) {
            this.bible = inEvent.bible;
        }

        // this.log('Signal', inEvent);

        if(Array.isArray(this.bible)) {
            this.bible = this.bible[0];
        }

        

        if(!this.language) {
            var bibleInfo = this.app.statics.bibles[this.bible];

            if(bibleInfo) {
                this.bibleInfo = bibleInfo;
                this.language = bibleInfo.lang_short;
            } else {
                return this.exitNoShow();
            }
        }

        // this.log('Internal', this.bible, this.passage);

        if(inEvent.cva || this.passage.chapter_verse_actual) {
            if(this.bible !== inEvent.bible || this.passage.book_id != inEvent.b || 
                this.passage.chapter_verse_actual != inEvent.cva && 
                this.passage.chapter_verse != inEvent.cva && 
                this.passage.chapter_verse_actual != inEvent.cv
            ) {
                return this.exitNoShow();
            }
        } else {
            if(this.bible !== inEvent.bible || this.passage.book_id != inEvent.b || this.passage.chapter_verse != inEvent.cv) {
                return this.exitNoShow();
            }
        }

        var audioEl = this.$.Audio.hasNode();

        if(inEvent.claimed) {
            return this.exitNoShow(); // already claimed by another audio container (multiple instance of same Bible!)
        } else {
            inEvent.claimed = true;
        }

        if(this.bibleQueried == this.bible && this.$.Container.getShowing()) {
            // already showing, so toggle off
            return this.exitNoShow();
        }

        this.bibleQueried = this.bible;

        this.log('Listen for bible ', this.bible);

        this.$.Container.setShowing(true);

        //this.$.BibleLabel.setContent(this.bibleInfo.name + ' - ' + this.passage.book_name + ' ' + (this.passage.chapter_verse_actual || this.passage.chapter_verse));

        // Set audio to start
        if(audioEl) {
            audioEl.currentTime = 0;
        }

        var api = this.app.configs.audioBibleApi || 'biblesupersearch';

        if(api == null || api == '' || api == 'biblesupersearch') {
            this.fetchRequest();
        } else {
            this.fetchThirdPartyRequest();
        }
    },
    exitNoShow: function() {
        var audioEl = this.$.Audio.hasNode();
        
        this.$.Container.setShowing(false);

        // Stop audio if playing
        if(audioEl && !audioEl.paused) {
            audioEl.pause();
        }
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

        var self = this;
        var useBlob = true;
        var url = this.app.configs.apiUrl + '/v2/audio_check';

        var query  = '?bible=' + encodeURIComponent(this.bibleQueried);
            query += '&book=' + encodeURIComponent(this.passage.book_id) + 'B';
            query += '&chapter_verse=' + encodeURIComponent(this.passage.chapter_verse_actual || this.passage.chapter_verse);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url + query, true);
        xhr.responseType = 'text';

        xhr.onload = function() {            
            var resp = JSON.parse(this.responseText);

            console.log('BSS Audio response parsed', resp);

            if(!resp.results.success) {
                alert(resp.errors.join('\n'));
                return;
            }

            if(resp.results.has_audio) {
                var audioUrl = self.app.configs.apiUrl + '/v2/audio' + query;
                
                if(useBlob) {
                    xhrBlob = new XMLHttpRequest();
                    xhrBlob.open('GET', audioUrl, true);
                    xhrBlob.responseType = 'blob';

                    xhrBlob.onload = function() {
                        audioEl.src = URL.createObjectURL(this.response);
                        audioEl.play();
                        
                        if(!self.bibleAny) {
                            self.loaded = true;
                        }
                        
                        self.$.Loading.setShowing(false);
                    };
                    
                    xhrBlob.error = function() {
                        var resp = JSON.parse(this.responseText);
                        alert(resp.errors.join('\n'));
                    };

                    xhrBlob.send();
                } else {
                    audioEl.src = audioUrl;
                    audioEl.play();

                    if(!self.bibleAny) {
                        self.loaded = true;
                    }
                    
                    self.$.Loading.setShowing(false);
                }
            }
        };

        xhr.onerror = function() {
            var resp = JSON.parse(this.responseText);
            alert(resp.errors.join('\n'));
        }

        xhr.send(); 
    },
    // Experimental third party TTS service integration
    fetchThirdPartyRequest: function() {
        var audioEl = this.$.Audio.hasNode();

        if(!audioEl) {
            return;
        }
        
        if(this.loaded) {
            audioEl.play();
            return;
        }

        var self = this;
        
        var request = this.buildRequest(this.app.configs.audioBibleApi);

        this.log('Request', request);
        
        var xhr = new XMLHttpRequest();
        xhr.open(request.method, request.url, true);
        xhr.responseType = request.responseType; // Load the data directly as a Blob.

        for(var h in request.headers) {
            xhr.setRequestHeader(h, request.headers[h]);
        }

        xhr.onload = function() {
            if(!self.bibleAny) {
                self.loaded = true;
            }
            
            if(request.returnType == 'blob') {
                audioEl.src = URL.createObjectURL(this.response);
                audioEl.play();
                self.$.Loading.setShowing(false);
            } else if(request.returnType == 'stream') {
                // This is experimental and does NOT work yet ....

                console.log('Stream response', this.response);

                // resp = new Response(this.response.data);
                // blob = resp.blob();

                // audioEl.srcObject = this.response;
                
                audioEl.src = URL.createObjectURL(this.response);
                audioEl.play();
                self.$.Loading.setShowing(false);
            } else if(request.returnType == 'url') {
                var resp = JSON.parse(this.responseText);
                audioEl.src = resp.audioFile; // :todo make a config
                audioEl.play();
                self.$.Loading.setShowing(false);
            }
        };

        xhr.send(JSON.stringify(request.body)); 
    },
    buildRequest: function(type) {
        this.log('Build request for', type);
        
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
                'xi-api-key': this.app.configs.audioBibleApiKey
            };
            request.body = {
                text: this.getText(),
                model_id: 'eleven_multilingual_v2', // Example voice
                output_format: 'mp3_44100_128',
                language_code: this.language
            };
        
        } else if (type == 'openai') {
            request.url = 'https://api.openai.com/v1/audio/speech';
            request.headers = {
                'Content-Type': 'application/json',
                //'Transfer-Encoding': 'chunked', // for streaming?? (namual use not allowed by browser policy?)
                'Authorization': 'Bearer ' + this.app.configs.audioBibleApiKey
            };
            request.body = {   
                model: 'gpt-4o-mini-tts',
                // model: 'tts-1',
                voice: 'alloy', // or 'sophia'
                instructions: 'Text is in the language of ' + this.bibleInfo.lang,
                input: this.getText(),  
                response_format: 'wav',
            };
        } else if(type == 'murfai') {
            request.url = 'https://api.murf.ai/v1/speech/generate';
            request.returnType = 'url';
            request.responseType = 'text';
            request.headers = { 
                'Content-Type': 'application/json',
                'api-key': this.app.configs.audioBibleApiKey
            };  
            request.body = {
                "text": this.getText(),
                // "voiceId": "en-US-natalie",
                'voiceId': 'en-US-charles'
            };

        } else if(type == 'murfai_stream') {
            request.url = 'https://api.murf.ai/v1/speech/stream';
            request.returnType = 'stream';
            request.responseType = 'blob';
            request.headers = { 
                'Content-Type': 'application/json',
                'Accept': 'application/octet-stream',
                'api-key': this.app.configs.audioBibleApiKey
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
            
            for(var c in this.passage.verse_index) {
                if(chapter && c != chapter) {
                    continue;
                }
                
                for(var vi in this.passage.verse_index[c]) {
                    var v = this.passage.verse_index[c][vi];

                    if(verse && v != verse) {
                        continue;
                    }
                    
                    text += this.processVerseText(this.passage.verses[this.bibleQueried][c][v].text);
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
        text = text.replace(/\s+/g, ' '); // normalize whitespace

        return text.trim() + ' ';
    }
});