

Ext.onReady(function () {

    var fromAddress = Ext.create('Ext.data.Store', {
        fields: ['value'],
        data: [
            { value: 'Dan' },
            { value: 'Assaf' }
        ],
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    });

    var combo = new Ext.form.ComboBox({
        store: fromAddress,
        valueField: "value",
        displayField: "value",
        valueNotFoundText: "Assaf" ,
        editable: false
    });

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
            }, 'sendFrom', {
                name: 'invitationsSent',
                type: 'int'
            }, {
                name: 'toCount',
                type: 'int'
            }, {
                name: 'replied',
                type: 'boolean'
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

    MyCheckColumn = Ext.extend(Ext.grid.column.CheckColumn,{
        //The reference to the related dataIndex
        relatedIndex : null,
        listeners: {
        //Override onMouseDown method
            beforecheckchange: function( column, rowIndex, checked, eOpts ) {
                var person = store.getAt(rowIndex).data;
                return person.invitationsSent == 0;
            }
        }
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
    var comboBoxRenderer = function(combo) {
        return function(value) {
            var idx = combo.store.find(combo.valueField, value);
            var rec = combo.store.getAt(idx);
            return (rec === null ? '' : rec.get(combo.displayField) );
        };
    }
    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'Person',
        proxy: {
            type: 'rest',
            url: 'people',
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'data'
            },
            writer: {
                type: 'json'
            }
        },
        listeners: {
            write: function(store, operation){
//                var record = operation.getRecords()[0];
//                personDetails.loadRecord(record);
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

            },
            load: function(store, records) {
//                store.each(function(record) {
//                    if (record.get('sendFrom') == "") {
//                        record.set('sendFrom', 'Assaf');
//                    }
//                });
            }, add: function(store, records) {
//                Ext.each(records, function(rec) {
//                    rec.set('sendFrom', 'Assaf');
//                })
            }
        }
    });

    var selModel = Ext.create('Ext.selection.CheckboxModel', {

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
        clicksToEdit: 2,
        listeners: {
            beforeEdit: function(object, options){
                if (object.context.record.data.invitationsSent > 0) {
                    return false;
                }
                return true;
            }
        }

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
        columnLines: true,
        selModel: selModel,
        invalidateScrollerOnRefresh: false,
//        header: {
//           items: [
//                {
//                    xtype: 'label',
//                    html: 'מוזמנים'
//                }
//
//            ]
//        },
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
            header: 'שלח מ',
            width: 80,
            sortable: true,
            dataIndex: 'sendFrom',
            editable: true,
            editor: combo

        },new MyCheckColumn({
            header: 'הזמנה זוגית',
            width: 80,
            sortable: true,
            dataIndex: 'couple',
            xtype: 'disablecheckcolumn',
            editor: {
                xtype: 'checkbox',
                cls: 'x-grid-checkheader-editor'
            }
        }),

       {
            header: 'שם הזוג',
            width: 100,
            sortable: true,
            dataIndex: 'coupleName',
            field: {
                xtype: 'textfield'
            }
        }, {
            header: 'התעלם',
            width: 50,
            dataIndex: 'toCount',
            field: {
                xtype: 'textfield'
            },
            editable: true
        }, {
            header: 'נשלחו',
            width: 50,
            dataIndex: 'invitationsSent',
            editable: false
        }, {
            header: 'מגיעים',
            width: 50,
            dataIndex: 'arriving',
            editable: false,
            renderer: function(value, metaData, record, row, col, store, gridView){
                if (record.data.replied) {
                    return value;
                }
                return '?';
            }
        }],
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                text: 'הוספה',
                handler: function(){
                    // empty record
                    store.add(Ext.create('Person'));
//                    rowEditing.startEdit(0, 0);
                }
            }, {
                itemId: 'delete',
                text: 'מחיקה',

                disabled: true,
                handler: function(){

                    Ext.MessageBox.confirm('מחיקה', 'בטוח??????!??', function(btn){
                        if(btn === 'yes') {
                            var selection = grid.getView().getSelectionModel().getSelection()[0];
                            if (selection) {
                                if (selection.get('invitationsSent') > 0) {
                                    Ext.MessageBox.alert('מחיקה חסומה', 'לא ניתן למחוק מוזמן שנשלחה אליו הזמנה. מחק נתוני הגעה קודם');
                                    return;
                                }
                                store.remove(selection);
                            }
                        }
                    });

                }
            },{
                xtype: 'button',
                text: 'שלח הזמנה לבדיקה ל assaf.is.on.fire@gmail.com',
                handler: function() {
                    var selections = grid.getSelectionModel().getSelection();
                    if (selections.length > 0) {
                        var selected = selections[0].data;
                        Ext.Ajax.request({
                            method: 'GET',
                            url: 'sendmail',
                            params: {
                                id: selected._id,
                                sendTo: 'assaf.is.on.fire@gmail.com'
                            }
                        });
                    }

                }
            },{
                xtype: 'button',
                text: 'שלח הזמנה לבדיקה ל danbaryak@gmail.com',
                handler: function() {
                    var selections = grid.getSelectionModel().getSelection();
                    if (selections.length > 0) {
                        var selected = selections[0].data;
                        Ext.Ajax.request({
                            method: 'GET',
                            url: 'sendmail',
                            params: {
                                id: selected._id,
                                sendTo: 'danbaryak@gmail.com'
                            }
                        });
                    }

                }
            }, {
                xtype: 'button',
                text: 'אפס נתוני הגעה',
                handler: function() {
                    Ext.MessageBox.confirm('איפוס', 'אם המוזמן עדכן הגעה הנתונים ימחקו. בטוח?', function(btn) {
                        if(btn === 'yes'){
                            Ext.each(grid.getSelectionModel().getSelection(), function(record) {
                                record.set('invitationsSent', 0);
                                record.set('arriving', 0);
                                record.set('replied', false);
                            });
                        }
                    });

                }
            }, '-',{
                xtype: 'button',
                text: 'שלח הזמנות',
                cls: 'btnRed',
                handler: function() {
                    Ext.MessageBox.confirm('שליחת הזמנות', 'לשלוח הזמנות? בטוח??', function(btn){
                        if(btn === 'yes'){
                            Ext.each(grid.getSelectionModel().getSelection(), function(record) {
                                record.set('invitationsSent', record.get('invitationsSent') + 1);
//                                record.save();
                                Ext.Ajax.request({
                                    method: 'GET',
                                    url: 'sendmail',
                                    params: {
                                        id: record.data._id,
                                        sendTo: record.data.email
                                    }
                                });
                            });
                        }
                    });

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
                    type: 'vbox',
                    defaultMargins: '10 10 10 10'
                },
                region: 'east',

                items: [



                ]

            },
            grid
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
