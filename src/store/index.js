import { createStore } from 'vuex'
// vuex는 부모 관계가 아닌 형제 관계거나 아예 관계가 없는 components들을
// 연결해주고 호환시켜준다.
import movie from './movie'
import about from './about'

export default createStore({
  modules: {
    movie,
    about
  }
})