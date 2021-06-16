<template>
    <div class="timeline-map-container">
      <img
          class="thumbnail"
        />
        <div
            class="timeline-popout-component-container"
            v-if="story"
        >
            <SearchPopout
              :selectedData="story"
              @closeStory="closeStory"
            />

        </div>
        <GmapMap
            :center="{lat: storiesAtThisDate ? storiesAtThisDate.lat : 0,
              lng: storiesAtThisDate ? storiesAtThisDate.lng : 0}"
            :zoom="storiesAtThisDate ? 4 : 1"
            map-type-id="satellite"
            style="width: 100%; height: 100%"
            :options="{
                styles,
                disableDefaultUI: true,
                clickableIcons: false,
            }"
            class="search-map"
            ref="thisMap"
        >
        <div v-if="filteredData">
          <div
            v-for="story in filteredData"
            v-bind:key="story.title"
          >
            <gmap-custom-marker
              ref="markers"
              :marker="story"
              @click.native="selectStory(story)"
          >
              <div class="marker-container">
                <div
                  @mouseover="showingScrubber? hover = null : hover = story"
                  @mouseleave="hover = null"
                  :class="[{ selected: dateIndex === story.date }, 'map-marker']">
                  <div v-if="dateIndex === story.date">
                    <img @mouseover="stopTimelapse()" class="preview-image" :src="story.img" />
                  </div>
                </div>
              </div>
          </gmap-custom-marker>
          </div>
        </div>
        </GmapMap>
        <div :class="['slider-container', {'invisible': !showingScrubber }]">
          <vue-slider
              class="slider"
              v-model="dateIndex"
              :data="getDateSlice"
              @change="onUpdate"
              :tooltip="'none'"
              v-bind="options"
              ref="vueSlider"
              :marks="datesWithEvents"
              :interval=1
              :absorb="true"
              :included="true"
          />

        <div
          v-if="currentDateIndex > 0"
          class="left-arrow" v-html="'<'"
          @click="showPrev"
        />
        <div
          v-if="currentDateIndex < datesWithEvents.length - 1"
          class="right-arrow"
          v-html="'>'"
           @click="showNext"
        />
        </div>

    </div>
</template>

<script>
import ee from '@google/earthengine';
import GmapCustomMarker from 'vue2-gmap-custom-marker';
import moment from 'moment';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import STORIES from '../../data/stories.json';
import SearchPopout from '../search-body/search-popout.vue';

let mouseX;
let mouseY;

export default {
  name: 'Timeline',
  components: {
    VueSlider,
    GmapCustomMarker,
    SearchPopout,
  },
  props: {
    timelapse: Boolean,
    showingScrubber: Boolean,
    submittedData: Array,
    filteredData: Array,
    showingData: Boolean,
  },
  watch: {
    timelapse() {
      if (this.timelapse && !this.timelapseTimeout) {
        this.timelapseTimeout = setInterval(() => {
          if (this.currentDateIndex + 1 < this.datesWithEvents.length) {
            this.showNext();
          } else {
            clearTimeout(this.timelapseTimeout);
            this.timelapseTimeout = null;
          }
        }, 4000);
      } else if (!this.timelapse) {
        this.stopTimelapse();
      }
    },
    showingData() {
      if (this.showingData) {
        this.showMap();
      } else {
        this.hideMap();
      }
    },
    filteredData() {
      this.fillDateArray();
      if (this.showingData) {
        this.hideMap();
        this.showMap();
      }
    },
    hover() {
      if (this.hover) {
        // const result = this.getSingleStory(this.hover);
        this.showThumbnail(this.hover);
      } else {
        this.hideThumbnail();
      }
    },
  },
  mounted() {
    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    // eslint-disable-next-line prefer-destructuring
    this.dateIndex = this.datesWithEvents[0];
  },
  beforeUnmount() {
    document.removeEventListener('mousemove');
  },
  computed: {
    storiesAtThisDate() {
      const filtered = this.filteredData.filter((story) => story.date === this.dateIndex);
      return filtered[0];
    },
    getDateSlice() {
      return this.dateArray;
    },
  },
  methods: {
    stopTimelapse() {
      clearTimeout(this.timelapseTimeout);
      this.timelapseTimeout = null;
    },
    showNext() {
      if (this.currentDateIndex + 1 < this.datesWithEvents.length) {
        this.currentDateIndex += 1;
        this.dateIndex = this.datesWithEvents[this.currentDateIndex];
        const [result] = this.filteredData.filter((entry) => entry.date === this.dateIndex);
        this.$refs.thisMap.$mapObject.setCenter({ lat: result.lat, lng: result.lng });
        if (this.showingData) {
          this.hideMap();
          this.showMap();
        }
      }
    },
    showPrev() {
      if (this.currentDateIndex > 0) {
        this.currentDateIndex -= 1;
        this.dateIndex = this.datesWithEvents[this.currentDateIndex];
        const [result] = this.filteredData.filter((entry) => entry.date === this.dateIndex);
        this.$refs.thisMap.$mapObject.setCenter({ lat: result.lat, lng: result.lng });
        if (this.showingData) {
          this.hideMap();
          this.showMap();
        }
      }
    },
    hideThumbnail() {
      const element = document.querySelector('.thumbnail');
      element.style.display = 'none';
    },
    showThumbnail(result) {
      const element = document.querySelector('.thumbnail');
      element.style.display = 'block';
      element.style.left = `${mouseX + 15}px`;
      element.style.top = `${mouseY + 15}px`;
      element.src = result.img;
    },
    showMap() {
      this.fetchMap(this.storiesAtThisDate.satellite_data_assigned);
    },
    hideMap() {
      this.$refs.thisMap.$mapObject.overlayMapTypes.pop();
    },
    initialize(mapid) {
      const tileSource = new ee.layers.EarthEngineTileSource({
        mapid,
      });
      const overlay = new ee.layers.ImageOverlay(tileSource);
      this.$refs.thisMap.$mapObject.overlayMapTypes.pop();
      this.$refs.thisMap.$mapObject.overlayMapTypes.push(overlay);
    },
    fetchMap(mapid = 'mapid2') {
      fetch(`https://forensic-storytelling.uc.r.appspot.com/${mapid}`)
        .then((response) => response.text())
        // eslint-disable-next-line no-shadow
        .then((mapid) => this.initialize(mapid));
    },
    selectStory(story) {
      this.story = [story];
    },
    closeStory() {
      this.story = null;
    },
    onUpdate(e) {
      this.currentDateIndex = this.datesWithEvents.indexOf(e);
      const [result] = this.filteredData.filter((entry) => entry.date === this.dateIndex);
      if (result) {
        this.$refs.thisMap.$mapObject.setCenter({ lat: result.lat, lng: result.lng });
        if (this.showingData) {
          this.hideMap();
          this.showMap();
        }
      }
    },
    fillDateArray() {
      this.dateArray = [];
      this.datesWithEvents = [];
      if (this.filteredData.length > 0) {
        this.filteredData.forEach((story) => this.datesWithEvents.push(story.date));
        let startDate = moment(this.filteredData[0].date);
        const lastDate = moment(this.filteredData[this.filteredData.length - 1].date);
        this.dateArray.push(startDate.format('YYYY-MM-DD'));
        while (!startDate.isSame(lastDate)) {
          startDate = startDate.add(1, 'days');
          this.dateArray.push(startDate.format('YYYY-MM-DD'));
        }
      }
      this.dateIndex = this.datesWithEvents[0] || 0;
      this.currentDateIndex = 0;
    },
  },
  beforeMount() {
    this.fillDateArray();
  },
  data() {
    return {
      timelapseTimeout: null,
      timelinePagination: 1,
      hover: null,
      STORIES,
      story: null,
      showingSatellite: false,
      dateIndex: '2021-01-03',
      dateArray: [],
      datesWithEvents: [],
      currentDateIndex: 0,
      options: {
        dotSize: 12,
        height: 8,
        marks: true,
      },
      styles: [
        {
          elementType: 'geometry',
          stylers: [
            {
              color: '#212121',
            },
          ],
        },
        {
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#757575',
            },
          ],
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#212121',
            },
          ],
        },
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [
            {
              color: '#757575',
            },
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'administrative.country',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#000000',
            },
          ],
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#9e9e9e',
            },
          ],
        },
        {
          featureType: 'administrative.land_parcel',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#bdbdbd',
            },
          ],
        },
        {
          featureType: 'administrative.neighborhood',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#757575',
            },
          ],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [
            {
              color: '#181818',
            },
          ],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#616161',
            },
          ],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#1b1b1b',
            },
          ],
        },
        {
          featureType: 'road',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#2c2c2c',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#8a8a8a',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [
            {
              color: '#373737',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [
            {
              color: '#3c3c3c',
            },
          ],
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [
            {
              color: '#4e4e4e',
            },
          ],
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#616161',
            },
          ],
        },
        {
          featureType: 'transit',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'transit',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#757575',
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000',
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ffffff',
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#3d3d3d',
            },
          ],
        },
      ],
    };
  },
};
</script>

<style >
 .vue-slider-rail {
    background-color: #000000 !important;
  }

  .vue-slider-process {
    background-color: #000000 !important;
  }

  .vue-slider-mark-step-active {
    box-shadow: 0 0 0 0px #000000 !important;
  }

  .vue-slider:hover .vue-slider-mark-step-active {
    box-shadow: 0 0 0 0px #000000 !important;
  }

  .vue-slider-dot-handle {
    cursor: pointer;
    width: 25px;
    height: 25px;
    margin-top: -6px;
    border-radius: 0%;
    background-color: #000000;
    border: 2px solid #000000;
    box-sizing: border-box;
  }

  .vue-slider-mark-step {
      width: 23px;
      height: 23px;
      margin-top: -6px;
      border-radius: 0 !important;
      box-shadow: 0 0 0 0px #000000;
      background-color:#000000;
  }

  .vue-slider:hover .vue-slider-mark-step-active:before, .vue-slider-mark-step-active:before {
    content: " ";
    position: absolute;
    z-index: -1;
    top: -7.5px;
    left: -7.5px;
    right: -7.5px;
    bottom: -7.5px;
  }

  .vue-slider:hover .vue-slider-dot-handle {
    border-color: #000000;
  }

  .vue-slider-dot-handle-focus {
    border-color: #000000;
    box-shadow: 0 0 0 5px rgba(54, 171, 255, 0.2);
  }

  .vue-slider:hover .vue-slider-dot-handle-focus {
    border-color: #000000;
  }

  .vue-slider-dot-handle:hover {
    border-color: #000000;
  }
  .vue-slider:hover .vue-slider-dot-handle:hover {
    border-color: #000000;
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 .left-arrow {
    bottom: 0px;
    width: 50px;
    height: 35px;
    z-index: 100;
    position: absolute;
    font-size: 3em;
    cursor: pointer;
  }

  .right-arrow {
    bottom: 0px;
    right: 0;
    width: 50px;
    font-size: 3em;
    height: 35px;
    z-index: 100;
    position: absolute;
    cursor: pointer;
  }

  .slider-container {
    position: relative;
    bottom: 50px;
    width: 90%;
    margin-left: 5%;
    left: 0;

    &.invisible {
      display: none;
    }
  }

  .thumbnail {
    width: 150px;
    height: 150px;
    position: fixed;
    z-index: 4;
    display: none;
  }

  .timeline-map-container {
    width: 100%;
    height: 100%;

    .timeline-popout-component-container {
      width: 100%;
      left: 0; top: 0;
      position: absolute;
      z-index: 3;
      background-color: rgba(0, 0, 0, 0.5);
      height: 100%;
    }

    .slider {
      bottom: 10%;
      position: relative !important;
      width: 80% !important;
      left: 10%;
    }

    .map-marker {
      width: 20px;
      height: 20px;
      background-color: #01A96B;
      cursor: pointer;

    .preview-image {
      width: 150px;
      height: 150px;
      margin-left: 35px; margin-top: 35px;
    }

    .preview-title {
      color: #000000;
      width: 200px;
    }

    &.selected {

    }
  }

  .selected:before {
    content: " ";
    position: absolute;
    z-index: -1;
    top: -7.5px;
    left: -7.5px;
    right: -7.5px;
    bottom: -7.5px;
    border: 1px solid #01A96B;
  }
}
</style>
