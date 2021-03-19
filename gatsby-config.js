const postcssPresetEnv = require("postcss-preset-env")

module.exports = {
  siteMetadata: {
    title: `Estudio Pablo Gallego`,
    description: ``,
    author: `@tonicq`,
    apiurl: `https://api.estudiopablogallego.com`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-process-wire-source`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          postcssPresetEnv({
            browsers: "> 0.5%, last 2 versions, ie 11",
          }),
        ],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/, // See below to configure properly
        },
      },
    },
    {
      resolve: "gatsby-plugin-transition-link",
      options: {
        layout: require.resolve(`./src/components/layout.js`),
      },
    },
    {
      resolve: `gatsby-plugin-gdpr-cookies`,
      options: {
        googleAnalytics: {
          trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
          // Setting this parameter is optional
          anonymize: true,
        },
        facebookPixel: {
          pixelId: "YOUR_FACEBOOK_PIXEL_ID",
        },
        // Defines the environments where the tracking should be available  - default is ["production"]
        environments: ["production", "development"],
      },
    },
    // `gatsby-plugin-sitemap`,
    // `gatsby-plugin-robots-txt`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#999999`,
        theme_color: `#66666`,
        display: `minimal-ui`,
        icon: `src/images/epg-favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
