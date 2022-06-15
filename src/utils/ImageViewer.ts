export class ImageViewer {
  image: HTMLImageElement;
  answer: any;
  solution: null;
  annotations: never[];
  zoomIn: () => void;
  zoomOut: () => void;
  dispose: () => void;
  refresh: () => void;
  constructor(canvasId: any, imageUrl: any, options: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: any = this;

    function Button(icon, tooltip) {
      // drawn on position
      this.drawPosition = null;
      this.drawRadius = 0;

      // transparency
      this.alpha = 0.5;

      // border
      this.lineWidth = 0; // default: 0 == disabled
      this.strokeStyle = "#000000";

      // color
      this.color = "#000000";

      // icon unicode from awesome font
      this.icon = icon;
      this.iconColor = "#ffffff";

      // tooltip
      this.tooltip = tooltip || null;

      // enabled state
      this.enabled = false;
      this.enabledAlpha = 0.7;

      // click action
      this.onClick = function () {
        alert("no click action set!");
        return true;
      };

      // mouse down action
      this.onMouseDown = function () {
        return false;
      };
    }
    options = typeof options === "object" ? options : {};

    // sanitize options.mode once
    options.mode = typeof options.mode === "string" ? options.mode : "";

    // canvas
    const canvas: any = document.getElementById(canvasId);
    const context = canvas.getContext("2d");
    // dirty state
    let dirty = true,
      // flag to stop render loop
      stopRendering = false,
      // image scale
      scale = 1;
    const scaleStep = 0.1,
      // image centre (scroll offset)
      centre = { x: 0, y: 0 };
    // keeping track of event handling
    let events: any = [];
    //// buttons
    // default buttons that are always visible
    const zoomOutButton = new Button("\uf010", "Zoom out"),
      zoomInButton = new Button("\uf00e", "Zoom in"),
      defaultButtons = [zoomOutButton, zoomInButton],
      // contains all active buttons
      buttons = defaultButtons.slice(),
      // contains all active color buttons (for coloring annotations)
      colorButtons: any = [];
    // current tool tip (used to track change of tool tip)
    let currentTooltip = null,
      // Input handling
      // active element (mainly) used for dragging
      activeMoveElement = centre,
      // track state of left mouse button (even outside the canvas)
      leftMouseButtonDown = false,
      // keep last mouse position to calculate drag distance
      mouseLastPos: any = null,
      // UI element which is currently in focus, i.e. the mouse is hovering over it
      focusUIElement = null;
    // active polygon in edit mode
    let activePolygon: any = null;
    // solution feature
    const solutionEditable = options.mode === "editSolution",
      // annotation feature
      annotationsEditable = options.mode === "editAnnotations";

    function convertToImagePosition(canvasPosition) {
      const visiblePart = {
          x:
            centre.x >= canvas.width / scale / 2
              ? centre.x - canvas.width / scale / 2
              : 0,
          y:
            centre.y >= canvas.height / scale / 2
              ? centre.y - canvas.height / scale / 2
              : 0,
        },
        canvasImage = {
          x:
            centre.x >= canvas.width / scale / 2
              ? 0
              : canvas.width / 2 - centre.x * scale,
          y:
            centre.y >= canvas.height / scale / 2
              ? 0
              : canvas.height / 2 - centre.y * scale,
        },
        imagePosition: any = {};

      imagePosition.x =
        visiblePart.x + // image offset
        canvasPosition.x / scale - // de-scaled canvas position
        canvasImage.x / scale; // de-scaled canvas offset
      imagePosition.y =
        visiblePart.y + // image offset
        canvasPosition.y / scale - // de-scaled canvas position
        canvasImage.y / scale; // de-scaled canvas offset

      return imagePosition;
    }

    function changeZoom(ctx, x, y, width, height, radius, fill, stroke) {
      radius = typeof radius === "number" ? radius : 5;
      fill = typeof fill === "boolean" ? fill : true; // fill = default
      stroke = typeof stroke === "boolean" ? stroke : false;

      // draw round rectangle
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    function createZoomButtons(ctx) {
      const padding = 10,
        radius = 20,
        gap = 2 * radius + padding;
      let x = canvas.width - radius - padding,
        y = canvas.height - radius - padding;
      let i;

      // draw buttons
      for (i = 0; i < buttons.length; i++) {
        buttons[i].draw(ctx, x, y - gap * i, radius);
      }

      // draw color buttons
      // ---
      // set starting coordinates in lower left corner
      x = radius + padding;
      y = canvas.height - radius - padding;
      for (i = 0; i < colorButtons.length; i++) {
        colorButtons[i].draw(ctx, x, y - gap * i, radius);
      }

      // draw tooltip
      if (currentTooltip !== null) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        const fontSize = radius;
        ctx.font = fontSize + "px sans-serif";

        // calculate position
        const textSize = ctx.measureText(currentTooltip).width,
          rectWidth = textSize + padding,
          rectHeight = fontSize * 0.8 + padding,
          rectX =
            canvas.width -
            (2 * radius + 2 * padding) - // buttons
            rectWidth,
          rectY = canvas.height - rectHeight - padding,
          textX = rectX + 0.5 * padding,
          textY = canvas.height - 1.5 * padding;

        ctx.fillStyle = "#000000";
        changeZoom(ctx, rectX, rectY, rectWidth, rectHeight, 8, true, false);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(currentTooltip, textX, textY);

        ctx.restore();
      }
    }
    function render() {
      // only re-render if dirty
      if (dirty) {
        dirty = false;

        const ctx = context;
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw image (transformed and scaled)
        ctx.save();
        const translateX = canvas.width / 2 - centre.x * scale,
          translateY = canvas.height / 2 - centre.y * scale;

        ctx.translate(translateX, translateY);
        ctx.scale(scale, scale);

        ctx.drawImage(self.image, 0, 0);

        ctx.restore();

        // create zoom buttons
        createZoomButtons(ctx);
      }
      if (!stopRendering) window.requestAnimationFrame(render);
    }

    // image
    this.image = new Image();

    // answer
    this.answer =
      typeof options.answer === "object" && options.answer !== null
        ? options.answer
        : null;

    // solution
    this.solution = null;

    // annotations
    // format: { polygon: Polygon-object, color: color-string }
    this.annotations = [];

    function onImageLoad() {
      // set scale to use as much space inside the canvas as possible
      if (
        (canvas.height / self.image.height) * self.image.width <=
        canvas.width
      ) {
        scale = canvas.height / self.image.height;
      } else {
        scale = canvas.width / self.image.width + 0.3;
      }

      // centre at image centre
      centre.x = self.image.width / 2;
      centre.y = self.image.height / 2;

      // image changed
      dirty = true;

      // start new render loop
      render();
    }

    this.zoomIn = function () {
      scale = scale * (1 + scaleStep);
      dirty = true;
    };

    this.zoomOut = function () {
      scale = scale * (1 - scaleStep);
      dirty = true;
    };

    function convertToCanvasTranslation(imagePosition) {
      return {
        x:
          (imagePosition.x + // x-position on picture
            canvas.width / scale / 2 - // offset of scaled canvas
            centre.x) * // scroll offset of image
          scale,

        y:
          (imagePosition.y + // y-position on picture
            canvas.height / scale / 2 - // offset of scaled canvas
            centre.y) * // scroll offset of image
          scale, // scale the transformation
      };
    }

    function getUIElements() {
      let collectedUIElements: any = [];
      // add buttons
      collectedUIElements = collectedUIElements
        .concat(buttons)
        .concat(colorButtons);

      // only add the polygon vertices handler
      // if there is an active polygon
      // and we are in polygon edit mode
      // (and add them before the polygons)
      if ((solutionEditable || annotationsEditable) && activePolygon !== null) {
        collectedUIElements = collectedUIElements.concat(
          activePolygon.getVertices()
        );
      }

      // add annotations
      collectedUIElements = collectedUIElements.concat(
        self.annotations.map(function (annotation) {
          return annotation.polygon;
        })
      );

      // add solution, if it exists
      if (self.solution !== null) collectedUIElements.push(self.solution);

      return collectedUIElements;
    }

    function getUIElement(evt) {
      const rect = canvas.getBoundingClientRect(),
        pos = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top,
        },
        activeUIElement = getUIElements().filter(function (uiElement) {
          return uiElement.isWithinBounds(pos.x, pos.y);
        });
      return activeUIElement.length > 0 ? activeUIElement[0] : null;
    }

    function onMouseDown(evt) {
      if (evt.button === 0) {
        // left/main button
        const activeElement = getUIElement(evt);
        if (activeElement === null || !activeElement.onMouseDown(evt)) {
          // set flag for image moving
          leftMouseButtonDown = true;
        }
      }
    }

    function onMouseUp(evt) {
      if (evt.button === 0) {
        // left/main button
        activeMoveElement = centre;
        leftMouseButtonDown = false;
      }
    }

    function onMouseClick(evt) {
      if (evt.button === 0) {
        // left/main button
        const activeElement = getUIElement(evt);
        if (activeElement === null || activeElement.onClick(evt)) {
          const rect = canvas.getBoundingClientRect(),
            clickPos = {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top,
            };
        }
      }
    }

    function onMouseWheel(evt) {
      if (!evt) evt = event;
      evt.preventDefault();
      if (evt.detail < 0 || evt.wheelDelta > 0) {
        // up -> smaller
        self.zoomOut();
      } else {
        // down -> larger
        self.zoomIn();
      }
    }

    function mouseDrag(evt) {
      const rect = canvas.getBoundingClientRect(),
        newPos = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top,
        };
      mouseLastPos = mouseLastPos || { x: 0, y: 0 };
      const deltaX = newPos.x - mouseLastPos.x,
        deltaY = newPos.y - mouseLastPos.y;
      if (leftMouseButtonDown) {
        if (activeMoveElement === centre) {
          activeMoveElement.x -= deltaX / scale;
          activeMoveElement.y -= deltaY / scale;
        } else {
          activeMoveElement.x += deltaX / scale;
          activeMoveElement.y += deltaY / scale;
          if (activePolygon === self.solution) {
            self.onSolutionChange(self.exportSolution());
          } else {
            self.onAnnotationChange(self.exportAnnotations());
          }
        }
        dirty = true;
      } else {
        const activeElement = getUIElement(evt),
          oldToolTip = currentTooltip;
        if (activeElement !== null) {
          if (typeof activeElement.tooltip !== "undefined") {
            currentTooltip = activeElement.tooltip;
          }
          // new focus UI element?
          if (activeElement !== focusUIElement) {
            focusUIElement = activeElement;
          }
        } else {
          // no activeElement
          currentTooltip = null;
          if (focusUIElement !== null) {
            focusUIElement = null;
          }
        }
        if (oldToolTip !== currentTooltip) dirty = true;
      }
      mouseLastPos = newPos;
      if (solutionEditable || annotationsEditable) dirty = true;
    }

    Button.prototype.isWithinBounds = function (x, y) {
      if (this.drawPosition === null) return false;
      const dx = Math.abs(this.drawPosition.x - x),
        dy = Math.abs(this.drawPosition.y - y);
      return dx * dx + dy * dy <= this.drawRadius * this.drawRadius;
    };

    function drawAwesomeIcon(ctx, icon, color, centreX, centreY, size) {
      // font settings
      ctx.font = size + "px FontAwesome";
      ctx.fillStyle = color;

      // calculate position
      const textSize = ctx.measureText(icon),
        x = centreX - textSize.width / 2,
        y = centreY + (size * 0.7) / 2;

      // draw it
      ctx.fillText(icon, x, y);
    }
    Button.prototype.draw = function (ctx, x, y, radius) {
      this.drawPosition = { x: x, y: y };
      this.drawRadius = radius;

      // preserve context
      ctx.save();

      // drawing settings
      const isEnabled =
        typeof this.enabled === "function" ? this.enabled() : this.enabled;
      ctx.globalAlpha = isEnabled ? this.enabledAlpha : this.alpha;
      ctx.fillStyle = this.color;
      ctx.lineWidth = 0;

      // draw circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      if (this.lineWidth > 0) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
      }

      // draw icon
      if (this.icon !== null) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        drawAwesomeIcon(ctx, this.icon, this.iconColor, x, y, radius);
        ctx.restore();
      }

      // restore context
      ctx.restore();
    };

    function addEventListener(eventTarget: any, eventType: any, listener: any) {
      eventTarget.addEventListener(eventType, listener);
      events.push({
        eventTarget: eventTarget,
        eventType: eventType,
        listener: listener,
      });
    }

    function removeAllEventListeners() {
      let _i;
      const _events = events.slice();
      let _current;
      for (_i = 0; _i < _events.length; _i++) {
        _current = _events[_i];
        _current.eventTarget.removeEventListener(
          _current.eventType,
          _current.listener
        );
      }
      events = [];
    }

    function addEventListeners() {
      // dragging image or ui-elements
      addEventListener(document, "mousedown", onMouseDown);
      addEventListener(document, "mouseup", onMouseUp);

      // zooming
      addEventListener(canvas, "DOMMouseScroll", onMouseWheel);
      addEventListener(canvas, "mousewheel", onMouseWheel);

      // moving
      addEventListener(canvas, "mousemove", mouseDrag);

      // setting answer
      addEventListener(canvas, "click", onMouseClick);
    }

    this.dispose = function () {
      removeAllEventListeners();
      stopRendering = true;
    };

    this.refresh = function () {
      self.dirty = true;
    };

    function initialize() {
      //// init image
      self.image.addEventListener("load", onImageLoad, false);
      self.image.src = imageUrl;

      //// init solution
      if (Object.prototype.toString.call(options.solution) === "[object Array]")
        self.importSolution(options.solution);

      //// init annotations
      if (
        Object.prototype.toString.call(options.annotations) === "[object Array]"
      )
        self.importAnnotations(options.annotations);

      //// init buttons
      // apply zooming functions to their buttons
      zoomOutButton.onClick = function () {
        self.zoomOut();
        return false;
      };
      zoomInButton.onClick = function () {
        self.zoomIn();
        return false;
      };

      //// init Input handling
      addEventListeners();
    }

    initialize();
  }
}
