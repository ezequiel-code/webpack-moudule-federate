import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import CssBaseline from '@mui/material/CssBaseline'
import red from '@mui/material/colors/red'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    }
  }
})

function Bootstrap (): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>)
}

ReactDOM.render(<Bootstrap />, document.getElementById('root'))
