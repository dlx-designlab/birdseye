<template>
    <div class="upload-container">
        <div class="upload-block left">
            <div class="request-story-button-container">
                <button>{{$t('upload.request-story')}}</button>
            </div>
            <p v-if="!imageUploaded"
                class="share-story-text"
            >
                <span>
                    {{$t('upload.share')}}
                </span>

            </p>
            <div class="canvas-container">
                <canvas id="imageCanvas" ref="imageCanvas"></canvas>
            </div>
            <div class="form-container">
                <div class="form">
                    <div class="upload-media-button-container">
                        <input :class="['upload-media-button', $i18n.locale]"
                            type="file"
                            accept="image/jpeg,image/x-png"
                            @change="onFileChange"
                        />
                    </div>
                    <div class="bottom-input-container">
                        <div class="title-input-container">
                            <span
                                @click="selectTitle"
                                class="highlighted"
                            >
                                {{$t('upload.title')}}
                            </span>
                            <input
                                v-model="title"
                                placeholder=""
                                class="title-input"
                            />
                        </div>
                        <div class="date-selector">
                            <span
                                class="highlighted"
                                @click="selectDate"
                            >
                                    {{$t('upload.date')}}
                            </span>
                            <Datepicker
                                v-model="date"
                                ref="datepicker"
                                input-class="date-picker-input"
                            />
                        </div>
                        <div class="location-selector">
                            <country-select
                                :placeholder="`${$t('upload.location')}`"
                                class="highlighted country-picker"
                                v-model="country"
                                :country="country"
                                topCountry="US"
                            />
                        </div>
                        <div class="tag-selector">
                            <span
                                @click="selectTags"
                                class="highlighted">
                                    {{$t('upload.tags')}}
                                </span>
                            <input-tag
                                class="tags-input"
                                v-model="tags"
                                :add-tag-on-keys="[ 13, 188, 9, 32]"
                            ></input-tag>
                        </div>
                        <div class="description-input-container">
                            <span
                                @click="selectDescription"
                                class="highlighted">
                                    {{$t('upload.description')}}
                                </span>
                            <textarea
                                v-model="description"
                                placeholder=""
                                class="description-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="upload-block right">
            <div class="request-data-button-container">
                <button>{{$t('upload.request-data')}}</button>
            </div>
            <button
                @click="close"
                class="close-icon"
            >
                ×
            </button>

            <div class="right-section" v-if="!showMapOverlay">
                <p class="pair-story-text">{{$t('upload.pair-story')}}</p>
                <div v-if="mapOverlay" class="data-information-container">
                    <span
                        v-html="$i18n.locale === 'en'
                            ? SATELLITE_DATA[mapOverlay].description
                            : SATELLITE_DATA[mapOverlay].jp_description"
                        />
                    <img class="data-key" :src="SATELLITE_DATA[mapOverlay].key" />
                </div>
                <div class="keyword-input-container">
                    <input
                        v-model="keywords"
                        :placeholder="`${$t('upload.search-placeholder')}`"
                        class="keywords-input"
                    >
                </div>
                <div v-if="keywords.length > 0" class="select-tags-container">
                    <div class="overlay-options">

                        <div class="overlay-option">
                            <input
                                v-model="mapOverlay"
                                type="radio"
                                id="GFSAD1000_Cropland"
                                value="GFSAD1000_Cropland"
                            >
                            <label for="GFSAD1000_Cropland">
                                <img
                                    src="/images/data-previews/GFSAD1000_Cropland.jpg"
                                    :class="['sensor-image',
                                        {'highlighted': mapOverlay === 'GFSAD1000_Cropland'}]"
                                />
                                <p>
                                    {{ $i18n.locale === 'en'
                                        ? SATELLITE_DATA.GFSAD1000_Cropland.name
                                        : SATELLITE_DATA.GFSAD1000_Cropland.jp_name
                                    }}
                                </p>
                            </label>
                        </div>

                        <div class="overlay-option">
                        <input
                            v-model="mapOverlay"
                            type="radio"
                            id="Biomass_Carbon_Density"
                            value="Biomass_Carbon_Density"
                        >
                        <label for="Biomass_Carbon_Density">
                            <img
                                src="/images/data-previews/Biomass_Carbon_Density.jpg"
                                :class="['sensor-image',
                                    {'highlighted': mapOverlay === 'Biomass_Carbon_Density'}]"
                                />
                            <p>
                                {{ $i18n.locale === 'en'
                                    ? SATELLITE_DATA.Biomass_Carbon_Density.name
                                    : SATELLITE_DATA.Biomass_Carbon_Density.jp_name
                                }}
                            </p>
                        </label>
                        </div>

                        <div class="overlay-option">
                        <input
                            v-model="mapOverlay"
                            ype="radio"
                            id="Accessibility_to_Healthcare_2019"
                            value="Accessibility_to_Healthcare_2019"
                        >
                        <label for="Accessibility_to_Healthcare_2019">
                            <img
                                src="/images/data-previews/Accessibility_to_Healthcare_2019.jpg"
                                :class="['sensor-image',
                                    {'highlighted': mapOverlay
                                        === 'Accessibility_to_Healthcare_2019'}]"
                                />
                            <p>
                                {{ $i18n.locale === 'en'
                                    ? SATELLITE_DATA.Accessibility_to_Healthcare_2019.name
                                    : SATELLITE_DATA.Accessibility_to_Healthcare_2019.jp_name
                                }}
                            </p>
                        </label>
                        </div>

                        <div class="overlay-option">
                            <input
                                v-model="mapOverlay"
                                type="radio"
                                id="Keetch-Byram_Drought_Index"
                                value="Keetch-Byram_Drought_Index"
                            >
                        <label for="Keetch-Byram_Drought_Index">
                            <img
                                src="/images/data-previews/Keetch-Byram_Drought_Index.jpg"
                                :class="['sensor-image',
                                {'highlighted': mapOverlay
                                === 'Keetch-Byram_Drought_Index'
                            }]"
                        />
                        <p>
                            {{ $i18n.locale === 'en'
                                ? SATELLITE_DATA['Keetch-Byram_Drought_Index'].name
                                : SATELLITE_DATA['Keetch-Byram_Drought_Index'].jp_name
                            }}
                        </p>
                        </label>
                        </div>

                        <div class="overlay-option">
                            <input
                                v-model="mapOverlay"
                                type="radio"
                                id="Chlorophyll-a_concentration"
                                value="Chlorophyll-a_concentration"
                            >
                            <label for="Chlorophyll-a_concentration">
                                <img
                                    src="/images/data-previews/Chlorophyll-a_concentration.jpg"
                                    :class="['sensor-image',
                                    {'highlighted': mapOverlay === 'Chlorophyll-a_concentration'}]"
                                />
                                <p>
                                    {{ $i18n.locale === 'en'
                                        ? SATELLITE_DATA['Chlorophyll-a_concentration'].name
                                        : SATELLITE_DATA['Chlorophyll-a_concentration'].jp_name
                                    }}
                                </p>
                            </label>
                        </div>

                        <div class="overlay-option">
                            <input
                                v-model="mapOverlay"
                                type="radio"
                                id="Hansen_Global_Forest_Change"
                                value="Hansen_Global_Forest_Change"
                            >
                            <label for="Hansen_Global_Forest_Change">
                                <img
                                    src="/images/data-previews/Hansen_Global_Forest_Change.jpg"
                                    :class="['sensor-image',
                                        {'highlighted': mapOverlay
                                            == 'Hansen_Global_Forest_Change'}]"
                                />
                                <p>{{ $i18n.locale === 'en'
                                        ? SATELLITE_DATA.Hansen_Global_Forest_Change.name
                                        : SATELLITE_DATA.Hansen_Global_Forest_Change.jp_name
                                    }}
                                </p>
                            </label>
                        </div>

                        <div class="overlay-option">
                            <input v-model="mapOverlay" type="radio" id="HYCOM" value="HYCOM">
                            <label for="HYCOM">
                                <img
                                    src="/images/data-previews/HYCOM.jpg"
                                    :class="['sensor-image',
                                        {'highlighted': mapOverlay === 'HYCOM'}]"
                                    />
                                <p>
                                    {{ $i18n.locale === 'en'
                                        ? SATELLITE_DATA.HYCOM.name
                                        : SATELLITE_DATA.HYCOM.jp_name
                                    }}
                                </p>
                            </label>
                        </div>

                        <div class="overlay-option">
                            <input
                                v-model="mapOverlay"
                                type="radio"
                                id="YCEO_Surface_Urban_Heat_Islands"
                                value="YCEO_Surface_Urban_Heat_Islands"
                            >
                            <label for="YCEO_Surface_Urban_Heat_Islands">
                                <img
                                    src="/images/data-previews/YCEO_Surface_Urban_Heat_Islands.jpg"
                                    :class="['sensor-image',
                                        {'highlighted': mapOverlay
                                            === 'YCEO_Surface_Urban_Heat_Islands'
                                        }]"
                                    />
                                <p>
                                    {{ $i18n.locale === 'en'
                                        ? SATELLITE_DATA.YCEO_Surface_Urban_Heat_Islands.name
                                        : SATELLITE_DATA.YCEO_Surface_Urban_Heat_Islands.jp_name
                                    }}
                                </p>
                            </label>
                        </div>

                    </div>

                    <div class="pair-button-container" v-if="mapOverlay">
                        <button class="pair-button" @click="showMap">{{$t('upload.cta')}}</button>
                    </div>
                </div>
            </div>

            <div class="map-container" v-if="showMapOverlay">
                <div v-if="showMapOverlay" class="map-overlay-info">
                    <span>{{ mapOverlay.replace('_', ' ') }} </span><br>
                    <span class="lat-lng">lat: {{ mapLatShown }}, lng: {{ mapLngShown }}</span>
                </div>
                <GmapMap
                    :center="{lat: mapLat, lng: mapLng}"
                    :zoom="mapZoom"
                    ref="thisMap"
                    map-type-id="terrain"
                    id="map-container"
                    style="width: 100%; height: 100%"
                    :options="{
                        disableDefaultUI: true,
                        clickableIcons: false,
                    }"
                >
                </GmapMap>
                <div class="submit-button-container">
                    <button
                        v-if="formCompleted"
                        class="submit-button"
                        @click="submit"
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ee from '@google/earthengine';
import Datepicker from 'vuejs-datepicker';
import InputTag from 'vue-input-tag';
import SATELLITE_DATA from '../../data/map-data.json';
import COUNTRY_CODES from '../../data/country-codes.json';

export default {
  name: 'UploadContainer',
  components: {
    Datepicker,
    'input-tag': InputTag,
  },
  computed: {
    formCompleted() {
      return this.title
            && this.date
            && this.mapOverlay
            && this.description
            && this.keywords
            && this.tags
            && this.country
            && this.mapLatShown
            && this.mapLngShown
            && this.img;
    },
  },
  watch: {
    // whenever question changes, this function will run
    country(country) {
      this.mapLat = COUNTRY_CODES[country].FIELD2;
      this.mapLng = COUNTRY_CODES[country].FIELD3;
      this.mapZoom = 8;
    },
  },
  methods: {
    selectTitle() {
      const input = document.querySelector('.title-input');
      input.focus();
      input.select();
    },
    selectDate() {
      const input = document.querySelector('.date-picker-input');
      input.focus();
      input.select();
      this.$refs.datepicker.showCalendar();
    },
    selectCountry() {
      const input = document.querySelector('.country-picker');
      input.focus();
      input.select();
    },
    selectTags() {
      const input = document.querySelector('.tags-input');
      input.focus();
    },
    selectDescription() {
      const input = document.querySelector('.country-picker');
      input.focus();
    },
    close() {
      this.$emit('closeUploader');
    },
    submit() {
      this.$emit('submitData', {
        title: this.title,
        date: this.date,
        satellite_data_assigned: this.mapOverlay,
        description: this.description,
        keywords: this.keywords,
        tags: this.tags,
        location: COUNTRY_CODES[this.country].FIELD4,
        region: this.region,
        lat: this.mapLatShown,
        lng: this.mapLngShown,
        img: this.img,
        comparison_img: `./images/data-previews/${this.mapOverlay}.png`,
      });
    },
    showMap() {
      this.fetchMap(this.mapOverlay);
      this.showMapOverlay = true;
    },
    initialize(mapid) {
      const tileSource = new ee.layers.EarthEngineTileSource({
        mapid,
      });
      const overlay = new ee.layers.ImageOverlay(tileSource);
      this.$refs.thisMap.$mapObject.overlayMapTypes.pop();
      this.$refs.thisMap.$mapObject.overlayMapTypes.push(overlay);
      const self = this;
      this.$refs.thisMap.$on('center_changed', () => {
        self.mapLatShown = self.$refs.thisMap.$mapObject.getCenter().lat();
        self.mapLngShown = self.$refs.thisMap.$mapObject.getCenter().lng();
      });
    },
    fetchMap(mapid = 'mapid2') {
      fetch(`https://forensic-storytelling.uc.r.appspot.com/${mapid}`)
        .then((response) => response.text())
        // eslint-disable-next-line no-shadow
        .then((mapid) => this.initialize(mapid));
    },
    onFileChange(e) {
      this.imageUploaded = true;
      const self = this;
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const reader = new FileReader();

      // eslint-disable-next-line no-shadow
      reader.onload = (e) => {
        const img = new Image();
        img.onload = function () {
          self.drawCanvasImage(img);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(files[0]);
    },
    drawCanvasImage(img) {
      const canvas = this.$refs.imageCanvas;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      this.img = canvas.toDataURL('image/jpeg');
    },
  },
  data() {
    return {
      SATELLITE_DATA,
      imageUploaded: false,
      datasetSelected: null,
      description: '',
      keywords: '',
      title: '',
      tags: [],
      date: null,
      country: '',
      region: '',
      img: null,
      mapZoom: 5,
      mapLat: 0,
      mapLng: 0,
      mapLatShown: 0,
      mapLngShown: 0,
      mapOverlay: null,
      showMapOverlay: false,
    };
  },
};
</script>

<style>
    .date-picker-input {
        border: none !important;
        color: #000000;
        margin-left: 10px;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .input-tag {
        margin-top: 5px;
        padding: 1px;
    }

    .vue-input-tag-wrapper {
        padding-top: 0;
    }

    .vue-input-tag-wrapper .tags-input {
        position: absolute;
    }

    .vue-input-tag-wrapper .input-tag {
        border: 1px solid black;
        color: #000000;
        background-color: #FFFFFF;
        padding-top: 0px;
        font-size: 0.8em;
        height: 13.1px;
        margin-top: 7px;
    }

    .country-picker {
        font-size: 1em;
        cursor: pointer;
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
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.upload-container {
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    border: 5px solid #000000;
    margin: 5vw 10vh;
    width: 80vw;
    max-height: 80vh;

    .highlighted {
        background-color: rgba(255, 255, 255, 0.5);
    }

    .upload-block {
        width: 50%;

        .upload-media-button-container {
            z-index: 2;
        }

        .share-story-text {
            color: #888888;
            padding: 25px;
        }

        .right-section {
            padding: 20px;

            .data-information-container {
                span {
                    font-size: 0.9em;
                }
                .data-key {
                    max-width: 100%;
                }
            }

            .pair-story-text {
                color: #888888;
                padding: 0px 0;
            }

            .keyword-input-container {
                color: #000000;
                margin-top: 3vh;

                .keywords-input {
                    color: #000000;
                    width: 95%;
                    border: none;
                    font-size: 1em;

                    &:focus {
                        outline: none;
                        border: none;
                    }
                }

                ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
                    color: #000000;
                    opacity: 1; /* Firefox */
                }
            }
        }

        .canvas-container {
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;

             #imageCanvas {
                height: 100%;
            }
        }
        .form-container {
            position: absolute;
            top: 12.5vh;
            width: 100%;

            .form {
                z-index: 4;
                top: 100px;
                max-width: 40vw;
                overflow-x: hidden;
            }
        }

        &.left {
            text-align: left;
            border-right: 5px solid #000000;
            overflow: hidden;
            overflow-y: scroll;
            position: relative;
            min-height: 80vh;

            .request-story-button-container {
                position: absolute;
                bottom: 0;
                margin: 20px;

                button {
                    background-color: #000000;
                    border: none;
                    color: #ffffff;
                    padding: 10px;
                    text-transform: uppercase;
                    font-size: 0.9em;
                }
            }
        }

        &.right {
            text-align: left;
            position: relative;

            .request-data-button-container {
                position: absolute;
                bottom: 0;
                right: 0;
                margin: 20px;

                button {
                    background-color: #000000;
                    border: none;
                    color: #ffffff;
                    padding: 10px;
                    text-transform: uppercase;
                    font-size: 0.9em;
                }
            }
        }

        .select-tags-container {
            margin-top: 5px;
            color: #000000;

            .overlay-options {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .overlay-option {
                    width: 25%;
                }

                input {
                    display: none;
                }
                p {
                    color: #888888;
                    font-size: 0.8em;
                    margin-top: 0;
                    background-color: rgba(255, 255, 255, 0.5);
                }

                .sensor-image {
                    width: 100%;
                    display: inline;

                    &.highlighted {
                        opacity: 0.5;
                    }
                }
            }

            .pair-button-container {

                .pair-button {
                    border: 1px solid #000000;
                    padding: 4px 10px;
                    background-color: #000000;
                    color: #ffffff;
                    position: relative;
                    bottom: 0;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }

        .submit-button-container {
            position: absolute;
            width: 100%;
            bottom: 35px;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;

            .submit-button {
                border: 1px solid #000000;
                padding: 4px 10px;
                background-color: #000000;
                color: #ffffff;
                position: relative;
                bottom: 0;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
            }
        }

        .upload-media-button {
            width: 150px;
            height: 20px;
            overflow: hidden;

            &:focus {
                outline: 0;
                box-shadow: none;
            }
            &::-webkit-file-upload-button {
                visibility: hidden;
            }

            &.jp {
                 &::before {
                content: 'メディア >';
                display: inline-block;
                border: none;
                background: none;
                padding-top: 0;
                padding-bottom: 50px;
                margin-left: 25px;
                outline: none;
                white-space: nowrap;
                -webkit-user-select: none;
                cursor: pointer;
                font-weight: normal;
                font-size: 1.15em;
                color: #000000;
                background-color: rgba(255, 255, 255, 0.5);
                }
            }

            &.en {
                 &::before {
                    content: 'media >';
                    display: inline-block;
                    border: none;
                    background: none;
                    padding-top: 0;
                    padding-bottom: 50px;
                    margin-left: 25px;
                    outline: none;
                    white-space: nowrap;
                    -webkit-user-select: none;
                    cursor: pointer;
                    font-weight: normal;
                    font-size: 1.15em;
                    color: #000000;
                    background-color: rgba(255, 255, 255, 0.5);
                }
            }
        }

        .map-container {
            height: 100%;
        }

        .bottom-input-container {
            bottom: 0;
            color: #000000;
            padding: 25px;

            .date-selector {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                padding: 20px 0px;
            }

            .location-selector {
                cursor: pointer;
                padding: 20px 0px;
                cursor: pointer;
                select {
                    border: none;
                    color:#000000;
                    width: 110px;
                    background-color: rgba(255, 255, 255, 0.5);
                }
            }

            .tag-selector {
                padding: 20px 0px;

                .tags-input {
                    display: inline-block;
                    border: none;
                    background: none;
                    background-color: rgba(255, 255, 255, 0.5);
                    height: 48px;
                    margin-top: -8px;
                    margin-left: 10px;
                    width: 70%;
                    /* overflow-x: hidden; */
                    position: absolute;
                }
            }

            .description-input-container {
                padding: 20px 0;

                .description-input {
                    width: 70%;
                    background-color: rgba(255, 255, 255, 0.5);
                    color: #000000;
                    border: none;
                    position: absolute;
                    margin-left: 10px;
                }
            }

            .title-input-container {
                padding: 20px 0px;
                cursor: pointer;

                .title-input {
                    width: 70%;
                    color: #000000;
                    background-color: rgba(255, 255, 255, 0.5);
                    border: none;
                    margin-left: 9px;
                }
            }
        }

        .map-overlay-info {
            position: absolute;
            z-index: 3;
            color: #000000;
            padding: 10% 25px;
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE10+/Edge */
            user-select: none; /* Standard */
            pointer-events: none;

            span {
                color: #000000;
                background-color: rgba(255, 255, 255, 0.5);
                -webkit-user-select: none; /* Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+/Edge */
                user-select: none; /* Standard */
            }

            .lat-lng {
                top: 150px;
                position: relative;
            }
        }

        .title-container {
            padding: 15px;

            h2 {
                font-size: 1em;
                color: #000000;
                font-weight: normal;
                margin: 0; padding: 0;
            }
        }

        .image-container {
            img {
                width: 100%;
                max-height: 370px;
                overflow: hidden;
            }
        }

        .buttons-container {
            margin-top: -10px;

            .under-image-button {
                width: 50%;
                display: inline;
                padding: 15px;
                background: #FFFFFF;
                border-left: 2px solid #000000;
                border-right: none;
                border-bottom: 2px solid #000000;
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
        position: relative;
        z-index: 5;
        width: 100%;
        position: absolute;
    }
}
</style>
