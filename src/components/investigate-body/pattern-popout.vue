<template>
    <div class="pattern-popout-container">
        <div
            @click="close"
            class="close-icon"
        >
            >
        </div>
        <div class="stories-container">
            <div
                :class="['story-container', { 'main': index === 0 }]"
                v-for="(story, index) in selectedData" :key="index"
            >
                <h2 v-if="index === 0">{{ story.title }}</h2>
                <img class="story-img" :src="index === 0 ? story.comparison_img : story.img">
                <div class="extra-data" v-if="index === 0">
                    <p>Paired with: {{ story.data }}</p>
                    <p>{{ story.date }}</p>
                    <p>{{ story.lat }}, {{ story.lng }}</p>
                    <p>Tags: <span v-for="tag in story.tags" :key="tag">{{ tag }} / </span></p>
                </div>
                <p v-if="index === 0 && selectedData.length > 1">Similar Stories</p>
                <p v-if="index !== 0">{{ story.title }}</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'PatternPopoutContainer',
  props: {
    selectedData: Array,
  },
  data() {
    return {
    };
  },
  methods: {
    close() {
      this.$emit('closeStory');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.pattern-popout-container {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    border-left: 2px solid #DD4126;
    border-right: 2px solid #DD4126;
    text-align: left;
    padding: 15px;
    min-height: 100%;

    .stories-container {
        display: flex;
        flex-direction: row;
        flex-flow: wrap;
        color: #DD4126;

        .story-container {
            flex-direction: column;
            width: 50%;
            display: flex;
            img {
                max-width: 80%;
            }

            .extra-data {
                position: absolute;
                padding: 45px 45px 45px 20px;
                left: 50%;
                margin: 0;
                font-size: 0.8em;

                p {
                    margin: 0;
                    padding: 0;
                }
            }

            &.main {
                width: 100%;
                flex-direction: column;
                h2 {
                    width: 100%;
                    font-size: 1em;
                    font-weight: 400;
                }
                img {
                    max-width: 50%;
                }
            }
        }
    }

    .close-icon {
        color: #DD4126;
        text-align: right;
        background: none;
        border: none;
        font-weight: 900;
        font-size: 1.3em;
        outline: 0;
        cursor: pointer;
    }

    .image-container {

        img {
            max-width: 50%;
        }
    }
}
</style>
