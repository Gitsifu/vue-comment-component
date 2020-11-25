<template>
  <div id="app">
    <Comment v-model="data" :handle-submit="submit" />
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
    data: []
  }),
  created() {
    setTimeout(() => {
      this.data = [
        {
          content: '测试1',
          visitor: { name: '冯风风' },
          created: '2020.11.24',
          children: [
            {
              content: '回复1',
              visitor: { name: 'NARUTO' },
              created: '2020.11.25'
            },
            {
              content: '回复2',
              visitor: { name: 'NARUTO' },
              created: '2020.11.25'
            }
          ]
        },
        {
          content: '测试2',
          visitor: { name: '冯风风' },
          created: '2020.11.21',
          children: [
            {
              content: '回复1',
              visitor: { name: 'NARUTO' },
              created: '2020.11.23'
            }
          ]
        }
      ]
    }, 500)
  },
  methods: {
    async submit({ content }) {
      await new Promise(resolve => {
        setTimeout(() => {
          // resolve(content)
          throw new Error('error')
        }, 1000)
      })
    }
  }
}
</script>

<style>
html {
  font-size: 12px;
}
</style>
