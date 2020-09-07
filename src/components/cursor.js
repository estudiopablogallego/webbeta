import React, { useState, useEffect } from "react"
import s from "./cursor.module.scss"
import { useSprings, useSpring, animated as a } from 'react-spring'

const Cursor = () => {

    const isMobile = () => {
        const ua = navigator.userAgent;
        return /Android|Mobi/i.test(ua);
    };
    // if (typeof navigator !== "undefined" && isMobile()) return null;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);
    const [hidden, setHidden] = useState(false);

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

    return (
        <div
            className={s.container}
            // onClick={(e)=>{return false}}
            // onDrag={(e)=>{return false}}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            <a.svg width="270px" height="22px" viewBox="0 0 270 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="arrow" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                    <a.polygon id="tri" fill="#000000" fillRule="nonzero" points="135 11 122 3.5 122 18.5" />
                    <a.line x1={0} y1={11} x2={126} y2={11} id="line" stroke="#000000" />
                </g>
            </a.svg>
        </div>
    );
};
export default Cursor