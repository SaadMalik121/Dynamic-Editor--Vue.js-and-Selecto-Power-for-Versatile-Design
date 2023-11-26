<template>
  <div class="main-container">
    <div class="left-container">
      <div class="logo-container"><h1 class="logo">Editor</h1></div>
      <div class="underline"></div>
      <div>
        <div v-if="selectedElement.id">
          <h4
            @click="deleteTextFromBody(selectedElement.id)"
            class="delete_btn"
          >
            X - Delete Element
          </h4>
        </div>
        <div class="list" @click="toggleElement('text')">
          <h4 id="text">Text</h4>
          <span class="down-arrow" v-if="!selectedItem.text">&#11167;</span>
          <span class="up-arrow" v-else>&#11165;</span>
        </div>

        <div v-if="selectedItem?.text" class="drop-down">
          <h4 @click="addTextToBody" class="addTxt">+ Add Text</h4>

          <!-- Input Fields -->
          <div v-if="selectedElement.type == 'text'">
            <div class="form-control">
              <p class="element">Width</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.width"
                @input="changeTextStyle('width')"
              />
            </div>
            <div class="form-control">
              <p class="element">Height</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.height"
                @input="changeTextStyle('height')"
              />
            </div>
            <div class="form-control">
              <p class="element">Font Size</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.fontSize"
                @input="changeTextStyle('fontSize')"
              />
            </div>
            <!-- <div class="form-control" v-if="shouldEditText">
              <p class="element">Value</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.textContent"
                @input="changeTextStyle('text')"
              />
            </div> -->
            <div class="form-control">
              <p class="element">Color</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.color"
                @input="changeTextStyle('color')"
              />
            </div>
            <div class="form-control">
              <p class="element">Backgond</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.backgroundColor"
                @input="changeTextStyle('backgroundColor')"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div class="list" @click="toggleElement('image')">
            <h4>Image</h4>
            <span class="down-arrow" v-if="!selectedItem.image">&#11167;</span>
            <span class="up-arrow" v-else>&#11165;</span>
          </div>
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            v-if="selectedItem?.image"
            @change="updateSelectedImage"
          />
        </div>
      </div>
      <div>
        <div class="list" @click="toggleElement('shape')">
          <h4>Shapes</h4>
          <span class="down-arrow" v-if="!selectedItem.shape">&#11167;</span>
          <span class="up-arrow" v-else>&#11165;</span>
        </div>
        <!-- Circle -->
        <br />
        <br />
        <div v-if="selectedItem?.shape">
          <svg
            style="width: 100px; height: 100px"
            class="target"
            @click="addCircleToBody"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="black"
              stroke-width="3"
              fill="red"
            />
          </svg>
          <div v-if="selectedElement.type == 'shape'" class="shapeInputs">
            <div class="form-control">
              <p class="element">Fill Color</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.fill"
                @input="changeTextStyle('fill')"
              />
            </div>

            <div class="form-control">
              <p class="element">Stroke Width</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.strokeWidth"
                @input="changeTextStyle('strokeWidth')"
              />
            </div>
            <div class="form-control">
              <p class="element">Stroke Color</p>
              <input
                type="text"
                placeholder="Enter Value"
                v-model="selectedElement.stroke"
                @input="changeTextStyle('stroke')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-container">
      <div id="editor-body" class="container" data-croffle-ref="element$0">
        <div id="imageContainer">
          <img
            id="selectedImage"
            class="selectedImage"
            src=""
            @click="shiftImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Moveable from "moveable";
import Selecto from "selecto";

export default {
  mounted() {
    // const body = document.getElementsByTagName("body")[0];
    // const selecto = new Selecto({
    //   body,
    //   dragContainer: body,
    //   selectableTargets: [".target"],
    //   hitRate: 1,
    //   selectByClick: true,
    //   selectFromInside: true,
    //   ratio: 0,
    // });
    // selecto.on("select", (e) => {
    //   e.added.forEach((el) => {
    //     el.style.background = "red";
    //     el.classList.add("selected");
    //     console.log(el);
    //   });
    //   e.removed.forEach((el) => {
    //     el.style.background = "transparent";
    //     el.classList.remove("selected");
    //   });
    // });
  },
  data() {
    return {
      selectedItem: { text: false, image: false, shape: false },
    };
  },

  computed: {
    selectedElement() {
      return this.$store.state.selectedElement;
    },
    shouldEditText() {
      return this.$store.state.shouldEditText;
    },
  },

  methods: {
    deleteTextFromBody(id) {
      this.$store.commit("deleteElementFromBody", id);
    },
    changeTextStyle(property) {
      this.$store.commit("changeTextStyle", property);
    },

    toggleElement(element) {
      this.selectedItem[element] = !this.selectedItem[element];
      this.$store.commit("editMoveable");

      // this.$store.state.activeMoveable.checkInput = true;
    },

    updateSelectedImage(event) {
      this.$store.commit("addElementToBody", "image");
    },

    addCircleToBody() {
      this.$store.commit("addElementToBody", "shape");
    },
    addTextToBody() {
      this.$store.commit("addElementToBody", "text");
    },
    deselect() {
      this.$store.commit("deselectPreviousShape");
    },
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.left-container {
  width: 40%;
  background-color: antiquewhite;
  min-height: 100vh;
  padding-left: 10px;
  box-shadow: 0px 0px 8px;
  margin: 0;
  z-index: 1;
}
.right-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: white;
  padding: 10px 20px;
  max-height: 100%;
}

svg {
  cursor: pointer;
  user-select: none;
  margin-left: 30px;
}
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin-top: 10px;
}
.logo {
  box-shadow: 0px 0px 8px gray;
  border-radius: 20px;
  color: rgb(178, 141, 91);
  margin-bottom: 20px;
  padding-top: 20px;
  background-color: orange;
  text-align: center;
  color: white;
  padding: 10px;
}

.underline {
  height: 1px;
  background-color: rgba(128, 128, 128, 0.518);
  width: 90%;
}

h4 {
  color: rgba(145, 109, 50, 0.817);
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  padding: 10px 20px;
  display: block;
}

.list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  cursor: pointer;
  margin: 10px 10px;
  box-shadow: 0px 0px 5px rgba(145, 109, 50, 0.655);
  padding: 0px 20px 10px 0px;
  border-radius: 20px;
  background-color: bisque;
}

.down-arrow,
.up-arrow {
  margin-top: 10px;
  color: rgba(145, 109, 50, 0.817);
  font-weight: bolder;
  font-size: 25px;
}
.form-control {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  width: 70%;
  margin-left: 50px;
}

.element {
  color: rgba(145, 109, 50, 0.817);
}
#imageInput {
  margin-left: 40px;
  margin-top: 20px;
  padding-bottom: 20px;
}
#selectedImage {
  width: 20%;
}

h1 {
  width: 80%;
}
.addTxt {
  margin-left: 20px;
}
.shapeInputs {
  padding-bottom: 20px;
}
.delete_btn {
  color: rgba(248, 69, 69, 0.776);
}
</style>
