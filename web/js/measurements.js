/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var store_tipos_dato = Ext.create('Ext.data.Store', {
    fields: ['id_tipo_dato', 'tipo_dato'],
    proxy: {
        type: 'ajax',
        url: 'controller/datatypes',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_medidas = Ext.create('Ext.data.Store', {
    fields: ["id_medida", "nombre", "id_tipo_dato", "unidad_medida", "valor_minimo", "valor_maximo", "obligatorio"],
    proxy: {
        type: 'ajax',
        url: 'controller/measurements',
        reader: {type: 'json',
            root: 'data'
        }
    }
});






function editRec(rec) {

    Ext.Ajax.request({
        url: 'controller/measurements/' + rec,

        success: function (f, opts) {
            var resultado = eval('(' + f.responseText + ')');
            if (resultado.success) {

                var frmEdit = Ext.create({
                    xtype: 'form',
                    padding: '5 5 5 5',
                    defaults: {
                        padding: '5 15 5 15'
                    },
                    modal: true,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    items: [
                        {
                            xtype: 'hidden',
                            name: 'id_medida',
                            value: resultado.data[0].id_medida
                        },{
                            xtype: 'textfield',
                            fieldLabel: 'Nombre',
                            name: 'nombre',
                            allowBlank: false,
                            maxLength: 50,
                            enforceMaxLength: true,
                            value: resultado.data[0].nombre
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Tipo de Dato',
                            store: store_tipos_dato,
                            queryMode: 'local',
                            displayField: 'tipo_dato',
                            valueField: 'id_tipo_dato',
                            name: 'id_tipo_dato',
                            allowBlank: false,
                            value: resultado.data[0].id_tipo_dato
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Unidad de Medida',
                            name: 'unidad_medida',
                            allowBlank: false,
                            maxLength: 50,
                            enforceMaxLength: true,
                            value: resultado.data[0].unidad_medida
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Valor Mínimo',
                            name: 'valor_minimo',
                            maxLength: 50,
                            enforceMaxLength: true,
                            value: resultado.data[0].valor_minimo
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Valor Máximo',
                            name: 'valor_maximo',
                            maxLength: 50,
                            enforceMaxLength: true,
                            value: resultado.data[0].valor_maximo
                        }, {
                            xtype: 'radiogroup',
                            allowBlank: false,
                            combineErrors: true,
                            fieldLabel: 'Obligatorio',
                            defaultType: 'radiofield',
                            defaults: {
                                flex: 1,
                                padding: '0 10 0 0'
                            },
                            layout: 'hbox',
                            items: [
                                {
                                    boxLabel: 'Sí',
                                    name: 'obligatorio',
                                    inputValue: 1,
                                    combineErrors: true,
                                    value: resultado.data[0].obligatorio
                                }, {
                                    boxLabel: 'No',
                                    name: 'obligatorio',
                                    inputValue: 0,
                                    combineErrors: true,
                                    value: !resultado.data[0].obligatorio
                                }
                            ]
                        }
                    ]
                });

                var vent = Ext.create('Ext.window.Window', {
                    title: 'Editar Registro',
                    buttons: [
                        {
                            text: 'Aceptar',
                            handler: function () {
                                if (!frmEdit.isValid()) {
                                } else {
                                    var data = frmEdit.getValues();
                                    frmEdit.mask("Espere");
                                    Ext.Ajax.request({
                                        url: 'controller/updatemeasurement',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                store_medidas.load();
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
                    url: 'controller/deletemeasurement',
                    method: 'POST',
                    jsonData: '{"id_medida": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_medidas.load();
                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                });
            } else if (btn === 'no') {
                console.log('No pressed');
            } else {
                console.log('Cancel pressed');
            }
        }
    });
}

Ext.onReady(function () {

    store_tipos_dato.load();
    store_medidas.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Medida',
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15',
                    selectOnFocus: true
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Nombre',
                        name: 'nombre',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Tipo de Dato',
                        store: store_tipos_dato,
                        queryMode: 'local',
                        displayField: 'tipo_dato',
                        valueField: 'id_tipo_dato',
                        name: 'id_tipo_dato',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Unidad de Medida',
                        name: 'unidad_medida',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Valor Mínimo',
                        name: 'valor_minimo',
                        maxLength: 50,
                        enforceMaxLength: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Valor Máximo',
                        name: 'valor_maximo',
                        maxLength: 50,
                        enforceMaxLength: true
                    }, {
                        xtype: 'radiogroup',
                        allowBlank: false,
                        combineErrors: true,
                        fieldLabel: 'Obligatorio',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1,
                            padding: '0 10 0 0'
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel: 'Sí',
                                name: 'obligatorio',
                                inputValue: 1,
                                combineErrors: true,
                                id: 'radio1'
                            }, {
                                boxLabel: 'No',
                                name: 'obligatorio',
                                inputValue: 0,
                                combineErrors: true,
                                id: 'radio2'
                            }
                        ]
                    }, {
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
                                            url: 'controller/createmeasurement',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                form.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    store_medidas.load();
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
                title: 'Medidas',
                items: [{
                        xtype: 'grid',
                        store: store_medidas,
                        maxHeight: 250,
                        columns: [
                            {hidden: true, dataIndex: 'id_medida'},
                            {text: 'Nombre', dataIndex: 'nombre', width: 100},
                            {text: 'Tipo de Dato', dataIndex: 'tipo_dato', width: 150},
                            {text: 'Unidad de Medida', dataIndex: 'unidad_medida', width: 120},
                            {text: 'Valor Mín', dataIndex: 'valor_minimo', width: 120},
                            {text: 'Valor Máx', dataIndex: 'valor_maximo', width: 120},
                            {text: 'Obligatorio', dataIndex: 'obligatorio', width: 120},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 40,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_medida');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_medida');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ]
                    }]
            }
        ]
    });
});