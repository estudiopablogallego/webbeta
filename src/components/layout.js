/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React, { useRef, useState, useEffect, useContext } from "react"
import { useStaticQuery, graphql } from "gatsby"
import TransitionLink from "gatsby-plugin-transition-link"

import Img from "gatsby-image/withIEPolyfill"
import { useSprings, useSpring, animated as a } from "react-spring"
import { useDrag } from "react-use-gesture"
import _ from "lodash"
import Header from "./header"
import "../styles/discreta.css"
import "./layout.css"
import s from "./layout.module.scss"
import Cursor from "./cursor"
import CursorContext from "../context/cursorContext"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query myprojects {
      processwire {
        projects {
          slug
          title
          texto
          pwid
          media {
            type
            pwid
            imagen_oscura
            imagen_vineta_horizontal
            imagen_vineta_vertical
            beta_imagen_vertical
            beta_imagen_vertical_base64
            beta_imagen_horizontal
            beta_imagen_horizontal_base64
            beta_video_horizontal
            beta_video_vertical
          }
        }
      }
      site {
        siteMetadata {
          apiurl
        }
      }
    }
  `)
  ////
  //SLIDES
  ////

  const projects = data.processwire.projects
  const apiurl = data.site.siteMetadata.apiurl
  // const imgPath = `${apiurl}/img`
  const imgPath = `https://estudiopablogallego.gumlet.net`
  const slides = []
  projects.forEach(project => {
    project.slideNumber = slides.length
    project.media.forEach((mediaItem, index) => {
      const slide = {
        isFirstPage: index === 0,
        ...mediaItem,
      }
      if (index === 0) {
        slide.projectTitle = project.title
        slide.projectTexto = project.texto
      }
      slides.push(slide)
    })
  })
  const [fondoOscuro, setFondoOscuro] = useState(slides[0].imagen_oscura)

  const activeSlide = useRef(0)

  const [springProps, setSpringProps] = useSprings(slides.length, i => ({
    x: typeof window !== "undefined" ? i * window.innerWidth : 0,
    sc: 1,
    display: "block",
  }))
  const bind = useDrag(dragProps => {
    //onsole.log(dragProps)
    const { movement, canceled } = dragProps
    const {
      down,
      delta: [xDelta],
      direction: [xDir],
      distance,
      cancel,
    } = dragProps
    if (typeof window !== "undefined") {
      if (!down && Math.abs(movement[0]) > window.innerWidth / 12) {
        if (!canceled)
          cancel(
            (activeSlide.current = _.clamp(
              activeSlide.current + _.clamp(movement[0] * -1, -1, 1),
              0,
              slides.length - 1
            ))
          )
      }
      if (!down && Math.abs(movement[0]) < 2) {
        const x = dragProps.values[0]
        if (x > window.innerWidth * 0.5) {
          onClickRight()
        } else {
          onClickLeft()
        }
      }
    }

    setSpringProps(i => {
      console.log(i)
      if (i < activeSlide.current - 1 || i > activeSlide.current + 3) {
        return { display: "none" }
      }

      const x =
        typeof window !== "undefined"
          ? (i - activeSlide.current) * window.innerWidth +
            (down ? movement[0] : 0)
          : null
      const sc = 1
      return { x, sc, display: "block" }
    })
    setFondoOscuro(slides[activeSlide.current].imagen_oscura)
    cursorContextData.setBlanco(slides[activeSlide.current].imagen_oscura)
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

  const goToSlide = n => {
    activeSlide.current = n
    setTrabajosVisibles(false)
    onClipUpdate(true)
  }

  const onClipUpdate = visibleAll => {
    setSpringProps(i => {
      if (!visibleAll) {
        if (i < activeSlide.current - 1 || i > activeSlide.current + 3)
          return { display: "none" }
      }
      const x = (i - activeSlide.current) * window.innerWidth
      const sc = 1
      return { x, sc, display: "block" }
    })
    setFondoOscuro(slides[activeSlide.current].imagen_oscura)
    cursorContextData.setBlanco(slides[activeSlide.current].imagen_oscura)
    // setIsLightboxOn(true)
  }

  const setCursorPointer = () => {}

  ////
  //CURSOR
  ////
  const cursorContextData = useContext(CursorContext)
  // const [cursorContextData, cursorContextData.setCursor] = useState('default') //default left right pointer
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [hidden, setHidden] = useState(false)

  const handleLinkHoverEvents = () => {
    document.querySelectorAll("a").forEach(el => {
      el.addEventListener("mouseover", () => setLinkHovered(true))
      el.addEventListener("mouseout", () => setLinkHovered(false))
    })
  }

  const onMouseMove = (e, cursorContextData) => {
    if (
      e.clientX >= window.innerWidth * 0.5 &&
      cursorContextData.cursor !== "right"
    ) {
      cursorContextData.setCursor("right")
    }
    if (
      e.clientX < window.innerWidth * 0.5 &&
      cursorContextData.cursor !== "left"
    ) {
      cursorContextData.setCursor("left")
    }
  }
  useEffect(() => {
    addEventListeners(cursorContextData)
    handleLinkHoverEvents()
    return () => removeEventListeners()
  }, [])

  const addEventListeners = cursorContextData => {
    document.addEventListener("mousemove", e =>
      onMouseMove(e, cursorContextData)
    )
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
  }

  const removeEventListeners = () => {
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseenter", onMouseEnter)
    document.removeEventListener("mouseleave", onMouseLeave)
    document.removeEventListener("mousedown", onMouseDown)
    document.removeEventListener("mouseup", onMouseUp)
  }

  const onMouseDown = () => {
    setClicked(true)
  }

  const onMouseUp = () => {
    setClicked(false)
  }

  const onMouseLeave = () => {
    setHidden(true)
  }

  const onMouseEnter = () => {
    setHidden(false)
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

  //TRABAJOS

  const [trabajosVisibles, setTrabajosVisibles] = useState(false)
  const [acercaVisible, setAcercaVisible] = useState(false)

  return (
    <CursorContext.Consumer>
      {cursor => {
        return (
          <>
            <div className={`${fondoOscuro ? s.fondo_oscuro : ""}`}>
              <main>{children}</main>
              <header className={s.header}>
                <h2>
                  Estudio <strong>Pablo Gallego</strong>
                </h2>
                <nav>
                  <ul>
                    <li
                      title="Trabajos"
                      onMouseEnter={setCursorPointer}
                      onClick={() => {
                        setTrabajosVisibles(!trabajosVisibles)
                      }}
                    >
                      Trabajos
                    </li>
                    <li
                      title="Info"
                      onMouseEnter={setCursorPointer}
                      onClick={() => {
                        setAcercaVisible(!acercaVisible)
                      }}
                    >
                      Info
                    </li>
                  </ul>
                </nav>
              </header>
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
                  {springProps.map(({ x, display, sc }, i) => (
                    <a.div
                      className={`${s.slideImage} ${
                        slides[i].imagen_oscura ? s.imagen_fondo_oscuro : ""
                      }`}
                      {...bind()}
                      key={i}
                      style={{
                        display,
                        transform: x.interpolate(
                          x => `translate3d(${x}px,0,0)`
                        ),
                      }}
                    >
                      {slides[i].type === "imagen" ? (
                        <div
                          className={`${s.image_horizontal} ${
                            s[
                              "image_horizontal_vineta" +
                                slides[i].imagen_vineta_horizontal
                            ]
                          }`}
                        >
                          <Img
                            fluid={{
                              aspectRatio: 1.5,
                              base64: slides[i].beta_imagen_horizontal_base64,
                              sizes: "(max-width: 880px) 100vw, 880px",
                              src: `${imgPath}/${slides[i].pwid}/beta_imagen_horizontal/800/`,
                              srcSet: `${imgPath}/${slides[i].pwid}/beta_imagen_horizontal/220/ 220w, ${imgPath}/${slides[i].pwid}/beta_imagen_horizontal/440/ 440w, ${imgPath}/${slides[i].pwid}/beta_imagen_horizontal/880/ 880w, ${imgPath}/${slides[i].pwid}/beta_imagen_horizontal/980/ 980w`,
                            }}
                            alt={slides[i].title}
                            loading="eager"
                            backgroundColor="#666666"
                            objectFit="cover"
                            backgroundColor="white"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      ) : null}
                      {slides[i].type === "imagen" ? (
                        <div
                          className={`${s.image_vertical} ${
                            s[
                              "image_vertical_vineta" +
                                slides[i].imagen_vineta_vertical
                            ]
                          }`}
                        >
                          <Img
                            fluid={{
                              aspectRatio: 1.5,
                              base64: slides[i].beta_imagen_vertical_base64,
                              sizes: "(max-width: 880px) 100vw, 880px",
                              src: `${imgPath}/${slides[i].pwid}/beta_imagen_vertical/800/`,
                              srcSet: `${imgPath}/${slides[i].pwid}/beta_imagen_vertical/220/ 220w, ${imgPath}/${slides[i].pwid}/beta_imagen_vertical/440/ 440w, ${imgPath}/${slides[i].pwid}/beta_imagen_vertical/880/ 880w, ${imgPath}/${slides[i].pwid}/beta_imagen_vertical/980/ 980w`,
                            }}
                            alt={slides[i].title}
                            loading="eager"
                            backgroundColor="#666666"
                            objectFit="cover"
                            backgroundColor="white"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      ) : null}
                      {slides[i].type === "video" ? (
                        <div
                          className={`${s.video_horizontal} ${
                            s[
                              "image_horizontal_vineta" +
                                slides[i].imagen_vineta_horizontal
                            ]
                          }`}
                        >
                          <video
                            data-object-fit="cover"
                            // autoPlay
                            loop
                            muted
                          >
                            <source
                              type="video/mp4"
                              src={`${apiurl}${slides[i].beta_video_horizontal}`}
                            />
                          </video>
                        </div>
                      ) : null}
                      {slides[i].type === "video" ? (
                        <div
                          className={`${s.video_vertical} ${
                            s[
                              "image_vertical_vineta" +
                                slides[i].imagen_vineta_vertical
                            ]
                          }`}
                        >
                          <video
                            data-object-fit="cover"
                            // autoPlay
                            loop
                            muted
                          >
                            <source
                              type="video/mp4"
                              src={`${apiurl}${slides[i].beta_video_vertical}`}
                            />
                          </video>
                        </div>
                      ) : null}
                      <div className={s.text_box}>
                        {slides[i].projectTitle ? (
                          <div className={s.projectTitle}>
                            {slides[i].projectTitle}
                          </div>
                        ) : null}
                        {slides[i].projectTexto ? (
                          <div className={s.projectTexto}>
                            {slides[i].projectTexto}
                          </div>
                        ) : null}
                      </div>
                    </a.div>
                  ))}
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
                        src: `${imgPath}/${mediaItem.pwid}/beta_imagen_horizontal/800/`,
                        srcSet: `${imgPath}/${mediaItem.pwid}/beta_imagen_horizontal/220/ 220w, ${imgPath}/${mediaItem.pwid}/beta_imagen_horizontal/440/ 440w, ${imgPath}/${mediaItem.pwid}/beta_imagen_horizontal/880/ 880w, ${imgPath}/${mediaItem.pwid}/beta_imagen_horizontal/980/ 980w`
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
              <div
                className={`${s.trabajos_container} ${
                  trabajosVisibles ? s.trabajos_visible : ""
                }`}
              >
                <div
                  className={s.trabajos_content_fondo}
                  onClick={() => {
                    setTrabajosVisibles(!trabajosVisibles)
                  }}
                />
                <div className={s.trabajos_content}>
                  <nav>
                    <ul>
                      {projects.map((project, index) => {
                        const number = (index + 1).toString().padStart(2, "0")
                        return (
                          <li key={index}>
                            <TransitionLink
                              to={`/${project.slug}`}
                              onClick={() => goToSlide(project.slideNumber)}
                            >
                              <span>{number}</span>{" "}
                              <strong>{project.title}</strong>
                            </TransitionLink>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                </div>
                <div
                  className={s.trabajos_cerrar}
                  onClick={() => {
                    setTrabajosVisibles(!trabajosVisibles)
                  }}
                />
              </div>

              <div
                className={`${s.acerca_container} ${
                  acercaVisible ? s.acerca_visible : ""
                }`}
              >
                <div
                  className={s.acerca_content_fondo}
                  onClick={() => {
                    setAcercaVisible(!acercaVisible)
                  }}
                />
                <div className={s.acerca_content}>
                  <div className={s.acerca_textos}>
                    <p className={s.acerca_destacado}>
                      Diseñamos conceptos, imágenes y narrativas capaces de
                      definir estratégicamente una marca y permitir su
                      activación fluida en los puntos de contacto relevantes:
                      sede digital, entorno físico, producto, comunicación.
                    </p>
                    <p>
                      Donec aliquet urna tempus consequat molestie. Sed non est
                      sed mauris consequat pellentesque. Aenean nulla felis,
                      egestas at varius non, dictum at tortor. Donec ut
                      sollicitudin nulla. Class aptent taciti sociosqu ad litora
                      torquent per conubia nostra, per inceptos himenaeos. Donec
                      ultrices, urna nec tristique facilisis, dolor nisl varius
                      libero, quis ornare ipsum lacus id eros. Mauris hendrerit
                      rhoncus orci vel sodales. Nulla facilisi. Etiam nunc
                      magna, commodo luctus diam eu, aliquet volutpat sem.
                      Praesent sem magna, fermentum vitae auctor vel, efficitur
                      quis est. Sed quis nunc pulvinar, pulvinar ligula
                      sollicitudin, mattis lorem. Sed et aliquet lectus. Etiam
                      mattis metus vel magna aliquet, quis rhoncus sem interdum.
                      Aliquam vehicula in est eu placerat. Nulla fermentum
                      tortor ut tempus molestie. Mauris vel congue lacus. Ut
                      lobortis sagittis semper. Vivamus sit amet sem at sapien
                      tincidunt iaculis vel id justo. Duis luctus tortor id
                      accumsan egestas. Proin sem turpis, vulputate at enim ac,
                      luctus elementum velit. Nullam finibus tempus ultricies.
                      Integer accumsan viverra pulvinar. Donec metus erat,
                      dictum et semper eget, dapibus ac sapien. Nulla fermentum
                      tortor ut tempus molestie. Mauris vel congue lacus. Ut
                      lobortis sagittis semper. Vivamus sit amet sem at sapien
                      tincidunt iaculis vel id justo.
                    </p>
                    <h6>Contacto</h6>
                    <p className={s.acerca_destacado}>
                      Si quieres conocernos ponte en contacto en nuestro{" "}
                      <a href="mailto:info@estudiopablogallego.com">email</a> o
                      pásate por nuestro{" "}
                      <a
                        href="https://goo.gl/maps/XeBBkwg1ykxEKomRA"
                        target="_blank"
                      >
                        estudio
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <div
                  className={s.acerca_cerrar}
                  onClick={() => {
                    setAcercaVisible(!acercaVisible)
                  }}
                />
              </div>
              <footer></footer>
            </div>
            <Cursor />
          </>
        )
      }}
    </CursorContext.Consumer>
  )
}

export default Layout
