<template>
    <div class="search-container">
        <div class="search-bar-container">
          <input
              ref="searchInput"
              v-model="search"
              :placeholder="mode === 'analyse' ? `${$t('analyze.search-placeholder')}`
                : `${$t('search-stories-page.search-placeholder')}`"
              class="search-bar"
              @keyup.enter="getSearchResult"
          />
          <div class="search-button-container">
            <button @click="getSearchResult" class="search-button">
              <img
                src="/images/ui/search-icon-small.png"
                class="search-icon"
              />
            </button>
          </div>
        </div>
        <div v-if="(mode==='story' || mode==='search_map')
          && this.highlighted" class="search-helper-container"
        >
          <div class="search-helper">
            <p class="selectable">
              <img
                src="/images/ui/search-icon-small.png"
                class="search-icon"
              />
              <span
                @click="searchFor('deforestation')">
                  {{ $t('search-stories-page.deforestation') }}
                </span>
            </p>
            <p class="selectable">
              <img
                src="/images/ui/search-icon-small.png"
                class="search-icon"
              />
              <span @click="searchFor('ocean')">{{ $t('search-stories-page.ocean') }}</span>
            </p>
            <div v-if="togglingSettings" class="bottom-options-container">
              <div class="bottom-options">
                <span class="selected">{{ $t('search-stories-page.relevance') }}</span>
                <span>{{ $t('search-stories-page.level') }}</span>
                <span>{{ $t('search-stories-page.date') }}</span>
                <span>{{ $t('search-stories-page.location') }}</span>
                <span>{{ $t('search-stories-page.reviews') }}</span>
                <span class="popularity">{{ $t('search-stories-page.popularity') }}</span>
                <span
                  class="apply"
                  ref="applyToggler"
                  @click="toggleMenuSettings">
                    {{ $t('search-stories-page.apply') }}
                  </span>
              </div>
            <div>
          </div>
        </div>
         <div v-else class="bottom-alerts-container">
              <span>{{ $t('search-stories-page.current-alerts') }}</span>
              <button
                class="sort-settings-button"
                ref="sortToggler"
                @click="toggleMenuSettings">
                  {{ $t('search-stories-page.sort-settings') }}
                </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import STORIES from '../../data/stories.json';

export default {
  name: 'SearchBar',
  data() {
    return {
      togglingSettings: false,
      search: '',
      STORIES,
      highlighted: false,
    };
  },
  mounted() {
    document.addEventListener('focusin', this.focusChanged);
    document.addEventListener('click', this.clickedOnPage);
    document.addEventListener('focusout', this.focusChanged);
    document.onkeydown = () => {
      if (this.search.length > 2 || this.search.length - 1 === 0) {
        this.getSearchResult();
      }
    };
  },
  props: {
    mode: String,
  },
  beforeDestroy() {
    document.removeEventListener('focusin', this.focusChanged);
    document.removeEventListener('focusout', this.loseFocus);
  },
  methods: {
    toggleMenuSettings() {
      this.togglingSettings = !this.togglingSettings;
    },
    searchFor(string) {
      this.search = string;
      this.getSearchResult();
    },
    loseFocus() {
      setTimeout(() => {
        this.highlighted = false;
      }, 0);
    },
    focusChanged(event) {
      const el = event.target;
      if (el === this.$refs.searchInput) {
        this.highlighted = true;
      } else {
        if (el === this.$refs.applyToggler || el === this.$refs.sortToggler) {
          return;
        }
        this.highlighted = false;
      }
    },
    goToMap() {
      this.$emit('goToMap');
    },
    goToStories() {
      this.$emit('goToStories');
    },
    getSearchResult() {
      if (this.search.length - 1 === 0) {
        this.$emit('getSearchResult', STORIES);
        return;
      }
      const matches = [];
      // eslint-disable-next-line array-callback-return
      STORIES.filter((story) => {
        if (
          story.title.toLowerCase().includes(this.search.toLowerCase())
              || story.jp_title.toLowerCase().includes(this.search.toLowerCase())
        ) {
          matches.push(story);
        }
        if (
          story.description.toLowerCase().includes(this.search.toLowerCase())
              || story.jp_description.toLowerCase().includes(this.search.toLowerCase())
        ) {
          matches.push(story);
        }

        if (
          story.location.toLowerCase().includes(this.search.toLowerCase())
              || story.jp_location.toLowerCase().includes(this.search.toLowerCase())
        ) {
          matches.push(story);
        }

        if (
          story.tags.includes(this.search.toLowerCase())
              || story.jp_tags.includes(this.search.toLowerCase())
        ) {
          matches.push(story);
        }
      });

      const removeDuplicates = matches.filter((v, i, a) => a
        .findIndex((t) => (t.id === v.id)) === i);
      this.$emit('getSearchResult', removeDuplicates);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .search-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 25px;
    z-index: 2;

    .search-helper-container {
      top: 30px;
      position: absolute;
      width: 100%;
      z-index: -1;
      width: 80%;
      height: 100px;
      margin-top: -20px;
      box-sizing: border-box;

    .search-helper {
      background-color: #ffffff;
      border: 2px solid #000000;
      border-radius: 30px;
      text-align: left;
      color: #666666;
      padding-top: 50px;

      p {
        margin: 0;
        line-height: 0px;
        padding: 0;
        &.selectable {
          cursor: pointer;
      }
      .search-icon {
        height: 35px;
        opacity: 0.8;
        vertical-align: middle;
      }
    }

    .bottom-alerts-container {
      margin-left: 5px;
      padding: 20px 15px;
      margin-bottom: 2px;

      span {
        font-style: italic;
        line-height: 25px;
        cursor: default;
      }

      .sort-settings-button {
        padding: 12px 0px;
        border-radius: 30px;
        color: snow;
        position: relative;
        background-color: #A5A5A5;
        border: 4px solid #A5A5A5;
        cursor: pointer;
        background-size: cover;
        width: 100px;
        right: 0;
        position: absolute;
        right: 2.5%;
        font-size: 0.95em;
        font-size: 1em;
        border: none;
        margin-top: -10px;
      }
    }

    .bottom-options-container {
      .bottom-options {
        width: 95%;
        text-align: center;
        margin: 0 auto;
        border: 2px solid #A5A5A5;;
        border-radius: 30px;
        margin-top: 10px;
        margin-bottom: 15px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;

        span {
          padding: 10px 0;
          box-sizing: border-box;
          color: #A5A5A5;
          justify-content: space-around;

          &.selected {
            color: #000000;
          }

          &.popularity {
            margin-right: 15%;
          }

          &.apply {
            padding: 10px 30px;
            border-radius: 30px;
            color: snow;
            position: relative;
            background-color: #A5A5A5;
            cursor: pointer;
            background-size: cover;
            width: 100px;
            right: 0;
            position: absolute;
            right: 2.5%;
          }
        }
      }
    }
  }
}

.search-bar-container {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;

  .search-button {
    margin-left: -110px;
    background: none;
    text-transform: uppercase;
    font-size: 0.9em;
    padding: 5px;
    margin-bottom: 0;
    width: 110px;
    border: none;

    .search-icon {
      width: 55px;
    }
  }

  input {
    width: 100%;
    font-size: 1em;
    color: #000000;
    font-weight: 900;
    border: none; outline: none;
    border: 2px solid #000000;
    padding: 10px;
    padding-left: 30px;
    border-radius: 25px;
  }

  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #000000;
    opacity: 1; /* Firefox */
    font-weight: 400;
    padding-left: 15px;
  }
}
}
</style>
