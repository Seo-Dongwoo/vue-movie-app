<template>
  <div class="container">
    <input
      v-model="title" 
      class="form-control"
      type="text" 
      placeholder="Search for Movies, Series & more" 
      @keyup.enter="apply" />
    <div class="selects">
      <select
        v-for="filter in filters"
        v-model="$data[filter.name]"
        :key="filter.name"
        class="form-select">
        <option
          v-if="filter.name === 'year'"
          value="">
          All Years
        </option>
        <option 
          v-for="item in filter.items"
          :key="item">
          {{ item }}
        </option>
      </select>
    </div>
    <button
      class="btn btn-primary"
      @click="apply">
      Apply
    </button>
  </div>
</template>

<script>
export default {
  // 위의 $data는 script의 안에있는 data에 접근할 수 있도록 해주는것.(양방향성)
  data() {
    return {
      title: '',
      type: 'movie',
      number: 10,
      year: '',
      filters: [
        { 
          name:'type',
         items: ['movie', 'series', 'episode']
        },
        {
          name: 'number',
         items: [10, 20, 30]
        },
        {
          name: 'year',
          items: (() => {
            const years = []
            const thisYear = new Date().getFullYear() // 2021이 반환!
            for (let i = thisYear; i >= 1985; i -= 1) {
              years.push(i)
              //years라는 함수에 i를 순서대로 넣어주는 작업.
            }
            return years
          })()
          //즉시 실행 하는 함수(선언과 동시에 실행한다.)
        }
      ]
    }
  },
  methods: {
    async apply() {
      this.$store.dispatch('movie/searchMovies', {
        title: this.title,
        type: this.type,
        number: this.number,
        year: this.year
    // 하나의 객체 데이터가 두번쨰 인수로 전달이 되고 
    // 이를 movie라는 component에서 payload로 받아서 각각의 내용을 객체 구조분해 해서 사용!
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  display: flex;
  > * {
    margin-right: 10px;
    font-size: 15px;
    &:last-child {
      margin-right: 0;
    }
  }
  .selects {
    display: flex;
    select {
      width: 120px;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
        // 가장 오른쪽에 있는 자식요소의 margin-right을 0
      } 
    }
  }
  .btn {
    width: 120px;
    height: 50px;
    font-weight: 700;
    flex-shrink: 0;
    // 120px보다 작아지도록 하지 않게하기 위해 설정
  }
  @include media-breakpoint-down(lg) {
    display: block;
    // 뷰포트의 크기가 large사이즈보다 작을 경우 display: block처리
    // 이경우 수평이였던 item들이 회면을 좁히면 수직정렬을 하게 된다.
    input {
      margin-right: 0;
      margin-bottom: 10px;
    }
    .selects {
      margin-right: 0;
      margin-bottom: 10px;
      select {
        width: 100%;
      }
    }
    .btn {
      width: 100%;
    }
  }
}
</style>