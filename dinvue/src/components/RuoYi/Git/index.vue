<template>
  <div>
    <svg-icon icon-class="gitee" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "RuoYiGit",
  data() {
    return {
      url: "https://hinachen.com"
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    }
  }
};
</script>
