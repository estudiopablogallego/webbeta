import React, { useState, useEffect, useContext } from "react"
import * as s from "./cursor.module.scss"
import { useSprings, useSpring, animated as a } from "react-spring"
// import { interpolate } from 'flubber'
import CursorContext from "../context/cursorContext"

const Cursor = ({ hidden }) => {
  const cursorContextData = useContext(CursorContext)
  const isMobile = () => {
    const ua = navigator.userAgent
    return /Android|Mobi/i.test(ua)
  }
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // if (typeof navigator !== "undefined" && isMobile()) return null;
  // const [estado, setEstado] = useState('default')
  const onMouseMove = e => {
    setPosition({ x: e.clientX, y: e.clientY })
    // cursorContextData.setPosicion({ x: e.clientX, y: e.clientY })
  }
  const cursorSpring = useSpring({
    color: cursorContextData.blanco ? "#ffffff" : "#000000",
    linea:
      cursorContextData.cursor === "pointer"
        ? "M135,30 L135,11"
        : cursorContextData.cursor === "right"
        ? "M0,11 L126,11"
        : cursorContextData.cursor === "left"
        ? "M144,11 L270,11"
        : "M165,41 L135,11",

    transform:
      cursorContextData.cursor === "pointer"
        ? "translate3d(135px,15px,0) scale(2,2) rotate(-90deg)"
        : cursorContextData.cursor === "right"
        ? "translate3d(132px,11px,0) scale(1,1) rotate(0deg)"
        : cursorContextData.cursor === "left"
        ? "translate3d(138px,11px,0) scale(1,1) rotate(180deg)"
        : "translate3d(135px,11px,0) scale(1,1) rotate(-135deg)",
    // cursorContextData.cursor === "pointer"
    //   ? "M147,18.5 L147,3.5 L134,11"
    //   : cursorContextData.cursor === "right"
    //   ? "M135,11 L122,3.5 L122,18.5"
    //   : cursorContextData.cursor === "left"
    //   ? "M147,18.5 L147,3.5 L134,11"
    //   : "M0,0 L100,0 L100,0",
  })

  const cursorClasses = ""
  // const cursorClasses = classNames("cursor", {
  //     "cursor--clicked": clicked,
  //     "cursor--hidden": hidden,
  //     "cursor--link-hovered": linkHovered
  // });
  // if(typeof window !== 'undefined'){
  //   console.log("bodyyyyy")
  //   document.body.style.cursor = 'none';
  // }

  // const interpolator = interpolate(paths[index], paths[index + 1] || paths[0], { maxSegmentLength: 0.1 })

  useEffect(() => {
    addEventListeners()
    return () => removeEventListeners()
  }, [])

  const addEventListeners = () => {
    document.addEventListener("mousemove", onMouseMove)
  }

  const removeEventListeners = () => {
    document.removeEventListener("mousemove", onMouseMove)
  }
  return (
    <CursorContext.Consumer>
      {cursor => (
        <a.div
          className={`cursor_contenedor ${s.container} ${
            hidden ? s.cursor_no_visible : ""
          }`}
          // onClick={(e)=>{return false}}
          // onDrag={(e)=>{return false}}
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
          <a.svg
            width="270px"
            height="50px"
            viewBox="0 0 270 50"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g
              id="arrow"
              stroke="none"
              strokeWidth={1}
              fill="none"
              fillRule="evenodd"
            >
              <a.path
                d="M-7.5,-7.5 L7.5,0 L-7.5,7.5"
                style={{
                  transform: cursorSpring.transform,
                }}
                fill={cursorSpring.color}
              />
              <a.path d={cursorSpring.linea} stroke={cursorSpring.color} />
            </g>
          </a.svg>
        </a.div>
      )}
    </CursorContext.Consumer>
  )
}
export default Cursor
