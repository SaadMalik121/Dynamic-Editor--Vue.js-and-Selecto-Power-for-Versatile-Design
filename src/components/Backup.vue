<template>
  <div class="main-container">
    <div class="left-container">
      <div class="logo-container"><h1 class="logo">Editor</h1></div>
      <div class="underline"></div>
      <div>
        <div class="list" @click="toggleElement('text')">
          <h4 id="text">Text</h4>
          <h4 id="text">{{ $store.state.count }}</h4>
          <h4 id="text">jsdk</h4>
          <span class="down-arrow">&#11167;</span>
        </div>

        <div v-if="selectedText.id">
          <h4 @click="deleteTextFromBody(selectedText.id)">- Delete Text</h4>
        </div>

        <div v-if="selectedItem.text">
          <h4 @click="addTextToBody">+ Add Text</h4>
          <div class="form-control">
            <p class="element">Width</p>
            <input
              type="text"
              placeholder="Enter Value"
              v-model="selectedText.width"
              @input="changeTextStyle('width')"
            />
          </div>
          <div class="form-control">
            <p class="element">Height</p>
            <input
              type="text"
              placeholder="Enter Value"
              v-model="selectedText.height"
              @input="changeTextStyle('height')"
            />
          </div>
          <div class="form-control">
            <p class="element">Font Size</p>
            <input
              type="text"
              placeholder="Enter Value"
              v-model="selectedText.fontSize"
              @input="changeTextStyle('fontSize')"
            />
          </div>
          <div class="form-control">
            <p class="element">Value</p>
            <input
              type="text"
              placeholder="Enter Value"
              v-model="selectedText.textContent"
              @input="changeTextStyle('text')"
            />
          </div>
          <div class="form-control">
            <p class="element">Color</p>
            <input
              type="text"
              placeholder="Enter Value"
              v-model="selectedText.color"
              @input="changeTextStyle('color')"
            />
          </div>
          <div class="form-control">
            <p class="element">Backgond</p>
            <input
              type="text"
              placeholder="Enter Value"
              v-model="selectedText.backgroundColor"
              @input="changeTextStyle('backgroundColor')"
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <div class="list" @click="toggleElement('image')">
            <h4>Image</h4>
            <span class="down-arrow">&#11167;</span>
          </div>
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            v-if="selectedItem.image"
            @change="updateSelectedImage"
          />
        </div>
      </div>
      <div>
        <div class="list" @click="toggleElement('shape')">
          <h4>Shapes</h4>
          <span class="down-arrow">&#11167;</span>
        </div>
        <!-- Circle -->
        <br />
        <br />
        <div v-if="selectedItem.shape">
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

export default {
  data() {
    return {
      selectedItem: { text: false, image: false, shape: false },
      newShapeId: 0,
      textElements: [],
      activeMoveable: null,
      newTextId: 0,
      selectedText: {
        width: null,
        height: null,
        fontSize: null,
        id: null,
        textContent: null,
        color: null,
        backgroundColor: null,
      },
      targetElement: null,
    };
  },

  methods: {
    deleteTextFromBody(id) {
      this.deselectPreviousShape();
      this.activeMoveable = null;
      const elementToRemove = document.querySelector(
        `[data-croffle-ref="targetRefText${id}"]`
      );
      if (elementToRemove) {
        elementToRemove.remove();
        this.textElements = this.textElements.filter(
          (element) => element.id !== id
        );

        if (this.selectedText.id === id) {
          this.selectedText = {
            width: null,
            height: null,
            fontSize: null,
            id: null,
            textContent: null,
            color: null,
            backgroundColor: null,
          };
        }
      }
    },
    changeTextStyle(property) {
      if (this.selectedText.id) {
        const selectedText = this.textElements.find(
          (element) => element.id === this.selectedText.id
        );

        if (selectedText) {
          if (property === "text") {
            this.targetElement.textContent = this.selectedText.textContent;
            selectedText.textContent = this.selectedText.textContent;
          } else {
            this.targetElement.style[property] = this.selectedText[property];
            selectedText[property] = this.selectedText[property];
          }
        }
      }
    },

    toggleElement(element) {
      this.selectedItem[element] = !this.selectedItem[element];
    },

    updateSelectedImage(event) {
      const imageInput = event.target;
      const selectedImage = document.getElementById("selectedImage");

      const file = imageInput.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          selectedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    addCircleToBody() {
      const editorBody = document.getElementById("editor-body");
      const shapeId = ++this.newShapeId;
      const span = document.createElement("div");
      span.addEventListener("click", () => this.shiftCircle(shapeId));
      span.innerHTML = `
          <svg
          style="width: 100px; height: 100px"
          data-croffle-ref="targetRefCircle${shapeId}"

              class="target"
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
          `;
      editorBody.appendChild(span);
    },
    addTextToBody() {
      const editorBody = document.getElementById("editor-body");
      const textId = ++this.newTextId;
      const span = document.createElement("span");
      span.addEventListener("click", () => this.shiftText(textId));
      span.innerHTML = `
         <h1  class="target"
              data-croffle-ref="targetRefText${textId}">Enter Text</h1>
          `;
      editorBody.appendChild(span);

      let targetRef = document.querySelector(
        `[data-croffle-ref="targetRefText${textId}"]`
      );
      const computedStyles = getComputedStyle(targetRef);
      this.textElements.push({
        width: computedStyles.width,
        height: computedStyles.height,
        fontSize: computedStyles.fontSize,
        id: textId,
        textContent: this.selectedItem.textContent || "Enter Text",
        color: this.selectedItem.color || "black",
        backgroundColor: this.selectedItem.backgroundColor || "white",
      });
    },
    shiftText(textId) {
      this.deselectPreviousShape();
      let targetRef = null;
      const draggable = true;
      const throttleDrag = 1;
      const edgeDraggable = false;
      const startDragRotate = 0;
      const throttleDragRotate = 0;
      const element$0 = document.querySelector(
        `[data-croffle-ref="element$0"]`
      );
      targetRef = document.querySelector(
        `[data-croffle-ref="targetRefText${textId}"]`
      );

      this.targetElement = targetRef;

      const selectedText = this.textElements.find(
        (element) => element.id === textId
      );

      if (selectedText) {
        this.selectedText = { ...selectedText };
      }
      const renderDirections = ["nw", "n", "ne", "w", "e", "sw", "s", "se"];

      const moveable$0 = new Moveable(element$0, {
        target: targetRef,
        draggable: draggable,
        throttleDrag: throttleDrag,
        edgeDraggable: edgeDraggable,
        startDragRotate: startDragRotate,
        throttleDragRotate: throttleDragRotate,
        // renderDirections: ["e", "w", "n", "s"],
        scalable: true,
        resizable: true,
        rotatable: true,

        // scalable: true,
      });

      this.activeMoveable = moveable$0;

      const northElement = document.getElementsByClassName("moveable-n");
      const eastElement = document.getElementsByClassName("moveable-e");
      const westElement = document.getElementsByClassName("moveable-w");
      const southElement = document.getElementsByClassName("moveable-s");
      const northEast = document.getElementsByClassName("moveable-ne");
      const northWest = document.getElementsByClassName("moveable-nw");
      const southEast = document.getElementsByClassName("moveable-se");
      const southWest = document.getElementsByClassName("moveable-sw");

      southElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
      });
      eastElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
      });
      westElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
      });
      northElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
      });
      southEast[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
      });
      southWest[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
      });
      northEast[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
      });
      northWest[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
      });

      moveable$0.on("drag", (e) => {
        e.target.style.transform = e.transform;
      });
      moveable$0.on("scale", (e) => {
        e.target.style.transform = e.drag.transform;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      });
      moveable$0.on("resize", (e) => {
        e.target.style.transform = e.drag.transform;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      });
      moveable$0.on("rotate", (e) => {
        e.target.style.transform = e.drag.transform;
      });
    },
    deselectPreviousShape() {
      if (this.activeMoveable) {
        this.activeMoveable.destroy();
        this.activeMoveable = null;
      }
    },
    shiftCircle(shapeId) {
      this.deselectPreviousShape();
      let targetRef = null;
      const draggable = true;
      const throttleDrag = 1;
      const edgeDraggable = false;
      const startDragRotate = 0;
      const throttleDragRotate = 0;
      const element$0 = document.querySelector(
        `[data-croffle-ref="element$0"]`
      );
      targetRef = document.querySelector(
        `[data-croffle-ref="targetRefCircle${shapeId}"]`
      );

      const moveable$0 = new Moveable(element$0, {
        target: targetRef,
        draggable: draggable,
        throttleDrag: throttleDrag,
        edgeDraggable: edgeDraggable,
        startDragRotate: startDragRotate,
        throttleDragRotate: throttleDragRotate,
        scalable: true,
        rotatable: true,
      });

      this.activeMoveable = moveable$0;

      moveable$0.on("drag", (e) => {
        e.target.style.transform = e.transform;
      });
      moveable$0.on("scale", (e) => {
        e.target.style.transform = e.drag.transform;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      });
      moveable$0.on("rotate", (e) => {
        e.target.style.transform = e.drag.transform;
      });
    },
    shiftImage() {
      this.deselectPreviousShape();
      const draggable = true;
      const throttleDrag = 1;
      const edgeDraggable = false;
      const startDragRotate = 0;
      const throttleDragRotate = 0;
      const imageRef = document.getElementById("selectedImage");
      const imageContainer = document.getElementById(`imageContainer`);

      const moveable$0 = new Moveable(imageContainer, {
        target: imageRef,
        draggable: draggable,
        throttleDrag: throttleDrag,
        edgeDraggable: edgeDraggable,
        startDragRotate: startDragRotate,
        throttleDragRotate: throttleDragRotate,
        scalable: true,
        rotatable: true,
        resizable: true,
      });
      this.activeMoveable = moveable$0;
      const northElement = document.getElementsByClassName("moveable-n");
      const eastElement = document.getElementsByClassName("moveable-e");
      const westElement = document.getElementsByClassName("moveable-w");
      const southElement = document.getElementsByClassName("moveable-s");
      const northEast = document.getElementsByClassName("moveable-ne");
      const northWest = document.getElementsByClassName("moveable-nw");
      const southEast = document.getElementsByClassName("moveable-se");
      const southWest = document.getElementsByClassName("moveable-sw");

      southElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
        moveable$0.keepRatio = false;
      });
      eastElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
        moveable$0.keepRatio = false;
      });
      westElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
        moveable$0.keepRatio = false;
      });
      northElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
        moveable$0.keepRatio = false;
      });
      southEast[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
        moveable$0.keepRatio = true;
      });
      southWest[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
        moveable$0.keepRatio = true;
      });
      northEast[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
        moveable$0.keepRatio = true;
      });
      northWest[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
        moveable$0.keepRatio = true;
      });

      moveable$0.on("drag", (e) => {
        e.target.style.transform = e.transform;
      });
      moveable$0.on("scale", (e) => {
        e.target.style.transform = e.drag.transform;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      });
      moveable$0.on("resize", (e) => {
        e.target.style.transform = e.drag.transform;
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      });
      moveable$0.on("rotate", (e) => {
        e.target.style.transform = e.drag.transform;
      });
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
  width: 30%;
  background-color: antiquewhite;
  min-height: 100vh;
  padding-left: 10px;
  box-shadow: 0px 0px 8px;
  margin: 0;
  z-index: 1;
}
.right-container {
  width: 80%;
  display: flex;
  /* justify-content: space-evenly; */
  flex-direction: row;
  flex-wrap: wrap;
  /* background-color: rgb(227, 225, 225); */
  background-color: white;
  padding: 10px 20px;
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
  width: 80%;
  cursor: pointer;
}

.down-arrow {
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
}
#selectedImage {
  width: 20%;
}

h1 {
  width: 80%;
}
</style>
