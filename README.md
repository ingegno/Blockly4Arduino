# Blockly4Arduino
Code repo of [Ingegno](http://ingegno.be) website with [Blockly](https://developers.google.com/blockly/) for [Arduino](http://arduino.cc) 

This is the code of website [Ingegno Blockly4Arduino](http://ingegno.be/Manuals/Blockly4Arduino/demos/blocklyduino/), created for the LedUpKidz project.

*Blockly for Arduino or Genuino* allows to program your Arduino with blocks, ideal for novices to learn the basics. Blockly for Arduino is also touch friendly so can be used on a tablet.

At the moment it is aimed at the LedUpKidz project of Ingegno, so as to allow to program your LedUpKidz graphically.

# For developers

The code is based on the branch *arduino* from [https://github.com/bmcage/blockly]. The directory structure locally should be:

./git/blockly (branch arduino from [bmcage](https://github.com/bmcage/blockly))
./git/closure-library (from [google](https://github.com/google/closure-library))
./git/Blockly4Arduino

In blockly run `python build.py` to build blockly. In Blockly4Arduino run `python create_site.py`, which will update Blockly4Arduino with the files needed for the website.
