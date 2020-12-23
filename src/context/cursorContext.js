import React, { createContext } from "react"

const defaultState = {
  cursor: "default", //left, right, pointer
  blanco: false,
  posicion: {
    x: -1000,
    y: -1000,
  },
  accionSinDefinir: () => {},
}

const CursorContext = createContext(defaultState)

class CursorProvider extends React.Component {
  state = defaultState

  setBlanco = blanco => {
    if (this.state.blanco !== blanco) {
      this.setState({ blanco: blanco })
      //onsole.log("seting cursor blanco: ", blanco)
    }
  }

  setCursor = cursorMode => {
    // console.log(this.state.cursor)
    if (this.state.cursor !== cursorMode) {
      // console.log("seting cursor", cursorMode)
      this.setState({ cursor: cursorMode })
    }
  }
  setPosicion = ({ x, y }) => {
    this.setState({ posicion: { x, y } })
  }

  componentDidMount() {
    // // Getting dark mode value from localStorage!
    // const lsDark = JSON.parse(localStorage.getItem("dark"))
    // if (lsDark) {
    //   this.setState({ dark: lsDark })
    // } else if (supportsDarkMode()) {
    //   this.setState({ dark: true })
    // }
  }

  render() {
    const { children } = this.props
    return (
      <CursorContext.Provider
        value={{
          cursor: this.state.cursor,
          blanco: this.state.blanco,
          posicion: this.state.posicion,
          setBlanco: this.setBlanco,
          setPosicion: this.setPosicion,
          setCursor: this.setCursor,
        }}
      >
        {children}
      </CursorContext.Provider>
    )
  }
}

export default CursorContext

export { CursorProvider }
