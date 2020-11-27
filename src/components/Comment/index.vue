<template>
  <div id="comment" ref="comment">
    <!-- 顶部评论表单区域 -->
    <comment-form class-name="comment-root" @form-submit="formSubmit">
      <img
        class="avatar"
        :src="user.avatar || ''"
        @error="(e) => e.target.classList.add('error')"
      >
    </comment-form>

    <!-- 底部评论列表 -->
    <comment-list v-if="data" ref="comment-list">
      <!-- 单个评论 -->
      <comment-item
        v-for="(comment, i) in data"
        :id="`comment-${i}`"
        :key="`comment-${i}`"
        :comment="comment"
        @comment-reply="hasForm"
        @comment-like="handleCommentLike"
      >
        <!-- 评论表单 -->
        <template #default="{id}">
          <comment-form
            v-if="forms.includes(id)"
            :id="id"
            class-name="reply"
            :placeholder="`回复${comment.user.name}...`"
            @form-submit="formSubmit"
            @form-delete="deleteForm"
          />
        </template>

        <!-- 回复列表 -->
        <template #replyList="{parentId}">
          <comment-list v-if="comment.children && comment.children.length > 0">
            <!-- 单条回复 -->
            <comment-item
              v-for="(child, j) in comment.children"
              :id="`${parentId}-${j}`"
              :key="`${parentId}-${j}`"
              :comment="child"
              @comment-reply="hasForm"
              @comment-like="handleCommentLike"
            >
              <!-- 回复表单 -->
              <comment-form
                v-if="forms.includes(`${parentId}-${j}`)"
                :id="`${parentId}-${j}`"
                :comment="child"
                class-name="reply sub-reply"
                :placeholder="`回复${child.user && child.user.name}...`"
                @form-delete="deleteForm"
                @form-submit="formSubmit"
              />
            </comment-item>
          </comment-list>
        </template>
      </comment-item>
    </comment-list>
  </div>
</template>

<script>
import CommentForm from './components/CommentForm'
import CommentList from './components/CommentIist'
import CommentItem from './components/CommentItem'
export default {
  name: 'Comment',
  components: { CommentList, CommentItem, CommentForm },
  inheritAttrs: false,
  model: {
    prop: 'data',
    event: 'input'
  },
  props: {
    /* 数据 */
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    /* 当前用户 */
    user: {
      type: Object,
      default: () => {},
      required: true
    },
    /* 配置属性 */
    props: {
      type: Object,
      default: () => {}
    },
    /* 提交表单前事件 */
    beforeSubmit: {
      type: Function,
      default: () => {}
    },
    /* 执行点赞前事件 */
    beforeLike: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      forms: [] // 显示在视图上的表单id数组
    }
  },
  // mounted() {
  //   window.addEventListener('blur', (e) => {
  //     console.log('blur')
  //     this.dispatchBlur(this)
  //   }, true)
  // },
  methods: {
    // * 点击回复按钮，判断是否已存在该id的表单，存在删除该表单，不存在则新增该表单，并触发其他表单blur事件
    hasForm(id) {
      this.forms.includes(id) ? this.deleteForm(id) : this.addForm(id)
      console.log('点击回复')
      this.dispatchBlur(this.$refs['comment-list'].$children, id)
    },
    // * 增加新表单
    addForm(id) {
      this.forms.push(id)
    },
    // * 删除表单
    deleteForm(id) {
      const index = this.forms.indexOf(id)
      index > -1 && this.forms.splice(index, 1)
    },
    // * 评论或回复
    async formSubmit({ id, callback, ...params }) {
      // 等待外部提交事件执行
      try {
        const res = await this.beforeSubmit(JSON.parse(JSON.stringify(params)))
        if (res === false) return
      } catch (e) {
        throw new Error(e)
      }

      // 插入评论或回复
      this.storeData(id, Object.assign(params, { user: this.user }))
      callback()
    },
    // * 点赞
    async handleCommentLike({ id, comment: { children, liked, ...params }}) {
      try {
        const data = JSON.parse(JSON.stringify(params))
        const res = await this.beforeLike(data)
        if (res === false) return
      } catch (e) {
        throw new Error(e)
      }

      this.storeLikes(id)
    },
    // * 存储点赞
    storeLikes(id) {
      const indexs = id.split('-')
      const commentIndex = +indexs[1]
      const replyIndex = indexs[2]
      const data = this.data.map((c, i) => {
        if (i === +commentIndex) {
          let item = c

          if (replyIndex !== undefined) {
            c.children.map((r, i) => {
              if (i === +replyIndex) {
                item = r
              }
              return r
            })
          }

          item.liked = !item.liked
          if (item.likes) {
            item.liked ? item.likes++ : item.likes--
          } else {
            item.likes = 1
          }
        }

        return c
      })

      this.$emit('input', data)
    },
    // * 存储新评论或回复
    storeData(id, rawData) {
      const commentIndex = id.split('-')[1]
      let data = []

      if (commentIndex === 'root') {
        data = this.data.concat(rawData)
      } else {
        data = this.data.map((c, i) => {
          if (i === +commentIndex) {
            c.children.push(rawData)
          }
          return c
        })
      }

      this.$emit('input', data)
    },
    // * 向下递归触发表单blur事件
    dispatchBlur(target, id) {
      if (id && target.id === id) return

      if (Array.isArray(target)) {
        target.map((c) => this.dispatchBlur(c, id))
      } else {
        const children = target.$children
        children && this.dispatchBlur(children, id)

        // target.handleBlur && target.handleBlur()
        const richInput = target.$refs['rich-input']
        richInput && richInput.blur()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#comment {
  border-top: 1px solid #ebebeb;
  padding-top: 1.0664rem;
  & > .comment-form {
    margin: 0 1.3328rem 1.0664rem;
  }
  & > .comment-list {
    margin: 0 1.3328rem 0 6.5rem;
    background-color: #fff;
  }

  ::v-deep {
    img {
      user-select: none;
      -webkit-user-drag: none;
      width: 2.1336rem;
      height: 2.1336rem;
      border-radius: 50%;
      &.avatar {
        cursor: pointer;
      }
      &.error {
        display: inline-block;
        transform: scale(0.5);
        content: '';
        color: transparent;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid #e7e7e7;
          box-sizing: border-box;
          transform: scale(2);
          background: #f5f5f5
            url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M304.128 456.192c48.64 0 88.064-39.424 88.064-88.064s-39.424-88.064-88.064-88.064-88.064 39.424-88.064 88.064 39.424 88.064 88.064 88.064zm0-116.224c15.36 0 28.16 12.288 28.16 28.16s-12.288 28.16-28.16 28.16-28.16-12.288-28.16-28.16 12.288-28.16 28.16-28.16z' fill='%23e6e6e6'/%3E%3Cpath d='M887.296 159.744H136.704C96.768 159.744 64 192 64 232.448v559.104c0 39.936 32.256 72.704 72.704 72.704h198.144L500.224 688.64l-36.352-222.72 162.304-130.56-61.44 143.872 92.672 214.016-105.472 171.008h335.36C927.232 864.256 960 832 960 791.552V232.448c0-39.936-32.256-72.704-72.704-72.704zm-138.752 71.68v.512H857.6c16.384 0 30.208 13.312 30.208 30.208v399.872L673.28 408.064l75.264-176.64zM304.64 792.064H165.888c-16.384 0-30.208-13.312-30.208-30.208v-9.728l138.752-164.352 104.96 124.416-74.752 79.872zm81.92-355.84l37.376 228.864-.512.512-142.848-169.984c-3.072-3.584-9.216-3.584-12.288 0L135.68 652.8V262.144c0-16.384 13.312-30.208 30.208-30.208h474.624L386.56 436.224zm501.248 325.632c0 16.896-13.312 30.208-29.696 30.208H680.96l57.344-93.184-87.552-202.24 7.168-7.68 229.888 272.896z' fill='%23e6e6e6'/%3E%3C/svg%3E")
            no-repeat center / 50% 50%;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  #comment {
    & > .comment-list {
      margin: 0 1.6rem;
    }
    & > .comment-form {
      margin: 1rem 1.6rem;
    }
    & > ::v-deep .comment-root .avatar-box {
      display: none;
    }
  }
}
</style>
