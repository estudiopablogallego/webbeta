import React, { useState, useEffect } from "react"
import s from "./cursor.module.scss"
import { useSprings, useSpring, animated as a } from 'react-spring'
// import { interpolate } from 'flubber'

const Cursor = () => {

    const isMobile = () => {
        const ua = navigator.userAgent;
        return /Android|Mobi/i.test(ua);
    };
    // if (typeof navigator !== "undefined" && isMobile()) return null;
    const [estado, setEstado] = useState('default')

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);
    const [hidden, setHidden] = useState(false);

    const cursorFormaSpring = useSpring({
        linea: estado ==='pointer' ? 'M0,0 L100,0' :
        ( estado === 'right' ? 'M0,11 L126,11' :
        ( estado === 'left' ? 'M144,11 L270,11' :
        'M0,0 L100,0' )),

        triangulo: estado ==='pointer' ? 'M0,0 L100,0 L100,0' :
        ( estado === 'right' ? 'M135,11 L122,3.5 L122,18.5' :
        ( estado === 'left' ? 'M147,18.5 L147,3.5 L134,11' :
        'M0,0 L100,0 L100,0' )),

    })

    

    useEffect(() => {
        addEventListeners();
        handleLinkHoverEvents();
        return () => removeEventListeners();
    }, []);

    const addEventListeners = () => {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseenter", onMouseEnter);
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);
    };

    const removeEventListeners = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseenter", onMouseEnter);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
        if(e.clientX >= window.innerWidth * 0.5 && estado!=='right'){
            setEstado('right')
        }
        if(e.clientX < window.innerWidth * 0.5 && estado!=='left'){
            setEstado('left')
        }
    };

    const onMouseDown = () => {
        setClicked(true);
    };

    const onMouseUp = () => {
        setClicked(false);
    };

    const onMouseLeave = () => {
        setHidden(true);
    };

    const onMouseEnter = () => {
        setHidden(false);
    };

    const handleLinkHoverEvents = () => {
        document.querySelectorAll("a").forEach((el) => {
            el.addEventListener("mouseover", () => setLinkHovered(true));
            el.addEventListener("mouseout", () => setLinkHovered(false));
        });
    };
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
                        d={cursorFormaSpring.triangulo}
                        fill="#000000"
                    />
                    <a.path
                        d={cursorFormaSpring.linea}
                        stroke="#000000"
                    />
                </g>
            </a.svg>
        </div>
    );
};
export default Cursor