/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from "react"

import { CursorProvider } from "./src/context/cursorContext"

export const wrapRootElement = ({ element }) => (
  <CursorProvider>{element}</CursorProvider>
)

function is_touch_device() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
      return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || (window.DocumentTouch)) {
      return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

if (is_touch_device()) {
  document.body.classList.add('touch-device')
} else {
  document.body.classList.add('no-touch-device')
}