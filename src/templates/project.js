import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
// import Cursor from "../components/cursor"

import SEO from "../components/seo"
// const imgPath = `https://estudiopablogallego.gumlet.net`
const imgPath = `http://api.estudiopablogallego.com/img`

const IndexPage = pagedata => {
  const {
    pwid,
    title,
    texto,
    seo_description,
    seo_title,
    seo_image,
  } = pagedata.pageContext
  return (
    <>
      <SEO
        title={seo_title}
        description={seo_description}
        image={`${imgPath}/${pwid}/seo_image/800/`}
      />
      <div
        style={{
          position: "absolute",
          zIndex: -5,
          maxHeight: "50vh",
          overflowY: "hidden",
        }}
      >
        <h1>{title}</h1>
        <p>{texto}</p>
        <img src={`${imgPath}/${pwid}/seo_image/800/`} />
      </div>
    </>
  )
}

export default IndexPage
