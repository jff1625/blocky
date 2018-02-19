export const COLOURS = ['red', 'green', 'blue', 'yellow'];
export const MAX_X = 10;
export const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    this.hidden = false;
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
    let connected = this.getConnectedBlocks(block);

    connected.forEach(connectedBlock => {
      connectedBlock.hidden = true;
    })

    this.collapse();

    this.render();
  };

  getConnectedBlocks(block) {
    let toCheck = [block];
    let checked = [];
    let hits = [];
    let current;
    while (current = toCheck.shift()) {
      if (current.colour == block.colour) {
        //'current' is connected/adjacent to the clicked block and is the same colour.
        //Add it to the hits list
        hits.push(current);
        
        //Now we need to also check all the blocks that are adjacent to the connected block we just found,
        // but only if we didn't already check them
        let adjacentBlocks = this.getAdjacentBlocks(current);
        adjacentBlocks.forEach(adjacent => {
          if (!checked.includes(adjacent)) {
            toCheck.push(adjacent);
          };
        })
      }
      //Make sure we don't waste time checking this one again.
      checked.push(current);
    }
    return hits;
  };

  getAdjacentBlocks(block) {
    let result = [];
    if (block.x > 0) {
      result.push(this.grid[block.x - 1][block.y]); //left
    }
    if (block.x < MAX_X - 1) {
      result.push(this.grid[block.x + 1][block.y]); //right
    }
    if (block.y > 0) {
      result.push(this.grid[block.x][block.y - 1]); //up
    }
    if (block.y < MAX_Y - 1) {
      result.push(this.grid[block.x][block.y + 1]); //down
    }
    return result;
  };

  collapse() {
    //iterate the columns
    this.grid.forEach((col, x, grid) => {
      //copy hidden to hiddenList
      let hiddenList = col.filter(block => block.hidden);

      //remove hidden from col
      grid[x] = col.filter(block => !block.hidden);

      //concat hiddenList
      grid[x] = grid[x].concat(hiddenList);

      //update y values
      grid[x] = grid[x].map((block, y) => {
        grid[x][y].y = y; 
        return grid[x][y];
      })
    });
  };
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
