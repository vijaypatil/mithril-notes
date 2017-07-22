/**
 * In each note record, set the .created field to the YYYY-MM-DDD HH:MM:SS date string.
 * All ids are converted to GUIDs.
 * It reads the current posts databas, as raw JS code.
 */

const posts = require('./db.json')
posts.notes.forEach(function(post) {
  post.id = guid()
  post.created = new Date().toLocaleString()
});
// Write out the posts with the new .created field.
console.log(JSON.stringify(posts, 0, 2))


/**
 * Generates a GUID string.
 * @returns {String} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
function guid() {
  function _p8(s) {
      var p = (Math.random().toString(16)+"000000000").substr(2,8);
      return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}
