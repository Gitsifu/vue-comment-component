<template>
  <div id="app">
    <div ref="header" class="change-role">
      <div class="change" @click="changeUser">切换角色</div>
      <div class="current-role">
        <img :src="currentUser.avatar">
        <span>{{
          currentUser.name + (isAuthor ? '（作者）' : '（游客）')
        }}</span>
      </div>
    </div>
    <div ref="comment" :style="wrapStyle" class="comment-wrap">
      <Comment
        v-model="data"
        :user="currentUser"
        :before-submit="submit"
        :before-like="like"
        :before-delete="deleteComment"
        :upload-img="uploadImg"
        :author="isAuthor"
        :props="props"
      />
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
export default {
  name: 'App',
  components: {
    Comment
  },
  data() {
    const users = [
      {
        name: 'Up&Up',
        avatar: require('./assets/image/comment.png')
      },
      {
        name: '天上的黑洞',
        avatar: require('./assets/image/avatar1.jpg')
      },
      {
        name: '地上的梦龙',
        avatar: require('./assets/image/avatar3.jpg')
      },
      {
        name: 'NARUTO',
        avatar: require('./assets/image/avatar2.jpg')
      }
    ]
    return {
      data: [],
      props: {
        content: 'content',
        imgSrc: 'imgSrc',
        children: 'childrenComments',
        likes: 'likes',
        reply: 'reply',
        createAt: 'createAt',
        user: 'visitor'
      },
      currentUser: users[0],
      users,
      wrapStyle: ''
    }
  },
  computed: {
    isAuthor() {
      return /up/i.test(this.currentUser.name)
    }
  },
  created() {
    this.addData(3)
  },
  mounted() {
    const header = this.$refs.header
    this.wrapStyle = `height: calc(100vh - ${header.clientHeight + 20}px)`
  },
  methods: {
    async submit(info) {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(info)
        }, 0)
      })

      console.log('addComment: ', res)
    },
    async like(comment) {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(comment)
        }, 0)
      })

      console.log('likeComment: ', res)
    },
    async uploadImg({ file, callback }) {
      const res = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = () => {
          reject(reader.error)
        }
      })

      callback(res)
      console.log('uploadImg： ', res)
    },
    async deleteComment(comment) {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(comment)
        }, 0)
      })

      console.log('deleteComment: ', res)
    },
    changeUser() {
      const users = this.users
      const index = users.findIndex((c) => c.name === this.currentUser.name)
      this.currentUser = users[index === users.length - 1 ? 0 : index + 1]
      this.$refs.comment.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    },
    addData(times) {
      setTimeout(() => {
        this.data = new Array(times)
          .fill([
            {
              content: '测试1',
              visitor: {
                name: '天上的黑洞',
                avatar: require('./assets/image/avatar1.jpg')
              },
              createAt: '2020.11.24',
              likes: 1,
              childrenComments: [
                {
                  content: '回复1',
                  visitor: {
                    name: 'NARUTO',
                    avatar: require('./assets/image/avatar2.jpg')
                  },
                  createAt: '2020.11.25'
                },
                {
                  content: '回复2',
                  visitor: {
                    name: 'NARUTO',
                    avatar: require('./assets/image/avatar2.jpg')
                  },
                  createAt: '2020.11.25'
                }
              ]
            },
            {
              content: '测试2',
              visitor: {
                name: '地上的梦龙',
                avatar: require('./assets/image/avatar3.jpg')
              },
              createAt: '2020.11.21',
              childrenComments: [
                {
                  content: '回复1',
                  visitor: {
                    name: 'NARUTO',
                    avatar: require('./assets/image/avatar2.jpg')
                  },
                  createAt: '2019.1.23'
                }
              ]
            }
          ])
          .flat(Infinity)
      }, 0)
    }
  }
}
</script>

<style lang="scss">
@mixin scroll-style($thumb:rgba(255, 255, 255, 0.6), $track: rgba(255, 255, 255, 0)) {
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-track {
    border: none;
    box-shadow: none;
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: $thumb;
  }
  &::-webkit-scrollbar-track {
    background: $track;
  }
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 14px;
}

html,body,#app {
  height: 100%;
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

.change-role {
  background: #1c2433;
  color: #eee;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-content: center;
  .change {
    cursor: pointer;
    padding: 0.4rem;
    margin-right: 2rem;
    font-size: 0.9rem;
    border: 1px solid #e99210;
    border-radius: 5px;
    user-select: none;
    &:hover {
      opacity: 0.9;
    }
  }
  .current-role {
    min-width: 15rem;
    color: #e99210;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #e99210;
    padding: 0 1rem;
    img {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
      border: 1px solid #eee;
      border-radius: 50%;
    }
  }
}

.comment-wrap {
  overflow: auto;
  @include scroll-style(#db8f1c,  #b9b9b9)
}

@media screen and (min-width: 760px) {
  body {
    margin: 0 10%;
    border: 1px dashed #eee;
  }
}
</style>
