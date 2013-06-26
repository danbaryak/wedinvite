/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

Ext.define('Ext.env.ChromeiOS', {
    override: 'Ext.env.Browser',
    statics: {
        browserNames: {
            ie: 'IE',
            firefox: 'Firefox',
            safari: 'Safari',
            chrome: 'Chrome',
            opera: 'Opera',
            dolfin: 'Dolfin',
            webosbrowser: 'webOSBrowser',
            chromeMobile: 'ChromeMobile',
            chromeiOS: 'ChromeiOS',
            silk: 'Silk',
            other: 'Other'
        },
        engineNames: {
            webkit: 'WebKit',
            gecko: 'Gecko',
            presto: 'Presto',
            trident: 'Trident',
            other: 'Other'
        },
        enginePrefixes: {
            webkit: 'AppleWebKit/',
            gecko: 'Gecko/',
            presto: 'Presto/',
            trident: 'Trident/'
        },
        browserPrefixes: {
            ie: 'MSIE ',
            firefox: 'Firefox/',
            chrome: 'Chrome/',
            safari: 'Version/',
            opera: 'OPR/',
            dolfin: 'Dolfin/',
            webosbrowser: 'wOSBrowser/',
            chromeMobile: 'CrMo/',
            chromeiOS: 'CriOS/',
            silk: 'Silk/'
        }
    }
});

Ext.define('Ext.viewport.ChromeiOS', {
    onReady: function() {
        if (this.getAutoRender()) {
            this.render();
        }
        if (Ext.browser.name == 'ChromeiOS') {
            this.element.setStyle({
        });
                this.setHeight('-webkit-calc(100% - ' + ((window.outerHeight - window.innerHeight) / 2) + 'px)');
//
    }
}
});

//<debug>
Ext.Loader.setPath({
    'Ext': '../touch/src'
});
//</debug>

Ext.application({
    name: 'rsvp',

    requires: [
        'Ext.MessageBox',
    ],

    views: [
        'Main'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element


        Ext.fly('appLoadingIndicator').destroy();

        mainPanel = Ext.create('rsvp.view.Main', { id: 'main-view' });
//        // Initialize the main view
        Ext.Viewport.setLayout('card');
        Ext.Viewport.add(mainPanel);

//        Ext.Viewport.add({
//            masked: {
//                xtype: 'loadmask',
//                message: 'שולח תשובה',
//                indicator: true
//            }
//        });
//        Ext.Viewport.add({
//            xtype: 'button',
//            text: 'just a button'
//        })
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
