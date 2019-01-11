Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var store_selecciones = Ext.create('Ext.data.Store', {
    fields: ['id_seleccion', 'nombre', 'descripcion', 'especialidad', 'estado'],
    proxy: {
        type: 'ajax',
        url: 'controller/teams',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_campeonatos = Ext.create('Ext.data.Store', {
    fields: ['id_campeonato','id_seleccion', 'nombre_seleccion', 'nombre', 'fecha', 'victorioso', 'victorioso_text', 'observaciones'],
    proxy: {
        type: 'ajax',
        url: 'controller/championships',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


function editRec(rec) {
        Ext.Ajax.request({
        url: 'controller/championships/' + rec,

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
                            name: 'id_campeonato',
                            value: resultado.data[0].id_campeonato
                        },

                        {
                            xtype: 'combo',
                            fieldLabel: 'Selección',
                            colspan: 2,
                            store: store_selecciones,
                            queryMode: 'local',
                            displayField: 'nombre',
                            valueField: 'id_seleccion',
                            name: 'id_seleccion',
                            value: resultado.data[0].id_seleccion
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Nombre',
                                    name: 'nombre',
                                    maxLength: 255,
                                    enforceMaxLength: true,
                                    allowBlank: false,
                            value: resultado.data[0].nombre
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha',
                                    name: 'fecha',
                                    allowBlank: false,
                            value: resultado.data[0].fecha
                        }, {
                            xtype: 'combo',
                            colspan: 2,
                            fieldLabel: '¿Victorioso?',
                            store: {
                                fields: ['id', 'value'],
                                data: [
                                    {"id": 1, "value": "Sí"},
                                    {"id": 0, "value": "No"}
                                ]
                            },
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'id',
                            name: 'victorioso',
                            allowBlank: false,
                            value: resultado.data[0].victorioso
                        }, {
                            xtype: 'textarea',
                            colspan: 2,
                            fieldLabel: 'Observaciones',
                            width: 580,
                            name: 'observaciones',
                            maxLength: 255,
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
                                        url: 'controller/updatechampionship',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                store_campeonatos.load();
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
                    url: 'controller/deletechampionship',
                    method: 'POST',
                    jsonData: '{"id_campeonato": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_campeonatos.load();
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

    store_selecciones.load();
    store_campeonatos.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Campeonato',
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                defaultButton: 'doCreate',
                referenceHolder: true,
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: 'Selección',
                        colspan: 2,
                        store: store_selecciones,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_seleccion',
                        name: 'id_seleccion'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Nombre',
                                name: 'nombre',
                                maxLength: 255,
                                enforceMaxLength: true,
                                allowBlank: false
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha',
                                name: 'fecha',
                                allowBlank: false
                    }, {
                        xtype: 'combo',
                        colspan: 2,
                        fieldLabel: '¿Victorioso?',
                        store: {
                            fields: ['id', 'value'],
                            data: [
                                {"id": 1, "value": "Sí"},
                                {"id": 0, "value": "No"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'value',
                        valueField: 'id',
                        name: 'victorioso',
                        allowBlank: false
                    }, {
                        xtype: 'textarea',
                        colspan: 2,
                        fieldLabel: 'Observaciones',
                        width: 580,
                        name: 'observaciones',
                        maxLength: 255,
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
                                            var form = this.up('form');
                                            if (!form.isValid()) {
                                            } else {
                                                form.mask("Espere");
                                                var data = form.getValues();
                                                //console.log(data);
                                                Ext.Ajax.request({
                                                    url: 'controller/createchampionship',
                                                    method: 'POST',
                                                    jsonData: data,
                                                    success: function (f, g) {
                                                        form.unmask();
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                            form.reset();
                                                            store_campeonatos.load();
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
                title: 'Campeonatos',
                items: [{
                        xtype: 'grid',
                        store: store_campeonatos,
                        //'id_campeonato','id_seleccion', 'nombre_seleccion', 'nombre', 'fecha', 'victorioso', 'victorioso_text', 'observaciones'

                        columns: [
                            {hidden: true, dataIndex: 'id_campeonato'},
                            {text: 'Selección', dataIndex: 'nombre_seleccion', width: 120},
                            {text: 'Nombre', dataIndex: 'nombre', width: 120},
                            {text: 'Fecha', dataIndex: 'fecha', width: 120},
                            {text: 'Victorioso', dataIndex: 'victorioso_text', width: 120},
                            {text: 'Observaciones', dataIndex: 'observaciones', width: 120},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_campeonato');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_campeonato');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ],
                        height: 250
                    }]
            }
        ]
    });
});