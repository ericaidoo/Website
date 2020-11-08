
/* main.js */

window.addEventListener('DOMContentLoaded', event => {
	console.log('DOMContentLoaded')
  document.querySelector('aside').hidden =false
  window.setTimeout( () => {
    document.querySelector('aside').hidden = true
  }, delay)
})
