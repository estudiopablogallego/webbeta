/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image/withIEPolyfill"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query myprojects{
      processwire {
        projects {
          title
          pwid
          lang
          media {
            type
            pwid
            beta_imagen_vertical
            beta_imagen_horizontal
            beta_imagen_horizontal_base64
          }
        }
      }
      site{
        siteMetadata{
          apiurl
        }
      }
    }
  `)
  console.log(data.processwire.projects)
  const projects = data.processwire.projects;
  const apiurl = data.site.siteMetadata.apiurl
  return (
    <>
      <div>
        <nav>
          { projects.map(project=>(
            <div key={project.pwid}>
              <h1>{project.title}</h1>
              <div>
              { project.media.map(mediaItem=>(
                <div key={mediaItem.pwid}>
                  <Img
                    fluid={
                      {
                        aspectRatio: 1.5,
                        base64: mediaItem.beta_imagen_horizontal_base64,
                        sizes: "(max-width: 880px) 100vw, 880px",
                        src: `${apiurl}/img/${mediaItem.pwid}/beta_imagen_horizontal/800/`,
                        srcSet: `${apiurl}/img/${mediaItem.pwid}/beta_imagen_horizontal/220/ 220w, ${apiurl}/img/${mediaItem.pwid}/beta_imagen_horizontal/440/ 440w, ${apiurl}/img/${mediaItem.pwid}/beta_imagen_horizontal/880/ 880w, ${apiurl}/img/${mediaItem.pwid}/beta_imagen_horizontal/980/ 980w`
                      }
                    }
                  />
                </div>
              ))
              }
              </div>
            </div>
          ))}
        </nav>
        <main>{children}</main>
        <footer>
        </footer>
      </div>
    </>
  )
}



export default Layout
