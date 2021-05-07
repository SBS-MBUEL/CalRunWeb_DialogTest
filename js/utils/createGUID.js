'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createGUID;
/**
 * creates a GUID (random) seed
 * @returns GUID ID
 */
function createGUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
		    v = c == 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}