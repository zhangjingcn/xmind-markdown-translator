/**
 * Created by shaoyin.zj on 16/12/24.
 */
var register = require('babel-core/register');

register({
    presets: ['stage-3']
});

require('./app.js');