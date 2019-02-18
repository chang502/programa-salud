/* global Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();








var store_tipo_capacitacion = Ext.create('Ext.data.Store', {
    fields: ['id', 'value'],
    data: [
        {"id": 'CAPACITACION', "value": "Capacitación"},
        {"id": 'CURSOLIBRE', "value": "Curso Libre"}
    ]
});


var store_capacitaciones = Ext.create('Ext.data.Store', {
    fields: ['id_capacitacion', 'nombre', 'descripcion', 'tipo_capacitacion', 'nombre_tipo_capacitacion', 'estado', 'fecha_inicio', 'fecha_fin'],
    proxy: {
        type: 'ajax',
        url: 'controller/trainings',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var store_capacitacion_personas = Ext.create('Ext.data.Store', {
    fields: ['id_capacitacion_persona', 'id_capacitacion', 'nombre_capacitacion', 'id_persona', 'nombre_persona', ],
    proxy: {
        type: 'ajax',
        url: 'controller/trainingattendees',
        reader: {type: 'json',
            root: 'data'
        }
    }
});



function editRec(rec) {


    Ext.Ajax.request({
        url: 'controller/trainings/' + rec,

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
                            name: 'id_capacitacion',
                            value: resultado.data[0].id_capacitacion
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Nombre',
                            name: 'nombre',
                            allowBlank: false,
                            maxLength: 250,
                            enforceMaxLength: true,
                            value: resultado.data[0].nombre
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Descripción',
                            name: 'descripcion',
                            allowBlank: false,
                            maxLength: 600,
                            enforceMaxLength: true,
                            value: resultado.data[0].descripcion
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Tipo',
                            store: store_tipo_capacitacion,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'id',
                            name: 'tipo_capacitacion',
                            allowBlank: false,
                            value: resultado.data[0].tipo_capacitacion
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Estado',
                            name: 'estado',
                            allowBlank: false,
                            maxLength: 100,
                            enforceMaxLength: true,
                            value: resultado.data[0].estado
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha inicio',
                            name: 'fecha_inicio',
                            allowBlank: false,
                            value: resultado.data[0].fecha_inicio
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha fin',
                            name: 'fecha_fin',
                            allowBlank: true,
                            value: resultado.data[0].fecha_fin
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
                                        url: 'controller/updatetraining',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                store_capacitaciones.load();
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
                    url: 'controller/deletetraining',
                    method: 'POST',
                    jsonData: '{"id_capacitacion": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_capacitaciones.load();
                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                });
            } else if (btn === 'no') {
                //console.log('No pressed');
            } else {
                //console.log('Cancel pressed');
            }
        }
    });
}









function deleteSubRec(rec) {
    Ext.Msg.show({
        title: 'Eliminar Registro',
        message: '¿Está seguro de eliminar el registro?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
                    url: 'controller/deletetrainingattendee',
                    method: 'POST',
                    jsonData: '{"id_capacitacion_persona": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_capacitacion_personas.load();
                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                });
            } else if (btn === 'no') {
                //console.log('No pressed');
            } else {
                //console.log('Cancel pressed');
            }
        }
    });
}



Ext.onReady(function () {

    store_capacitaciones.load();
    store_capacitacion_personas.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        items: [
            {
                xtype: 'form',
                defaultButton: 'doCreate',
                referenceHolder: true,
                items: [

                    {
                        xtype: 'fieldset',
                        title: 'Crear Capacitación',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        padding: '5 5 5 5',
                        defaults: {
                            padding: '5 15 5 15'
                        },
                        buttonAlign: 'right',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Nombre',
                                name: 'nombre',
                                allowBlank: false,
                                maxLength: 250,
                                enforceMaxLength: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Descripción',
                                name: 'descripcion',
                                allowBlank: false,
                                maxLength: 600,
                                enforceMaxLength: true
                            }, {
                                xtype: 'combo',
                                fieldLabel: 'Tipo',
                                store: store_tipo_capacitacion,
                                queryMode: 'local',
                                displayField: 'value',
                                valueField: 'id',
                                name: 'tipo_capacitacion',
                                allowBlank: false
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Estado',
                                name: 'estado',
                                allowBlank: false,
                                maxLength: 100,
                                enforceMaxLength: true
                            }, {
                                xtype: 'datefield',
                                fieldLabel: 'Fecha inicio',
                                name: 'fecha_inicio',
                                allowBlank: false
                            }, {
                                xtype: 'datefield',
                                fieldLabel: 'Fecha fin',
                                name: 'fecha_fin',
                                allowBlank: true
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
                                        anchor: '-50%',
                                        reference: 'doCreate',
                                        handler: function () {

                                            var form = this.up('form');
                                            if (!form.isValid()) {
                                            } else {
                                                form.mask("Espere");
                                                var data = form.getValues();


                                                Ext.Ajax.request({
                                                    url: 'controller/createtraining',
                                                    method: 'POST',
                                                    jsonData: data,
                                                    success: function (f, g) {
                                                        form.unmask();
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                            form.reset();
                                                            store_capacitaciones.load();
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
                    }

                ]
            }, {
                xtype: 'fieldset',
                title: 'Capacitaciones',
                items: [{
                        xtype: 'grid',
                        store: store_capacitaciones,
                        height: 250,
                        columns: [
                            {hidden: true, dataIndex: 'id_capacitacion'},
                            {text: 'Nombre', dataIndex: 'nombre'},
                            {text: 'Descripción', dataIndex: 'descripcion'},
                            {text: 'Tipo', dataIndex: 'nombre_tipo_capacitacion'},
                            {text: 'Estado', dataIndex: 'estado'},
                            {text: 'Fecha Inicio', dataIndex: 'fecha_inicio'},
                            {text: 'Fecha Fin', dataIndex: 'fecha_fin'},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_capacitacion');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_capacitacion');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ]
                    }]
            }, {
                xtype: 'fieldset',
                title: 'Asistentes',
                items: [
                    {
                        xtype: 'form',
                        padding: '5 5 5 5',
                        defaults: {
                            padding: '5 15 5 15'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: 'Capacitación',
                                store: store_capacitaciones,
                                queryMode: 'local',
                                displayField: 'nombre',
                                name: 'id_capacitacion',
                                allowBlank: false,
                                colspan: 2,
                                valueField: 'id_capacitacion'
                            }
                            ,
                            getPersonTextBox({
                                panelConfig: {/*margin: '5 0 5 0'*/ width: 610}
                            })
                                    ,
                            {
                                xtype: 'container',
                                colspan: 1,
                                pack: 'end',
                                width: 610,
                                layout: {
                                    type: 'hbox',
                                    pack: 'end'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        text: 'Agregar',
                                        anchor: '-50%',
                                        reference: 'doCreate',
                                        handler: function () {
                                            //Ext.Msg.wait("Iniciando Sesi&oacute;n...","Espere");
                                            var form = this.up('form');
                                            if (!form.isValid()) {
                                            } else {
                                                form.mask("Espere");
                                                var data = form.getValues();
                                                console.log(form);
                                                //adding hiddenfield value
                                                data.id_persona = form.items.items[1].items.items[0].value;

                                                Ext.Ajax.request({
                                                    url: 'controller/createtrainingattendee',
                                                    method: 'POST',
                                                    jsonData: data,
                                                    success: function (f, g) {
                                                        form.unmask();
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                            form.reset();
                                                            store_capacitacion_personas.load();
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
                        xtype: 'grid',
                        colspan: 2,
                        store: store_capacitacion_personas,
                        height: 250,
                        columns: [
                            {hidden: true, dataIndex: 'id_capacitacion_persona'},
                            {text: 'Capacitación', dataIndex: 'nombre_capacitacion', width: 250},
                            {text: 'Nombre', dataIndex: 'nombre_persona', width: 400},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [
                                    {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_capacitacion_persona');
                                            deleteSubRec(rec);
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