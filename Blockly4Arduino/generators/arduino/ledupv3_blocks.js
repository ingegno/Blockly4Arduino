/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Microduino code for procedure (function) blocks.
 *
 */
'use strict';

goog.provide('Blockly.Arduino.ledupv3_blocks');

goog.require('Blockly.Arduino');


/**
 * The Hub block for LedUpKidzv3
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['ledupv3_hub'] = function(block) {
  
  function parseInput(block, name, connectors) {
    var targetBlock = block.getInputTargetBlock(name);
    if (targetBlock) {
      targetBlock.setHubConnector(connectors);
    }
    var code = Blockly.Arduino.blockToCode(targetBlock);
    if (!goog.isString(code)) {
      throw 'Expecting code from statement block "' + targetBlock.type + '".';
    }
    if (code) {
      // blocks should only init data ... 
      console.log('Unexpected code in ledupv3_hub', code);
    }
    return code;
  }
  
  var code = '';
  var nr;
  
  var target = block.getFieldValue('TARGET');
  
  var blockinputs = [["LED-0", ['8']], ["LED-1", ['9']], ["LED-2", ['10']], ["LED-3", ['0']],
                     ["LED-4", ['1']], ["LED-5", ['2']] ];
  code += '// LedUpv3 block wiring of the LED0 to 5\n' +
            '/*' +
            'int LED0 = 8;// RESET\n' +
            'boolean LED0_ON = LOW;\n' +
            'int LED1 = 9;// SCK\n' +
            'boolean LED1_ON = LOW;\n' +
            'int LED2 = 10;// MISO\n' +
            'boolean LED2_ON = LOW;\n' +
            'int LED3 = 0;// MOSI\n' +
            'boolean LED3_ON = LOW;\n' +
            'int LED4 = 1;// PB4\n' +
            'boolean LED4_ON = LOW;\n' +
            'int LED5 = 2;// PB3\n' +
            'boolean LED5_ON = LOW;\n' +
            '*/\n';

  for (nr in blockinputs) {
    parseInput(block, blockinputs[nr][0], blockinputs[nr][1]);
  }

  Blockly.Arduino.addInclude('ledupkidzv3', code);

  return '';
};

