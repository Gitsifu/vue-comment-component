<template>
  <div class="comment-list" :class="{ child: parentId }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CommentList',
  props: {
    parentId: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
/*   &.child {
    padding-bottom: 0.3rem;
    ::v-deep .comment-item {
      margin-top: 0;
      padding-top: 0.8rem;
      background-color: #fafbfc;
      &:last-child {
        margin-bottom: 0.5rem;
        .right {
          border-bottom: none;
        }
      }
    }
  } */
}
</style>
