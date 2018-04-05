'use strict';

module.exports.required = input => Boolean(input);

module.exports.newAuthorMessage = input => (input ? 'New author' : 'Author');
