<template>
  <div id="app">
    <Comment
      v-model="data"
      :user="user"
      :before-submit="submit"
      :before-like="like"
      :before-delete="deleteComment"
      :upload-img="uploadImg"
      author
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
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(info)
        }, 0)
      })

      console.log(res)
    },
    async like(comment) {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(comment)
        }, 0)
      })

      console.log(res)
    },
    async uploadImg({ file, callback }) {
      const res = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
      })

      callback(res)
      console.log(res)
    },
    async deleteComment(comment) {
      const res = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(comment)
        }, 500)
      })

      console.log(res)
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
