<template>
    <div class="network-container">
        <h1>{{$t('network-page.title')}}</h1>
        <button
            class="back-button"
            v-html="`<  ${$t('back')}`"
            @click="closeSection"
        />
        <div class="search-bar-container">
            <input
                v-model="search"
                :placeholder="showPage === 'connections'
                    ? `${$t('network-page.search-placeholder')}`
                    : `${$t('network-page.search-request-placeholder')}`"
                class="search-bar"
            >
            <div class="search-button-container">
                <button class="search-button">
                <img
                    src="/images/ui/search-icon-small.png"
                    class="search-icon"
                    @click="getSearchResult"
                />
                </button>
            </div>
        </div>
        <div class="network-page-buttons">
            <button v-if="showPage === 'connections'
                || showPage === 'searchResults'"
                @click="selectRequests" class="selected"
            >
                {{ $t('network-page.requests') }}
            </button>
            <button
                v-if="showPage === 'requests'"
                class="selected" @click="selectConnections"
            >
                {{ $t('network-page.connections') }}
            </button>
        </div>
        <div class="network-placeholder-container" :class="{hidden: showPage!=='connections'}">
          <img src="/images/ui/network.png" />
        </div>
        <div class="search-results-container" :class="{hidden: showPage!=='searchResults'}">
            <img src="/images/ui/search-results.png" />
        </div>
        <div class="requests-placeholder" :class="{hidden: showPage!=='requests'}">
            <img src="/images/ui/requests.png" />
        </div>
    </div>
</template>

<script>
import Highcharts from 'highcharts';
import NetworkGraph from 'highcharts/modules/networkgraph';

NetworkGraph(Highcharts);

export default {
  name: 'network',
  methods: {
    closeSection() {
      this.$emit('closeSection');
    },
    selectRequests() {
      this.showPage = 'requests';
    },
    selectConnections() {
      this.showPage = 'connections';
    },
    getSearchResult() {
      this.showPage = 'searchResults';
    },
  },
  data() {
    return {
      showPage: 'connections',
      search: '',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.hidden {
    display: none;
}

.search-bar-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;

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
        width: 80%;
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

.network-container {
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #0060FF 0%, rgba(255, 255, 255, 100%) 100%);

    .network-placeholder-container {
        width: 80%;
        margin: 0 auto;
        img {
            max-width: 100%;
            box-sizing: border-box;
            padding: 50px;
        }
    }
    .search-results-container, .requests-placeholder {
        width: 60%;
        margin: 0 auto;

        img {
            max-width: 100%;
            box-sizing: border-box;
            padding: 50px;
        }
    }

    h1 {
        color: #FFFFFF;
        font-size: 2em;
        justify-content: center;
        margin: 0 auto;
        margin-top: 10vh;
        text-transform: uppercase;
        font-weight: 400;
    }

    .network-page-buttons {
        z-index: 4;
        button {
            padding: 15px;
            border: 1px solid black;
            background-color: #FFFFFF;
            margin: 25px 35px;

            &.selected {
                background-color: #000000;
                color: #FFFFFF;
            }
        }
    }

    .graph-container {
        margin-top: -70px;
        h2 {
            font-size: 1em;
            text-transform: lowercase;
        }
    }

    .ui-placeholder-container {
        position: absolute;
        height: 100%;
        width: auto;
        box-sizing: border-box;
        padding: 20vh 15vw;

        img {
            width: 100%;
        }
    }
    .back-button {
        position: absolute;
        z-index: 4;
        height: 50px;
        width: 100px;
        top: 25px;
        left: 25px;
        background: none;
        color: #000000;
        border: none;
        outline: none;
        text-transform: lowercase;
    }
}

</style>
