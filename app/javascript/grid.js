/** 
 * A Blocky Griddy Gamey sort of module
 * @module grid 
 */

 /** The colours available for the blocks. */
export const COLOURS = ['red', 'green', 'blue', 'yellow'];

 /** The number of blocks horizontally in the grid */
export const MAX_X = 10;

 /** The number of blocks vertically in the grid */
export const MAX_Y = 10;

/** Class representing a block. */
export class Block {
  /**
   * Create a block.
   * Each block accepts x and y coords as params,
   * and will have a 'hidden' status of false,
   * and will also choose for itself a random colour (from const COLOURS).
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    this.hidden = false;
  }
}

/** Class representing the grid of blocks. */
export class BlockGrid {
  /**
   * Create the grid, and fill it with coloured blocks
   */
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

  /**
   * render the grid onto the DOM.
   * @function
   * @param {HTMLElement} el - element to render the grid inside. Defaults to #gridEl
   * @returns {Grid} The Grid instance that owns this method.
   */
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
        blockEl.style.background = block.hidden ? 'grey' : block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }
    return this;
  };

  /**
   * handle mouse click on a block. 
   * Removes all 'connected' blocks from the grid, 
   * moves blocks above the removed ones down into the empty space,
   * then updates the DOM to reflect the changed grid layout.
   * @method
   * @param {event} e - 'click' event
   * @param {Block} block - the Block that was clicked on
   */
  blockClicked(e, block) {
    //console.log(e, block);
    if (!block.hidden) {
      let connected = this.getConnectedBlocks(block);

      connected.forEach(connectedBlock => {
        connectedBlock.hidden = true;
      })

      //only update the DOM if there are changes
      if (this.collapse()) {
        this.update();
      }
    }
  };

  /**
   * update the DOM after some blocks were removed from the grid.
   * @method
   * @param {event} e - 'click' event
   * @param {Block} block - the Block that was clicked on
   */
  update() {
    //this is a little lazy - if the app should ever require to be more performant this should be changed.
    //remove ALL the blocks
    let el = document.querySelector('#gridEl');
    let blocks = el.children;
    for (var i = blocks.length - 1; i >= 0; i--) {
      el.removeChild(blocks[i]);
    }

    //redraw all the blocks from the updated grid
    this.render();
  };

  /**
   * get a list of blocks that are 'connected' to a specified block. 
   * 'Connected' means they are all the same colour and are adjacent to each other.
   * @method
   * @param {Block} block - the Block that was selected
   * @returns {Array} list of Blocks
   */
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

  /**
   * get a list of blocks that are adjacent to a specified block (up, down, left, right)
   * @method
   * @param {Block} block - the Block that was selected
   * @returns {Array} list of Blocks. 
   * Typically there will be four blocks in the array, 
   * but could be three or two if and edge ro corner block is selected.
   */
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

  /**
   * search the grid for any 'hidden' blocks, 
   * move any blocks that were above the hidden ones down to fill the gaps,
   * Also moves the 'hidden' blocks up to the empty space at the top of their columns
   * @method
   * @returns {Boolean} whether or not any change was made to the grid
   */
  collapse() {
    let wasChanged = false;
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
      });

      wasChanged = wasChanged || hiddenList.length > 0;
    });
    return wasChanged;
  };
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
