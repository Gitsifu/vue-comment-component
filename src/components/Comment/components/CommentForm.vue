<template>
  <div
    class="comment-form"
    :class="{ 'reply': parentId !== '' && parentId !== id }"
    @click.stop
  >
    <div class="avatar-box">
      <img src="../../../assets/image/avatar3.jpg" alt="">
    </div>
    <div class="form-box">
      <div class="rich-input-wrap" :class="{ focus: focus || value }">
        <div
          ref="rich-input"
          class="rich-input"
          contenteditable="true"
          spellcheck="false"
          disabled="disabled"
          :placeholder="placeholder"
          @input="handleInput"
          @focus="handleFocus"
        />
      </div>
      <div v-show="focus || value" class="option-box">
        <slot name="submitBtn">
          <button
            class="submit-btn"
            :disabled="!value"
            @click="submit"
          >
            评论
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentForm',
  inject: ['comment'],
  props: {
    placeholder: {
      type: String,
      default: '输入评论...'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: 'comment-0'
    },
    parentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      focus: false, // 是否聚焦
      value: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.autofocus) {
        this.$refs.input.focus() // 自动聚焦
      }

      this.$watch('comment.focusId', (id) => {
        // 监听当前聚焦的输入框id变化
        if (id !== this.id) {
          this.close()
        }
      })
    },
    handleInput(e) {
      this.value = e.target.innerText
    },
    submit() {
      // 提交评论或回复
      if (!this.value) return

      const data = {
        content: this.value,
        callback: () => {
          this.reset()
        }
      }

      this.comment.$emit('submit', data)
    },
    reset() {
      // 重置
      this.$refs['rich-input'].innerHTML = ''
      this.value = ''
      this.close()
    },
    handleFocus() {
      // 聚焦
      this.comment.focusId = this.id
      this.focus = true
    },
    close() {
      // 关闭输入框
      if (!this.focus) return
      if (!this.value) {
        this.focus = false
        this.comment.removeInputBox(this.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.comment-form {
  max-width: 100%;
  padding: 1rem 1.333rem;
  display: flex;
  background-color: #fafbfc;
  border-radius: 3px;
  &.reply {
    .avatar-box {
      display: none;
    }
  }
  .avatar-box {
    flex: 0 0 auto;
    img {
      margin: 0 1rem 0 0;
    }
  }
  .form-box {
    flex: 1 1 auto;
    .rich-input-wrap {
      border-radius: 3px;
      border: 1px solid #f1f1f1;
      background-color: #fff;
      overflow: hidden;
      &.focus {
        border-color: #007fff;
      }
      .rich-input {
        outline: none;
        padding: 0.6rem 1rem;
        min-height: 1.3em;
        line-height: 1.7;
        font-size: 1.083rem;
        color: #17181a;
        word-break: break-word;
        touch-action: none;
        &:empty::before {
          content: attr(placeholder);
          opacity: 0.4;
          pointer-events: none;
          user-select: none;
        }
        &:enabled:before {
          content: none;
        }
      }
    }
    .option-box {
      margin-top: 0.65rem;
      display: flex;
      .submit-btn {
        flex: 0 0 auto;
        margin-left: auto;
        padding: 0.5rem 1.3rem;
        font-size: 1.25rem;
        color: #fff;
        background-color: #027fff;
        border-radius: 2px;
        outline: none;
        border: none;
        cursor: pointer;
        transition: all .3s;
        &:hover {
          background-color: #0371df;
        }
        &:disabled {
          opacity: 0.4;
          cursor: default;
        }
      }
    }
  }
}
</style>
