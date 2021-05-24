module.exports = {
    bool: function(data, key) {
        if(typeof data[key] == 'undefined') {
            data[key] = false;
        }
        else if(data[key]) {
            data[key] = (data[key] == '0' || data['key'] == 'false') ? false : true;
        }
        else {
            data[key] = false;
        }

        return data[key];
    }
}