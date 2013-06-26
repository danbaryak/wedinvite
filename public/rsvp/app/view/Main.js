

var mainPanel = null;
var btnHeight = 45;

var createItems = function() {
    var items = [{
        baseCls: 'myfont',
        xtype: 'label',
        html: 'הי ' + personName
    }, {
        baseCls: 'customf',
        xtype: 'label',
        html: 'אנחנו מתחתנים'
    }];

    var arriving = 'אגיע'
//    if (isFemale) {
//        arriving = 'מגיעה';
//    }
//    items.push({
//        xtype: 'label',
//        html: Ext.broswer.name,
//
//        height: 120
//    });
    if (isPersonCouple) {

        items.push({
            flex: 1,
            height: btnHeight,
            xtype: 'button',
            minWidth: 250,
            maxWidth: 360,
            ui: 'confirm',
            text: 'אני ו' + coupleName + ' נגיע',
            handler: approveCouple
        });

        items.push({
            flex: 1,
            height: btnHeight,
            xtype: 'button',
            minWidth: 250,
            text: 'אני ' + arriving + ' לבד',
            scale: 'large',
            ui: 'confirm',
            handler: approve
        });

    } else {
        items.push({
            flex: 1,
            height: btnHeight,
            xtype: 'button',
            ui: 'confirm',
            minWidth: 250,
            maxHeight: 40,

            text: 'אני ' + arriving,
            handler: approve
        })
    }
    items.push({
//        xtype: 'panel',
////        layout: { type: 'hbox', pack: 'center' },
//        children: [{
        flex: 1,
        xtype: 'button',
        height: btnHeight,
        minWidth: 250,
        ui: 'decline',
        maxHeight: 40,
        text: 'אני לא ' + arriving,
        handler: decline
//        }]

    });

    return items;
};

var approve = function() {
    sendReply(1);
}

var sendReply = function(count) {
    Ext.Viewport.setMasked({
        xtype: 'loadmask',
        message: 'מעדכן'
    });

    Ext.Ajax.request({
        url: '/reply',
        method: 'GET',
        params: {
            id: personId,
            num: count
        },
        success: function() {
            Ext.Viewport.setMasked(false);
            if (count > 0) {
                mainPanel.animateActiveItem(wedInfoPanel, {type: 'fade'});
            } else {
                mainPanel.animateActiveItem(notComingPanel, {type: 'fade'});
            }

        },
        failure: function() {
            Ext.Viewport.setMasked(false);
        }
    });
}

var approveCouple = function() {
    sendReply(2);
}

var decline = function() {
    sendReply(0);
}


var notComingPanel = Ext.create('Ext.Panel', {
    layout: {
        type: 'vbox',
        align: 'center'
//        pack: 'top'
    },
    baseCls: 'customb',
    padding: '0',
    defaults: {
//        pack: 'center',
        margin: 0
    },

    items: [
        {
            xtype: 'image',
//        height: '',
            width: '100%',
            height: '70%',
//        src: 'http://www.huptalentandbooking.com/images/elephants_dove.png',
            src: 'resources/images/Sad.png',
            flex: 1
        }, {
            xtype: 'panel',
            layout: {
                type: 'border'
            },
            height: '30%'
        }
    ]
});

var wedInfoPanel = Ext.create('Ext.Panel', {
    baseCls: 'customb',
    layout: {
        type: 'vbox',
        align: 'center'
//        pack: 'top'
    },
//    padding: '10',

    defaults: {
        pack: 'center'
//        margin: 5
    },
    items: [
        {
            xtype: 'image',
//        height: '',
            width: '100%',
            height: '70%',
//        src: 'http://www.huptalentandbooking.com/images/elephants_dove.png',
            src: 'resources/images/Happy.png',
            flex: 1
        }
    ]
});

var createContent = function() {
    return [
        {
            xtype: 'image',
            width: '100%',
//            height: '10%',
//            html    : '<img src="resources/images/Normal.png" />',
            src: 'resources/images/Normal.png',
            flex: 2

        }, {
            xtype: 'panel',
//            height: '40%',
            layout: {
                type: 'vbox',

                align: 'right'
            },
            defaults: {
                margin: 2
            },
            items: createItems(),
            flex: 1
        }, {
            xtype: 'panel',
            height: 60
//        flex: 0,
//        height: '20%'
        }];
}

var content = Ext.create('Ext.Panel', {

    baseCls: 'customb',
    fullscreen: true,
    layout: {
        type: 'vbox',
        align: 'center'
//        pack: 'top'
    },
//    padding: '5',

    defaults: {
//        pack: 'center',
//        margin: 2
    },

    items: createContent()
});

Ext.define('rsvp.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',

    requires: [


    ],
    initConfig: function() {
        console.log('initConfig called');
        var me = this;
        me.loadLangFiles();
        me.callParent(arguments);

    },
    config: {


        layout: {
            type: 'card'
        },

        items: content
    },

    loadCssFile :function( fileName ){

        var fileReference = document.createElement("link");
        fileReference.setAttribute("rel", "stylesheet");
        fileReference.setAttribute("type", "text/css");
        fileReference.setAttribute("href", fileName);

        document.getElementsByTagName("head")[0].appendChild(fileReference);

        console.log(fileName + " CSS file loaded successfully");
    },
    loadJsFile : function ( fileName ){

        var fileReference = document.createElement('script');
        fileReference.setAttribute("type", "text/javascript");
        fileReference.setAttribute("src", fileName);

        document.getElementsByTagName("head")[0].appendChild(fileReference);

        console.log(fileName + " JS file loaded successfully");
    },
    loadLangFiles: function (){

//        var lang = localStorage.getItem("b4e39e88-994e-4393-a6f0-b696f0a35dd2_LANGUAGE_KEY");
        var lang = "rtl";
        //console.log("The language is: " + lang);

        if(lang === "rtl"){
//            this.loadJsFile("../ext-4.2/ext-all.js");
            this.loadJsFile("http://code.jquery.com/jquery-latest.js");
            this.loadCssFile("../touch/resources/css/sencha-touch-rtl.css");
//            this.loadCssFile("resources/css/app-rtl.css");
            this.loadCssFile("resources/css/app.css");
            this.loadCssFile("resources/css/custom.css");
        }else{
            this.loadCssFile("resources/css/app.css");
            this.loadCssFile("resources/css/custom.css");
        }
    }
});


