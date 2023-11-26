import Moveable from "moveable";
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      selectedItem: { text: false, image: false, shape: false },
      activeMoveable: null,
      elementsList: [],
      targetElement: null,
      newElementId: 0,
      selectedElement: {},
      shouldEditText: false,
    };
  },
  mutations: {
    addElementToBody(state, type) {
      const editorBody = document.getElementById("editor-body");
      const elementId = ++state.newElementId;
      const span = document.createElement("div");
      span.addEventListener("click", () =>
        this.commit("shiftElement", { id: elementId, type })
      );

      if (type == "text") {
        span.innerHTML = `
       <h1  class="target selected"
            data-croffle-ref="targetRef${elementId}">Enter Text</h1>
        `;
        editorBody.appendChild(span);

        let targetRef = document.querySelector(
          `[data-croffle-ref="targetRef${elementId}"]`
        );
        const computedStyles = getComputedStyle(targetRef);
        state.elementsList.push({
          width: computedStyles.width,
          height: computedStyles.height,
          fontSize: computedStyles.fontSize,
          id: elementId,
          textContent: state.selectedElement.textContent || "Enter Text",
          color: state.selectedElement.color || "black",
          backgroundColor: state.selectedElement.backgroundColor || "white",
          type: type,
        });
      }
      //shape
      else if (type == "shape") {
        span.setAttribute("data-croffle-ref", `targetRef${elementId}`);
        span.innerHTML = `
          <svg
          style="width: 100px; height: 100px"
  
              class="target"
            >
            <circle
            id="circle${elementId}"

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
        state.elementsList.push({
          id: elementId,
          type: type,
          fill: "red",
          stroke: "black",
          strokeWidth: 3,
        });
      }

      //image
      else if (type === "image") {
        // const imageInput = event.target;

        const file = imageInput.files[0];

        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;
            image.classList.add("target");
            image.setAttribute("data-croffle-ref", `targetRef${elementId}`);
            image.setAttribute("width", `100px`);
            image.setAttribute("height", `100px`);
            span.appendChild(image);
            editorBody.appendChild(span);

            state.elementsList.push({
              id: elementId,
              type: "image",
              src: e.target.result,
            });
          };
          reader.readAsDataURL(file);
        }
      }
    },
    shiftElement(state, { id, type }) {
      this.commit("deselectPreviousShape");
      let targetRef = null;
      const draggable = true;
      const throttleDrag = 1;
      const edgeDraggable = false;
      const startDragRotate = 0;
      const throttleDragRotate = 0;
      const element$0 = document.querySelector(
        `[data-croffle-ref="element$0"]`
      );
      targetRef = document.querySelector(`[data-croffle-ref="targetRef${id}"]`);

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

      state.activeMoveable = moveable$0;

      if (state.targetElement == targetRef) {
        targetRef.addEventListener("click", () => {
          state.targetElement.contentEditable = true;
          state.targetElement.focus();
        });
      } else {
        state.targetElement = targetRef;
        state.targetElement.contentEditable = false;
      }

      const selectedElement = state.elementsList.find(
        (element) => element.id === id
      );

      if (selectedElement) {
        state.selectedElement = { ...selectedElement };
      }

      if (type === "shape") {
        const element = document.getElementById(`circle${id}`);
        state.targetElement = element;
      }
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
        moveable$0.keepRatio = false;
      });
      eastElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
        moveable$0.keepRatio = false;
      });
      westElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
        moveable$0.keepRatio = false;
      });
      northElement[0].addEventListener("mousedown", () => {
        moveable$0.scalable = false;
        moveable$0.resizable = true;
        moveable$0.keepRatio = false;
      });
      southEast[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
        moveable$0.keepRatio = true;
      });
      southWest[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
        moveable$0.keepRatio = true;
      });
      northEast[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
        moveable$0.keepRatio = true;
      });
      northWest[0].addEventListener("mousedown", () => {
        moveable$0.scalable = true;
        moveable$0.resizable = false;
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

    deselectPreviousShape(state) {
      if (state.activeMoveable) {
        state.activeMoveable.destroy();
        state.activeMoveable = null;
      }
    },

    changeTextStyle(state, property) {
      if (state.selectedElement.id) {
        const selectedElement = state.elementsList.find(
          (element) => element.id === state.selectedElement.id
        );

        if (selectedElement) {
          if (property === "text") {
            state.targetElement.textContent = state.selectedElement.textContent;
            selectedElement.textContent = state.selectedElement.textContent;
            selectedElement[property] = state.selectedElement[property];
          } else {
            state.targetElement.style[property] =
              state.selectedElement[property];
            selectedElement[property] = state.selectedElement[property];
          }
        }
      }
    },

    deleteElementFromBody(state, id) {
      this.commit("deselectPreviousShape");
      state.activeMoveable = null;
      const elementToRemove = document.querySelector(
        `[data-croffle-ref="targetRef${id}"]`
      );
      if (elementToRemove) {
        elementToRemove.remove();
        state.elementsList = state.elementsList.filter(
          (element) => element.id !== id
        );

        if (state.selectedElement.id === id) {
          state.selectedElement = {
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
    editMoveable(state) {
      // state.activeMoveable.checkInput = true;
      console.log("state");
      console.log(state);
    },
  },
});

export default store;
