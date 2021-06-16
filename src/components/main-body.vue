<template>
    <div class="main-body-container">
      <transition name="fade">
        <div class="main-body" v-if="mode==='search_map'">
            <SearchMap
              @openUploader="openUploader"
              :submittedData="submittedData"
            />
        </div>
      </transition>
      <transition name="fade">
        <div class="main-body" v-if="mode==='search_stories'">
            <SearchStories
              :key="storiesKey"
              :search="search"
              @openUploader="openUploader"
              :submittedData="submittedData"
              :showingUploader="showingUploader"
            />
        </div>
      </transition>
      <transition name="fade">
        <div class="main-body" v-if="mode==='analyse'">
          <Analyse :submittedData="submittedData"/>
        </div>
      </transition>
      <transition name="fade">
        <div class="main-body" v-if="mode==='investigate_timeline'">
            <InvestigateTimeline />
        </div>
      </transition>
      <transition name="fade">
        <div class="main-body" v-if="mode==='investigate_pattern'">
            <InvestigatePattern />
        </div>
      </transition>
      <transition name="fade">
        <div class="main-body" v-if="mode==='profile'">
            <UserProfile />
        </div>
      </transition>
      <transition name="fade">
        <div
          class="uploader-container"
          v-if="showingUploader"
        >
          <Upload
            @submitData="submitData"
            @closeUploader="closeUploader"
          />
        </div>
      </transition>
    </div>
</template>

<script>
import SearchMap from './search-body/map.vue';
import UserProfile from './profile/profile.vue';
import SearchStories from './search-body/stories.vue';
import Upload from './upload-body/upload.vue';
import Analyse from './analyse-body/analyse.vue';

import InvestigateTimeline from './investigate-body/timeline.vue';
import InvestigatePattern from './investigate-body/_pattern.vue';

export default {
  name: 'Body',
  components: {
    SearchMap,
    SearchStories,
    Upload,
    InvestigateTimeline,
    InvestigatePattern,
    UserProfile,
    Analyse,
  },
  props: {
    mode: String,
    search: String,
  },
  methods: {
    forceRerender() {
      this.storiesKey += 1;
    },
    openUploader() {
      this.showingUploader = true;
    },
    closeUploader() {
      this.showingUploader = false;
    },
    submitData(data) {
      this.submittedData.push(data);
      this.showingUploader = false;
    },
  },
  data() {
    return {
      storiesKey: 1,
      showingUploader: false,
      submittedData: [],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-body-container {
    width: 100%;
    display: flex;
    overflow: hidden;

      .uploader-container {
        width: 100vw;
        height: 100vh;
        position: absolute;
        z-index: 4;
        background-color: rgba(255, 255, 255, 0.7);
        left: 6vw;
      }

    .main-body {
      width: 94vw;
      left: 6vw;
      height: 100vh;
      position: absolute;
  }
}

</style>
