export const COLOURS = ['red', 'green', 'blue', 'yellow'];
export const MAX_X = 10;
export const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector('#gridEl')) {
    for (let x = 0; x < MAX_X; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  blockClicked(e, block) {
    console.log(e, block);
    //getConnectedBlocks(block)

    //removeBlocks()

    //collapse/update 
  };

  getAdjacentBlocks(block) {
    let result = [];
    if (block.x > 0) {
      result.push(this.grid[block.x - 1][block.y]); //left
    }
    if (block.x < MAX_X) {
      result.push(this.grid[block.x + 1][block.y]); //right
    }
    if (block.y > 0) {
      result.push(this.grid[block.x][block.y - 1]); //up
    }
    if (block.y < MAX_Y) {
      result.push(this.grid[block.x][block.y + 1]); //down
    }
    return result;
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
