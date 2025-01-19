import { endGame, startGame } from "../index";
import { Actions } from "./Actions/Actions";
import { Cell } from "./Classes/Cell";

export class PlayGame extends Actions {
  constructor() {
    super();
    this.#startGame();
  }

  #startGame() {
    this.cells = [];
    for (let i = 0; i <= 15; i++) {
      this.cells[i] = new Cell(i);
    }
    super.new(2);
    super.new(2);
    this.#startEventList();
  }

  buttonBound = this.#buttonMoveEvent.bind(this);
  touchMoveBound = this.#touchMoveEvent.bind(this);
  mouseDownBound = this.#mouseDownEvent.bind(this);
  mouseUpBound = this.#mouseUpEvent.bind(this);
  mouseMoveBound = this.#mouseMoveEvent.bind(this);

  #startEventList() {
    document.addEventListener("keydown", this.buttonBound);
    document.addEventListener("touchmove", this.touchMoveBound);
    document.addEventListener("mousedown", this.mouseDownBound);
  }

  #stopEventList() {
    document.removeEventListener("keydown", this.keydownBound);
    document.removeEventListener("touchmove", this.touchMoveBound);
    document.removeEventListener("mousedown", this.mouseDownBound);
    document.removeEventListener("mousedup", this.mouseUpBound);
    document.removeEventListener("mousemove", this.mouseMoveBound);
  }

  #move(direction) {
    this.#stopEventList();
    super.moveCacl(direction);
    super.moveView(direction);

    setTimeout(() => {
      super.clearAfterMove();
      super.merge(direction);
      super.moveCacl(direction);
      super.moveView(direction);
    }, 201);

    setTimeout(() => {
      super.clearAfterMove();
      this.#startEventList();

      if (this.isGameEnd) {
        this.#gameEnd(this.gameEndText);
      } else {
        super.new();
      }
    }, 420);
  }

  #buttonMoveEvent(e) {
    switch (e.key.toLowerCase()) {
      case "w":
      case "ц":
      case "arrowup":
        this.#move("up");
        break;
      case "s":
      case "ы":
      case "arrowdown":
        this.#move("down");
        break;
      case "d":
      case "в":
      case "arrowright":
        this.#move("right");
        break;
      case "a":
      case "ф":
      case "arrowleft":
        this.#move("left");
        break;
      default:
        break;
    }
  }

  #mouseDownEvent(e) {
    document.addEventListener("mouseup", this.mouseUpBound);
    document.addEventListener("mousemove", this.mouseMoveBound);
  }

  #mouseUpEvent(e) {
    document.removeEventListener("mousedup", this.mouseUpBound);
    document.removeEventListener("mousemove", this.mouseMoveBound);
  }

  #mouseMoveEvent(e) {
    const x = e.movementX;
    const y = e.movementY;
    this.#computeDirection(x, y);
  }

  firstTouch = { x: 0, y: 0 };

  #touchMoveEvent(e) {
    const touch = e.touches[0];
    if (!this.firstTouch.x || !this.firstTouch.y) {
      this.firstTouch = { x: touch.pageX, y: touch.pageY };
    }
    const x = touch.pageX - this.firstTouch.x;
    const y = touch.pageY - this.firstTouch.y;
    this.#computeDirection(x, y);
  }

  #computeDirection(x, y) {
    if (Math.abs(x) > 10 || Math.abs(y) > 10) {
      this.firstTouch = { x: 0, y: 0 };

      if (Math.abs(x) >= Math.abs(y)) {
        switch (true) {
          case x < 0:
            this.#move("left");
            break;

          case x > 0:
            this.#move("right");
            break;
          default:
            break;
        }
      } else {
        switch (true) {
          case y < 0:
            this.#move("up");
            break;

          case y > 0:
            this.#move("down");
            break;
          default:
            break;
        }
      }
    }
  }

  #gameEnd(text) {
    this.#stopEventList();
    const elModal = document.getElementById("modal");
    elModal.style.display = "block";
    elModal.innerText = text;

    const elButton = document.getElementById("startButton");
    elButton.style.display = "block";

    elButton.onclick = () => {
      const canvas = document.getElementById("field");
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 450, 450);
      elModal.style.display = "none";
      elButton.style.display = "none";
      this.isGameEnd = false;
      this.#startGame();
    };
  }
}
