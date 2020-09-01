import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Cursor from "../components/cursor"
// import Cursor from "../components/cursor"

import SEO from "../components/seo"

const IndexPage = () => (
  <>
  <Layout>
    <SEO title="Home" />
    <h1>Estudio Pablo Gallego</h1>
  </Layout>
  <Cursor />
  </>
)

export default IndexPage
