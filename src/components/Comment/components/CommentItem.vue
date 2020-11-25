<template>
  <div class="comment-item">
    <div class="comment">
      <img class="avatar" src="../../../assets/image/avatar1.jpg">
      <div class="content-box">
        <div class="meta-box">
          <slot name="visitorMeta">
            <div class="user-popover-box">
              <span v-if="comment.visitor">{{ comment.visitor.name }}</span>
            </div>
          </slot>
        </div>
        <div class="content">
          <span
            v-if="comment.reply"
          >回复
            <span
              class="pointer"
              style="color: #406599"
              :title="comment.reply.email"
            >{{ comment.reply.name + '：' }}</span></span>{{ comment.content }}
        </div>
        <div class="reply-stat">
          <time :datetime="comment.created">{{ comment.created }}</time>
          <!-- <div class="delete">
            &nbsp; · &nbsp; 删除
          </div> -->
          <div class="action-box">
            <div class="like-action action">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                class="icon like-icon"
              >
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h20v20H0z" />
                  <path
                    stroke="#8A93A0"
                    stroke-linejoin="round"
                    d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"
                  />
                </g>
              </svg>
              <span v-if="comment.likes" class="action-title">{{
                comment.likes
              }}</span>
            </div>
            <div
              class="comment-action action"
              @mousedown.prevent="$emit('comment-reply', id)"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
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
        <slot :id="id" />

        <div class="sub-comment-list">
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
      default: () => {}
    },
    id: {
      type: [String, Number],
      default: ''
    },
    parentId: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  margin-bottom: 1.333rem;
  &:not(:last-child) {
    .content-box {
      border-bottom: 1px solid #f1f1f1;
    }
  }
  .comment {
    display: flex;
    .content-box {
      margin-left: 0.833rem;
      flex: 1 1 auto;
      .meta-box {
        display: flex;
        align-items: center;
        font-size: 1.083rem;
        line-height: 1.25;
        white-space: nowrap;
      }
      .content {
        margin-top: 0.55rem;
        font-size: 1.083rem;
        line-height: 1.833rem;
        word-wrap: break-word;
        white-space: pre-wrap;
        color: #505050;
        overflow: hidden;
      }
      &.focus {
        padding-bottom: 0.5rem;
      }
    }
    .reply-stat {
      display: flex;
      margin-top: 7px;
      font-weight: 400;
      time {
        font-size: 1.083rem;
        color: #8a9aa9;
        cursor: default;
      }
      .delete {
        font-size: 1.083rem;
        color: #8a9aa9;
        cursor: default;
      }
      .action-box {
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        margin-left: auto;
        min-width: 8.8rem;
        color: #8a93a0;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .action {
          display: flex;
          align-items: center;
          margin-left: 0.5rem;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
.sub-comment-list {
  margin: 1rem 0;
  padding: 0 0 0 1rem;
  background-color: #fafbfc;
  border-radius: 3px;
}
</style>
