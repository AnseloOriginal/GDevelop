//@ts-check
/// <reference path="../JsExtensionTypes.d.ts" />
/**
 * This is a declaration of an extension for GDevelop 5.
 *
 * ℹ️ Changes in this file are watched and automatically imported if the editor
 * is running. You can also manually run `node import-GDJS-Runtime.js` (in newIDE/app/scripts).
 *
 * The file must be named "JsExtension.js", otherwise GDevelop won't load it.
 * ⚠️ If you make a change and the extension is not loaded, open the developer console
 * and search for any errors.
 *
 * More information on https://github.com/4ian/GDevelop/blob/master/newIDE/README-extensions.md
 */

/** @type {ExtensionModule} */
module.exports = {
  createExtension: function (_, gd) {
    const extension = new gd.PlatformExtension();
    extension
      .setExtensionInformation(
        'SceneTransition',
        _('Scene Transition'),
        _('Changes the Scene with transition effects'),
        'Ansel Uzebu',
        'MIT'
      )
      .setShortDescription(
        'Change scenes with customizable transitions.'
      ).setCategory('Scene');
    extension
      .addInstructionOrExpressionGroupMetadata(_('Scene Transition'))
      .setIcon('CppPlatform/Extensions/topdownmovementicon.png');


       extension
      .addAction(
        'ChangeSceneWithTransition',
        _('Change Scene with transition'),
        _(
          'Change the scene to a new scene with a transition.'
        ),
        _('Change Scene to _PARAM1_ using _PARAM2_ transition (Duration _PARAM3_)'),
        _('Scene'),
        'res/actions/saveDown.svg',
        'res/actions/saveDown.svg'
      )
      .addParameter('sceneName', '')
      .addParameter('string', _('Type of Transition'), '', false)
      .setDefaultValue(`Swipe Left`)
      .addParameter('number', _('Duration of the transition'), '', true)
      .setDefaultValue(`1`)
      .getCodeExtraInformation()
      .addIncludeFile('Extensions/SceneTransition/scenetransitiontools.js') // ← this is missing
      .setFunctionName('gdjs.SceneTransition.changeSceneWithTransition');
  
    return extension;
  },
  runExtensionSanityTests: function (gd, extension) {
    return [];
  },
}