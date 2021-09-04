var Style = require('enyo/Style');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'MaterialIcons',
    kind: Style,

    create: function() {
        this.inherited(arguments);
        this.renderContent();
    },

    renderContent: function() {
        var dir = this.app.get('rootDir') + '/assets/fonts';
        var c = '';

        c += '@font-face {\n';
        c += '  font-family: \'Material Icons\';\n';
        c += '  font-style: normal;\n';
        c += '  font-weight: 400;\n';
        c += '  src: ';
        // c += '    local(\'Material Icons\'),\n';
        // c += '    local(\'MaterialIcons-Regular\'),\n';        
        c += '    local(\'Material Icons Outlined\'),\n';
        c += '    local(\'MaterialIconsOutlined-Regular\'),\n';
        // c += '    url(' + dir + '/MaterialIcons-Regular.woff2) format(\'woff2\'),\n';
        // c += '    url(' + dir + '/MaterialIcons-Regular.woff) format(\'woff\'),'\n;
        // c += '    url(' + dir + '/MaterialIcons-Regular.ttf) format(\'truetype\');';        
        // c += '    url(' + dir + '/MaterialIconsOutlined-Regular.otf) format(\'opentype\'),\n';
        c += '    url(' + dir + '/MaterialIconsOutlined.woff2) format(\'woff2\');\n';
        c += '}';

        this.set('content', c);
    }
});
