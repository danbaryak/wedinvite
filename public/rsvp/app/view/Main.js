

var createItems = function() {
    var items = [{
        xtype: 'image',
//        height: '',
        width: '100%',

        src: 'http://www.huptalentandbooking.com/images/elephants_dove.png',
        flex: 5
    }, {
        xtype: 'label',
        html: 'הי ' + personName
    }, {
        xtype: 'label',
        html: 'אנחנו מתחתנים!!'
    }];

    var arriving = 'אגיע'
//    if (isFemale) {
//        arriving = 'מגיעה';
//    }
    if (isPersonCouple) {
        items.push({
            flex: 1,
            height: 40,
            xtype: 'button',
            ui: 'confirm',
            minWidth: 250,
            text: 'אני ' + arriving + ' לבד',
            icon: 'http://icons.iconseeker.com/png/32/icontexto-emoticons/happy-3.png',
            iconAlign: 'right',
            scale: 'large',
            handler: approve
        });

        items.push({
            flex: 1,
            height: 35,
            xtype: 'button',
            ui: 'confirm',
            minWidth: 250,
            text: 'אני ו' + coupleName + ' נגיע',
            handler: approveCouple
        });
    } else {
        items.push({
            flex: 1,
            height: 35,
            xtype: 'button',
            ui: 'confirm',
            minWidth: 250,
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
            height: 35,
            minWidth: 250,
            text: 'אני לא ' + arriving,
            handler: decline
//        }]

    });

    items.push({
        xtype: 'spacer',
        height: 5
    });
    return items;
};

var approve = function() {
    Ext.Ajax.request({
        url: '/reply',
        method: 'GET',
        params: {
            id: personId,
            num: 1
        }
    });
}

var approveCouple = function() {
    Ext.Ajax.request({
        url: '/reply',
        method: 'GET',
        params: {
            id: personId,
            num: 2
        }
    });
}

var decline = function() {
    Ext.Ajax.request({
        url: '/reply',
        method: 'GET',
        params: {
            id: personId,
            num: 0
        }
    });
}
Ext.define('WedinviteApp.view.Main', {
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
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        padding: '10',

        defaults: {
            pack: 'center',
            margin: 5
        },

        items: createItems()
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
            this.loadJsFile("../ext-4.2/ext-all.js");
            this.loadJsFile("http://code.jquery.com/jquery-latest.js");
            this.loadCssFile("../touch/resources/css/sencha-touch-rtl.css");
//            this.loadCssFile("resources/css/app-rtl.css");
        }else{
            this.loadCssFile("resources/css/app.css");
        }
    }
});


