<template>
  <div class="comment-item">
    <div class="comment">
      <!-- 评论或回复人头像 -->
      <img
        class="avatar"
        :src="comment.user.avatar || ''"
        @error="(e) => e.target.classList.add('error')"
      >
      <div class="content-box">
        <!-- 评论或回复人具体信息 -->
        <div class="meta-box">
          <slot name="userMeta">
            <div class="user-popover-box">
              <span v-if="comment.user">{{ comment.user.name }}</span>
            </div>
          </slot>
        </div>

        <!-- 评论或回复内容 -->
        <div class="content">
          <span
            v-if="comment.reply"
          >回复
            <span
              v-if="comment.reply"
              class="reply-target"
              style="color: #406599"
              :title="comment.reply.email"
            >{{ comment.reply.name + '：' }}</span></span>{{ comment.content }}
        </div>

        <!-- 评论或回复时间及操作 -->
        <div class="reply-stat">
          <time
            :title="formatTime(comment.createAt, true)"
            :datetime="comment.createAt"
          >{{ formatTime(comment.createAt) }}</time>
          <!-- <div class="delete">
            &nbsp; · &nbsp; 删除
          </div> -->
          <div class="action-box">
            <div
              class="like-action action"
              :class="{ active: comment.liked }"
              @click.stop="$emit('comment-like', { id, comment })"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                class="icon like-icon"
              >
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h20v20H0z" />
                  <path
                    :stroke="comment.liked ? '#37C700' : '#8A93A0'"
                    stroke-linejoin="round"
                    fill="currentColor"
                    d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"
                  />
                </g>
              </svg>
              <span v-show="comment.likes" class="action-title">{{
                comment.likes
              }}</span>
            </div>
            <div
              class="comment-action action"
              @mousedown.prevent="$emit('comment-reply', id)"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                class="icon comment-icon"
              >
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h20v20H0z" />
                  <path
                    stroke="#8A93A0"
                    stroke-linejoin="round"
                    d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"
                  />
                </g>
              </svg>
              <span class="action-title">回复</span>
            </div>
          </div>
        </div>

        <!-- 评论表单组件 -->
        <slot :id="id" />

        <!-- 回复列表 -->
        <div v-if="hasSubList" class="sub-comment-list">
          <slot name="replyList" :parentId="id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      default: () => {},
      required: true
    },
    id: {
      type: [String, Number],
      default: '',
      required: true
    }
  },
  computed: {
    hasSubList() {
      return this.id.split('-').length === 2
    }
  },
  methods: {
    formatTime(time, local = false) {
      const d = new Date(time)

      if (local) {
        return d.toString()
      }

      const now = Date.now()
      const diff = (now - d) / 1000

      if (diff < 30) {
        return '刚刚'
      } else if (diff < 3600) {
        return Math.ceil(diff / 60) + '分钟前'
      } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
      } else if (diff < 3600 * 24 * 30) {
        return Math.floor(diff / 3600 / 24) + '天前'
      } else if (diff < 3600 * 24 * 365) {
        return Math.floor(diff / 3600 / 24 / 30) + '月前'
      } else {
        return Math.floor(diff / 3600 / 24 / 365) + '年前'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  margin-bottom: 1.333em;
  &:not(:last-child) {
    .content-box {
      border-bottom: 1px solid #f1f1f1;
    }
  }
  .comment {
    display: flex;
    .content-box {
      margin-left: 0.833em;
      flex: 1 1 auto;
      .meta-box {
        display: flex;
        align-items: center;
        font-size: 1.407em;
        line-height: 1.25;
        white-space: nowrap;
        cursor: pointer;
      }
      .content {
        margin-top: 0.55em;
        font-size: 1.407em;
        line-height: 1.833em;
        word-wrap: break-word;
        white-space: pre-wrap;
        color: #505050;
        overflow: hidden;
        .reply-target {
          cursor: pointer;
        }
      }
      &.focus {
        padding-bottom: 0.5em;
      }
    }
    .reply-stat {
      display: flex;
      margin-top: 7px;
      font-weight: 400;
      time {
        font-size: 1.407em;
        color: #8a9aa9;
        cursor: text;
      }
      .delete {
        font-size: 1.407em;
        color: #8a9aa9;
        cursor: default;
      }
      .action-box {
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        margin-left: auto;
        min-width: 11em;
        color: #8a93a0;
        user-select: none;
        .action {
          display: flex;
          align-items: center;
          margin-left: 0.5em;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          &.active {
            color: #37c700;
          }
          .icon {
            min-width: 16px;
            min-height: 16px;
            width: 1.666em;
            height: 1.666em;
          }
          .action-title {
            margin-left: 0.25em;
            font-size: 1.407em;
          }
        }
      }
    }
  }
}
.sub-comment-list {
  margin: 1em 0;
  padding: 0 0 0 1em;
  background-color: #fafbfc;
  border-radius: 3px;
  .comment-item {
    margin-bottom: 0;
    &:last-child .content-box {
      border-bottom: none;
    }
    .comment {
      position: relative;
      padding: 1em 0 0;

      .content-box {
        margin-right: 1em;
        padding-bottom: 12px;
      }
    }
  }
}
</style>
