Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




var store_bebederos = Ext.create('Ext.data.Store', {
    fields: ['id_bebedero', 'nombre', 'ubicacion', 'fecha_mantenimiento', 'estado', 'observaciones', 'creado'],
    proxy: {
        type: 'ajax',
        url: 'controller/drinkfountains',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


function editRec(rec) {
        Ext.Ajax.request({
        url: 'controller/drinkfountains/' + rec,

        success: function (f, opts) {
            var resultado = eval('(' + f.responseText + ')');
            if (resultado.success) {

                var frmEdit = Ext.create({
                    xtype: 'form',
                    padding: '5 5 5 5',
                    defaults: {
                        padding: '5 15 5 15',
                        selectOnFocus: true
                    },
                    modal: true,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    items: [
                        {
                            xtype: 'hidden',
                            name: 'id_bebedero',
                            value: resultado.data[0].id_bebedero
                        },
                        
                        
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Nombre',
                            name: 'nombre',
                            maxLength: 100,
                            enforceMaxLength: true,
                            allowBlank: false,
                            value: resultado.data[0].nombre
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Ubicación',
                            name: 'ubicacion',
                            maxLength: 250,
                            enforceMaxLength: true,
                            allowBlank: false,
                            value: resultado.data[0].ubicacion
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha Mantenimiento',
                            name: 'fecha_mantenimiento',
                            allowBlank: false,
                            value: resultado.data[0].fecha_mantenimiento
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Estado',
                            name: 'estado',
                            maxLength: 200,
                            enforceMaxLength: true,
                            allowBlank: false,
                            value: resultado.data[0].estado
                        }, {
                            xtype: 'textarea',
                            colspan: 2,
                            fieldLabel: 'Observaciones',
                            width: 580,
                            name: 'observaciones',
                            maxLength: 1000,
                            enforceMaxLength: true,
                            value: resultado.data[0].observaciones
                        }
                    ]
                });

                var vent = Ext.create('Ext.window.Window', {
                    title: 'Editar Registro',
                    defaultButton: 'doUpdate',
                    referenceHolder: true,
                    buttons: [
                        {
                            text: 'Aceptar',
                            reference: 'doUpdate',
                            handler: function () {
                                if (!frmEdit.isValid()) {
                                } else {
                                    var data = frmEdit.getValues();
                                    frmEdit.mask("Espere");
                                    Ext.Ajax.request({
                                        url: 'controller/updatedrinkfountain',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                store_bebederos.load();
                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                                            } else {
                                                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {
                                            frmEdit.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                    });
                                }
                            }
                        },
                        {text: 'Cancelar', handler: function () {
                                this.up('window').close();
                            }}
                    ],
                    items: frmEdit
                }).show();



            } else {
                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
            }
        },

        failure: function (response, opts) {
            //
        }
    });
    
}



function deleteRec(rec) {
    Ext.Msg.show({
        title: 'Eliminar Registro',
        message: '¿Está seguro de eliminar el registro?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
                    url: 'controller/deletedrinkfountain',
                    method: 'POST',
                    jsonData: '{"id_bebedero": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_bebederos.load();
                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                });
            } else if (btn === 'no') {
                
            } else {
                
            }
        }
    });
}




Ext.onReady(function () {
    
    store_bebederos.load();
    
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        defaultButton: 'doCreate',
        referenceHolder: true,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Bebedero',
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15',
                    selectOnFocus: true
                },
                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Nombre',
                        name: 'nombre',
                        maxLength: 100,
                        enforceMaxLength: true,
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Ubicación',
                        name: 'ubicacion',
                        maxLength: 250,
                        enforceMaxLength: true,
                        allowBlank: false
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha Mantenimiento',
                        name: 'fecha_mantenimiento',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Estado',
                        name: 'estado',
                        maxLength: 200,
                        enforceMaxLength: true,
                        allowBlank: false
                    }, {
                        xtype: 'textarea',
                        colspan: 2,
                        fieldLabel: 'Observaciones',
                        width: 580,
                        name: 'observaciones',
                        maxLength: 1000,
                        enforceMaxLength: true
                    },
                    {
                        xtype: 'container',
                        pack: 'end',
                        colspan: 2,
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Crear',
                                reference: 'doCreate',
                                anchor: '-50%',
                                handler: function () {
                                    //Ext.Msg.wait("Iniciando Sesi&oacute;n...","Espere");
                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        form.mask("Espere");
                                        var data = form.getValues();
                                        //console.log(data);
                                        Ext.Ajax.request({
                                            url: 'controller/createdrinkfountain',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                form.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    store_bebederos.load();
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                }
                                            },
                                            failure: function (f, g) {
                                                form.unmask();
                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    }
                ]
            }, {
                xtype: 'fieldset',
                title: 'Bebederos',
                items: [{
                        xtype: 'grid',
                        store: store_bebederos,
                        maxHeight: 250,

                        columns: [
                            {hidden: true, dataIndex: 'id_bebedero'},
                            {text: '<br>Nombre', dataIndex: 'nombre'},
                            {text: '<br>Ubicación', dataIndex: 'ubicacion'},
                            {text: 'Fecha<br>Mantenimiento', dataIndex: 'fecha_mantenimiento'},
                            {text: '<br>Estado', dataIndex: 'estado'},
                            {text: '<br>Observaciones', dataIndex: 'observaciones'},
                            {text: '<br>Creado', dataIndex: 'creado'},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_bebedero');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_bebedero');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ]
                    }
                ]
            }
        ]
    });
});