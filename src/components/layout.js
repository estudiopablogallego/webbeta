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

import { useWindowSize } from "./helpers/useWindowSize"

import Img from "gatsby-image/withIEPolyfill"
import { useSprings, animated as a } from "react-spring"
import { useDrag } from "react-use-gesture"
import _ from "lodash"
import "../styles/discreta.css"
import "./layout.css"
import * as s from "./layout.module.scss"
import Cursor from "./cursor"
import CursorContext from "../context/cursorContext"
import forEach from "lodash/forEach"

if (typeof window !== "undefined") {
  window.addEventListener(
    "touchstart",
    function onFirstHover() {
      window.USER_IS_TOUCHING = true
      window.removeEventListener("touchstart", onFirstHover, false)
    },
    false
  )
}

const Layout = allProps => {
  if (typeof document === "object") {
    //Para que no se escale en safari ios 10+ scale fix
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault()
      document.body.style.zoom = 0.99
    })

    document.addEventListener("gesturechange", function (e) {
      e.preventDefault()

      document.body.style.zoom = 0.99
    })
    document.addEventListener("gestureend", function (e) {
      e.preventDefault()
      document.body.style.zoom = 1
    })
  }

  const { children, location } = allProps
  const data = useStaticQuery(graphql`
    query myprojects {
      processwire {
        projects {
          slug
          title
          titleinpage
          texto
          pwid
          media {
            type
            pwid
            imagen_oscura
            imagen_vineta_horizontal
            imagen_vineta_horizontal_opacidad
            imagen_vineta_vertical
            imagen_vineta_vertical_opacidad
            beta_imagen_vertical
            beta_imagen_vertical_base64
            beta_imagen_horizontal
            beta_imagen_horizontal_base64
            beta_imagen_horizontal_2000
            beta_imagen_horizontal_1200
            beta_imagen_horizontal_220
            beta_imagen_horizontal_440
            beta_imagen_horizontal_880
            beta_imagen_horizontal_980

            beta_imagen_vertical_800
            beta_imagen_vertical_220
            beta_imagen_vertical_440
            beta_imagen_vertical_880
            beta_imagen_vertical_1200
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
      fotosjuan: allFile(
        filter: { relativeDirectory: { eq: "equipo/juan" } }
        sort: { fields: relativePath }
      ) {
        nodes {
          relativePath
          childImageSharp {
            fluid(maxWidth: 496, quality: 60) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
      fotosbreell: allFile(
        filter: { relativeDirectory: { eq: "equipo/breell" } }
        sort: { fields: relativePath }
      ) {
        nodes {
          relativePath
          childImageSharp {
            fluid(maxWidth: 496, quality: 60) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
      fotospablo: allFile(
        filter: { relativeDirectory: { eq: "equipo/pablo" } }
        sort: { fields: relativePath }
      ) {
        nodes {
          relativePath
          childImageSharp {
            fluid(maxWidth: 496, quality: 60) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
      fotosjaime: allFile(
        filter: { relativeDirectory: { eq: "equipo/jaime" } }
        sort: { fields: relativePath }
      ) {
        nodes {
          relativePath
          childImageSharp {
            fluid(maxWidth: 496, quality: 60) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  `)

  const windowSize = useWindowSize()
  useEffect(() => onClipUpdate(), [windowSize])
  //onsole.log(windowSize)
  //SLIDES
  ////

  const projects = data.processwire.projects
  const apiurl = data.site.siteMetadata.apiurl
  // const imgPath = `${apiurl}/img`
  // const imgPath = `https://estudiopablogallego.gumlet.net`
  const imgPath = `https://api.estudiopablogallego.com/img`
  const slides = []
  let indexCounter = 0
  forEach(projects, project => {
    project.slideNumber = slides.length
    forEach(project.media, (mediaItem, index) => {
      const slide = {
        isFirstPage: index === 0,
        index: indexCounter++,
        ...mediaItem,
      }
      //if (index === 0) {
      slide.projectSlug = project.slug
      slide.projectTitle = project.titleinpage
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
      typeof window !== "undefined" ? (i - activeSlide.current) * windowSize : 0
    const sc = 1
    //onsole.log("x")
    //onsole.log(x)
    return {
      x,
      sc,
      display: display,
      config: { mass: 3, tension: 300, friction: 100 },
    }
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
      if (!down && Math.abs(movement[0]) > windowSize / 12) {
        //onsole.log("what!")
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
        //onsole.log("Moviendo!")
        const x = dragProps.values[0]
        if (x > windowSize * 0.5) {
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
          ? (i - activeSlide.current) * windowSize + (down ? movement[0] : 0)
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
    if (activeSlide.current !== 0) {
      setCursorPointer("left")
    } else {
      setCursorPointer("default")
    }
    onClipUpdate()
    updateUrlName()
  }
  const onClickRight = () => {
    //onsole.log("onClickRight")
    activeSlide.current = _.clamp(activeSlide.current + 1, 0, slides.length - 1)
    if (activeSlide.current + 1 < slides.length) {
      setCursorPointer("right")
    } else {
      setCursorPointer("default")
    }
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
    //onsole.log("UPADTARIND")
    playOrStopVideos()
    setSpringProps(i => {
      if (!visibleAll) {
        if (i < activeSlide.current - 1 || i > activeSlide.current + 3)
          return { display: "none" }
      }
      const x = (i - activeSlide.current) * windowSize
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
  const [hidden, setHidden] = useState(true)

  const handleLinkHoverEvents = () => {
    forEach(document.querySelectorAll("a"), el => {
      el.addEventListener("mouseover", () => setLinkHovered(true))
      el.addEventListener("mouseout", () => setLinkHovered(false))
    })
  }

  const onMouseMove = (e, cursorContextData) => {
    if (e.clientX >= windowSize * 0.5) {
      if (activeSlide.current + 1 < slides.length) {
        setCursorPointer("right")
      } else {
        setCursorPointer("default")
      }
    }
    if (e.clientX < windowSize * 0.5) {
      if (activeSlide.current !== 0) {
        setCursorPointer("left")
      } else {
        setCursorPointer("default")
      }
    }
  }
  useEffect(() => {
    addEventListeners(cursorContextData)
    handleLinkHoverEvents()
    return () => removeEventListeners()
  }, [])

  const playOrStopVideos = () => {
    if (typeof window !== "undefined") {
      if (windowSize >= window.innerHeight) {
        videoHorRefs.current.forEach((videoEl, i) => {
          if (activeSlide.current == i) {
            videoEl.play()
          } else {
            videoEl.pause()
          }
        })
      } else {
        videoVerRefs.current.forEach((videoEl, i) => {
          //onsole.log(videoEl.pause)
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
    // document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseover", onMouseEnter)
    // document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mouseout", onMouseLeave)
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
  }

  const removeEventListeners = () => {
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseover", onMouseEnter)
    // document.removeEventListener("mouseenter", onMouseEnter)
    // document.removeEventListener("mouseleave", onMouseLeave)
    document.removeEventListener("mouseout", onMouseLeave)
    document.removeEventListener("mousedown", onMouseDown)
    document.removeEventListener("mouseup", onMouseUp)
  }

  const onMouseDown = () => {
    if (!window.USER_IS_TOUCHING) {
      setClicked(true)
    }
  }

  const onMouseUp = () => {
    if (!window.USER_IS_TOUCHING) {
      setClicked(false)
    }
  }

  const onMouseLeave = () => {
    if (!window.USER_IS_TOUCHING) {
      setHidden(true)
    }
  }

  const onMouseEnter = () => {
    if (!window.USER_IS_TOUCHING) {
      setHidden(false)
    }
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
        if (
          window.location.pathname.substring(1) === "info" ||
          window.location.pathname.substring(1) === "info/"
        ) {
          onMostrarAcerca()
        }
      }
      return
    }
  })

  const [acercaTime, setAcercaTime] = useState([11, 0])

  const onMostrarAcerca = () => {
    setAcercaVisible(!acercaVisible)
    cursorContextData.setBlanco(false)
    const d = new Date()
    const hora = d.getHours()
    const minutos = d.getMinutes()
    setAcercaTime([hora, minutos])
    navigate(`/info`)
  }
  const onOcultaAcerca = () => {
    setAcercaVisible(false)
    navigate(`/${slides[activeSlide.current].projectSlug}`)
  }
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

  //OnResize

  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1024

  const Persona = ({ nombre, labor, fotos }) => (
    <li>
      {fotos.nodes.map((foto, i) => {
        return (
          <Img
            className={i === acercaTime[0] ? s.active : ""}
            key={i}
            fluid={foto.childImageSharp.fluid}
            alt={i === acercaTime[0] ? nombre : "---"}
          />
        )
      })}
      <span>
        {("0" + acercaTime[0]).slice(-2)}:{("0" + acercaTime[1]).slice(-2)}
      </span>
      <strong>{nombre}</strong>
      <p>{labor}</p>
    </li>
  )

  return (
    <CursorContext.Consumer>
      {cursor => {
        return (
          <>
            <div className={`${fondoOscuro ? s.fondo_oscuro : ""}`}>
              <main>{children}</main>
              <header className={s.header}>
                <TransitionLink
                  to="/"
                  onClick={() => {
                    goToSlide(0)
                    cursorContextData.setBlanco(
                      slides[activeSlide.current].imagen_oscura
                    )
                  }}
                  onMouseEnter={() => {
                    if (activeSlide.current != 0) {
                      setCursorPointer("pointer")
                    }
                  }}
                  onMouseLeave={() => setCursorPointer("default")}
                >
                  <h2>
                    Estudio <strong>Pablo Gallego</strong>
                  </h2>
                </TransitionLink>

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
                        onMostrarAcerca()
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
                          style={{
                            "--alpha": slides[i]
                              .imagen_vineta_horizontal_opacidad
                              ? slides[i].imagen_vineta_horizontal_opacidad *
                                0.01
                              : 0.35,
                          }}
                        >
                          <Img
                            fluid={{
                              aspectRatio: 1.5,
                              base64: slides[i].beta_imagen_horizontal_base64,
                              sizes: "(max-width: 1200px) 100vw, 1200px",
                              src: slides[i].beta_imagen_horizontal_1200,
                              srcSet: `${slides[i].beta_imagen_horizontal_220} 220w, ${slides[i].beta_imagen_horizontal_440} 440w, ${slides[i].beta_imagen_horizontal_880} 880w, ${slides[i].beta_imagen_horizontal_980} 980w, ${slides[i].beta_imagen_horizontal_1200} 1200w, ${slides[i].beta_imagen_horizontal_2000} 2000w`,
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
                              src: slides[i].beta_imagen_vertical_800,
                              srcSet: `${slides[i].beta_imagen_vertical_220} 220w, ${slides[i].beta_imagen_vertical_440} 440w, ${slides[i].beta_imagen_vertical_880} 880w, ${slides[i].beta_imagen_vertical_1200} 1200w`,
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
                            <a.div
                              className={s.projectTitle}
                              style={{
                                transform: x.interpolate(
                                  x => `translate3d(${x * 0.3}px,0,0)`
                                ),
                                opacity: x.interpolate(
                                  x => 1.5 - x / (windowWidth * 0.35)
                                ),
                              }}
                            >
                              {slides[i].projectTitle}
                            </a.div>
                          ) : null}
                          {slides[i].projectTexto ? (
                            <a.div
                              className={s.projectTexto}
                              style={{
                                transform: x.interpolate(
                                  x => `translate3d(${x * 0.4}px,0,0)`
                                ),
                                opacity: x.interpolate(
                                  x => 1 - x / (windowWidth * 0.35)
                                ),
                              }}
                            >
                              {slides[i].projectTexto}
                            </a.div>
                          ) : null}
                        </div>
                      ) : null}
                    </a.div>
                  ))}
                </div>
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
                  <TransitionLink
                    to="/"
                    onClick={() => {
                      goToSlide(0)
                      setTrabajosVisibles(!trabajosVisibles)
                      cursorContextData.setBlanco(
                        slides[activeSlide.current].imagen_oscura
                      )
                    }}
                    className={s.trabajos_logo}
                  >
                    Estudio <strong>Pablo Gallego</strong>
                  </TransitionLink>
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
                    onOcultaAcerca()
                    // setAcercaVisible(!acercaVisible)
                    cursorContextData.setBlanco(
                      slides[activeSlide.current].imagen_oscura
                    )
                  }}
                />
                <div className={s.acerca_content}>
                  <TransitionLink
                    to="/"
                    onClick={() => {
                      goToSlide(0)
                      // setAcercaVisible(!acercaVisible)
                      onOcultaAcerca()
                      cursorContextData.setBlanco(
                        slides[activeSlide.current].imagen_oscura
                      )
                    }}
                    className={s.acerca_logo}
                  >
                    Estudio <strong>Pablo Gallego</strong>
                  </TransitionLink>
                  <div className={s.acerca_textos}>
                    {/* 👇 A partir de aquí se puede tocar 👇 */}

                    <p className={s.acerca_destacado}>
                      <strong>
                        Palabras, imágenes y código construyen tu marca - o la
                        rompen.
                      </strong>{" "}
                      Somos un estudio de diseño con mentalidad estratégica que
                      ayudamos a nuestros clientes a definir su ecosistema de
                      marca y a desarrollar su tratamiento narrativo y visual
                      para alcanzar a sus diferentes audiencias en cualquier
                      momento y lugar.
                    </p>
                    <p>
                      <strong>Ecosistema de marca.</strong> Definimos
                      identidades de marca y construimos plataformas, guías y
                      pautas de uso. Nombramos empresas, productos y servicios.
                      Articulamos narrativas de marca y definimos su voz.
                      Establecemos un leguaje visual coherente. Creamos
                      tipografías a medida. Ordenamos tu portfolio de marcas.
                    </p>

                    <p>
                      <strong>Activación fluida.</strong> Creamos webs y
                      productos digitales claros e intuitivos. Diseñamos y
                      producimos eventos y contenido capaces de proyectar
                      identidad de marca a la vez que involucran a su público.
                      Mejoramos la experiencia de marca en sus puntos de
                      contacto relevantes. Y diseñamos y escribimos todo, desde
                      packaging y etiquetado a exposiciones, espacios,
                      señalética, campañas, productos audiovisuales y
                      editoriales.
                    </p>
                    <p>
                      <strong>Gestionar el olvido.</strong> En un momento en el
                      que la atención es el más escaso de los recursos, las
                      organizaciones deben trabajar por gestionar el olvido de
                      las acciones que llevan a cabo en lugar de preocuparse por
                      alcanzar una notoriedad que hoy en día es más fugaz que
                      nunca. Diseñamos y cuidamos tu estrategia de activación de
                      marca estableciendo una conexión real con tus audiencias
                      que brinde estabilidad y relevancia a medio y largo plazo.
                      Qué eres y qué no eres. El resto es solo ruido.
                    </p>
                    <h6>Equipo</h6>
                    <p>
                      Hacemos las preguntas correctas y escuchamos con atención.
                      Afortunados de vivir en Córdoba, trabajamos en remoto
                      cuando el proyecto lo requiere. Creemos que cada marca
                      lleva dentro su propio éxito y sabemos que nuestro trabajo
                      es identificarlo y revelarlo. Somos claros, transparentes
                      y defendemos que lo auténtico es poderoso.
                    </p>
                    <ul className={s.acerca_equipo}>
                      <Persona
                        nombre="Pablo Gallego Sevilla"
                        labor="Estrategia, dirección creativa y tipografía"
                        fotos={data.fotospablo}
                      />
                      <Persona
                        nombre="José Luis Breell"
                        labor="Dirección de arte visual, UX/UI"
                        fotos={data.fotosbreell}
                      />
                      <Persona
                        nombre="Juan Bolaños"
                        labor="Narrativa y activación de marca"
                        fotos={data.fotosjuan}
                      />
                      <Persona
                        nombre="Jaime Gallego"
                        labor="Producción y administración"
                        fotos={data.fotosjaime}
                      />
                    </ul>
                    <h6>Contacto</h6>
                    <p className={s.acerca_destacado}>
                      Si quieres contarnos tu idea, proyecto o saber más sobre
                      nuestro trabajo, puedes escribirnos a nuestro{" "}
                      <a
                        href="mailto:info@estudiopablogallego.com"
                        onMouseEnter={() => setCursorPointer("pointer")}
                        onMouseLeave={() => setCursorPointer("default")}
                      >
                        email
                      </a>{" "}
                      o llamarnos al{" "}
                      <a
                        href="tel:+34957487166"
                        onMouseEnter={() => setCursorPointer("pointer")}
                        onMouseLeave={() => setCursorPointer("default")}
                      >
                        957 487 166
                      </a>
                      . Siempre estamos interesados en nuevas oportunidades y
                      colaboraciones.
                    </p>
                    {/* ⛔️ AQUI YA NO SE PUEDE TOCAR ⛔️ */}

                    <div className={s.social_links}>
                      <a
                        href="https://www.linkedin.com/company/estudio-de-dise-o-/"
                        target="_blank"
                        onMouseEnter={() => setCursorPointer("pointer")}
                        onMouseLeave={() => setCursorPointer("default")}
                      >
                        Linkedin
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className={s.acerca_cerrar}
                  onMouseEnter={() => setCursorPointer("pointer")}
                  onMouseMove={() => setCursorPointer("pointer")}
                  onMouseLeave={() => setCursorPointer("default")}
                  onClick={() => {
                    setAcercaVisible(!acercaVisible)
                    onOcultaAcerca()
                    cursorContextData.setBlanco(
                      slides[activeSlide.current].imagen_oscura
                    )
                  }}
                />
              </div>
              <footer></footer>
            </div>
            <Cursor hidden={hidden} />
          </>
        )
      }}
    </CursorContext.Consumer>
  )
}

export default Layout
