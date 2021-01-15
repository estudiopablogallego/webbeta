/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
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

const Layout = allProps => {
  //onsole.log(allProps)
  const { children, location } = allProps
  //onsole.log(allProps)
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
  let indexCounter = 0
  projects.forEach(project => {
    project.slideNumber = slides.length
    project.media.forEach((mediaItem, index) => {
      const slide = {
        isFirstPage: index === 0,
        index: indexCounter++,
        ...mediaItem,
      }
      //if (index === 0) {
      slide.projectSlug = project.slug
      slide.projectTitle = project.title
      slide.projectTexto = project.texto
      //}
      slides.push(slide)
    })
  })
  const [fondoOscuro, setFondoOscuro] = useState(slides[0].imagen_oscura)

  const activeSlide = useRef(-1)
  const videoHorRefs = useRef([])
  const videoVerRefs = useRef([])

  const [springProps, setSpringProps] = useSprings(slides.length, i => {
    let display = "block"
    if (i < activeSlide.current - 1 || i > activeSlide.current + 3) {
      display = "none"
    }

    const x =
      typeof window !== "undefined"
        ? (i - activeSlide.current) * window.innerWidth
        : 0
    const sc = 1
    //onsole.log("x")
    //onsole.log(x)
    return { x, sc, display: display }
  })
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
        console.log("what!")
        if (!canceled) {
          cancel(
            (activeSlide.current = _.clamp(
              activeSlide.current + _.clamp(movement[0] * -1, -1, 1),
              0,
              slides.length - 1
            ))
          )
          onClipUpdate()
        }
      }
      if (!down && Math.abs(movement[0]) < 2) {
        console.log("Moviendo!")
        const x = dragProps.values[0]
        if (x > window.innerWidth * 0.5) {
          onClickRight()
        } else {
          onClickLeft()
        }
      }
    }

    setSpringProps(i => {
      let display = "block"
      if (i < activeSlide.current - 1 || i > activeSlide.current + 3) {
        display = "none"
      }

      const x =
        typeof window !== "undefined"
          ? (i - activeSlide.current) * window.innerWidth +
            (down ? movement[0] : 0)
          : null
      const sc = 1
      //onsole.log("x")
      //onsole.log(x)
      return { x, sc, display: display }
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
    updateUrlName()
  }
  const onClickRight = () => {
    console.log("onClickRight")
    activeSlide.current = _.clamp(activeSlide.current + 1, 0, slides.length - 1)
    onClipUpdate()
    updateUrlName()
  }

  const updateUrlName = () => {
    const currentUrlProjectSlug = window.location.pathname.substring(1)
    if (currentUrlProjectSlug !== slides[activeSlide.current].projectSlug) {
      navigate(`/${slides[activeSlide.current].projectSlug}`)
    }
  }

  const goToSlide = n => {
    //onsole.log("goToSlide")
    //onsole.log(n)
    activeSlide.current = n
    if (typeof window !== "undefined") setTrabajosVisibles(false)
    if (typeof window !== "undefined") onClipUpdate(true)
  }

  const onClipUpdate = visibleAll => {
    //onsole.log("onClipUpdate")
    console.log("UPADTARIND")
    playOrStopVideos()
    setSpringProps(i => {
      if (!visibleAll) {
        if (i < activeSlide.current - 1 || i > activeSlide.current + 3)
          return { display: "none" }
      }
      const x = (i - activeSlide.current) * window.innerWidth
      const sc = 1
      //onsole.log("clipupdate x")
      //onsole.log(x)
      return { x, sc, display: "block" }
    })
    setFondoOscuro(slides[activeSlide.current].imagen_oscura)
    cursorContextData.setBlanco(slides[activeSlide.current].imagen_oscura)
    // setIsLightboxOn(true)
  }

  const setCursorPointer = modo => {
    if (cursorContextData.cursor !== modo) {
      cursorContextData.setCursor(modo)
    }
  }

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
    if (e.clientX >= window.innerWidth * 0.5) {
      setCursorPointer("right")
    }
    if (e.clientX < window.innerWidth * 0.5) {
      setCursorPointer("left")
    }
  }
  useEffect(() => {
    addEventListeners(cursorContextData)
    handleLinkHoverEvents()
    return () => removeEventListeners()
  }, [])

  const playOrStopVideos = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= window.innerHeight) {
        videoHorRefs.current.forEach((videoEl, i) => {
          if (activeSlide.current == i) {
            videoEl.play()
          } else {
            videoEl.pause()
          }
        })
      } else {
        videoVerRefs.current.forEach((videoEl, i) => {
          if (activeSlide.current == i) {
            videoEl.play()
          } else {
            videoEl.pause()
          }
        })
      }
    }
  }

  const addEventListeners = cursorContextData => {
    // document.addEventListener("mousemove", e =>
    //   onMouseMove(e, cursorContextData)
    // )
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

  //TRABAJOS

  const [trabajosVisibles, setTrabajosVisibles] = useState(false)
  const [acercaVisible, setAcercaVisible] = useState(false)

  const lanzadaPrimeraSlide = useRef(false)
  useLayoutEffect(() => {
    if (!lanzadaPrimeraSlide.current) {
      lanzadaPrimeraSlide.current = true
      //onsole.log("Lanzando la primera slide")
      //onsole.log(window.location.pathname)
      const loadedSlide = _.find(slides, {
        projectSlug: window.location.pathname.substring(1),
      })

      if (loadedSlide) {
        goToSlide(loadedSlide.index)
      } else {
        goToSlide(0)
      }
      return
    }
  })
  // // Si es SSR oculta el resto de slides
  // if (typeof window === "undefined") {
  //   onsole.log("allProps")
  //   onsole.log(allProps)
  //   const pathname = location ? location.pathname : "/_"
  //   const loadedSlide = _.find(slides, {
  //     projectSlug: pathname.substring(1),
  //   })
  //   if (loadedSlide) {
  //     goToSlide(loadedSlide.index)
  //   } else {
  //     goToSlide(0)
  //   }
  // }

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
                      onMouseEnter={() => setCursorPointer("pointer")}
                      onMouseLeave={() => setCursorPointer("default")}
                      onClick={() => {
                        setTrabajosVisibles(!trabajosVisibles)
                        cursorContextData.setBlanco(false)
                      }}
                    >
                      Trabajos
                    </li>
                    <li
                      title="Info"
                      onMouseEnter={() => setCursorPointer("pointer")}
                      onMouseLeave={() => setCursorPointer("default")}
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
                <div
                  className={s.galeria}
                  onMouseEnter={e => onMouseMove(e, cursorContextData)}
                  onMouseMove={e => onMouseMove(e, cursorContextData)}
                >
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
                            playsInline
                            loop
                            muted
                            ref={el => (videoHorRefs.current[i] = el)}
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
                            autoPlay
                            playsInline
                            loop
                            muted
                            ref={el => (videoVerRefs.current[i] = el)}
                          >
                            <source
                              type="video/mp4"
                              src={`${apiurl}${slides[i].beta_video_vertical}`}
                            />
                          </video>
                        </div>
                      ) : null}
                      {slides[i].isFirstPage ? (
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
                      ) : null}
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
                    cursorContextData.setBlanco(
                      slides[activeSlide.current].imagen_oscura
                    )
                  }}
                />
                <div className={s.trabajos_content}>
                  <nav>
                    <ul>
                      {projects.map((project, index) => {
                        const number = (index + 1).toString().padStart(2, "0")
                        const isCurrent =
                          slides[activeSlide.current] &&
                          project.slug ===
                            slides[activeSlide.current].projectSlug
                        return (
                          <li key={index}>
                            <TransitionLink
                              to={`/${project.slug}`}
                              onClick={() => goToSlide(project.slideNumber)}
                              onMouseEnter={() => setCursorPointer("pointer")}
                              onMouseMove={() => setCursorPointer("pointer")}
                              onMouseLeave={() => setCursorPointer("default")}
                              className={isCurrent ? s.activo : ""}
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
                  onMouseEnter={() => setCursorPointer("pointer")}
                  onMouseMove={() => setCursorPointer("pointer")}
                  onMouseLeave={() => setCursorPointer("default")}
                  onClick={() => {
                    setTrabajosVisibles(!trabajosVisibles)
                    cursorContextData.setBlanco(
                      slides[activeSlide.current].imagen_oscura
                    )
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
                      Conceptos, imágenes y narrativa construyen tu marca. O la
                      rompen. Somos un estudio de diseño con mentalidad
                      estratégica que ayudamos a nuestros clientes a definir su
                      ecosistema de marca y a darle vida a través del lenguaje
                      visual y verbal.
                    </p>
                    <p>
                      Desarrollamos identidades de marca. Nombramos empresas,
                      productos y servicios. Creamos interfaces claras e
                      intuitivas. Diseñamos packaging y etiquetado. Creamos
                      tipografías a medida. Mejoramos la experiencia del cliente
                      en los puntos de contacto relevantes. Creamos contenido y
                      eventos capaces de proyectar lo que somos hacia dentro y
                      hacia fuera, a la vez que involucran al público en el
                      nuevo paradigma de la comunicación.
                    </p>
                    <p>
                      Cuando todo se encuentra en un estado de cambio constante,
                      la definición de marcos conceptuales alrededor de la idea
                      de marca es lo que brinda estabilidad y permite el
                      desarrollo de contenido estratégico que genere relevancia
                      a medio y largo plazo. Para nosotros, el reto reside en el
                      diseño aplicado al pensamiento y su traducción a
                      diferentes entornos, contextos, momentos y audiencias.
                    </p>
                    <h6>Contacto</h6>
                    <p className={s.acerca_destacado}>
                      Somos flexibles cuando es posible y claros cuando es
                      necesario. Si quieres conocernos, puedes escribirnos a{" "}
                      <a href="mailto:info@estudiopablogallego.com">email</a> o
                      pasarte por nuestro{" "}
                      <a
                        href="https://goo.gl/maps/XeBBkwg1ykxEKomRA"
                        target="_blank"
                      >
                        estudio
                      </a>
                      . Creemos que será divertido.
                    </p>
                  </div>
                </div>
                <div
                  className={s.acerca_cerrar}
                  onMouseEnter={() => setCursorPointer("pointer")}
                  onMouseMove={() => setCursorPointer("pointer")}
                  onMouseLeave={() => setCursorPointer("default")}
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
