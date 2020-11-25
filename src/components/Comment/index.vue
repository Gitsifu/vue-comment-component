<template>
  <div id="comment">
    <!-- 顶部评论表单区域 -->
    <comment-form @form-submit="formSubmit">
      <img src="../../assets/image/comment.png">
    </comment-form>

    <!-- 底部评论列表 -->
    <comment-list v-if="data" ref="comment-list">
      <!-- 单个评论 -->
      <comment-item
        v-for="(item, i) in data"
        :id="`comment-${i}`"
        :key="`comment-${i}`"
        :comment="item"
        :is-active="isActive(`comment-${i}`)"
        @comment-reply="hasForm"
      >
        <!-- 回复评论的表单区域 -->
        <template #default="{id}">
          <comment-form
            v-if="isActive(id)"
            :id="id"
            @form-submit="formSubmit"
            @form-delete="deleteForm"
          />
        </template>

        <!-- 回复列表 -->
        <template #replyList="{parentId}">
          <comment-list v-if="item.children && item.children.length > 0">
            <!-- 单条回复 -->
            <comment-item
              v-for="(child, j) in item.children"
              :id="`${parentId}-${j}`"
              :key="`${parentId}-${j}`"
              :comment="child"
              :is-active="isActive(`${parentId}-${j}`)"
              @comment-reply="hasForm"
            >
              <!-- 回复回复的表单区域 -->
              <comment-form
                v-if="isActive(`${parentId}-${j}`)"
                :id="`${parentId}-${j}`"
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
  model: {
    prop: 'data',
    event: 'input'
  },
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    props: {
      type: Object,
      default: () => {}
    },
    handleSubmit: {
      type: Function,
      default: new Function(),
      required: true
    }
  },
  data() {
    return {
      forms: []
    }
  },
  methods: {
    // * 点击回复按钮，判断是否已存在该id的表单，存在删除该表单，不存在则新增该表单
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
    // * 表单提交事件
    async formSubmit({ id, content, callback }) {
      // 等待外部提交事件执行
      try {
        await this.handleSubmit({ content })
      } catch (e) {
        console.log(e)
      }

      //  插入数据
      const commentIndex = id.split('-')[1]
      let data = []

      if (commentIndex === 'root') {
        data = this.data.concat({ content })
      } else {
        data = this.data.map((c, i) => {
          if (i === +commentIndex) {
            c.children.push({ content })
          }
          return c
        })
      }

      callback()
      this.$emit('input', data)
    },
    // * 判断单个评论中的表单是否存在于视图上
    isActive(index) {
      return this.forms.includes(index)
    },
    // * 向下传递blur事件
    dispatchBlur(target, id) {
      const children = target.$children

      if (children) {
        this.dispatchBlur(children, id)
      }

      if (Array.isArray(target)) {
        target.map((c) => this.dispatchBlur(c, id))
      } else {
        const richInput = target.$refs['rich-input']
        if (richInput) {
          richInput.blur()
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
