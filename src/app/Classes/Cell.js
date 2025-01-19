import { cellWidth } from "../../index";

export class Cell {
  value = 0;
  tempValue = 0;
  steps = 0;

  constructor(index) {
    this.index = index;
    this.x = index % 4;
    this.y = Math.floor(index / 4);
  }

  #getColor() {
    switch (this.value) {
      case 0:
        return "#fff";
      case 2:
        return "#eee4da";
      case 4:
        return "#eee0c6";
      case 8:
        return "#f9b377";
      case 16:
        return "#ff9b60";
      case 32:
        return "#cb6a49";
      case 64:
        return "#ec6233";
      case 128:
        return "#e8c463";
      case 256:
        return "#e0ba55";
      case 512:
        return "#f3c54b";
      case 1024:
        return "#f2c138";
      case 2048:
        return "#f3bd29";
    }
  }

  viewNew(x = 10 + this.x * 110, y = 10 + this.y * 110) {
    const canvas = document.getElementById("field");
    const ctx = canvas.getContext("2d");

    if (this.value) {
      ctx.beginPath();
      ctx.moveTo(x + 20, y);
      ctx.arcTo(x + 100, y, x + 100, y + 100, 20);
      ctx.arcTo(x + 100, y + 100, x, y + 100, 20);
      ctx.arcTo(x, y + 100, x, y, 20);
      ctx.arcTo(x, y, x + 100, y, 20);
      ctx.closePath();
      ctx.strokeStyle = "#aaa";
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = this.#getColor();
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.strokeStyle = "#111";
      ctx.font = "40px sans-serif";
      ctx.fillText(this.value, x + 50, y + 50);
    }
  }
}
