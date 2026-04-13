/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Functions related to language and localisation.
 */
'use strict';

/** Create a namespace for the application. */
var Blockly4Arduino = Blockly4Arduino || {};

/** Lookup for names of supported languages. Keys in ISO 639 format. */
Blockly4Arduino.LANGUAGE_NAME = {
  'en': 'English',
  'nl': 'Nederlands',
};

/**
 * Selected language, default Dutch.
 * @type {string}
 */
Blockly4Arduino.LANG = 'nl';

/**
 * We keep a local copy of the default language in case translations cannot
 * be found in the injected language file.
 * @type {Object}
 */
Blockly4Arduino.DEFAULT_LANG_TEXT = {};

/**
 * The example base link URL
 * @return {string}
 */
Blockly4Arduino.EXAMPLE_HTTPURL = '/blockly4Arduino/examples/';

/** Initialize the page language. */
Blockly4Arduino.initLanguage = function() {
  // Save the current default language ID to check if it has been changed
  var defaultLang = Blockly4Arduino.LANG;

  // Check server settings and url language, url gets priority
  Blockly4Arduino.LANG = Blockly4Arduino.getUrlLanguage() ||
      Blockly4Arduino.getLanguageSetting() || Blockly4Arduino.LANG;

  Blockly4Arduino.populateLanguageMenu(Blockly4Arduino.LANG);

  if (defaultLang !== Blockly4Arduino.LANG) {
      Blockly4Arduino.duplicateDefaultLang();
      Blockly4Arduino.injectLanguageJsSources(Blockly4Arduino.LANG);
      Blockly4Arduino.updateLanguageText();
  }
};

/**
 * Get the language previously set by the user from the server settings.
 * @return {string} Language saved in the server settings.
 */
Blockly4Arduino.getLanguageSetting = function() {
  //TODO: Server feature still to be implemented, for now return default
  return null;
};

/**
 * Get the language selected from the URL, format '?lang=en'.
 * @return {string} Selected language.
 */
Blockly4Arduino.getUrlLanguage = function() {
  var langKey = 'lang';
  var val = location.search.match(new RegExp('[?&]' + langKey + '=([^&]+)'));
  var language = val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : '';
  if (Blockly4Arduino.LANGUAGE_NAME[language] === undefined) {
    language = null;
  }
  return language;
};

/**
 * Populates the settings language selection menu.
 * @param {!string} selectedLang Language to be marked as selected.
 */
Blockly4Arduino.populateLanguageMenu = function(selectedLang) {
  var languageMenu = document.getElementById('language');
  // we don't have a language menu yet
  if (languageMenu) {
    languageMenu.options.length = 0;

    for (var lang in Blockly4Arduino.LANGUAGE_NAME) {
      var option = new Option(Blockly4Arduino.LANGUAGE_NAME[lang], lang);
      if (lang == selectedLang) {
        option.selected = true;
      }
      languageMenu.options.add(option);
    }
    languageMenu.onchange = Blockly4Arduino.changeLanguage;
  }
};

/**
 * Because new languages are injected by overwriting Ardublockly.LOCALISED_TEXT
 * we keep a local copy of the default language (included in the html header) so
 * that we can still retrieve these strings if the translation cannot be found.
 */
Blockly4Arduino.duplicateDefaultLang = function() {
  for (var textId in Blockly4Arduino.LOCALISED_TEXT) {
    Blockly4Arduino.DEFAULT_LANG_TEXT[textId] = Blockly4Arduino.LOCALISED_TEXT[textId];
  }
};

/** Updates the page text strings with the new language. */
Blockly4Arduino.updateLanguageText = function() {
  for (var textId in Blockly4Arduino.LOCALISED_TEXT) {
    var textStrings = document.getElementsByClassName('translatable_' + textId);
    for (var i = 0; i < textStrings.length; i++) {
      textStrings[i].innerHTML = Blockly4Arduino.getLocalStr(textId);
    }
  }
};

/**
 * Injects the language JavaScript files into the html head element.
 * @param {string} langKey Dictionary key for the language to inject, must also
 *     be JS file name.
 */
Blockly4Arduino.injectLanguageJsSources = function(langKey) {
  var head = document.getElementsByTagName('head')[0];

  // Retrieve and inject Ardublockly translations synchronously
  var appLangJsLoad = document.createElement('script');
  var request = Blockly4ArduinoServer.createRequest();
  var appLangJdPath = 'msg/' + langKey + '.js';
  try {
    request.open('GET', appLangJdPath, false);
    request.send('');
    appLangJsLoad.text = request.responseText;
  } catch (e) {
    // Display an alert to indicate we cannot load languages
    Blockly4Arduino.alertMessage(
        Blockly4Arduino.getLocalStr('noServerTitle'),
        Blockly4Arduino.getLocalStr('noServerNoLangBody'),
        false);
    // But still asynchronous lazy load so at least some text gets translated
    appLangJsLoad.src = appLangJdPath;
  }
  head.appendChild(appLangJsLoad);

  // Retrieve and inject Blockly translations asynchronously
  var blocklyLangJsLoad = document.createElement('script');
  blocklyLangJsLoad.src = '../blockly/msg/js/' + langKey + '.js';
  head.appendChild(blocklyLangJsLoad);
};

/** Saves the blocks and reloads with a different language. */
Blockly4Arduino.changeLanguage = function() {
  // Store the blocks for the duration of the reload only
  Blockly4Arduino.saveSessionStorageBlocks();

  var languageMenu = document.getElementById('language');
  var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

/**
 * Finds and returns the requests string in the localised language.
 * If the translation is not returned, it fetches the original language string.
 * @param {string} stringId
 * @return {!string} The localised, original, or an empty string.
 */
Blockly4Arduino.getLocalStr = function(stringId) {
  var text = Blockly4Arduino.LOCALISED_TEXT[stringId];
  if (!text) {
    console.log('Localised text string ID "' + stringId + '" does not exists!');
  }
  return text || Blockly4Arduino.DEFAULT_LANG_TEXT[stringId] || '';
};
