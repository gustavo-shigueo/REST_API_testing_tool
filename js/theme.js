const lightBtn = document.querySelector('#light')
const darkBtn = document.querySelector('#dark')
const body = document.querySelector('body')

const applyLightTheme = () => {
  lightBtn.classList.add('active')
  darkBtn.classList.remove('active')

  body.classList.add('light')
  body.classList.remove('dark')

  localStorage.setItem('theme', 'light')
}

const applyDarkTheme = () => {
  lightBtn.classList.remove('active')
  darkBtn.classList.add('active')

  body.classList.remove('light')
  body.classList.add('dark')

  localStorage.setItem('theme', 'dark')
}


// Applies the theme inside localStorage, if there isn't one, applies dark theme
localStorage.getItem('theme') === 'light' ? applyLightTheme() : applyDarkTheme()

lightBtn.addEventListener('click', applyLightTheme)
darkBtn.addEventListener('click', applyDarkTheme)