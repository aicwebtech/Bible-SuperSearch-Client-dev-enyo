// Format Buttons registry

module.exports = {
    // Classic format button icons from v2
    'Classic': require('../components/FormatButtons/classic/FormatButtonsClassic'),
    // Pure HTML / CSS buttons that are readily stylable
    'Stylable': require('../components/FormatButtons/FormatButtonsHtml'),
    'StylableNarrow': require('../components/FormatButtons/FormatButtonsHtmlNarrow'),
    'StylableMinimal': require('../components/FormatButtons/FormatButtonsHtmlMinimal'),

    // None - (no buttons)
    'none': require('../components/FormatButtons/FormatButtonsNone'),
};
