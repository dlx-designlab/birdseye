<template>
  <div class="sidebar-container">
    <div class="top-menu">
      <div class="menu-buttons-container">
        <button class="main-header-button" @click="goToStories">
          <img src="/images/ui/search.png" class='sidebar-icon' />
        </button>
        <button
          class="main-header-button"
          @click="goToMap"
        >
          <img src="/images/ui/map.png" class='sidebar-icon' />
        </button>
        <button
          class="main-header-button"
          @click="goToAnalyse"
        >
          <img src="/images/ui/analytics.png" class='sidebar-icon' />
        </button>
        <button class="main-header-button" @click="goToUser">
          <img src="/images/ui/user.png" class='sidebar-icon' />
        </button>
      </div>
    </div>

    <div class="subheader-container">
     <div class="lang-select-container">
       <span
        @click="selectJP"
        :class="[{ 'highlighted': $i18n.locale === 'jp' }]">
          JP
        </span> /
        <span
          @click="selectEN"
          :class="[{ 'highlighted': $i18n.locale === 'en' }]">
            EN
          </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainUi',
  props: {
    mode: String,
  },
  data() {
    return {
    };
  },
  methods: {
    selectJP() {
      this.$emit('langChanged');
      this.$i18n.locale = 'jp';
    },
    selectEN() {
      this.$emit('langChanged');
      this.$i18n.locale = 'en';
    },
    goToMap() {
      this.$emit('goToMap');
    },
    goToUser() {
      this.$emit('goToUser');
    },
    goToStories() {
      this.$emit('goToStories');
    },
    goToTimeline() {
      this.$emit('goToTimeline');
    },
    goToPattern() {
      this.$emit('goToPattern');
    },
    goToAnalyse() {
      this.$emit('goToAnalyse');
    },
    goToHelp() {
      this.$emit('goToHelp');
    },
    getSearchResult(search) {
      this.$emit('getSearchResult', search);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .sidebar-container {
    height: 100%;
    width: 6vw;
    padding: 0; margin: 0;
    left: 0; top: 0;
    display: flex;
    flex-direction: column;
    position: absolute;
    background-color: #C4C4C4;

  .subheader-container {
    display: flex;
    flex-direction: row;
    height: 75px;
    width: 100%;

    .lang-select-container {
      font-size: 0.9em;
      margin: 0 auto;
      cursor: pointer;

      span {
        &.highlighted {
          color: #ffffff;
        }
      }
    }

    .bar {
      width: 90%;

      &.investigate-bar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .top-menu {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 100%;
    margin: 10vh 0;

    .menu-buttons-container {
      display: flex;
      flex-direction: column;
      height: 100%;

      .main-header-button {
        background: none;
        color: #DD4126;
        border: none;
        outline: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 25%;
        padding: 10px;

        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
