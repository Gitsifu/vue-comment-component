<template>
  <div id="app">
    <Comment
      v-model="data"
      :user="user"
      :before-submit="submit"
      :before-like="like"
    />
  </div>
</template>

<script>
import Comment from '@/components/Comment'
export default {
  name: 'App',
  components: {
    Comment
  },
  data: () => ({
    data: [],
    user: {
      name: 'user',
      avatar: require('./assets/image/comment.png')
    }
  }),
  created() {
    setTimeout(() => {
      this.data = [
        {
          content: '测试1',
          user: { name: '冯风风' },
          createAt: '2020.11.24',
          likes: 1,
          children: [
            {
              content: '回复1',
              user: { name: 'NARUTO' },
              createAt: '2020.11.25'
            },
            {
              content: '回复2',
              user: { name: 'NARUTO' },
              createAt: '2020.11.25'
            }
          ]
        },
        {
          content: '测试2',
          user: { name: '冯风风' },
          createAt: '2020.11.21',
          children: [
            {
              content: '回复1',
              user: { name: 'NARUTO' },
              createAt: '2019.1.23'
            }
          ]
        }
      ]
    }, 500)
  },
  methods: {
    async submit(info) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve()
          console.log(info)
        }, 0)
      })
    },
    async like(comment) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve()
          console.log(comment)
        }, 0)
      })
    }
  }
}
</script>

<style>
html {
  font-size: 14px;
}

@media screen and (min-width: 320px) {
  html {
    font-size: calc(14px + 4 * ((100vw - 320px) / (1200 - 320)));
  }
}

@media screen and (min-width: 1200px) {
  html {
    font-size: 18px;
  }
}

</style>
