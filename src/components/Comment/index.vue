<template>
  <div id="comment">
    <!-- 顶部评论表单区域 -->
    <comment-form>
      <img src="../../assets/image/comment.png">
    </comment-form>

    <!-- 底部评论列表 -->
    <comment-list v-if="data">
      <!-- 单个评论 -->
      <comment-item
        v-for="(item, index) in data"
        :key="`comment-${index}`"
        :comment="item"
        :is-active="isActive(index)"
      >
        <!-- 回复表单区域，点击回复切换状态，点击其他区域消失 -->
        <comment-form
          v-if="isActive(index)"
          :id="`comment-${index}`"
          autofocus
        />
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
  provide() {
    return {
      comment: this
    }
  },
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      forms: [],
      focusId: ''
    }
  },
  mounted() {
    window.addEventListener('click', this.reset)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('click', this.reset)
    })
  },
  methods: {
    isActive(index) {
      return this.forms.includes(`comment-${index}`)
    },
    reset() {
      if (this.focusId === '') return
      this.focusId = ''
      this.globalBlur(this)
    },
    addInputBox(id) {
      // 点击回复按钮

      if (id === this.focusId) {
        this.focusId = ''
        this.removeInputBox(id)
        return
      }

      this.focusId = id
      if (!this.forms.includes(id)) {
        this.forms.push(id)
        this.$nextTick(() => {
          const inputformsize =
            5 * (16 + (6 * (document.documentElement.clientWidth - 326)) / 680)
          window.scrollBy({
            top: inputformsize,
            behavior: 'smooth'
          })
        })
      }
    },
    removeInputBox(id) {
      // 移除评论输入框
      const index = this.forms.indexOf(id)
      if (index > -1) {
        this.forms.splice(index, 1)
      }
    },
    globalBlur(target = this) {
      // 全局失焦，递归执行评论输入框的close方法
      const children = target.$children

      if (children.length > 0) {
        children.map((c) => this.globalBlur(c))
      } else {
        if (target.close) {
          target.close()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#comment {
  margin-top: 2rem;
  & > .comment-form {
    margin: 0 1.666rem 1.333rem;
  }
  & > .comment-list {
    margin: 0 1.666rem 0 6.5rem;
    background-color: #fff;
  }
  // 统一头像样式
  ::v-deep {
    img {
      user-select: none;
      -webkit-user-drag: none;
      width: 2.667rem;
      height: 2.667rem;
      border-radius: 50%;
    }
  }
}
</style>
