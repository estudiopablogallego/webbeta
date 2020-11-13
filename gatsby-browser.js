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