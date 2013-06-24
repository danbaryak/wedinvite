
Ext.onReady(function () {

    Ext.define('Person', {
        extend: 'Ext.data.Model',

        idProperty: '_id',
        fields: [{
            name: '_id',
            useNull: true
        }, 'name', 'lastname','email',
            {
                name: 'isFemale',
                type: 'boolean'
            },
            {
                name: 'couple',
                type: 'boolean'
            }, 'coupleName', {
                name: 'arriving',
                type: 'int'
            }]
    });

    var personDetails = Ext.create('Ext.form.Panel', {
        title: 'פרטי מוזמן',
        bodyPadding: 10,
        region: 'south',
        frame: true,
        resizable: true,
        defaultType: 'textfield',
        items: [
            {
                fieldLabel: 'שם פרטי',
                name: 'name'
            },
            {
                fieldLabel: 'שם משפחה',
                name: 'lastname'
            },
            {
                fieldLabel: 'כתובת Email',
                name: 'email'
            }

//            {
//                xtype: 'textarea',
//                fieldLabel: 'תוכן ההזמנה',
//                name: 'content'
//            }

        ]
    });

    var form = Ext.create('Ext.form.Panel', {
        width: 500,
        frame: true,
        layout: {
            type: 'hbox'
        },
        bodyPadding: '10 10 0',
        region: 'south',

        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 50
        },

        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Name'
            },
            {
                xtype: 'filefield',
                id: 'form-file',
                emptyText: 'Select an image',
                fieldLabel: 'Photo',
                name: 'thumbnail',
                buttonText: '',
                buttonConfig: {
                    iconCls: 'upload-icon'
                }
            }
        ],

        buttons: [
            {
                text: 'Save',
                handler: function () {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'upload.file',
                            waitMsg: 'Uploading your photo...',
                            success: function (fp, o) {
                                msg('Success', 'Processed file "' + o.result.file + '" on the server');
                            }
                        });
                    }
                }
            },
            {
                text: 'Reset',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }
        ]
    });

    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'Person',
        proxy: {
            type: 'rest',
            url: 'people',
            reader: {
                type: 'json',
                root: 'data'
            },
            writer: {
                type: 'json'
            }
        },
        listeners: {
            write: function(store, operation){
                var record = operation.getRecords()[0];
                personDetails.loadRecord(record);
//                    name = Ext.String.capitalize(operation.action),
//                    verb;
//
//
//                if (name == 'Destroy') {
//                    record = operation.records[0];
//                    verb = 'Destroyed';
//                } else {
//                    verb = name + 'd';
//                }
//                Ext.example.msg(name, Ext.String.format("{0} user: {1}", verb, record.getId()));

            }
        }
    });

    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        listeners: {
            cancelEdit: function(rowEditing, context) {
                // Canceling editing of a locally added, unsaved record: remove it
                if (context.record.phantom) {
                    store.remove(context.record);
                }
            }
        }
    });

    cellEditing = new Ext.grid.plugin.CellEditing({
        clicksToEdit: 2
    });

    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        rtl: true,
        plugins: [cellEditing],
        width: 400,
        height: 300,
        autoScroll: false,
        frame: true,
        title: 'רשימת מוזמנים',
        store: store,

//        iconCls: 'icon-user',
        columns: [{
            header: 'שם פרטי',
            sortable: true,
            flex: 1,
            width: 300,
            dataIndex: 'name',
            field: {
                xtype: 'textfield'
            }
        },{
            text: 'שם משפחה',
            flex: 1,
            width: 100,
            sortable: true,
            dataIndex: 'lastname',
            field: {
                xtype: 'textfield'
            }
        },{
            text: 'כתובת Email',
            flex: 1,
            width: 200,
            sortable: true,
            dataIndex: 'email',
            editor: {
                allowBlank: true
            }
        },{
            header: 'הזמנה זוגית',
            width: 80,
            sortable: true,
            dataIndex: 'couple',
            xtype: 'checkcolumn'
        },{
            header: 'שם הזוג',
            width: 100,
            sortable: true,
            dataIndex: 'coupleName',
            field: {
                xtype: 'textfield'
            }
        }, {
            header: 'מגיעים',
            width: 50,
            dataIndex: 'arriving',
            editable: false
        }],
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                text: 'הוספה',
                handler: function(){
                    // empty record
                    store.insert(0, new Person());
                    rowEditing.startEdit(0, 0);
                }
            }, {
                itemId: 'delete',
                text: 'מחיקה',

                disabled: true,
                handler: function(){
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        store.remove(selection);
                    }
                }
            }]
        }]

    });

    var onSelectionChange = function(model, records) {
        var prev = personDetails.getRecord();
        if (prev) {
//            personDetails.updateRecord(prev);
//            prev.save({
//                success: function(user) {
//
//                }
//            });
        }

        var rec = records[0];
        if (rec) {
            personDetails.loadRecord(rec);
        }
        grid.down('#delete').setDisabled(records.length === 0);
    };

    grid.on('selectionchange', onSelectionChange, this);




    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        renderTo: 'main',
        rtl: true,
        defaultMargin: '10 10 10 10',
        items: [
            {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    defaultMargins: '10 10 10 10'
                },
                region: 'north',

                items: [
                    {
                        xtype: 'button',
                        text: 'שלח הזמנה (שולח בינתיים לכתובת שלך)',
                        handler: function() {
                            var selections = grid.getSelectionModel().getSelection();
                            if (selections.length > 0) {
                                var selected = selections[0].data;
                                Ext.Ajax.request({
                                    method: 'GET',
                                    url: 'sendmail',
                                    params: {
                                        id: selected._id
                                    }
                                });
                            }

                        }
                    }

                ]

            },
            grid, personDetails
        ]
    });


});


var putJson = function () {
    var value = "foobar";

    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    var uploadPath = 'http://danassaf_rsvp.s3.amazonaws.com/12345678.json';

    Ext.Ajax.request({
        url: uploadPath,
        jsonData: JSON.stringify(
            {
                value: value,
                name: 'Dan Bar-Yaakov'
            }
        ),
        method: 'PUT',
        success: function (response) {
            msg('File Saved', response.responseText);
        }
    });

}

var msg = function (title, msg) {
    Ext.Msg.show({
        title: title,
        msg: msg,
        minWidth: 200,
        modal: true,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK
    });
};
