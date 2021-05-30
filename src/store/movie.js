import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'
// uniqBy를 이용해서 중복되는 영화를 없애주고 하나로 고유하게 한다.

const _defaultMessage = 'Search for the movie title!'

export default {
   // movie.js가 하나의 store에서 module화 될 수 있다라는 의미!
   namespaced: true,

   // 취급해야 하는 각각의 data를 의미!
   state: () => ({
    movies: [],
    message: _defaultMessage,
    loading: false,
    theMovie: {}
   }),

   // 계산 된 데이터를 만들어 내는 것! (computed)
   getters: {
    //  movieIds(state) {
    //    return state.movies.map(m => m.imdbID)
    //  }
   },

   // methods 같은 의미 
   // 변이(mutations를 이용해야만 state를 수정할 수 있다.)
   mutations: {
     updateState(state, payload) {
       // 객체데이터에 속성의 이름들만 가지고 배열을 만들어준다.(['movies', 'message', 'loading'])
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
     },
     resetMovies(state) {
      state.movies = []
      state.message = _defaultMessage
      state.loading = false 
    }
    // 이처럼 movies를 빈 배열로 만들 수 있다.
   },

   // 비동기로 동작 !
   actions: {
    // Search movie...(검색한 영화가 나오도록 하는 과정)
    async searchMovies({ state, commit }, payload) {
      if (state.loading) return
      // searchMovies가 시작되면 처음 loading 값은 false이고
      // commit 안에서 true값으로 변하고 밑에 로직이 시작되는데 그중에 여러번 엔터누르거나 그러면
      // 로직이 끝나지 않았고 ture값이 if문 안의 값으로 들어가서 return으로 종료
      // (동시에 여러번 실행하는것을 방지하는 역할!)
      
      commit('updateState', {
        message: '',
        // 검색을 하면 메세지를 없애줘야 한다.
        loading: true
        // 검색이 시작되면 로딩이 시작!
      })
      try {
        const res = await _fetchMovie({
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          movies: _uniqBy(Search, 'imdbID')
        })
          // 이 객체 데이터가 payload에 들어간디.
          console.log(totalResults) // 268 => 27
          console.log(typeof totalResults) // string
  
          const total = parseInt(totalResults, 10)
          // 문자열을 10진수로 만들어주는 과정!
          const pageLength = Math.ceil(total / 10)
  
          // 추가 요청!
          if (pageLength > 1) {
            for (let page = 2; page <= pageLength; page += 1 ) {
              if (page > (payload.number / 10)) break
              const res = await _fetchMovie({
                ...payload,
                page
              })
              const { Search } = res.data
              commit('updateState', {
                movies: [
                  ...state.movies, 
                  ..._uniqBy(Search, 'imdbID')]
              })
            }
          }
      } catch (message) {
        commit('updateState', {
          movies: [],
          // 혹시라도 검색된 내용이 있는데 error가 발생하면 빈 배열로 만든다.
          message
        })
      } finally {
        commit('updateState', {
         loading: false
         // 검색이 완료 되었으니까 loading은 다시 false처리
        })
      }
    },
    async searchMovieWithId({ state, commit }, payload) {
      if (state.loading) return

      commit('updateState', {
        theMovie: {},
        // 기존에 검색했던 영화 정보가 출력될 수도 있기 때문에 
        // searchMovieWithId가 실행될 때 초기값을 빈 배열로 해놓는다.
        loading: true
      })

      try {
        const res = await _fetchMovie(payload)
        commit('updateState', {
          theMovie: res.data
        })
      } catch (error) {
        commit('updateState', {
          theMovie: {}
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  }
}

function _fetchMovie(payload) {
  const { title, type, year, page, id } = payload
  const OMDB_API_KEY = '7035c60c'
  const url = id 
  ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` 
  : `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
// 단일 영화정보를 가지고 올 수 있고 여러 영화 정보를 가지고 올 수 있게 하는 로직.
// id 값이 있으면 ? 뒤가 동작해서 단일 영화 정보를 가지고 오고
// 여러 영화 정보를 가지고 올 경우는 : 뒤에가 동작한다.

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        // error가 생긴게 then안에서도 보이기 때문에 한번 더 처리해준다.
        if (res.data.Error) {
          reject()
        }
        resolve(res)
      })
      .catch(err => {
        reject(err.message)
      })
  })
}