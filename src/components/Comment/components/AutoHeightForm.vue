<template>
  <div
    ref="rich-input"
    class="rich-input"
    contenteditable="true"
    spellcheck="false"
    disabled="disabled"
    :placeholder="placeholder"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
export default {
}
</script>

<style></style>
