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
	}
};
