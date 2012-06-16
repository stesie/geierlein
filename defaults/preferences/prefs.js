pref("toolkit.defaultChromeURI", "chrome://geierlein/content/main.xul");

pref("geierlein.autosave.geierfile", false);
pref("geierlein.autosave.protocol", true);

pref("geierlein.autofill.time.mode", 3);

pref("geierlein.defaultAddress.name", "");
pref("geierlein.defaultAddress.strasse", "");
pref("geierlein.defaultAddress.plz", "");
pref("geierlein.defaultAddress.ort", "");
pref("geierlein.defaultAddress.land", "");
pref("geierlein.defaultAddress.telefon", "");
pref("geierlein.defaultAddress.email", "");
pref("geierlein.defaultAddress.steuernummer", "");

pref("geierlein.debug.showDevelMenu", false);


/* extension manager */
pref("xpinstall.dialog.confirm", "chrome://mozapps/content/xpinstall/xpinstallConfirm.xul");
pref("xpinstall.dialog.progress.skin", "chrome://mozapps/content/extensions/extensions.xul?type=themes");
pref("xpinstall.dialog.progress.chrome", "chrome://mozapps/content/extensions/extensions.xul?type=extensions");
pref("xpinstall.dialog.progress.type.skin", "Extension:Manager-themes");
pref("xpinstall.dialog.progress.type.chrome", "Extension:Manager-extensions");
pref("extensions.update.enabled", true);
pref("extensions.update.interval", 86400);
pref("extensions.dss.enabled", false);
pref("extensions.dss.switchPending", false);
pref("extensions.ignoreMTimeChanges", false);
pref("extensions.logging.enabled", false);
pref("general.skins.selectedSkin", "classic/1.0");
// NB these point at AMO
pref("extensions.update.url", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreExtensionsURL", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreThemesURL", "chrome://mozapps/locale/extensions/extensions.properties");


/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);
