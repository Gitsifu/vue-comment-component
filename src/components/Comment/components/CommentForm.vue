<template>
  <div class="comment-form">
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
          @blur="handleBlur"
        />
      </div>
      <div
        v-show="focus || value"
        class="option-box"
        @mousedown.prevent="$refs['rich-input'].focus()"
      >
        <slot name="submitBtn">
          <button class="submit-btn" :disabled="!value" @click.stop="handleSubmit">
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
  props: {
    placeholder: {
      type: String,
      default: '输入评论...'
    },
    id: {
      type: [String, Number],
      default: 'comment-root'
    }
  },
  data() {
    return {
      focus: false, // * 聚焦状态
      value: '' // * 输入框值
    }
  },
  computed: {
    isRoot() {
      return this.id === 'comment-root'
    }
  },
  mounted() {
    if (!this.isRoot) {
      // 自动聚焦
      this.$refs['rich-input'].focus()
    }
  },
  methods: {
    handleInput(e) {
      this.value = e.target.innerText
    },
    handleFocus() {
      this.focus = true
    },
    handleBlur() {
      if (this.value) return

      if (this.isRoot) {
        // 顶部表单特殊处理
        this.focus = false
        return
      }
      this.close()
    },
    handleSubmit() {
      if (!this.value) return

      const data = {
        id: this.id,
        content: this.value,
        callback: () => {
          this.id === 'comment-root' ? this.reset() : this.close()
        }
      }

      this.$emit('form-submit', data)
    },
    reset() {
      this.value = ''
      this.$refs['rich-input'].innerHTML = null
      this.$refs['rich-input'].blur()
    },
    close() {
      this.$emit('form-delete', this.id)
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
        transition: all 0.3s;
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
