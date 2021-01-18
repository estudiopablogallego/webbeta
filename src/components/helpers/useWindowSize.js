import { useState, useLayoutEffect } from "react"
//Devuelve mobile, tablet o desktop
export const useWindowSize = () => {
	const isClient = typeof window === 'object';
	function getWidth() {
		if(isClient){
			return window.innerWidth
		}
		return 1024
	}

	const [windowSize, setWindowSize] = useState(getWidth);

	useLayoutEffect(() => {
		if (!isClient) {
			return false;
		}
		
		function handleResize() {
			setWindowSize(getWidth());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount and unmount

	return windowSize;
}
// 
// export const useWindowRatio = () => {
// 	const isClient = typeof window === 'object';
// 	
// 	function getRatio() {
// 		if(isClient){
// 			const wWidth = window.innerWidth
// 			const wHeight = window.innerHeight
// 			if(wWidth >= wHeight) 
// 				return 'horizontal'
// 			if(wWidth < wHeight)
// 				return 'vertical'
// 		}
// 		return 'mobile'
// 	}
// 
// 	const [windowRatio, setWindowRatio] = useState(getRatio);
// 
// 	useLayoutEffect(() => {
// 		if (!isClient) {
// 			return false;
// 		}
// 		
// 		function handleResize() {
// 			setWindowRatio(getRatio());
// 		}
// 
// 		window.addEventListener('resize', handleResize);
// 		return () => window.removeEventListener('resize', handleResize);
// 	}, []); // Empty array ensures that effect is only run on mount and unmount
// 
// 	return windowRatio;
// }