<template>
  <div :class="`${className} comment-form`">
    <div class="avatar-box">
      <slot />
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
        <div
          v-if="showImgBox"
          ref="image-preview-box"
          class="image-preview-box"
        >
          <div class="clean-btn" @mousedown.prevent="removeImg">
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 21 21"
              class="icon close-icon"
            >
              <g
                fill="none"
                fill-rule="evenodd"
                transform="translate(1 1)"
              >
                <circle
                  cx="9.5"
                  cy="9.5"
                  r="9.5"
                  fill="#000"
                  stroke="#FFF"
                  opacity=".5"
                />
                <path
                  fill="#FFF"
                  d="M13.743 5.964L10.207 9.5l3.536 3.536-.707.707L9.5 10.207l-3.536 3.536-.707-.707L8.793 9.5 5.257 5.964l.707-.707L9.5 8.793l3.536-3.536z"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div
        v-show="focus || value || imgStr"
        class="option-box"
        @mousedown.prevent="$refs['rich-input'].focus()"
      >
        <slot name="submitBtn">
          <button
            class="submit-btn"
            :disabled="!value && !imgStr"
            @click.stop="handleSubmit"
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
  props: {
    placeholder: {
      type: String,
      default: '输入评论...'
    },
    id: {
      type: [String, Number],
      default: 'comment-root'
    },
    className: {
      type: String,
      default: ''
    },
    comment: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      focus: false, // * 聚焦状态
      value: '', // * 输入框值
      showImgBox: false, // * 粘贴的图片容器状态
      imgStr: '' // * 粘贴的图片DOM字符串
    }
  },
  computed: {
    // 是否为顶部评论表单
    isRoot() {
      return this.id === 'comment-root'
    }
  },
  mounted() {
    const richInput = this.$refs['rich-input']
    !this.isRoot && richInput.focus() // 自动聚焦

    richInput.addEventListener('paste', this.handlePaste)
    this.$once('hook:beforeDestroy', () =>
      richInput.removeEventListener('paste', this.handlePaste)
    )
  },
  methods: {
    handleInput(e) {
      this.value = e.target.innerText.replace(/\n+/g, '\n')
    },
    handleFocus() {
      this.focus = true
    },
    handleBlur() {
      if (this.value || this.imgStr) return

      if (this.isRoot) {
        // 顶部表单特殊处理
        this.focus = false
        return
      }
      this.close()
    },
    handleSubmit() {
      if (!this.value.trim() && !this.imgStr) return
      const user = (this.comment && this.comment.user) || null

      const data = {
        id: this.id,
        content: this.value + this.imgStr,
        reply:
          this.id.split('-').length === 3 && JSON.parse(JSON.stringify(user)), // 子回复
        createAt: new Date().getTime(),
        callback: () => {
          this.isRoot ? this.reset() : this.close()
        }
      }

      this.$emit('form-submit', data)
    },
    handlePaste(e) {
      if (!e.clipboardData) return

      const img = e.clipboardData.files[0]
      if (!img) return
      // 粘贴图片
      this.showImgBox = true
      this.$nextTick(() => {
        this.handlePasteImg(img, this.$refs['image-preview-box'])
      })
      e.preventDefault()
    },
    // 粘贴文字
    handlePasteString(str) {
      const selection = window.getSelection()
      const textList = this.html2Escape(str).split(/\n/g) // 字符转为实体，并以换行符切割为数组

      let htmlStr // html字符串
      let node // DOM节点

      // 处理单行
      if (textList.length === 1 && textList[0]) {
        htmlStr = textList[0].replace(/\n+/g, '\n')
        node = document.createTextNode(htmlStr)
      } else {
        // 处理多行
        htmlStr = textList.reduce((pre, cur, i) => {
          cur = cur.replace(/^\s+/, '') // 去除开头的所有空格
          return (pre += i === 0 ? cur : `<div>${cur}</div>`) // 第一行不处理为div
        }, '')

        node = document.createRange().createContextualFragment(htmlStr) // 解析字符串为DOM
        // this.$refs['rich-input'].insertAdjacentHTML('beforeend', htmlStr)
      }
      this.value += htmlStr
      selection.deleteFromDocument()
      selection.getRangeAt(0).insertNode(node)
      selection.removeAllRanges()
      this.setFocus(this.$refs['rich-input'])
    },
    setFocus(el) {
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      const sel = window.getSelection()
      // 判断光标位置，如不需要可删除
      if (sel.anchorOffset !== 0) {
        return
      }
      sel.removeAllRanges()
      sel.addRange(range)
    },
    // 粘贴图片
    handlePasteImg(img, target) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (target.children.length === 2) {
          target.removeChild(target.lastChild) // 删除原有的图片
        }

        const img = document.createElement('div')
        img.style.cssText = `width: 5.3336rem; height:5.3336rem; background: url(${e.target.result}) no-repeat; background-size: cover; background-position: 50%;`

        target.appendChild(img)
        this.imgStr = img.outerHTML.replace('width', 'margin-top: .5rem; width')
      }
      reader.readAsDataURL(img)
    },
    // 移除已粘贴的图片
    removeImg() {
      const imgBox = this.$refs['image-preview-box']
      imgBox.removeChild(imgBox.lastChild)
      this.imgStr = ''
      this.showImgBox = false
    },
    // 字符转实体
    html2Escape(sHtml) {
      return sHtml.replace(/[<>&"']/g, (c) => {
        return {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&apos;'
        }[c]
      })
    },
    // 重置
    reset() {
      this.value = ''
      this.imgStr = ''
      this.showImgBox = false
      this.$refs['rich-input'].innerHTML = null
      this.$refs['rich-input'].blur()
    },
    // 关闭
    close() {
      this.$emit('form-delete', this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-form {
  max-width: 100%;
  padding: .8rem 1.0664rem;
  display: flex;
  background-color: #fafbfc;
  border-radius: 3px;
  .avatar-box {
    flex: 0 0 auto;
    img {
      margin: 0 .8rem 0 0;
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
        padding: .48rem .8rem;
        min-height: 1.04rem;
        line-height: 1.7;
        font-size: .8664rem;
        color: #17181a;
        word-break: break-word;
        touch-action: none;
        &:empty::before {
          content: attr(placeholder);
          opacity: .4;
          pointer-events: none;
          user-select: none;
        }
        &:enabled:before {
          content: none;
        }
      }
      .image-preview-box {
        display: inline-block;
        position: relative;
        margin: 0 .8rem .8rem;
        .clean-btn {
          position: absolute;
          top: .15rem;
          right: .2rem;
          cursor: pointer;
        }
      }
    }
    .option-box {
      margin-top: .52rem;
      display: flex;
      .submit-btn {
        flex: 0 0 auto;
        margin-left: auto;
        padding: .4rem 1.04rem;
        font-size: 1rem;
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
          opacity: .4;
          cursor: default;
        }
      }
    }
  }
  &.reply {
    margin-top: .8664rem;
    padding: .8rem;
    &.sub-reply {
      background-color: #fff;
      border: 1px solid #f1f1f2;
    }
    .avatar-box {
      display: none;
    }
  }
}
</style>
