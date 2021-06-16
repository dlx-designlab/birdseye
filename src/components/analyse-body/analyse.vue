<template>
    <div class="profile-container">
        <div class="left-section-container">
          <div class="top">
            <h2>{{$t('analyze.filters')}}</h2>
            <div class='input-container'>
              <div class="left-input">
                <input type="radio" id="allPosts" value="allPosts" v-model="filter">
                <label for="allPosts">{{$t('analyze.all-posts')}}</label>
              </div>
              <div class="right-input">
                <input type="radio" id="ownPosts" value="ownPosts" v-model="filter">
                <label for="ownPosts">{{$t('analyze.my-posts')}}</label>
              </div>
            </div>
            <SearchBar
                :mode="mode"
                @getSearchResult="getSearchResult"
            />
            <div class="date-selection">
              <span class="date-selector" @click="selectFromDate">{{$t('analyze.from')}}</span>
              <Datepicker v-model="fromDate" ref="fromDatepicker" input-class="date-picker-from"/>
              <span class="date-selector" @click="selectToDate">{{$t('analyze.to')}}</span>
              <Datepicker v-model="toDate" ref="toDatepicker" input-class="date-picker-to"/>
            </div>
            <div class="location-selector">
                <country-select
                  :placeholder="`${$t('analyze.location')}`"
                  class="location-picker"
                  v-model="country"
                  :country="country"
                  topCountry="US"
                />
            </div>
            <div class="submit-button-container">
              <button class="submit-button" @click="submit">
                <img
                  :src="submitted ?
                    '/images/ui/check-mark-checked.png' : '/images/ui/check-mark-unchecked.png'"
                />
              </button>
            </div>
          </div>
          <div class="bottom">
            <h2>{{$t('analyze.patterns')}}</h2>
            <div
                v-if="submitted"
                class="pattern-component-container">
                <PatternSection
                  :filteredData="filteredData"
                />
            </div>
          </div>
        </div>
        <div class="right-section-container">
            <div v-if="submitted" class="play-icon-container">
              <button @click="showData">
                <img src="/images/ui/play-icon.png" />
              </button>
            </div>
            <h2 v-if="!submitted">{{$t('analyze.timeline')}}</h2>
            <div
                v-if="submitted"
                class="timeline-container">
                <Timeline
                  :submittedData="submittedData"
                  :showingScrubber="showingScrubber"
                  :filteredData="filteredData"
                  :showingData="showingData"
                  :timelapse="timelapse"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import STORIES from '../../data/stories.json';
import COUNTRY_CODES from '../../data/country-codes.json';
import Timeline from '../investigate-body/timeline.vue';
import PatternSection from '../investigate-body/pattern.vue';
import SearchBar from '../header-bars/search.vue';

export default {
  name: 'profile',
  components: {
    Timeline,
    PatternSection,
    SearchBar,
    Datepicker,
  },
  props: {
    submittedData: Array,
  },
  computed: {
    filteredData() {
      const storiesToFilter = [];

      if (this.filter === 'ownPosts') {
        // might need to be [this.submittedData];
        storiesToFilter.push(this.submittedData[0]);
      } else if (this.searchResults) {
        storiesToFilter.push(this.searchResults);
      } else {
        storiesToFilter.push(STORIES);
      }

      let filtered;
      if (this.fromDate && this.toDate) {
        filtered = storiesToFilter[0].filter((story) => new Date(story.date) > this.fromDate
            && new Date(story.date) < this.toDate);
      } else {
        // eslint-disable-next-line prefer-destructuring
        filtered = storiesToFilter[0];
      }

      let finalPass;
      if (this.country) {
        const country = COUNTRY_CODES[this.country].FIELD4;
        const filterByCountry = filtered.filter((story) => story.location.includes(country));
        finalPass = filterByCountry;
      } else {
        finalPass = filtered || [];
      }

      const removeDuplicates = finalPass
        .filter((v, i, a) => a
          .findIndex((t) => (t.id === v.id)) === i);
      const sorted = removeDuplicates.sort((a, b) => new Date(a.date) - new Date(b.date));
      return sorted;
    },
  },
  methods: {
    selectFromDate() {
      this.$refs.fromDatepicker.showCalendar();
    },
    selectToDate() {
      this.$refs.toDatepicker.showCalendar();
    },
    getSearchResult(data) {
      this.searchResults = data;

      if (!this.submitted) {
        this.submitted = true;
      }
    },
    submit() {
      this.submitted = true;
    },
    startTimelapse() {
      this.timelapse = true;
    },
    stopTimelapse() {
      this.timelapse = false;
    },
    showData() {
      this.showingData = !this.showingData;
      if (this.timelapse) {
        this.stopTimelapse();
      } else {
        this.startTimelapse();
      }
    },
  },
  data() {
    return {
      timelapseTimeout: null,
      timelapse: false,
      mode: 'analyse',
      filter: null,
      submitted: false,
      fromDate: null,
      toDate: null,
      country: null,
      showingScrubber: true,
      searchResults: null,
      showingData: false,
    };
  },
};
</script>

<style>
  .date-picker-from {
      border: none !important;
      color: #000000;
      margin-left: 10px;
      background-color: rgba(255, 255, 255, 0);
      margin-right: 15px;
      max-width: 80px;
      cursor: pointer;
  }

  .date-picker-to {
      border: none !important;
      color: #000000;
      margin-left: 10px;
      background-color: rgba(255, 255, 255, 0);
      margin-right: 15px;
      cursor: pointer;
  }
</style>s

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.profile-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .left-section-container {
      display: flex;
      flex-direction: column;
      width: 50%;
      height: 100%;

      h2 {
          font-size: 2em;
          font-weight: 400;
          margin: 35px;
          padding: 15px;
          color: #000000;
          text-align: left;
          margin-bottom: 5px;
      }

      .top {
        background-color: #FFFFFF;
        height: 50%;
        display: flex;
        flex-direction: column;
        background: linear-gradient(-180deg, rgba(255, 255, 255, 100%) 0%, #0660ff 100%);

        .date-selection {
          position: relative;
          top: 30px;
          display:flex;
          margin: 1vw;
          flex-direction: row;
          color: #000000;
          margin-left: 50px;

          .date-selector {
            cursor: pointer;
          }
        }

        .submit-button-container {
          width: 100%;

          .submit-button {
            background: none;
            outline: none;
            border: none;
            float: right;
            bottom: 3vh;
            right: 3vw;
            position: relative;

          img {
            width: 70px;
          }
        }
      }

      .location-selector {
        position: relative;
        top: 45px;
        margin-left: 50px;
        display:flex;
        flex-direction:row;

        .location-picker{
          top: 15px;
          font-size: 1em;
          background-color: transparent;
          border: none;
        }

        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          text-indent: 1px;
          text-overflow: '';
        }

        select::-ms-expand {
          display: none;
        }
      }

      .input-container {
        display: flex;
        flex-direction: row;
        margin-left: 50px;

        .left-input {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .right-input {
          margin-left: 20%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        input[type=radio] {
          border: 2px solid #000000;
          padding: 0.8em;
          -webkit-appearance: none;
          margin-right: 20px;
          cursor: pointer;
          background-color: #ffffff;
        }

        input[type=radio]:checked {
          background-color: #000000;
          background-size: 9px 9px;
        }

        input[type=radio]:focus {
          outline-color: transparent;
        }
      }
    }

    .bottom {
      background-color: #8B8888;
      height: 50%;
      background: linear-gradient(-180deg, rgba(255, 255, 255, 100%) 0%, #01A96B 100%);

      .pattern-component-container {
          max-height: 100%;
      }
    }
  }

  .right-section-container {
    display: flex;
    flex-direction: column;
    width: 50%;
    background: linear-gradient(-180deg, #F89F39 0, rgba(255, 255, 255, 100%) 100%);

    .play-icon-container {
      position: absolute;
      right: 30px;
      top: 30px;
      z-index: 4;

      button {
        border: none;
        outline: none;
        background: none;
        cursor: pointer;
      }

      img {
        width: 70px;
      }
    }

    .timeline-container {
        height: 100%;
    }
  }
}
</style>
