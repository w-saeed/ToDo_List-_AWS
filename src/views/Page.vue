<template>
  <div class="page">
    <TodoAppVue></TodoAppVue>
  </div>
</template>




<script>
// @ is an alias to /src
import TodoAppVue from "../components/TodoApp.vue";

export default {
  name: "Page",
  components: {
    TodoAppVue,
  },
};
</script>
