/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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



var store_doctores_especialidades = Ext.create('Ext.data.Store', {
    fields: ['id_doctor_especialidad', 'especialidad', 'activo'],
    proxy: {
        type: 'ajax',
        //url: 'controller/users',
        reader: {type: 'json',
            root: 'data'
        }
    }
});



var store_doctores = Ext.create('Ext.data.Store', {
    fields: ['id_doctor', 'id_usuario', 'nombre', 'fecha_nacimiento', 'sexo', 'telefono', 'email'],
    proxy: {
        type: 'ajax',
        url: 'controller/doctors',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


function editRec(rec) {

    Ext.Ajax.request({
        url: 'controller/doctors/' + rec,

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
                            xtype: 'combo',
                            id: 'cmbUsuarioEdit',
                            fieldLabel: 'Usuario',
                            colspan: 2,
                            name: 'id_usuario',
                            store: store_usuarios,
                            queryMode: 'local',
                            displayField: 'id_usuario',
                            valueField: 'id_usuario',
                            allowBlank: false,
                            listeners: {
                                change: function (combo, newVal, oldVal, eOpts) {
                                    if (newVal != null) {
                                        combo.ownerCt.mask('Cargando...');
                                        Ext.Ajax.request({
                                            url: 'controller/users/' + newVal,

                                            success: function (f, opts) {
                                                combo.ownerCt.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    combo.ownerCt.items.items[1].setValue(resultado.data[0].primer_nombre);
                                                    combo.ownerCt.items.items[2].setValue(resultado.data[0].segundo_nombre);
                                                    combo.ownerCt.items.items[3].setValue(resultado.data[0].primer_apellido);
                                                    combo.ownerCt.items.items[4].setValue(resultado.data[0].segundo_apellido);
                                                    combo.ownerCt.items.items[5].setValue(resultado.data[0].fecha_nacimiento);
                                                    combo.ownerCt.items.items[6].setValue(resultado.data[0].sexo);
                                                    combo.ownerCt.items.items[7].setValue(resultado.data[0].telefono);
                                                    combo.ownerCt.items.items[8].setValue(resultado.data[0].email);
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});

                                                }
                                            },
                                            failure: function (response, opts) {
                                                combo.ownerCt.unmask();
                                                Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                Ext.getCmp('cmbUsuarioRolEdit').reset();
                                            }
                                        });
                                    }
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Primer nombre',
                            submitValue: false,
                            allowBlank: false,
                            maxLength: 50,
                            enforceMaxLength: true,
                            readOnly: true
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Segundo nombre',
                            submitValue: false,
                            maxLength: 50,
                            enforceMaxLength: true,
                            readOnly: true
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Primer apellido',
                            submitValue: false,
                            allowBlank: false,
                            maxLength: 50,
                            enforceMaxLength: true,
                            readOnly: true
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Segundo apellido',
                            submitValue: false,
                            maxLength: 50,
                            enforceMaxLength: true,
                            readOnly: true
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha nacimiento',
                            submitValue: false,
                            allowBlank: false,
                            readOnly: true
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Sexo',
                            readOnly: true,
                            submitValue: false,
                            store: {
                                fields: ['id', 'value'],
                                data: [
                                    {"id": 'm', "value": "Masculino"},
                                    {"id": 'f', "value": "Femenino"}
                                ]
                            },
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'id',
                            allowBlank: false
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Teléfono',
                            submitValue: false,
                            readOnly: true
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Correo',
                            vtype: 'email',
                            submitValue: false,
                            allowBlank: true,
                            maxLength: 50,
                            enforceMaxLength: true,
                            readOnly: true
                        }, {
                            xtype: 'hidden',
                            name: 'id_doctor',
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
                                        url: 'controller/updatedoctor',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {
                                                frmEdit.unmask();
                                                vent.close();
                                                store_doctores.load();
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

                frmEdit.items.items[0].setValue(resultado.data[0].id_usuario);
                frmEdit.items.items[9].setValue(resultado.data[0].id_doctor);


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
                    url: 'controller/deletedoctor',
                    method: 'POST',
                    jsonData: '{"id_doctor": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_doctores.load();
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
    store_doctores.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Doctor',
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
                        id: 'cmbUsuario',
                        fieldLabel: 'Usuario',
                        name: 'id_usuario',
                        store: store_usuarios,
                        queryMode: 'local',
                        displayField: 'id_usuario',
                        valueField: 'id_usuario',
                        colspan: 2,
                        allowBlank: false,
                        listeners: {
                            change: function (combo, newVal, oldVal, eOpts) {
                                if (newVal != null) {
                                    combo.ownerCt.mask('Cargando...');
                                    Ext.Ajax.request({
                                        url: 'controller/users/' + newVal,

                                        success: function (f, opts) {
                                            combo.ownerCt.unmask();
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {
                                                combo.ownerCt.items.items[1].setValue(resultado.data[0].primer_nombre);
                                                combo.ownerCt.items.items[2].setValue(resultado.data[0].segundo_nombre);
                                                combo.ownerCt.items.items[3].setValue(resultado.data[0].primer_apellido);
                                                combo.ownerCt.items.items[4].setValue(resultado.data[0].segundo_apellido);
                                                combo.ownerCt.items.items[5].setValue(resultado.data[0].fecha_nacimiento);
                                                combo.ownerCt.items.items[6].setValue(resultado.data[0].sexo);
                                                combo.ownerCt.items.items[7].setValue(resultado.data[0].telefono);
                                                combo.ownerCt.items.items[8].setValue(resultado.data[0].email);
                                            } else {
                                                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});

                                            }
                                        },
                                        failure: function (response, opts) {
                                            combo.ownerCt.unmask();
                                            Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            Ext.getCmp('cmbUsuarioRol').reset();
                                        }
                                    });
                                }
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Primer nombre',
                        submitValue: false,
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Segundo nombre',
                        submitValue: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Primer apellido',
                        submitValue: false,
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Segundo apellido',
                        submitValue: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        readOnly: true
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha nacimiento',
                        submitValue: false,
                        allowBlank: false,
                        readOnly: true
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Sexo',
                        readOnly: true,
                        submitValue: false,
                        store: {
                            fields: ['id', 'value'],
                            data: [
                                {"id": 'm', "value": "Masculino"},
                                {"id": 'f', "value": "Femenino"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'value',
                        valueField: 'id',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Teléfono',
                        submitValue: false,
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Correo',
                        vtype: 'email',
                        submitValue: false,
                        allowBlank: true,
                        maxLength: 50,
                        enforceMaxLength: true,
                        readOnly: true
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
                                            url: 'controller/createdoctor',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    form.unmask();
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    store_doctores.load();
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
                title: 'Doctores',
                items: [{
                        xtype: 'grid',
                        store: store_doctores,
                        maxHeight: 250,
                        columns: [
                            {hidden: true, dataIndex: 'id_doctor'},
                            {text: 'Usuario', dataIndex: 'id_usuario', width: 80},
                            {text: 'Nombre', dataIndex: 'nombre', width: 200},
                            {text: 'Fecha Nac', dataIndex: 'fecha_nacimiento', width: 95},
                            {text: 'Sexo', dataIndex: 'sexo', width: 50},
                            {text: 'Teléfono', dataIndex: 'telefono', width: 80},
                            {text: 'Correo', dataIndex: 'email', width: 210},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 60,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_doctor');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_doctor');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ]
                    }]
            },{
                xtype: 'form',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Especialidades',
                        items: [
                            {
                                xtype: 'combo',
                                id: 'cmbDoctorEspecialidad',
                                fieldLabel: 'Doctor',
                                store: store_doctores,
                                queryMode: 'local',
                                displayField: 'nombre',
                                valueField: 'id_doctor',
                                listeners: {
                                    change: function (combo, newVal, oldVal, eOpts) {


                                        Ext.Ajax.request({
                                            url: 'controller/specialities/' + newVal,

                                            success: function (f, opts) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    store_doctores_especialidades.loadData(resultado.data);
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
                                store: store_doctores_especialidades,
                                height: 140,
                                maxHeight: 250,
                                columns: [
                                    {hidden: true, dataIndex: 'id_doctor_especialidad'},
                                    {
                                        xtype: 'checkcolumn',
                                        text: 'Seleccionar',
                                        dataIndex: 'activo',
                                        listeners: {
                                            checkchange: function (checkolumn, rowindex, checked, record, evnt, eOpts) {
                                                thisgrid = this.up('grid');
                                                thisgrid.mask('Trabajando...');
                                                Ext.Ajax.request({
                                                    url: 'controller/updatespeciality/',
                                                    method: 'POST',
                                                    jsonData: record.data,

                                                    success: function (f, opts) {
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            store_doctores_especialidades.commitChanges();
                                                            thisgrid.unmask();
                                                        } else {
                                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});

                                                            store_doctores_especialidades.rejectChanges();
                                                            Ext.getCmp('cmbUsuarioRol').reset();
                                                            thisgrid.unmask();
                                                        }
                                                    },
                                                    failure: function (response, opts) {
                                                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                        store_doctores_especialidades.rejectChanges();
                                                        Ext.getCmp('cmbUsuarioRol').reset();
                                                        thisgrid.unmask();
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {text: 'Especialidad', dataIndex: 'rol', width: 275, dataIndex: 'especialidad'}
                                ]
                            }

                        ]
                    }
                ]
            }
        ]
    });
});