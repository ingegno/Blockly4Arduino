# Blockly4Arduino

Graphically program your Arduino on Chrome OS, or Windows, Apple, Linux via the Chrome, Firefox ... browser. Program it if online with

1. [English Blockly4Arduino](http://blokkencode.ingegno.be/index_en.html)

2. [Nederlandse Blockly4Arduino](http://blokkencode.ingegno.be/index.html)

![](https://github.com/ingegno/Blockly4Arduino/blob/master/doc/03_sketch.png?raw=true)

To use off-line, download this code repo as a zip file, extract on your PC or on the Intranet, and run it by clickling in your file explorer on the file `Blockly4Arduino/blockly4Arduino/index_en.html`.

Developed with support from [Ingegno.be](http://ingegno.be) and [VZW De Creatieve STEM](http://decreatievestem.be).

## Manual and examples

Dutch: [Nederlandse handleiding](http://ingegno.be/01-blockly-4-arduino/)

Example blocks: [The basic Arduino sketches, Ingegno UGO&TESS blocks, and Ingegno LedUpKidz](http://ingegno.be/01-blockly-4-arduino/#Voorbeeld_blok_sketches). Blockly4Arduino can do it!

## General Info

This is the code of website created for the LedUpKidz project, but usable also more generally.
*Blockly for Arduino or Genuino* allows to program your Arduino with blocks, ideal for novices to learn the basics. Blockly for Arduino is also touch friendly so can be used on a tablet.

## Translations
Would you like to submit a translation of the website for your language? This can be done easily:

1. from [our ardublockly branch](https://github.com/bmcage/ardublockly/tree/blockly4arduino/blockly/msg/json) copy from the file en.json the string codes starting with `ARD`, as well as the codes under those, to your language file, eg `de.json`
2. Translate them. 
3. Send them to us, or do a pull request against our branch of blockly.

We plan to make the demo site more easily translatable. At the moment, to obtain a version for your language, you need to create a copy of this repo, and create a copy of Blockly4Arduino [index_en.html](https://github.com/ingegno/Blockly4Arduino/blob/master/Blockly4Arduino/index_en.html) and translate the few strings present. See the Dutch site for such a translation: [index.html](https://github.com/ingegno/Blockly4Arduino/blob/master/Blockly4Arduino/index.html).


## Screenshots

![](https://github.com/ingegno/Blockly4Arduino/blob/master/doc/01_start.png?raw=true)

![](https://github.com/ingegno/Blockly4Arduino/blob/master/doc/03_sketch.png?raw=true)

![](https://github.com/ingegno/Blockly4Arduino/blob/master/doc/02a_uno.png?raw=true) ![](https://github.com/ingegno/Blockly4Arduino/blob/master/doc/02b_uno.png?raw=true) ![](https://github.com/ingegno/Blockly4Arduino/blob/master/doc/02c_uno.png?raw=true)

# For developers

## Current Situation
The code is now standalone, as it is no longer compatible with standard ardublockly or blockly. So to hand edit this repository for further changes, with blockly frozen.
It is our hope we can create a new style blockly app in the future to replace this site.

## Old Situation pre 2022
The code is based on the branch *blockly4arduino* from [bmcage/ardublockly](https://github.com/bmcage/ardublockly). The directory structure locally should be:

`./git/ardublockly` (branch blockly4arduino from [bmcage](https://github.com/bmcage/ardublockly)

`./git/closure-library` (from [google](https://github.com/google/closure-library))

`./git/Blockly4Arduino`

In ardublockly run `git submodule update --init --recursive` to obtain the submodules. Then in de subdirectory `blockly` run `python build.py` to build the blockly version of ardublockly. 

In Blockly4Arduino run `python create_site.py`, which will update Blockly4Arduino with the files needed for the website.

