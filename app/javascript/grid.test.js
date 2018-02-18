import { Block, COLOURS, BlockGrid, MAX_X, MAX_Y } from './grid';
import { assert } from 'chai';

describe('Block', () => {
  it('should be created with correct coordinates and one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});

describe('BlockGrid', () => {
  var blockGrid;

  beforeEach(function(){
    blockGrid = new BlockGrid;
  });
  
  it('can be instanciated successfully', () => {
    assert.isTrue(blockGrid instanceof BlockGrid);
  });

  it('has the correct grid length and depth', () => {
    assert.equal(blockGrid.grid.length, MAX_X);
    assert.equal(blockGrid.grid[0].length, MAX_Y);
  });

  it('has a .grid prop which contains Block instances', () => {
    assert.isTrue(blockGrid.grid[0][0] instanceof Block);
    assert.isTrue(blockGrid.grid[MAX_X -1][MAX_Y -1] instanceof Block);
  });

  describe('getAdjacentBlocks', () => {
    it('returns an array of four blocks on a coord near the middle', () => {
      let block = blockGrid.grid[5][5];
      let result = blockGrid.getAdjacentBlocks(block);
      assert.typeOf(result, "array");
      assert.lengthOf(result, 4);
    });

    it('returns an array of two blocks on a coord in top left corner', () => {
      let block = blockGrid.grid[0][0];
      let result = blockGrid.getAdjacentBlocks(block);
      assert.typeOf(result, "array");
      assert.lengthOf(result, 2);
    });

    it('returns an array of two blocks on a coord in bottom right corner', () => {
      let block = blockGrid.grid[MAX_X-1][MAX_Y-1];
      let result = blockGrid.getAdjacentBlocks(block);
      assert.typeOf(result, "array");
      assert.lengthOf(result, 2);
    });
  });
  
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
      assert.typeOf(result, "array");
      assert.lengthOf(result, 1);
      assert.equal(result[0], targetBlock);
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
      assert.typeOf(result, "array");
      assert.lengthOf(result, MAX_X);
      result.forEach(block => {
        assert.equal(block.colour, targetBlock.colour);
        assert.equal(block.y, targetBlock.y);
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
      assert.typeOf(result, "array");
      assert.lengthOf(result, MAX_Y);
      result.forEach(block => {
        assert.equal(block.colour, targetBlock.colour);
        assert.equal(block.x, targetBlock.x);
      });
    });

    it('finds and returns a U-shaped group of blocks when they are all the same colour', () => {
      let colourMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
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
      assert.typeOf(result, "array");
      assert.lengthOf(result, 10);
      result.forEach(block => {
        assert.equal(block.colour, targetBlock.colour);
      });
    });


  });
});
