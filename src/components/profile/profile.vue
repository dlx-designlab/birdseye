<template>
    <div class="profile-container">
        <transition name="fade">
          <div
            class="section-container"
            v-if="sectionSelected"
          >
            <Points @closeSection="closeSection" v-if="sectionSelected==='points'" />
            <Alerts @closeSection="closeSection" v-else-if="sectionSelected==='alerts'" />
            <Archives @closeSection="closeSection" v-else-if="sectionSelected==='archives'" />
            <Network @closeSection="closeSection" v-else-if="sectionSelected==='network'" />
          </div>
        </transition>
        <div class="left-section-container">
          <div class="top">
            <h2>JOHN SMITH</h2>
            <img
              src="/images/ui/user-icon-large.png"
              class="user-icon"
            />
          </div>
          <div class="bottom">
            <h2>{{ $t('profile-page.settings') }}</h2>
            <div class="settings">
              <div class="location-setting">
                <img
                  src="/images/ui/history-icon.png"
                  class="location-history-image"
                >
                <span>{{ $t('profile-page.location-history') }}</span>
              </div>
              <div class="suggestion-setting">
                <img
                  src="/images/ui/settings-icon.png"
                  class="settings-image"
                >
                <span>{{ $t('profile-page.suggestion-pref') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-section-container">

          <div @click="openPoints" class="section points">
            <h1>{{$t('points-page.title')}}</h1>
            <div class="stats">
              {{$t('points-page.counter')}}
            </div>
          </div>

          <div @click="openNetwork" class="section network">
            <h1>{{$t('network-page.title')}}</h1>
            <div class="stats">
              {{ $t('network-page.connections-count') }}
            </div>
          </div>

          <div @click="openAlerts" class="section alerts">
            <h1>{{$t('alerts-page.title')}}</h1>
            <div class="stats">
              {{$t('profile-page.five-keywords')}}
            </div>
          </div>

          <div @click="openArchives" class="section archives">
            <h1>{{$t('archives-page.title')}}</h1>
            <div class="stats">
              {{$t('profile-page.saved')}}
            </div>
          </div>

        </div>
    </div>
</template>

<script>
import Alerts from './alerts.vue';
import Archives from './archives.vue';
import Network from './network.vue';
import Points from './points.vue';

export default {
  name: 'profile',
  components: {
    Alerts,
    Archives,
    Network,
    Points,
  },
  props: {
  },
  methods: {
    openAlerts() {
      this.sectionSelected = 'alerts';
    },
    openArchives() {
      this.sectionSelected = 'archives';
    },
    openNetwork() {
      this.sectionSelected = 'network';
    },
    openPoints() {
      this.sectionSelected = 'points';
    },
    openProfile() {
      this.sectionSelected = 'profile';
    },
    closeSection() {
      this.sectionSelected = null;
    },
  },
  data() {
    return {
      sectionSelected: null,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.profile-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .section-container {
      z-index: 5;
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .left-section-container {
      display: flex;
      flex-direction: column;
      width: 40%;
      height: 100%;

      h2 {
        padding-top: 3vh;
        font-weight: 400;
        color: #000000;
      }

      .user-icon {
        width: 200px;
        padding-top: 3vh;
        cursor: pointer;
      }

      .top {
        background-color: #FFFFFF;
        height: 50%;
      }

      .bottom {
        background-color: #8B8888;
        height: 50%;

        .settings {
          display: flex;
          flex-direction: column;

          .location-setting, .suggestion-setting {
                cursor: pointer;
                position: relative;
                left: 50px;
                text-align: left;
                line-height: 60px;
                align-items: center;
                display: flex;
                flex-direction: row;
                color: #000000;
             img {
               margin-right: 20px;
              width: 50px;
              height: auto;
              line-height: 60px;
            }
          }
        }
      }
    }

    .right-section-container {
      display: flex;
      flex-direction: column;
      width: 60%;

      .section {
        padding: 25px;
        height: 25%;
        text-align: left;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;

        h1 {
          color: #FFFFFF;
          font-weight: 400;
          text-transform: uppercase;
        }

        .stats {
          position: absolute;
          right: 35px;
          color: #000000;
        }

        &.points {
          background-color: #00AA6B;
        }

        &.network {
          background-color: #0060FF;
        }

        &.alerts {
          background-color: #FE1F02;
        }

        &.archives {
          background-color: #F076A8;
        }
      }
    }
}

</style>
