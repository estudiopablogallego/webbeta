/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const generalQuery = await graphql(
    `
      {
        processwire {
          projects {
            pwid
            title
            slug
            texto
            seo_title
            seo_description
            seo_image
          }
        }
      }
    `
  )
  // parentpage{
  //     pwid
  //     page_url
  //     title
  // }
  //onsole.log(generalQuery.data)
  const projects = generalQuery.data.processwire.projects

  const createProjectPage = project => {
    console.log("--Creando página: " + project.title)
    createPage({
      path: project.slug,
      component: path.resolve(`src/templates/project.js`),
      context: {
        ...project,
      },
    })
  }
  projects.forEach(createProjectPage)
}
