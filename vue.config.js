/**
 * Date:2020/4/16
 * Desc:
 */
const pkg = require('./package');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? `/${pkg.name}/`
        : '/'
};
