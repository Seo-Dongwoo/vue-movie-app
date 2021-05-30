import { createApp } from 'vue'
import App from './App'
import router from './routes'
import store from './store'
import loadImage from './plugins/loadImage'
// 특정 폴더에 들어가 있는 index.js는 생략해줄 수 있다.

createApp(App)
  .use(router) // use같은 매소드는 현재 프로그램에 특정한 플러그인을 연결 할 떄 사용.
  .use(store)
  .use(loadImage) // $loadImage를 이용해서 vue안에서 언제든지 사용 가능!
  .mount('#app')