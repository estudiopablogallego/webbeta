import React, { useState, useEffect } from "react"
import s from "./cursor.module.scss"
import { useSprings, useSpring, animated as a } from 'react-spring'
// import { interpolate } from 'flubber'

const Cursor = ({imagenOscura, cursorEstado}) => {

    const isMobile = () => {
        const ua = navigator.userAgent;
        return /Android|Mobi/i.test(ua);
    };
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // if (typeof navigator !== "undefined" && isMobile()) return null;
    // const [estado, setEstado] = useState('default')
    const onMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    
    const cursorSpring = useSpring({
        linea: cursorEstado ==='pointer' ? 'M0,0 L100,0' :
        ( cursorEstado === 'right' ? 'M0,11 L126,11' :
        ( cursorEstado === 'left' ? 'M144,11 L270,11' :
        'M0,0 L100,0' )),

        triangulo: cursorEstado ==='pointer' ? 'M0,0 L100,0 L100,0' :
        ( cursorEstado === 'right' ? 'M135,11 L122,3.5 L122,18.5' :
        ( cursorEstado === 'left' ? 'M147,18.5 L147,3.5 L134,11' :
        'M0,0 L100,0 L100,0' )),

        color: imagenOscura ? '#ffffff' : '#000000'
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
        addEventListeners();
        return () => removeEventListeners();
    }, []);
    
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
    };
    
    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
    return (
        <div
            className={s.container}
            // onClick={(e)=>{return false}}
            // onDrag={(e)=>{return false}}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            <a.svg width="270px" height="22px" viewBox="0 0 270 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="arrow" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                    <a.path
                        d={cursorSpring.triangulo}
                        fill={cursorSpring.color}
                    />
                    <a.path
                        d={cursorSpring.linea}
                        stroke={cursorSpring.color}
                    />
                </g>
            </a.svg>
        </div>
    );
};
export default Cursor