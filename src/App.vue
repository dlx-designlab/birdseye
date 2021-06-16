<template>
  <div id="app">
    <div class="sidebar-component-container">
      <Sidebar
        :mode="mode"
        @goToMap="goToMap"
        @goToStories="goToStories"
        @goToUser="goToUser"
        @goToTimeline="goToTimeline"
        @goToPattern="goToPattern"
        @goToAnalyse="goToAnalyse"
        @getSearchResult="getSearchResult"
        @langChanged="langChanged"
      />
    </div>
    <MainBody
      :mode="mode"
      :search="search"
      ref="mainBody"
    />
  </div>
</template>

<script>
import Sidebar from './components/sidebar.vue';
import MainBody from './components/main-body.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
    MainBody,
  },
  data() {
    return {
      mode: 'search_stories', // search_map / search_stories / upload / analyse
      search: null,
      showingUploader: false,
    };
  },
  methods: {
    langChanged() {
      this.$refs.mainBody.forceRerender();
    },
    goToMap() {
      this.mode = 'search_map';
    },
    goToStories() {
      this.mode = 'search_stories';
    },
    goToUser() {
      this.mode = 'profile';
    },
    goToTimeline() {
      this.mode = 'investigate_timeline';
    },
    goToPattern() {
      this.mode = 'investigate_pattern';
    },
    goToAnalyse() {
      this.mode = 'analyse';
    },
    getSearchResult(search) {
      this.mode = 'search_stories';
      this.search = search;
    },
  },
};
</script>

<style lang="scss">
#app {
  top: 0; left: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  margin: 0; padding: 0;
  font-family: Arial, Helvetica, Avenir, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .slide-leave-active,
  .slide-enter-active {
    transition: 1s;
  }
  .slide-enter {
    transform: translate(100%, 0);
  }
  .slide-leave-to {
    transform: translate(100%, 0);
  }

  .sidebar-component-container {
    height: 100%;
    position: absoliute;
    position: absolute;
    z-index: 6;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
}

  button {
    cursor: pointer;
    outline: 0;
  }

  button:focus {
    outline: 0;
    box-shadow: none;
  }
}
</style>
