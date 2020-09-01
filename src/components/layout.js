/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React, { useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image/withIEPolyfill"
import { useSprings, useSpring, animated as a } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import _ from 'lodash'
import Header from "./header"
import "./layout.css"
import s from "./layout.module.scss"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query myprojects{
      processwire {
        projects {
          title
          texto
          pwid
          media {
            type
            pwid
            beta_imagen_vertical
            beta_imagen_vertical_base64
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
  const projects = data.processwire.projects;
  const apiurl = data.site.siteMetadata.apiurl

  const slides = []
  projects.forEach(project => {
    project.media.forEach((mediaItem, index) => {
      const slide = {
        isFirstPage: index === 0,
        ...mediaItem,
      }
      if(index===0){
        slide.projectTitle = project.title
        slide.projectTexto = project.texto
      }
      slides.push(slide)
    })
  });


  const activeSlide = useRef(0)
	
	const [springProps, setSpringProps] = useSprings(slides.length, i => ({ x: typeof window !== 'undefined' ? i * window.innerWidth : 0, sc: 1, display: 'block' }))
	const bind = useDrag((dragProps) => {
		//onsole.log(dragProps)
		const { movement, canceled } = dragProps
		const { down, delta: [xDelta], direction: [xDir], distance, cancel } = dragProps
		if(typeof window !== 'undefined'){
			if (!down && Math.abs(movement[0]) > window.innerWidth / 12) {
        if(!canceled) cancel((activeSlide.current = _.clamp(activeSlide.current + _.clamp((movement[0])*-1, -1, 1), 0, slides.length - 1)))
      }
      if (!down && Math.abs(movement[0]) < 2){
        const x = dragProps.values[0]
        if(x>window.innerWidth*0.5){
          onClickRight()
        } else {
          onClickLeft()
        }
      }
		}
		
		setSpringProps(i => {
		  if (i < activeSlide.current - 1 || i > activeSlide.current + 1) return { display: 'none' }
		  const x = typeof window !== 'undefined' ? (i - activeSlide.current) * window.innerWidth + (down ? movement[0] : 0) : null
		  const sc = 1
		  return { x, sc, display: 'block' }
		})
	})

	// const onImageClick = i => {
	// 	activeSlide.current = i
	// 	onClipUpdate()
	// }
	// ---const onLightBoxClose = () => {
	// ---	setIsLightboxOn(false)
	// ---}
	const onClickLeft = () => {
		activeSlide.current = _.clamp(activeSlide.current - 1, 0, slides.length - 1)
		onClipUpdate()
	}
	const onClickRight = () => {
		activeSlide.current = _.clamp(activeSlide.current + 1, 0, slides.length - 1)
		onClipUpdate()
	}
	const onClipUpdate = () => {
		setSpringProps(i => {
			if (i < activeSlide.current - 1 || i > activeSlide.current + 1) return { display: 'none' }
			const x = (i - activeSlide.current) * window.innerWidth
			const sc = 1
			return { x, sc, display: 'block' }
		})
		// setIsLightboxOn(true)
	}
	// return(
	// 	<div className={s.container}>
	// 		{
	// 			galeriaimages.map((image, i) => (
	// 				<div onClick={() => onImageClick(i)} key={image.url} className={s.imageContainer}>
	// 					<Img
	// 						// fluid={image.image.childImageSharp.fluid}
	// 						sizes={{ ...image.image.childImageSharp.fluid, aspectRatio: 1 / 1 }}
	// 						alt={image.description}
	// 						loading="eager"
	// 						backgroundColor="#666666"
	// 						objectFit="cover"
	// 						objectPosition={`${image.focus.left}% ${image.focus.top}%`}
	// 						backgroundColor="white"
	// 					/>
	// 				</div>
	// 			))
	// 		}
	// 		<a.div style={lightBoxSpring} className={s.lightbox}>
	// 			<div
	// 				className={s.close}
	// 			>
	// 				<CloseButton onClickPassedEvent={onLightBoxClose} />
	// 			</div>
	// 			<div
	// 				className={s.left}
	// 				onClick={onClickLeft}>
  //               	<svg width="10" height="16" viewBox="19 0 10 20" fill="none">
	// 					<path d="M27.63 9.37L18 19" stroke="#ffffff" strokeWidth="1.5"/>
	// 					<path d="M27.62 10.62L18 1" stroke="#ffffff" strokeWidth="1.5"/>
	// 				</svg>
	// 			</div>
	// 			<div
	// 				className={s.right}
	// 				onClick={onClickRight}>
	// 				<svg width="10" height="16" viewBox="19 0 10 20" fill="none">
	// 					<path d="M27.63 9.37L18 19" stroke="#ffffff" strokeWidth="1.5"/>
	// 					<path d="M27.62 10.62L18 1" stroke="#ffffff" strokeWidth="1.5"/>
	// 				</svg>
	// 			</div>
	// 			{
	// 				springProps.map(({ x, display, sc }, i) => (
	// 					<a.div className={s.slideImage} {...bind()} key={i} style={{ display, transform: x.interpolate(x => `translate3d(${x}px,0,0)`) }}>
	// 						<div>
	// 							<Img
	// 								fluid={galeriaimages[i].image.childImageSharp.fluid}
	// 								alt={galeriaimages[i].description}
	// 								loading="eager"
	// 								backgroundColor="#666666"
	// 								objectFit="contain"
	// 								backgroundColor="white"
	// 								style={{
	// 									width: '100%',
	// 									height: '100%'
	// 								}}
	// 							/>
	// 							{
	// 								galeriaimages[i].description?
	// 								<div className={s.description}>
	// 									{galeriaimages[i].description}
	// 								</div>
	// 								:
	// 								null
	// 							}
								
	// 						</div>
	// 					</a.div>
	// 				))
	// 			}
	// 		</a.div>
			

	// 	</div>
  // )
  

 

  return (
    <>
      <div>
        <nav>
            <div className={s.galeria}>
              {/* <div
                className={s.left}
                onClick={onClickLeft}
                >
                        <svg width="10" height="16" viewBox="19 0 10 20" fill="none">
                  <path d="M27.63 9.37L18 19" stroke="#ffffff" strokeWidth="1.5"/>
                  <path d="M27.62 10.62L18 1" stroke="#ffffff" strokeWidth="1.5"/>
                </svg>
              </div> */}
              {/* <div
                className={s.right}
                onClick={onClickRight}
                >
                <svg width="10" height="16" viewBox="19 0 10 20" fill="none">
                  <path d="M27.63 9.37L18 19" stroke="#ffffff" strokeWidth="1.5"/>
                  <path d="M27.62 10.62L18 1" stroke="#ffffff" strokeWidth="1.5"/>
                </svg>
              </div> */}
              {
                springProps.map(({ x, display, sc }, i) => (
                  <a.div className={s.slideImage}
                    {...bind()}
                    key={i}
                    style={{ display, transform: x.interpolate(x => `translate3d(${x}px,0,0)`) }}
                  >
                    <div className={s.image_horizontal}>
                      <Img
                        fluid={
                          {
                            aspectRatio: 1.5,
                            base64: slides[i].beta_imagen_horizontal_base64,
                            sizes: "(max-width: 880px) 100vw, 880px",
                            src: `${apiurl}/img/${slides[i].pwid}/beta_imagen_horizontal/800/`,
                            srcSet: `${apiurl}/img/${slides[i].pwid}/beta_imagen_horizontal/220/ 220w, ${apiurl}/img/${slides[i].pwid}/beta_imagen_horizontal/440/ 440w, ${apiurl}/img/${slides[i].pwid}/beta_imagen_horizontal/880/ 880w, ${apiurl}/img/${slides[i].pwid}/beta_imagen_horizontal/980/ 980w`
                          }
                        }
                        alt={slides[i].title}
                        loading="eager"
                        backgroundColor="#666666"
                        objectFit="cover"
                        backgroundColor="white"
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                    <div className={s.image_vertical}>
                      <Img
                        fluid={
                          {
                            aspectRatio: 1.5,
                            base64: slides[i].beta_imagen_vertical_base64,
                            sizes: "(max-width: 880px) 100vw, 880px",
                            src: `${apiurl}/img/${slides[i].pwid}/beta_imagen_vertical/800/`,
                            srcSet: `${apiurl}/img/${slides[i].pwid}/beta_imagen_vertical/220/ 220w, ${apiurl}/img/${slides[i].pwid}/beta_imagen_vertical/440/ 440w, ${apiurl}/img/${slides[i].pwid}/beta_imagen_vertical/880/ 880w, ${apiurl}/img/${slides[i].pwid}/beta_imagen_vertical/980/ 980w`
                          }
                        }
                        alt={slides[i].title}
                        loading="eager"
                        backgroundColor="#666666"
                        objectFit="cover"
                        backgroundColor="white"
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                    <div className={s.text_box}>
                      {
                        slides[i].projectTitle?
                        <div className={s.projectTitle}>
                          {slides[i].projectTitle}
                        </div>
                        :
                        null
                      }
                      {
                        slides[i].projectTexto?
                        <div className={s.projectTexto}>
                          {slides[i].projectTexto}
                        </div>
                        :
                        null
                      }
                      
                    </div>
                  </a.div>
                ))
              }
            
            

          </div>
          {/* { projects.map(project=>(
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
          ))} */}
        </nav>
        <main>{children}</main>
        <footer>
        </footer>

      </div>
    </>
  )
}



export default Layout
