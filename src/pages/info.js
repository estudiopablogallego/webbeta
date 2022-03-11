import React from "react"
import { useStaticQuery, graphql } from "gatsby"

// import Layout from "../components/layout"
// import Cursor from "../components/cursor"

import SEO from "../components/seo"

const InfoPage = () => {
  const data = useStaticQuery(graphql`
    query aaaacercaquery {
      processwire {
        general {
          seo_description
          seo_image
          seo_title
        }
      }
    }
  `)
  const { seo_title, seo_description, seo_image } = data.processwire.general
  return (
    <>
      <SEO title={seo_title} description={seo_description} image={seo_image} />
    </>
  )
}

export default InfoPage
