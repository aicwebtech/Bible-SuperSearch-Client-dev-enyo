var kind = require('enyo/kind');
var Signal = require('../../components/Signal');

module.exports = kind({
    name: 'AudioContainer',
    enabled: true,
    bible: null,
    passage: null,

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

        this.log('Signal', inEvent);

        if(Array.isArray(this.bible)) {
            this.bible = this.bible[0];
        }

        this.log('Internal', this.bible, this.passage);

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
    },
    getText: function() {
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

        return text;
    }
});