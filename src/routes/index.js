import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home'
import Movie from './Movie'
import About from './About'
import NotFound from './NotFound'

export default createRouter({
  // Hash 모드
  // https://google.com/#/search
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  // pages들을 구분해주는 개념
  // https://google.com/ 이처럼 제일 메인페이지로 이동하겠다라는 의미이며 
  // 거기에 component를 연결해서 사용하겠다는 의미
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/movie/:id',
      component: Movie
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/:notFound(.*)',
      // 모든 문자와 일치
      component: NotFound
    }
  ]
})