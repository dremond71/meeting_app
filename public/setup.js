/**
 * Have to put here.
 * For some reason, cannot put it into : room.ejs nor main_vue.js.
 * And
 * in room.ejs, all external scripts must be set to defer, and
 * all internal scripts must also be set to defer.
 * 
 *    <script src="setup.js" defer></script>
 *    <script src="main_vue.js" type="module" defer></script>
 */
const socket = io('/');