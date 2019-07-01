<template>
  <div id="app">
    <Navbar/>
    <md-editer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Navbar from './components/Navbar.vue';
import MdEditer from './components/MdEditer.vue';

export default Vue.extend({
  name: 'app',
  components: {
    Navbar,
    MdEditer,
  },
});
</script>
