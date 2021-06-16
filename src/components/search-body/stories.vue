<template>
    <div class="search-stories-container">
        <transition name="fade">
            <div
            class="search-popout-component-container"
            v-if="selectedData"
            >
            <SearchPopout
                :selectedData="selectedData"
                :mode="mode"
                @closeStory="closeStory"
                @goToStory="goToStory"
            />
            </div>
        </transition>
        <div class="search-bar-container">
            <SearchBar
                :mode="mode"
                @getSearchResult="getSearchResult"
                ref="searchBar"
            />
        </div>
        <div class="pixi-container"></div>

        <div class="map-stories-buttons-container">
            <div class="buttons-border">
                <button
                    @click="showStory"
                    :class="['stories-button', {selected: mode === 'story'}]"
                >
                    {{ $t('search-stories-page.story') }}
                </button>
                <button
                    @click="showData"
                    :class="['map-button', {selected: mode === 'data'} ]"
                >
                    {{ $t('search-stories-page.data') }}
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
        <!--
        <div class="story-block" v-for="story in filteredStories" :key="story.title">
            <div class="title-container">
                <h2>{{ story.title }}</h2>
            </div>
            <div class="image-container">
                <img :src="story.img" />
            </div>
            <div class="buttons-container">
                <button class="under-image-button">more</button>
                <button class="under-image-button">data</button>
            </div>
        </div>
        !-->
    </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import TWEEN from '@tweenjs/tween.js';
import STORIES from '../../data/stories.json';
import SearchPopout from './search-popout.vue';
import SearchBar from '../header-bars/search.vue';

PIXI.Sprite.prototype.bringToFront = function () {
  if (this.parent) {
    const { parent } = this;
    parent.removeChild(this);
    parent.addChild(this);
  }
};

const app = new PIXI.Application({ resizeTo: window });
const loader = PIXI.Loader.shared;
const canvasGradients = [];
app.renderer.antialias = true;
app.renderer.backgroundColor = 0xFFFFFF;
app.renderer.view.style.width = window.innerWidth;
app.renderer.view.style.height = window.innerHeight;

app.ticker.add(() => {
  TWEEN.update();
});

const viewport = new Viewport({
  screenWidth: app.renderer.view.width,
  screenHeight: app.renderer.view.height,
  worldWidth: app.renderer.view.width,
  worldHeight: 1500,
  interaction: app.renderer.plugins.interaction,
});

const storyImgSprites = [];
const dataImgSprites = [];
const spriteCollections = {};
const colors = ['#FE1F02', '#00AA6B', '#F89F39', '#F076A8', '#0060FF'];

STORIES.forEach((story, i) => {
  loader.add(`${i.toString()}`, story.img);
});

STORIES.forEach((story, i) => {
  loader.add(`${i.toString()}-data`, story.comparison_img);
});

export default {
  name: 'SearchStoriesContainer',
  components: {
    SearchBar,
    SearchPopout,
  },
  data() {
    return {
      selectedData: null,
      STORIES,
      mode: 'story',
      searchResults: null,
    };
  },
  unmounted() {
    PIXI.utils.destroyTextureCache();
    app.loader.reset();
    app.destroy();
  },
  mounted() {
    this.createCanvasGradients();
    document.querySelector('.pixi-container').appendChild(app.view);
    app.stage.addChild(viewport);
    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate();

    document.querySelector('.pixi-container').addEventListener('click', () => {
      this.$refs.searchBar.loseFocus();
    });
    this.addStories();
  },
  props: {
    search: String,
    submittedData: Array,
    showingUploader: Boolean,
  },
  watch: {
    // whenever question changes, this function will run
    showingUploader() {
      if (this.showingUploader) {
        this.pauseViewport();
      } else {
        this.resumeViewport();
      }
    },
    submittedData() {
      const latest = this.submittedData[this.submittedData.length - 1];
      this.addStory(latest);
    },
    mode() {
      if (this.mode === 'story') {
        storyImgSprites.forEach((sprite) => {
        // eslint-disable-next-line no-param-reassign
          sprite.alpha = 1;
        });
        dataImgSprites.forEach((sprite) => {
        // eslint-disable-next-line no-param-reassign
          sprite.alpha = 0;
        });
      } else {
        storyImgSprites.forEach((sprite) => {
        // eslint-disable-next-line no-param-reassign
          sprite.alpha = 0;
        });
        dataImgSprites.forEach((sprite) => {
        // eslint-disable-next-line no-param-reassign
          sprite.alpha = 1;
        });
      }
    },
  },
  methods: {
    closeStory() {
      this.selectedData = null;
      this.resumeViewport();
    },
    pauseViewport() {
      viewport.plugins.pause('drag');
      viewport.plugins.pause('pinch');
      viewport.plugins.pause('wheel');
      viewport.plugins.pause('decelerate');
    },
    resumeViewport() {
      viewport.plugins.resume('drag');
      viewport.plugins.resume('pinch');
      viewport.plugins.resume('wheel');
      viewport.plugins.resume('decelerate');
    },
    getSearchResult(data) {
      this.searchResults = data;
      this.sortStories(data);
    },
    bringToCenter(toCenter) {
      toCenter.forEach((data) => {
        const newLocationX = viewport.center.x + (Math.random() < 0.5
          ? -(Math.random() * 200) : (Math.random() * 200));
        const newLocationY = viewport.center.y + (Math.random() < 0.5
          ? -(Math.random() * 200) : (Math.random() * 200));
        data.forEach((sprite) => {
        // eslint-disable-next-line no-unused-vars
          const tween = new TWEEN.Tween(sprite) // Create a new tween that modifies 'coords'.
            .to({ x: newLocationX, y: newLocationY }, 1000) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out)
            .start(); // Start the tween immediately.
        });
      });
    },
    pushAwayFromCenter(toPush) {
      // eslint-disable-next-line no-unused-vars
      Object.entries(toPush).forEach(([key, value]) => {
        const newLocationX = viewport.center.x + (Math.random() < 0.5
          ? -(Math.random() * 2500) : (Math.random() * 2500));
        const newLocationY = viewport.center.y + (Math.random() < 0.5
          ? -(Math.random() * 2500) : (Math.random() * 2500));
        value.forEach((sprite) => {
          /* eslint-disable-next-line */
            const tween = new TWEEN.Tween(sprite) // Create a new tween that modifies 'coords'.
            .to({ x: newLocationX, y: newLocationY }, 1000) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out)
            .start(); // Start the tween immediately.
        });
      });
    },
    sortStories(data) {
      const spriteCollectionsToCenter = [];
      const spriteCollectionsToShuffle = { ...spriteCollections };
      // eslint-disable-next-line no-shadow
      data.forEach((data) => {
        spriteCollectionsToCenter.push(spriteCollections[data.id]);
        delete spriteCollectionsToShuffle[data.id];
      });

      this.bringToCenter(spriteCollectionsToCenter);
      this.pushAwayFromCenter(spriteCollectionsToShuffle);
    },
    showUploader() {
      this.$emit('openUploader');
    },
    goToStory(story) {
      this.pauseViewport();
      this.selectedData = [story];
    },
    showStory() {
      this.mode = 'story';
    },
    showData() {
      this.mode = 'data';
    },
    getRandomColor(hex = true) {
      const letters = '0123456789ABCDEF';
      let color;
      if (hex) {
        color = '0x';
      } else {
        color = '#';
      }
      for (let i = 0; i < 6; i += 1) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    createCanvasGradients() {
      for (let i = 0; i < 5; i += 1) {
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        const randColor = colors[Math.floor(Math.random() * colors.length)];
        gradient.addColorStop(0, randColor);
        if (Math.random() < 0.5) {
          gradient.addColorStop(1, '#FFFFFF');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 250, 250);
        canvasGradients.push(canvas);
      }
    },
    addStory(story) {
      const id = STORIES.length + this.submittedData.length;
      loader.add(`${id}-data`, story.comparison_img);
      loader.add(`${id}`, story.img);
      // eslint-disable-next-line no-shadow
      loader.load((loader, resources) => {
        const text = new PIXI.Text(this.$i18n.locale === 'en' ? story.title : story.jp_title,
          {
            fontFamily: 'Arial',
            fontSize: this.$i18n.locale === 'en' ? 19 : 12,
            fill: 0xffffff,
            align: this.$i18n.locale === 'en' ? 'left' : 'center',
            wordWrap: true,
            wordWrapWidth: this.$i18n.locale === 'en' ? 150 : 25,
          });
        const img = new PIXI.Sprite(resources[`${id}`].texture);
        img.width = 250;
        img.height = 250;
        img.anchor.x = 0.5;
        img.anchor.y = 0.5;
        img.x = viewport.center.x;
        img.y = viewport.center.y;
        img.anchor.x = 0.5;
        img.anchor.y = 0.5;

        const dataImg = new PIXI.Sprite(resources[`${id}-data`].texture);
        dataImg.width = img.width;
        dataImg.height = img.height;
        dataImg.x = img.x;
        dataImg.y = img.y;
        dataImg.anchor.x = img.anchor.x;
        dataImg.anchor.y = img.anchor.y;
        const gradient = canvasGradients[Math.floor(Math.random() * canvasGradients.length)];
        const overlay = new PIXI.Sprite(PIXI.Texture.from(
          gradient,
        ));
        overlay.width = img.width;
        overlay.height = img.height;
        overlay.x = img.x;
        overlay.y = img.y;
        overlay.anchor.x = img.anchor.x;
        overlay.anchor.y = img.anchor.y;

        text.x = overlay.x;
        text.y = overlay.y;
        text.scale.x = 0.85;
        text.scale.y = 0.85;
        if (this.$i18n.locale === 'en') {
          text.anchor.x = overlay.anchor.x + 0.35;
        } else {
          text.anchor.x = overlay.anchor.x + 0.15;
        }
        text.anchor.y = overlay.anchor.y + 0.5;

        overlay.interactive = true;

        overlay.mouseover = () => {
          overlay.bringToFront();
          text.bringToFront();
          img.bringToFront();
          dataImg.bringToFront();
        };

        overlay.mouseout = () => {
          overlay.bringToFront();
          text.bringToFront();
        };

        overlay.mousedown = () => {
          this.$refs.searchBar.loseFocus();
          this.goToStory(story);
        };

        if (this.mode === 'story') {
          dataImg.alpha = 0;
          img.alpha = 1;
        } else {
          dataImg.alpha = 1;
          img.alpha = 0;
        }

        // Add the bunny to the scene we are building.
        viewport.addChild(img);
        viewport.addChild(dataImg);
        viewport.addChild(overlay);
        viewport.addChild(text);

        dataImgSprites.push(dataImg);
        storyImgSprites.push(img);

        const allLayers = [img, dataImg, overlay, text];
        spriteCollections[id] = allLayers;
      });
    },
    addStories() {
      // prevent readding duplicate stories on refresh
      if (Object.keys(spriteCollections).length > 0) {
        // eslint-disable-next-line
        for (const collection in spriteCollections) {
          spriteCollections[collection].forEach((sprite) => {
            sprite.destroy();
          });
        }
      }
      STORIES.forEach((story, i) => {
        // eslint-disable-next-line no-shadow
        loader.load((loader, resources) => {
          // This creates a texture from a 'bunny.png' image.
          const text = new PIXI.Text(this.$i18n.locale === 'en' ? story.title : story.jp_title,
            {
              fontFamily: 'Arial',
              fontSize: this.$i18n.locale === 'en' ? 19 : 12,
              fill: 0xffffff,
              align: this.$i18n.locale === 'en' ? 'left' : 'center',
              wordWrap: true,
              wordWrapWidth: this.$i18n.locale === 'en' ? 150 : 25,
            });

          const img = new PIXI.Sprite(resources[`${i}`].texture);
          img.width = 250;
          img.height = 250;
          img.x = app.renderer.width * (2 * Math.random());
          img.y = app.renderer.height * (2 * Math.random());
          img.anchor.x = 0.5;
          img.anchor.y = 0.5;
          img.x = app.renderer.width * (2 * Math.random());
          img.y = app.renderer.height * (2 * Math.random());
          img.anchor.x = 0.5;
          img.anchor.y = 0.5;

          const dataImg = new PIXI.Sprite(resources[`${i}-data`].texture);
          dataImg.width = img.width;
          dataImg.height = img.height;
          dataImg.x = img.x;
          dataImg.y = img.y;
          dataImg.anchor.x = img.anchor.x;
          dataImg.anchor.y = img.anchor.y;
          const gradient = canvasGradients[Math.floor(Math.random() * canvasGradients.length)];
          const overlay = new PIXI.Sprite(PIXI.Texture.from(
            gradient,
          ));
          overlay.width = img.width;
          overlay.height = img.height;
          overlay.x = img.x;
          overlay.y = img.y;
          overlay.anchor.x = img.anchor.x;
          overlay.anchor.y = img.anchor.y;

          text.x = overlay.x;
          text.y = overlay.y;
          text.scale.x = 0.85;
          text.scale.y = 0.85;

          if (this.$i18n.locale === 'en') {
            text.anchor.x = overlay.anchor.x + 0.35;
          } else {
            text.anchor.x = overlay.anchor.x + 0;
          }
          text.anchor.y = overlay.anchor.y + 0.5;

          overlay.interactive = true;

          overlay.mouseover = () => {
            overlay.bringToFront();
            text.bringToFront();
            img.bringToFront();
            dataImg.bringToFront();
          };

          overlay.mouseout = function () {
            overlay.bringToFront();
            text.bringToFront();
          };

          overlay.mousedown = () => {
            this.$refs.searchBar.loseFocus();
            this.goToStory(story);
          };

          if (this.mode === 'story') {
            dataImg.alpha = 0;
            img.alpha = 1;
          } else {
            dataImg.alpha = 1;
            img.alpha = 0;
          }

          viewport.addChild(img);
          viewport.addChild(dataImg);
          viewport.addChild(overlay);
          viewport.addChild(text);

          dataImgSprites.push(dataImg);
          storyImgSprites.push(img);

          const allLayers = [img, dataImg, overlay, text];
          spriteCollections[story.id] = allLayers;
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.search-stories-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;

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

    .search-bar-container {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
    }

    .pixi-container {
        position: absolute;
        max-width: 95vw;
        max-height: 100%;
        overflow: hidden;
        left: 0;
        top: 0;
    }

    .upload-icon-container {
        position: absolute;
        z-index: 2;
        right: 50px;
        bottom: 50px;

        .upload-icon {
            width: 75px;
            height: auto;
            cursor: pointer;
        }
    }

    .map-stories-buttons-container {
        display: flex;
        flex-direction: column;
        position: absolute;
        height: 100%;
        right: 25px;
        justify-content: center;
        align-items: center;

        .buttons-border {
            flex-direction: column;
            border: 2px solid  #000000;
            height: 200px;
            width: 50px;
            border-radius: 25px;
            background-color: #FFFFFF;

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

    .story-block {
        width: 50%;

        .title-container {
            padding: 15px;
            position: absolute;

            h2 {
                font-size: 1em;
                color: #DD4126;
                font-weight: normal;
                margin: 0; padding: 0;
                background-color:rgba(229,229,229,0.4);
            }
        }

        .image-container {
            object-fit: cover;
            border-bottom: 2px solid #DD4126;
            border-left: 2px solid #DD4126;
            img {
                width: 100%;
                // overflow: hidden;
                object-fit: cover;
            }
        }
        .buttons-container {
            margin-top: -10px;

            .under-image-button {
                width: 50%;
                display: inline;
                padding: 15px;
                background: #FFFFFF;
                color: #DD4126;
                font-size: 1.1em;
                border-left: 2px solid #DD4126;
                border-right: none;
                border-bottom: 2px solid #DD4126;
                border-top: 2px solid #DD4126;
            }
        }
    }
}
</style>
