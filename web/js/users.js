Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var store_usuarios = Ext.create('Ext.data.Store', {
    fields: ['id_usuario', 'nombre', 'email', 'activo'],
    proxy: {
        type: 'ajax',
        url: 'controller/users',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_roles_usuarios = Ext.create('Ext.data.Store', {
    fields: ['id_usuario_rol', 'nombre_rol', 'descripcion_rol', 'activo'],
    proxy: {
        type: 'ajax',
        //url: 'controller/users',
        reader: {type: 'json',
            root: 'data'
        }
    }
});




function editRec(rec) {

    Ext.Ajax.request({
        url: 'controller/users/' + rec,

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
                            xtype: 'textfield',
                            fieldLabel: 'Id Usuario',
                            editable: false,
                            name: 'id_usuario',
                            value: resultado.data[0].id_usuario,
                            allowBlank: false
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Clave',
                            name: 'clave',
                            emptyText: 'Llenar para cambiar',
                            value: '',
                            inputType: 'password'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Nombres',
                            value: resultado.data[0].nombre,
                            name: 'primer_nombre',
                            allowBlank: false
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Apellidos',
                            value: resultado.data[0].apellido,
                            name: 'primer_apellido',
                            allowBlank: false
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha nacimiento',
                            value: resultado.data[0].fecha_nacimiento,
                            name: 'fecha_nacimiento',
                            emptyText: 'dd/mm/aaaa',
                            allowBlank: false
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Sexo',
                            value: resultado.data[0].sexo,
                            name: 'sexo',
                            allowBlank: false,
                            store: {
                                fields: ['id', 'value'],
                                data: [
                                    {"id": 'm', "value": "Masculino"},
                                    {"id": 'f', "value": "Femenino"}
                                ]
                            },
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'id'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Correo',
                            name: 'email',
                            value: resultado.data[0].email,
                            vtype: 'email'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Teléfono',
                            name: 'telefono',
                            value: resultado.data[0].telefono,
                            maxLength: 8,
                            enforceMaxLength: true,
                            minLength: 8,
                            maskRe: /[0-9]/
                        }, {
                            xtype: 'radiogroup',
                            allowBlank: false,
                            combineErrors: true,
                            colspan: 2,
                            labelWidth: 300,
                            fieldLabel: '¿Usuario debe cambiar clave en el siguiente inicio de sesión?',
                            defaultType: 'radiofield',
                            defaults: {
                                flex: 1,
                                padding: '0 0 0 10'
                            },
                            layout: 'hbox',
                            items: [
                                {
                                    boxLabel: 'Sí',
                                    name: 'cambiar_clave',
                                    inputValue: 1,
                                    combineErrors: true,
                                    id: 'radio1'
                                }, {
                                    boxLabel: 'No',
                                    name: 'cambiar_clave',
                                    inputValue: 0,
                                    combineErrors: true,
                                    checked: true,
                                    id: 'radio2'
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
                                        url: 'controller/updateuser',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {
                                                frmEdit.unmask();
                                                vent.close();
                                                store_usuarios.load();
                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                                            } else {
                                                frmEdit.unmask();
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
                    url: 'controller/deleteuser',
                    method: 'POST',
                    jsonData: '{"id_usuario": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_usuarios.load();
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

    store_usuarios.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Usuario',
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
                        fieldLabel: 'Id Usuario',
                        name: 'id_usuario',
                        regex: new RegExp('^[a-zA-Z][a-zA-Z0-9]{2,49}'),
                        maxLength: 50,
                        enforceMaxLength: 50,
                        regexText: 'El Id de Usuario debe iniciar con una letra, seguido de 2 o más números o letras',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Clave',
                        name: 'clave',
                        inputType: 'password',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Nombres',
                        name: 'nombre',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Apellidos',
                        name: 'apellido',
                        allowBlank: false
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha nacimiento',
                        name: 'fecha_nacimiento',
                        emptyText: 'dd/mm/aaaa',
                        allowBlank: false
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Sexo',
                        name: 'sexo',
                        allowBlank: false,
                        store: {
                            fields: ['id', 'value'],
                            data: [
                                {"id": 'm', "value": "Masculino"},
                                {"id": 'f', "value": "Femenino"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'value',
                        valueField: 'id'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Correo',
                        name: 'email',
                        vtype: 'email'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Teléfono',
                        name: 'telefono',
                        maxLength: 8,
                        enforceMaxLength: true,
                        minLength: 8,
                        maskRe: /[0-9]/
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
                                handler: function () {
                                    
                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        form.mask("Espere");
                                        var data = form.getValues();
                                        Ext.Ajax.request({
                                            url: 'controller/createuser',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    form.unmask();
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    store_usuarios.load();
                                                } else {
                                                    form.unmask();
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
                title: 'Usuarios',
                items: [{
                        xtype: 'grid',
                        store: store_usuarios,
                        maxHeight: 250,
                        columns: [
                            {text: 'Id Usuario', dataIndex: 'id_usuario', width: 100},
                            {text: 'Nombre', dataIndex: 'nombre', width: 150},
                            {text: 'Correo', dataIndex: 'email', width: 220},
                            {text: 'Estado', dataIndex: 'activo', width: 120},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_usuario');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_usuario');
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
                        title: 'Roles',
                        items: [
                            {
                                xtype: 'combo',
                                id: 'cmbUsuarioRol',
                                fieldLabel: 'Usuario',
                                store: store_usuarios,
                                queryMode: 'local',
                                displayField: 'id_usuario',
                                valueField: 'id_usuario',
                                listeners: {
                                    change: function (combo, newVal, oldVal, eOpts) {


                                        Ext.Ajax.request({
                                            url: 'controller/roles/' + newVal,

                                            success: function (f, opts) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    store_roles_usuarios.loadData(resultado.data);
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                    Ext.getCmp('cmbUsuarioRol').reset();
                                                }
                                            },
                                            failure: function (response, opts) {
                                                Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                Ext.getCmp('cmbUsuarioRol').reset();
                                            }
                                        });

                                    }
                                }
                            }, {
                                xtype: 'grid',
                                store: store_roles_usuarios,
                                height: 140,
                                maxHeight: 250,
                                columns: [
                                    {hidden: true, dataIndex: 'id_usuario_rol'},
                                    {
                                        xtype: 'checkcolumn',
                                        text: 'Seleccionar',
                                        dataIndex: 'activo',
                                        listeners: {
                                            checkchange: function (checkolumn, rowindex, checked, record, evnt, eOpts) {
                                                thisgrid = this.up('grid');
                                                thisgrid.mask('Trabajando...');
                                                Ext.Ajax.request({
                                                    url: 'controller/updaterole/',
                                                    method: 'POST',
                                                    jsonData: record.data,

                                                    success: function (f, opts) {
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            store_roles_usuarios.commitChanges();
                                                            thisgrid.unmask();
                                                        } else {
                                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});

                                                            store_roles_usuarios.rejectChanges();
                                                            Ext.getCmp('cmbUsuarioRol').reset();
                                                            thisgrid.unmask();
                                                        }
                                                    },
                                                    failure: function (response, opts) {
                                                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                        store_roles_usuarios.rejectChanges();
                                                        Ext.getCmp('cmbUsuarioRol').reset();
                                                        thisgrid.unmask();
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {text: 'Rol', dataIndex: 'rol', width: 175, dataIndex: 'nombre_rol'},
                                    {text: 'Descripción Rol', dataIndex: 'descripcionRol', width: 250, dataIndex: 'descripcion_rol'}
                                ]
                            }

                        ]
                    }
                ]
            }
        ]
    });
});