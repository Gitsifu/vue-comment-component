import component from './src/components/Comment/index.vue'

component.install = function(Vue) {
  Vue.component(component.name, component)
}

export default component
