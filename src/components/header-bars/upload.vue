<template>
    <div class="upload-title-container">
        <div class="title-bar-container">
          <input
              v-model="title"
              placeholder="title of story ..."
              class="title-bar"
          >
          <div class="upload-button-container">
          <button
            class="upload-button"
            @click="upload"
          >
            UPLOAD
          </button>
        </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'UploadBar',
  data() {
    return {
      title: '',
    };
  },
  methods: {
    upload() {
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .upload-title-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 5px;

    .title-bar-container {
      width: 95%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 15px;

      .upload-button {
        margin-left: -110px;
        background: none;
        border: 1px solid #DD4126;
        text-transform: uppercase;
        font-size: 0.9em;
        color: #DD4126;
        padding: 5px;
        margin-bottom: 15px;
        width: 110px;
      }

      input {
        width: 100%;
        font-size: 1em;
        padding: 15px;
        padding: 1vh 0;
        color: #000000;
        font-weight: 900;
        border: none; outline: none;
        border-bottom: 2px solid #000000;
      }

      ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #000000;
        opacity: 1; /* Firefox */
      }
    }
  }
</style>
