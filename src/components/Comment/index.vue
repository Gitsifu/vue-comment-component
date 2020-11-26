<template>
  <div id="comment" ref="comment">
    <!-- 顶部评论表单区域 -->
    <comment-form class-name="comment-root" @form-submit="formSubmit">
      <img
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
  methods: {
    // * 点击回复按钮，判断是否已存在该id的表单，存在删除该表单，不存在则新增该表单，并触发其他表单blur事件
    hasForm(id) {
      this.forms.includes(id) ? this.deleteForm(id) : this.addForm(id)
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
      if (target.id === id) return

      if (Array.isArray(target)) {
        target.map((c) => this.dispatchBlur(c, id))
      } else {
        const children = target.$children
        children && this.dispatchBlur(children, id)

        const richInput = target.$refs['rich-input']
        richInput && richInput.blur()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#comment {
  font-size: calc(12px + 4 * ((100vw - 1600px) / (1600 - 320)));
  margin-top: 2em;
  & > .comment-form {
    margin: 0 1.666em 1.333em;
  }
  & > .comment-list {
    margin: 0 1.666em 0 6.5em;
    background-color: #fff;
  }

  ::v-deep {
    img {
      user-select: none;
      -webkit-user-drag: none;
      width: 3.5em;
      height: 3.5em;
      border-radius: 50%;
      cursor: pointer;
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
          background: #f5f5f5 url('../../assets/image/break.svg') no-repeat center / 50% 50%;
        }
      }
    }
  }
}

@media screen and (max-width: 600px) {
  #comment {
    & > .comment-list {
      margin: 0 2em;
    }
    & > .comment-form {
      margin: 1.25em 2em;
    }
    & > ::v-deep .comment-root .avatar-box {
      display: none;
    }
  }
}
</style>
