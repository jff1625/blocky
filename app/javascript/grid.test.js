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

    it('returns an array of two blocks on a coord in a corner', () => {
      let block = blockGrid.grid[0][0];
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
  });
});
