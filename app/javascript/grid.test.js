import { Block, COLOURS, BlockGrid, MAX_X, MAX_Y } from './grid';
import { assert } from 'chai';
var sinon = require('sinon');

describe('Block', () => {
  it('should be created with correct coordinates', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
    });
  });

  it('should be created with one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });

  it('should be not be hidden initially', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.isFalse(block.hidden, 'block is not hidden');
    });
  });
});//describe Block

describe('BlockGrid', () => {
  var blockGrid;

  beforeEach(function(){
    blockGrid = new BlockGrid;
  });
  
  it('can be instanciated successfully', () => {
    assert.isTrue(blockGrid instanceof BlockGrid, 'created an instance of BlockGrid');
  });

  it('has the correct grid length and depth', () => {
    assert.equal(blockGrid.grid.length, MAX_X, 'grid length is correct (correct number of columns)');
    assert.equal(blockGrid.grid[0].length, MAX_Y, 'grid depth is correct (correct number of rows)');
  });

  it('has a .grid prop which contains Block instances', () => {
    assert.isTrue(blockGrid.grid[0][0] instanceof Block, 'bottom left corner of grid holds an instance of Block');
    assert.isTrue(blockGrid.grid[MAX_X -1][MAX_Y -1] instanceof Block), 'top right corner of grid holds an instance of Block';
  });

  describe('getAdjacentBlocks', () => {
    it('returns an array of four blocks on a coord near the middle', () => {
      let block = blockGrid.grid[5][5];
      let result = blockGrid.getAdjacentBlocks(block);
      assert.typeOf(result, "array", 'returned type is \'array\'');
      assert.lengthOf(result, 4, 'returned array length is 4');
    });

    it('returns an array of two blocks on a coord in bottom left corner', () => {
      let block = blockGrid.grid[0][0];
      let result = blockGrid.getAdjacentBlocks(block);
      assert.typeOf(result, "array", 'returned type is \'array\'');
      assert.lengthOf(result, 2, 'returned array length is 2');
    });

    it('returns an array of two blocks on a coord in top right corner', () => {
      let block = blockGrid.grid[MAX_X-1][MAX_Y-1];
      let result = blockGrid.getAdjacentBlocks(block);
      assert.typeOf(result, "array", 'returned type is \'array\'');
      assert.lengthOf(result, 2, 'returned array length is 2');
    });
  });//describe getAdjacentBlocks
  
  describe('getConnectedBlocks', () => {
    it('returns only the specified block when no neighbours are the same colour', () => {
      let test = {x:1, y: 2};
      let targetBlock = blockGrid.grid[test.x][test.y];
      targetBlock.colour = COLOURS[0];
      blockGrid.grid[test.x-1][test.y].colour = COLOURS[1];
      blockGrid.grid[test.x+1][test.y].colour = COLOURS[1];
      blockGrid.grid[test.x][test.y-1].colour = COLOURS[1];
      blockGrid.grid[test.x][test.y+1].colour = COLOURS[1];

      let result = blockGrid.getConnectedBlocks(targetBlock);
      assert.typeOf(result, "array", 'returned type is \'array\'');
      assert.lengthOf(result, 1, 'returned array length is 1');
      assert.equal(result[0], targetBlock, 'returned the correct Block inside the array');
    });

    it('returns a row of blocks when that row is all the same colour', () => {
      let test = {x:1, y: 2};
      let targetBlock = blockGrid.grid[test.x][test.y];
      for (let i = 0; i < MAX_X; i++ ) {
        blockGrid.grid[i][test.y-1].colour = COLOURS[0];
        blockGrid.grid[i][test.y].colour = COLOURS[1];
        blockGrid.grid[i][test.y+1].colour = COLOURS[2];
      }

      let result = blockGrid.getConnectedBlocks(targetBlock);
      assert.typeOf(result, "array", 'returned type is \'array\'');
      assert.lengthOf(result, MAX_X, 'returned array length is equal to MAX_X');
      result.forEach(block => {
        assert.equal(block.colour, targetBlock.colour, 'block has same colour as target block');
        assert.equal(block.y, targetBlock.y, 'block has same \'y\' value as target block');
      });
    });

    it('returns a column of blocks when that col is all the same colour', () => {
      let test = {x:4, y: 5};
      let targetBlock = blockGrid.grid[test.x][test.y];
      for (let i = 0; i < MAX_Y; i++ ) {
        blockGrid.grid[test.x-1][i].colour = COLOURS[0];
        blockGrid.grid[test.x][i].colour = COLOURS[1];
        blockGrid.grid[test.x+1][i].colour = COLOURS[2];
      }

      let result = blockGrid.getConnectedBlocks(targetBlock);
      assert.typeOf(result, "array", 'returned type is \'array\'');
      assert.lengthOf(result, MAX_Y, 'returned array length is equal to MAX_Y');
      result.forEach(block => {
        assert.equal(block.colour, targetBlock.colour, 'block has same colour as target block');
        assert.equal(block.x, targetBlock.x, 'block has same \'x\' value as target block');
      });
    });

    it('finds and returns a U-shaped group of blocks when they are all the same colour', () => {
      let colourMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 1, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          blockGrid.grid[x][y].colour = colourMap[x][y];
        }
      }
      let test = {x:3, y: 5};
      let targetBlock = blockGrid.grid[test.x][test.y];

      let result = blockGrid.getConnectedBlocks(targetBlock);
      assert.typeOf(result, "array", 'returned type is \'array\'');
      assert.lengthOf(result, 12, 'returned array length is correct (12)');
      result.forEach(block => {
        assert.equal(block.colour, targetBlock.colour, 'block has same colour as target block');
      });
    });
  });//describe getConnectedBlocks

  describe('collapse', () => {
    it('returns true when it found something to remove', () => {
      let testCoord = {x:3, y: 5};
      let block = blockGrid.grid[testCoord.x][testCoord.y];
      block.hidden = true;
      let result = blockGrid.collapse();
      assert.isTrue(result, 'returned true');
    });

    it('returns false when it found nothing to remove', () => {
      let testCoord = {x:3, y: 5};
      let block = blockGrid.grid[testCoord.x][testCoord.y];

      let result = blockGrid.collapse();
      assert.isFalse(result, 'returned false');
    });

    it('removes a single \'hidden\' block from its place in the grid and moves it to the top of its column', () => {
      let testCoord = {x:3, y: 5};
      let block = blockGrid.grid[testCoord.x][testCoord.y];
      block.hidden = true;
      blockGrid.collapse();
      assert.equal(block.y, MAX_Y-1, 'block.y value was correctly set to top of grid (MAX_Y - 1)');
      assert.equal(blockGrid.grid[testCoord.x][MAX_Y-1], block, 'block at top of the column is the same one we applied \'hidden\' to');
    });

    it('removes two \'hidden\' blocks from the same column and move them to the top, in the correct order', () => {
      let lowerBlock = blockGrid.grid[1][2];
      let higherBlock = blockGrid.grid[1][5];
      lowerBlock.hidden = true;
      higherBlock.hidden = true;
      blockGrid.collapse();
      assert.equal(lowerBlock.y, MAX_Y-2, 'lower hidden block is second to top in the column');
      assert.equal(higherBlock.y, MAX_Y-1, 'higher hidden block is at top of column');
    });
  });//describe collapse

  describe('update', () => {
    it('returns true when it found something to remove', () => {
      let testCoord = {x:3, y: 5};
      let block = blockGrid.grid[testCoord.x][testCoord.y];
      block.hidden = true;
      let result = blockGrid.collapse();
      assert.isTrue(result, 'returned true');
    });

    it('returns false when it found something to remove', () => {
      let testCoord = {x:3, y: 5};
      let block = blockGrid.grid[testCoord.x][testCoord.y];
      
      let result = blockGrid.collapse();
      assert.isFalse(result, 'returned false');
    });
  });//describe update

  describe('blockClicked', () => {
    it('calls getConnectedBlocks() if the block is not hidden', () => {
      var stub = sinon.stub(blockGrid, "getConnectedBlocks");
      stub.returns([]);
      let block = blockGrid.grid[0][0];
      blockGrid.blockClicked({}, block);
      assert(stub.called, 'getConnectedBlocks() method was called');
    });

    it('calls collapse() if the block is not hidden', () => {
      //update does DOM stuff, so stub it.
      var stub = sinon.stub(blockGrid, "collapse");
      let block = blockGrid.grid[0][0];
      blockGrid.blockClicked({}, block);
      assert(stub.called, 'collapse() method was called');
    });

    it('calls update() if the block is not hidden', () => {
      //update does DOM stuff, so stub it.
      var stub = sinon.stub(blockGrid, "update");
      let block = blockGrid.grid[0][0];
      blockGrid.blockClicked({}, block);
      assert(stub.called, 'update() method was called');
    });

    it('does not call update() if the block was already hidden', () => {
      //update does DOM stuff, so stub it.
      var stub = sinon.stub(blockGrid, "getConnectedBlocks");
      let block = blockGrid.grid[0][0];
      block.hidden = true;
      blockGrid.blockClicked({}, block);
      assert(stub.notCalled, 'getConnectedBlocks() method was not called');
    });

    it('does not call collapse() if the block was already hidden', () => {
      //update does DOM stuff, so stub it.
      var stub = sinon.stub(blockGrid, "collapse");
      let block = blockGrid.grid[0][0];
      block.hidden = true;
      blockGrid.blockClicked({}, block);
      assert(stub.notCalled, 'collapse() method was not called');
    });

    it('does not call update() if the block was already hidden', () => {
      //update does DOM stuff, so stub it.
      var stub = sinon.stub(blockGrid, "update");
      let block = blockGrid.grid[0][0];
      block.hidden = true;
      blockGrid.blockClicked({}, block);
      assert(stub.notCalled, 'update() method was not called');
    });

  });//describe blockClicked
  

});//describe BlockGrid
