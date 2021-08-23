<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "RuoYiDoc",
  data() {
    return {
      url: "http://hinachen.com"
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    }
  }
};
</script>
