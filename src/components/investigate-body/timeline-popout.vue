<template>
    <div class="timeline-popout-container">
        <div 
            @click="close"
            class="close-icon"
        > 
            >
        </div>
        <div class="stories-container">
            <div class="title-container">
                <h2>{{ story.title }}</h2>
            </div>
            <div class="image-container">
                <img :src="story.comparison_img" />
            </div>
            <div class="info-container">
                <p>Date: {{ story.date }}</p>
                <p>Location: {{ story.location }}</p>
                <p>Data: {{ story.data }}</p>
                <p>Media: {{ story.media }}</p>
                <p>Description: {{ story.description }}</p>
                <p>Tags: {{ story.tags }}</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'SearchStoriesContainer',
  components: {

  },
  props: {
      story: Object,
  },
  data() {
    return {
    }
  },
methods: {
    close() {
        this.$emit('closeStory');
    },
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.timeline-popout-container {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    border-left: 2px solid #DD4126;
    border-right: 2px solid #DD4126;
    border-bottom: 2px solid #DD4126;
    text-align: left;
    padding: 15px;
    overflow-y: scroll;

    .stories-container {
        display: flex;
        flex-direction: row;
        flex-flow: wrap;
        color: #DD4126;

        h2 {
            width: 100%;
            font-size: 1em;
            font-weight: 400;
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