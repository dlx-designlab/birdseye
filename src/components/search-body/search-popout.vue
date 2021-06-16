<template>
    <div
        class="search-popout-container"
    >
        <button
            @click="close"
            class="close-icon"
        >
            ×
        </button>
        <div class="stories-container">
            <template v-if="!showingSimilar">
            <div class="left">
                <img v-if="!showingData && selectedData[0].media === 'image'"
                    :src="selectedData[0].img" class="main-img"
                    @click="showData"
                />
                <video v-else-if="!showingData && selectedData[0].media ==='video'"
                    class="main-img"
                    :src="selectedData[0].video"
                    @click="showData"
                    autoplay
                />
                <div v-else class="map">
                    <GmapMap
                        :center="{lat: selectedData[0].lat, lng: selectedData[0].lng}"
                        :zoom="10"
                        map-type-id="satellite"
                        style="width: 100%; height: 100%"
                        :options="{
                            disableDefaultUI: true,
                            clickableIcons: false,
                        }"
                        class="search-map"
                        ref="thisMap"
                    >
                    </GmapMap>
                </div>
            </div>
            <div class="right">
                <h1 v-html="$i18n.locale === 'en'
                    ? selectedData[0].title : selectedData[0].jp_title" />
                <p v-html="$i18n.locale === 'en'
                    ? selectedData[0].location : selectedData[0].jp_location" />
                <p v-html="selectedData[0].date" />
                <p v-html="$i18n.locale === 'en'
                    ? selectedData[0].tags.join(', ') : selectedData[0].jp_tags.join(', ')" />
                <p v-html="$i18n.locale === 'en'
                    ? selectedData[0].description : selectedData[0].jp_description" />
                <div class="satellite-data-info">
                    <h2>{{$t('stories-info.data')}} <span v-html="$i18n.locale === 'en'
                        ? SATELLITE_DATA[selectedData[0].satellite_data_assigned].name
                        : SATELLITE_DATA[selectedData[0].satellite_data_assigned].jp_name" />
                    </h2>
                    <p>{{$t('stories-info.source')}} <a
                        :href="SATELLITE_DATA[selectedData[0].satellite_data_assigned].link"
                        class="data-source"
                        v-html="SATELLITE_DATA[selectedData[0]
                            .satellite_data_assigned]
                            .official_name"
                    />
                    </p>
                    <img
                        class="map-key"
                        :src="SATELLITE_DATA[selectedData[0].satellite_data_assigned].key"
                    />
                </div>
                <button
                    class="similar-stories"
                    @click="showSimilar"
                >
                    {{$t('stories-info.similar')}}
                </button>
            </div>
            </template>
            <template v-else>
                <div class="similar-stories-container">
                    <h1>
                        {{$t('stories-info.similar-to')}} {{ $i18n.locale === 'en' ?
                            selectedData[0].title : selectedData[0].jp_title }}</h1>
                    <p
                        v-html="$i18n.locale === 'en'
                        ? selectedData[0].tags.join(', ')
                        : selectedData[0].jp_tags.join(', ')"
                        />
                    <div class="stories-container">
                        <div
                            :class="['story-container', { 'main': index === 0 }]"
                            v-for="(story, index) in getSimilarStories"
                            :key="index"
                        >
                            <div class="story"
                                @mouseleave="hovered = null"
                                @mouseenter="hovered = story.title"
                                @click="goToStory(story)"
                            >
                                <img v-if="hovered !== story.title" :src="story.img" />
                                <img v-else :src="story.comparison_img" />

                                <p>{{ $i18n.locale === 'en' ? story.title : story.jp_title }} ></p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import ee from '@google/earthengine';
import STORIES from '../../data/stories.json';
import SATELLITE_DATA from '../../data/map-data.json';

export default {
  name: 'SearchPopoutContainer',
  components: {

  },
  mounted() {
    if (this.mode === 'data') {
      this.showData();
    }
  },
  computed: {
    filteredSelectedData() {
      const dataCopy = this.selectedData;
      dataCopy.shift();
      return dataCopy;
    },
    getSimilarStories() {
      const list = [];
      this.selectedData[0].tags.forEach((tag) => {
        list.push(STORIES.filter((story) => story.tags.includes(tag)));
      });
      const flattened = list.flat();
      const filtered = [...new Map(flattened.map((item) => [item.title, item]))
        .values()].slice(0, 3);
      const filteredWithOriginalPostRemoved = filtered.filter((obj) => obj.title
        !== this.selectedData[0].title);
      return filteredWithOriginalPostRemoved;
    },
  },
  props: {
    selectedData: Array,
    mode: String,
  },
  data() {
    return {
      SATELLITE_DATA,
      showingSimilar: false,
      showingData: false,
      hovered: null,
    };
  },
  methods: {
    goToStory(story) {
      this.$emit('goToStory', story);
      this.showingSimilar = false;
    },
    showMap() {
      this.fetchMap(this.selectedData[0].satellite_data_assigned);
    },
    fetchMap(mapid = 'mapid2') {
      fetch(`https://forensic-storytelling.uc.r.appspot.com/${mapid}`)
        .then((response) => response.text())
        // eslint-disable-next-line no-shadow
        .then((mapid) => this.initialize(mapid));
    },
    initialize(mapid) {
      const tileSource = new ee.layers.EarthEngineTileSource({
        mapid,
      });
      const overlay = new ee.layers.ImageOverlay(tileSource);
      this.$refs.thisMap.$mapObject.overlayMapTypes.pop();
      this.$refs.thisMap.$mapObject.overlayMapTypes.push(overlay);
    },
    close() {
      this.$emit('closeStory');
    },
    showSimilar() {
      this.showingSimilar = true;
    },
    showData() {
      this.showingData = true;
      this.showMap();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.search-popout-container {
    position: absolute;
    display: flex;
    flex-direction: row;
    background-color: #FFFFFF;
    text-align: left;
    top: 0;
    box-sizing: border-box;
    height: 80vh;
    width: 82.5vw;
    margin: 10vh 5vw;
    overflow: hidden;
    border: 4px solid #000000;

    .similar-stories-container {
        display: flex;
        flex-direction: column;
        color: #000000;

        .stories-container {
            display: flex;
            flex-direction:row;

            .story-container {
                width: 33%;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                padding: 15px;

                .story {
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;

                    img {
                        width: 100%;
                    }

                    p {
                        font-weight: 400;
                        margin: 0;
                        padding-top: 15px;
                    }
                }
            }
        }

        p {
            margin: 25px;
        }

        h1 {
            font-size: 1.2em;
            margin: 20px;
        }
    }

    .stories-container {
        display: flex;
        flex-direction: row;
        flex-flow: wrap;
        color: #000000;
        width: 100%;

        .left {
            width: 50%;
            overflow: hidden;

            .main-img {
                width: 100%;
                object-fit: cover;
            }

            .map {
                width: 100%;
                height: 100%;
            }
        }

        .right {
            width: 50%;
            padding: 35px;
            box-sizing: border-box;
            border-left: 5px solid #000000;

            .satellite-data-info {
                width: 100%;
                background-color: #E5E5E5;
                box-sizing: border-box;
                padding: 10px;

                a {
                    color: #000000;
                    text-decoration: none;
                }

                .data-source {
                    font-style: italic;
                }

                h2 {
                    font-weight: 400;
                    font-size: 1.2em;
                    margin: 0;
                    padding: 0;
                }

                p {
                    margin: 0;
                    padding: 0;
                    padding-bottom: 5px;
                }

                .map-key {
                    max-width: 100%;
                }
            }

            .similar-stories {
                border: none;
                background: none;
                font-weight: 900;
                font-size: 1em;
                padding: 0;
                margin: 0;
                margin-top: 14px;
            }

            p {
                padding: 8px 0;
                font-size: 0.9em;
            }

            h1 {
                font-size: 1em;
                font-weight: 900;
                font-family: Arial;
                margin-bottom: 28px;
            }
        }

    }

    .close-icon {
        color: #000000;
        text-align: right;
        background: none;
        border: none;
        font-weight: 900;
        font-size: 2.2em;
        outline: 0;
        position: absolute;
        z-index: 5;
        right: 5px;
    }
}
</style>
