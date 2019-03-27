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


var store_seleccion_personas = Ext.create('Ext.data.Store', {
    fields: ['id_seleccion_persona', 'id_seleccion', 'id_persona', 'fecha_inicio', 'fecha_fin', 'nombre_seleccion', 'nombre_persona'],
    proxy: {
        type: 'ajax',
        url: 'controller/teampersons',
        reader: {type: 'json',
            root: 'data'
        }
    }
});







function editRec(rec) {
    Ext.Ajax.request({
        url: 'controller/teams/' + rec,

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
                            name: 'id_seleccion',
                            value: resultado.data[0].id_seleccion
                        },

                        {
                            xtype: 'textfield',
                            fieldLabel: 'Nombre',
                            name: 'nombre',
                            maxLength: 255,
                            enforceMaxLength: true,
                            allowBlank: false,
                            value: resultado.data[0].nombre
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Descripción',
                            name: 'descripcion',
                            maxLength: 255,
                            enforceMaxLength: true,
                            allowBlank: true,
                            value: resultado.data[0].descripcion
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Especialidad',
                            name: 'especialidad',
                            maxLength: 255,
                            enforceMaxLength: true,
                            allowBlank: false,
                            value: resultado.data[0].especialidad
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Estado',
                            name: 'estado',
                            maxLength: 255,
                            enforceMaxLength: true,
                            allowBlank: false,
                            value: resultado.data[0].estado
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
                                        url: 'controller/updateteam',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                store_seleccion_personas.load();
                                                store_selecciones.load();
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
                    url: 'controller/deleteteam',
                    method: 'POST',
                    jsonData: '{"id_seleccion": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_seleccion_personas.load();
                            store_selecciones.load();
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





function deleteSubRec(rec) {
    Ext.Msg.show({
        title: 'Eliminar Registro',
        message: '¿Está seguro de eliminar el registro?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
                    url: 'controller/deleteteamperson',
                    method: 'POST',
                    jsonData: '{"id_seleccion_persona": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_seleccion_personas.load();
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
    
    store_seleccion_personas.load();
    store_selecciones.load();

    Ext.create({
        xtype: 'panel',
        renderTo: 'main-container',
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Selección',

                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'form',
                        padding: '5 5 5 5',
                        defaults: {
                            padding: '5 15 5 15'
                        },
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaultButton: 'doCreate',
                        referenceHolder: true,
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Nombre',
                                name: 'nombre',
                                maxLength: 255,
                                enforceMaxLength: true,
                                allowBlank: false
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Descripción',
                                name: 'descripcion',
                                maxLength: 255,
                                enforceMaxLength: true,
                                allowBlank: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Especialidad',
                                name: 'especialidad',
                                maxLength: 255,
                                enforceMaxLength: true,
                                allowBlank: false
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Estado',
                                name: 'estado',
                                maxLength: 255,
                                enforceMaxLength: true,
                                allowBlank: false
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
                                                    url: 'controller/createteam',
                                                    method: 'POST',
                                                    jsonData: data,
                                                    success: function (f, g) {
                                                        form.unmask();
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                            form.reset();
                                                            store_selecciones.load();
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
                title: 'Selecciones',
                items: [{
                        xtype: 'grid',
                        store: store_selecciones,
                        height: 250,

                        columns: [
                            {hidden: true, dataIndex: 'id_seleccion'},
                            {text: 'Nombre', dataIndex: 'nombre', width: 100},
                            {text: 'Descripción', dataIndex: 'descripcion', width: 150},
                            {text: 'Especialidad', dataIndex: 'especialidad', width: 220},
                            {text: 'Estado', dataIndex: 'estado', width: 120},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_seleccion');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_seleccion');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ]
                    }]
            }, {
                xtype: 'form',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Integrantes',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        padding: '5 5 5 5',
                        defaults: {
                            padding: '5 15 5 15'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: 'Selección',
                                store: store_selecciones,
                                queryMode: 'local',
                                displayField: 'nombre',
                                valueField: 'id_seleccion',
                                name: 'id_seleccion',
                                allowBlank: false
                            },
                            getPersonTextBox({
                                panelConfig: {padding: '0 0 0 15'}
                            })
                            , {
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
                                colspan: 2,
                                pack: 'end',
                                layout: {
                                    type: 'hbox',
                                    pack: 'end'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        text: 'Agregar',
                                        anchor: '-50%',
                                        handler: function () {
                                            var form = this.up('form');
                                            if (!form.isValid()) {
                                            } else {
                                                form.mask("Espere");
                                                var data = form.getValues();
                                                data.id_persona = form.items.items[0].items.items[1].items.items[0].value;
                                                //console.log(data);
                                                Ext.Ajax.request({
                                                    url: 'controller/createteamperson',
                                                    method: 'POST',
                                                    jsonData: data,
                                                    success: function (f, g) {
                                                        form.unmask();
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                            //console.log(form);
                                                            
                                                            var curval=form.items.items[0].items.items[0].getValue();
                                                            window.console.log(curval);
                                                            form.reset();
                                                            form.items.items[0].items.items[0].setValue(curval);
                                                            store_seleccion_personas.load({
                                                                params:{
                                                                    id_seleccion: data.id_seleccion
                                                                }
                                                            });
                                                            //store_selecciones.load();
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
                            }, {
                                xtype: 'grid',
                                colspan: 2,
                                store: store_seleccion_personas,

                                columns: [
                                    {hidden: true, dataIndex: 'id_seleccion_persona'},
                                    {text: 'Selección', dataIndex: 'nombre_seleccion'},
                                    //{text: 'CUI', dataIndex: 'cui'},
                                    {text: 'Nombre', dataIndex: 'nombre_persona'},
                                    //{text: 'Carrera', dataIndex: 'carrera'},
                                    {text: 'Fecha Inicio', dataIndex: 'fecha_inicio'},
                                    {text: 'Fecha Fin', dataIndex: 'fecha_fin'},
                                    {
                                        xtype: 'actioncolumn',
                                        text: 'Acciones',
                                        width: 100,
                                        items: [
                                            {
                                                icon: 'images/icons/cross.png',
                                                tooltip: 'Eliminar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_seleccion_persona');
                                                    deleteSubRec(rec);
                                                }
                                            }]
                                    }
                                ],
                                height: 250
                            }

                        ]
                    }
                ]
            }
        ]
    });
});