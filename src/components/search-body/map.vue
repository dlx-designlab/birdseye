<template>
    <div class="search-map-container">
      <div class="map-stories-buttons-container">
          <div class="buttons-border">
              <button
                  @click="toggleFootprint(true)"
                  :class="['stories-button', {selected: showingFootprint }]"
              >
                  {{ $t('search-stories-page.area')}}
              </button>
              <button
                  @click="toggleFootprint(false)"
                  :class="['map-button', {selected: !showingFootprint }]"
              >
                {{ $t('search-stories-page.point')}}
              </button>
          </div>
      </div>
      <div class="upload-icon-container">
          <img
              class="upload-icon"
              src="/images/ui/upload-icon.png"
              @click="showUploader"
          />
      </div>
      <div class="search-bar-container">
            <SearchBar
                :mode="mode"
                @getSearchResult="getSearchResult"
            />
        </div>
        <img
          class="thumbnail"
        />
        <GmapMap
            ref="thisMap"
            :center="{lat: 0, lng: 0}"
            :zoom="2"
            map-type-id="satellite"
            style="width: 100%; height: 100%"
            :options="{
                styles,
                disableDefaultUI: true,
                clickableIcons: false,
            }"
            class="search-map"
        >
        <div v-if="locationsWithStories">
          <gmap-custom-marker
              v-for="location in locationsWithStories"
              :marker="location"
              v-bind:key="location.lat"
              @click.native="selectStory(location)"
          >
              <div
                @mouseover="hover = location"
                @mouseleave="hover = null"
                :class="[
                  { 'hidden': !includedInSearchResults(location) },
                  'map-marker',
                  { 'footprint': showingFootprint},
                  getRandomColour(location),
                  getMarkerSize(location.count)
                ]"
              >
                <!-- {{ story.title }} !-->
              </div>
          </gmap-custom-marker>
        </div>
        <div v-if="showingFootprint && locationsWithStories">
          <gmap-rectangle
              @click="selectStory(location)"
              v-bind:key="location.lat"
              v-for="location in locationsWithStories"
              :bounds="{ north: getLocation(location).rect.north - 4,
                east: getLocation(location).rect.east + 3,
                south: getLocation(location).rect.south - 4,
                west: getLocation(location).rect.west + 3
              }"
              :editable="false"
              :options="{visible: includedInSearchResults(location),
                strokeColor: getLocation(location).color,
                strokeWeight: 0.8,
                fillColor: getLocation(location).color,
                fillOpacity:0.5
              }"
          ></gmap-rectangle>
        </div>
        </GmapMap>
        <transition name="fade">
          <div
            class="search-popout-component-container"
            v-if="selectedData"
          >
            <SearchPopout
              :selectedData="selectedData"
              @closeStory="closeStory"
            />
          </div>
        </transition>
    </div>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker';
import STORIES from '../../data/stories.json';
import SearchPopout from './search-popout.vue';
import SearchBar from '../header-bars/search.vue';

const colors = ['red', 'green', 'yellow', 'blue'];
const allLocations = [];
const counts = {};
let mouseX;
let mouseY;

export default {
  name: 'SearchMapContainer',
  components: {
    SearchPopout,
    SearchBar,
    'gmap-custom-marker': GmapCustomMarker,
  },
  mounted() {
    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });
  },
  beforeUnmount() {
    document.removeEventListener('mousemove');
  },
  watch: {
    hover() {
      if (this.hover) {
        const result = this.getSingleStory(this.hover);
        this.showThumbnail(result);
      } else {
        this.hideThumbnail();
      }
    },
  },
  computed: {
    locationsWithStories() {
      STORIES.forEach((story) => {
        allLocations.push([story.lat, story.lng]);
      });

      this.submittedData.forEach((story) => {
        allLocations.push([story.lat, story.lng]);
      });

      // counts = {};
      allLocations.forEach((location) => {
        if (counts[location]) {
          counts[location].count += 1;
        } else {
          counts[location] = {};
          // eslint-disable-next-line prefer-destructuring
          counts[location].lat = location[0];
          // eslint-disable-next-line prefer-destructuring
          counts[location].lng = location[1];
          counts[location].count = 1;
        }
      });
      return counts;
    },
  },
  props: {
    submittedData: Array,
  },
  methods: {
    toggleFootprint(bool) {
      this.showingFootprint = bool;
    },
    showThumbnail(result) {
      const element = document.querySelector('.thumbnail');
      element.style.display = 'block';
      element.style.left = `${mouseX + 15}px`;
      element.style.top = `${mouseY + 15}px`;
      element.src = result[0].img;
    },
    hideThumbnail() {
      const element = document.querySelector('.thumbnail');
      element.style.display = 'none';
    },
    includedInSearchResults(location) {
      if (this.searchResults === null) {
        return true;
      }
      const allStories = [];
      this.submittedData.forEach((story) => {
        allStories.push(story);
      });
      STORIES.forEach((story) => {
        allStories.push(story);
      });
      const find = allStories
        .filter((story) => story.lat === location.lat && story.lng === location.lng);

      const result = [...find];
      if (this.searchResults.includes(result[0])) {
        return true;
      }
      return false;
    },
    getSingleStory(location) {
      const allStories = [];
      this.submittedData.forEach((story) => {
        allStories.push(story);
      });
      STORIES.forEach((story) => {
        allStories.push(story);
      });
      const find = allStories
        .filter((story) => story.lat === location.lat && story.lng === location.lng);

      return find;
    },
    getSearchResult(result) {
      this.searchResults = result;
    },
    showUploader() {
      this.$emit('openUploader');
    },
    getLocation(location) {
      const allStories = [];
      this.submittedData.forEach((story) => {
        allStories.push(story);
      });
      STORIES.forEach((story) => {
        allStories.push(story);
      });
      const find = allStories
        .filter((story) => story.lat === location.lat && story.lng === location.lng);
      return find[0];
    },
    getRandomColour(location) {
      const allStories = [];
      this.submittedData.forEach((story) => {
        allStories.push(story);
      });
      STORIES.forEach((story) => {
        allStories.push(story);
      });
      const find = allStories
        .filter((story) => story.lat === location.lat && story.lng === location.lng);

      const randColor = colors[Math.floor(Math.random() * colors.length)];
      return find[0].color || randColor;
    },
    // eslint-disable-next-line consistent-return
    getMarkerSize(count) {
      if (count < 2) {
        return 'small';
      } if (count < 5) {
        return 'medium';
      } if (count >= 5) {
        return 'large';
      }
    },
    selectStory(location) {
      const allStories = [];
      this.submittedData.forEach((story) => {
        allStories.push(story);
      });
      STORIES.forEach((story) => {
        allStories.push(story);
      });
      const find = allStories
        .filter((story) => story.lat === location.lat && story.lng === location.lng);
      this.selectedData = find;
      return find;
    },
    closeStory() {
      this.selectedData = null;
    },
  },
  data() {
    return {
      showingFootprint: false,
      hover: null,
      searchResults: null,
      selectedData: null,
      STORIES,
      mode: 'search_map',
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .hidden {
    opacity: 0.05;
  }

  .map-stories-buttons-container {
      display: flex;
      flex-direction: column;
      position: absolute;
      height: 100%;
      right: 25px;
      justify-content: center;
      align-items: center;
      z-index: 6;

      .buttons-border {
          flex-direction: column;
          border: 2px solid  #000000;
          height: 200px;
          width: 50px;
          border-radius: 25px;
          background-color: #fff;

              button {
              text-transform: uppercase;
              font-size: 0.9em;
              background: none;
              text-transform: lowercase;
              width: 87px;
              margin: 30px 0;
              height: 40px;
              transform: rotate(-90deg);
              text-transform: uppercase;
              outline: none;
              border: none;
              margin-left: -18px;

              &.selected {
                  color: #ffffff;
                  background-color: #000000;
                  border-radius: 25px;
              }
          }
      }
  }

  .footprint-select-container {
    position: relative;
    z-index: 6;
    justify-content: center;
    align-self: center;
    margin: 25px 55px -20px 25px;

      .footprint-select {
        outline: none;
        background: none;
          text-transform: uppercase;
          font-size: 0.9em;
          background: none;
          outline: none;
          border: none;
          background-color: #fff;
          border-radius: 40px;
          padding: 15px;
          font-family: arial;
          width: 120px;

          &:hover {
             background-color: #000000;
           color: white;
          }
      }
  }

  .thumbnail {
    width: 150px;
    height: 150px;
    position: fixed;
    z-index: 4;
    display: none;
  }

  .search-map-container {
      width: 100%;
      height: 100%;

      .search-bar-container {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: row;
  }
  .upload-icon-container {
    position: absolute;
    z-index: 3;
    right: 50px;
    bottom: 50px;

    .upload-icon {
        width: 75px;
        height: auto;
        cursor: pointer;
    }
  }

  .search-popout-component-container {
      right: 0; top: 0;
      position: absolute;
      z-index: 3;
      overflow-y: scroll;
      max-height: 100%;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
  }

  .map-marker {
    cursor: pointer !important;
    background-color: #DD4126;

    &.footprint {
      display: none;
    }

    &.red {
      background-color: #FE1F02;

      &.footprint {
        background-color: rgba(254, 31, 2, 0.7);
        border: 1px solid #FE1F02;
      }
    }

    &.green {
      background-color: #00AA6B;
      &.footprint {
        background-color: rgba(0, 170, 107, 0.7);
        border: 1px solid #00AA6B;
      }
    }

    &.yellow {
      background-color: #F89F39;
      &.footprint {
        background-color: rgba(248, 159, 57, 0.7);
        border: 1px solid #F89F39;
      }
    }

    &.blue {
      background-color: #0060FF;
      &.footprint {
        background-color: rgba(0, 96, 255, 0.7);
        border: 1px solid #0060FF;
        width: 42px;
        height: 63px;
      }
    }

    &.small {
      width: 8px;
      height: 8px;
      &.footprint {
        width: 14px;
        height: 15px;
      }
    }

    &.medium {
      width: 12px;
      height: 12px;
      &.footprint {
        width: 32px;
        height: 23px;
      }
    }

    &.large {
      width: 16px;
      height: 16px;
      &.footprint {
        width: 32px;
        height: 39px;
      }
    }
  }
}
</style>
