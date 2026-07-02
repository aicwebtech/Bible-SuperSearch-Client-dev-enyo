module.exports = {
	ucfirst: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	ucwords: function(str) {
		var parts = str.split(' '),
			t = this;

		parts.forEach(function(item) {
			item = t.ucfrist(item);
		});

		return parts.join(' ');
	},
	// Escapes a string for safe insertion into HTML markup (text content or quoted attributes).
	escapeHtml: function(str) {
		if(str === null || typeof str == 'undefined') {
			return '';
		}

		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	},
	// Escapes a string for safe insertion into a single-quoted JavaScript string literal
	// (e.g. inside a 'javascript:' URL). Backslash is escaped first. The U+2028/U+2029 line
	// separators are also stripped, since they terminate JS string literals.
	escapeJsString: function(str) {
		if(str === null || typeof str == 'undefined') {
			return '';
		}

		return String(str)
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'")
			.replace(/\r/g, '\\r')
			.replace(/\n/g, '\\n')
			.replace(new RegExp('[' + String.fromCharCode(0x2028, 0x2029) + ']', 'g'), '');
	}
};
