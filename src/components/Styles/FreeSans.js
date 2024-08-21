var Style = require('enyo/Style');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'FreeSans',
    kind: Style,

    create: function() {
        this.inherited(arguments);
        this.renderContent();
    },

    renderContent: function() {
        var dir = this.app.get('rootDir') + '/assets/fonts';
        var c = '';

        c += '@font-face {\n';
        c += '  font-family: \'Free Sans\';\n';
        c += '  font-style: normal;\n';
        c += '  font-weight: 400;\n';
        c += '  src: ';
        // c += '    local(\'Material Icons\'),\n';
        // c += '    local(\'MaterialIcons-Regular\'),\n';        
        c += '    local(\'FreeSans\'),\n';
        c += '    local(\'Free Sans\'),\n';
        // c += '    local(\'MaterialIconsOutlined-Regular\'),\n';
        c += '    url(\'' + dir + '/FreeSans.woff\') format(\'woff\');\n';
        c += '}';

        this.set('content', c);
    }
});
