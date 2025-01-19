export class Actions {
  constructor() {}

  // Vars

  #score = 0;
  isGameEnd = false;
  gameEndText = "";

  /// Actions

  new(value) {
    const emptyCells = this.cells.filter((i) => i.value === 0);

    if (emptyCells.length === 0) {
      this.isGameEnd = true;
      this.gameEndText = "Нельзя сделать ход";
    } else {
      const rndCell = Math.floor(Math.random() * emptyCells.length);
      const newCellIndex = emptyCells[rndCell].index;

      if (value) {
        this.cells[newCellIndex].value = value;
      } else {
        this.cells[newCellIndex].value = Math.random() < 0.9 ? 2 : 4;
      }

      this.cells[newCellIndex].viewNew();
    }
  }

  moveCacl(direction) {
    const { ratio, stepsCounter } = this.#directionProps(direction);

    for (let i = 0; i !== 16; i++) {
      if (this.#noValue(i)) {
        continue;
      }

      const steps = stepsCounter(i);

      if (steps === 0 || this.#outArray(i + ratio)) {
        this.cells[i].tempValue = this.cells[i].value;
        continue;
      }
      this.cells[i].steps = steps;
      this.cells[i + steps * ratio].tempValue = this.cells[i].value;
    }
  }

  moveView(direction) {
    const canvas = document.getElementById("field");
    const ctx = canvas.getContext("2d");
    let xMove = [];
    let yMove = [];
    const { xMoveRatio, yMoveRatio } = this.#directionProps(direction);

    for (let i = 0; i < 16; i++) {
      if (!this.cells[i].steps) continue;
      xMove[i] = (110 * this.cells[i].steps * xMoveRatio) / 20;
      yMove[i] = (110 * this.cells[i].steps * yMoveRatio) / 20;
    }

    let cellMoveRatio = 0;
    let timerId = setInterval(() => {
      cellMoveRatio++;
      ctx.clearRect(0, 0, 450, 450);

      for (let i = 0; i !== 16; i++) {
        if (this.cells[i].steps) {
          this.cells[i].viewNew(
            10 + this.cells[i].x * 110 + xMove[i] * cellMoveRatio,
            10 + this.cells[i].y * 110 + yMove[i] * cellMoveRatio
          );
        } else if (this.cells[i].value) {
          this.cells[i].viewNew();
        }
      }
    }, 10);

    setTimeout(() => {
      clearInterval(timerId);
    }, 200);
  }

  clearAfterMove() {
    for (let i = 0; i !== 16; i++) {
      this.cells[i].value = this.cells[i].tempValue;
      this.cells[i].tempValue = 0;
      this.cells[i].steps = 0;
    }
  }

  merge(direction) {
    let { ratio, mergeFrom, mergeTo, mergeInc } =
      this.#directionProps(direction);

    for (let i = mergeFrom; i !== mergeTo; i += mergeInc) {
      if (
        this.#noValue(i) ||
        this.#outArray(i - ratio) ||
        this.#noValue(i - ratio)
      )
        continue;

      if (
        this.cells[i].value === this.cells[i - ratio].value &&
        this.#isSameLine(direction, i, i - ratio)
      ) {
        this.cells[i].value *= 2;
        if (this.cells[i].value === 2048) {
          this.isGameEnd = true;
          this.gameEndText = "Уровень пройден";
        }
        this.#addScore(this.cells[i - ratio].value);
        this.cells[i - ratio].value = 0;
      }
    }
  }

  #addScore(value) {
    const elScore = document.getElementById("score");
    this.#score += value;
    elScore.innerText = "СЧЁТ: " + this.#score;
  }

  // utils

  #outArray = (i) => !this.cells[i];
  #noValue = (i) => !this.cells[i].value;
  #isSameLine = (direction, i1, i2) => {
    if (direction === "left" || direction === "right") {
      return Math.floor(i1 / 4) === Math.floor(i2 / 4);
    }
    if (direction === "up" || direction === "down") {
      return i1 % 4 === i2 % 4;
    }
  };

  #directionProps = (direction) => {
    let ratio;
    let mergeFrom;
    let mergeTo;
    let mergeInc;
    let xMoveRatio;
    let yMoveRatio;
    let stepsCounter = () => {};

    switch (direction) {
      case "up":
        ratio = -4;
        mergeFrom = 0;
        mergeTo = 16;
        mergeInc = 1;
        xMoveRatio = 0;
        yMoveRatio = -1;

        stepsCounter = (index) =>
          this.cells.filter(
            (i) =>
              i.value === 0 &&
              this.#isSameLine(direction, i.index, index) &&
              i.index < index
          ).length;

        break;

      case "down":
        ratio = 4;
        mergeFrom = 15;
        mergeTo = -1;
        mergeInc = -1;
        xMoveRatio = 0;
        yMoveRatio = 1;

        stepsCounter = (index) =>
          this.cells.filter(
            (i) =>
              i.value === 0 &&
              this.#isSameLine(direction, i.index, index) &&
              i.index > index
          ).length;

        break;

      case "right":
        ratio = +1;
        mergeFrom = 15;
        mergeTo = -1;
        mergeInc = -1;
        xMoveRatio = 1;
        yMoveRatio = 0;

        stepsCounter = (index) =>
          this.cells.filter(
            (i) =>
              i.value === 0 &&
              this.#isSameLine(direction, i.index, index) &&
              i.index > index
          ).length;

        break;

      case "left":
        ratio = -1;
        mergeFrom = 0;
        mergeTo = 16;
        mergeInc = 1;
        xMoveRatio = -1;
        yMoveRatio = 0;
        stepsCounter = (index) =>
          this.cells.filter(
            (i) =>
              i.value === 0 &&
              this.#isSameLine(direction, i.index, index) &&
              i.index < index
          ).length;

        break;
    }
    return {
      ratio: ratio,
      mergeFrom: mergeFrom,
      mergeTo: mergeTo,
      mergeInc: mergeInc,
      xMoveRatio: xMoveRatio,
      yMoveRatio: yMoveRatio,
      stepsCounter: stepsCounter,
    };
  };
}
