export default {
  install(app) {
    app.config.globalProperties.$loadImage = src => {
      return new Promise(resolve => {
        const img = document.createElement('img')
        img.src = src 
        img.addEventListener('load', () => {
          resolve()
          // load가 끝나면 resolve()가 동작하고 그다음으로 넘어간다.
        })
      })
    }
  }
}