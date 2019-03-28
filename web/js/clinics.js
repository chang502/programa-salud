/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var store_clinicas = Ext.create('Ext.data.Store', {
    fields: ["id_clinica", "nombre", "ubicacion", "descripcion"],
    proxy: {
        type: 'ajax',
        url: 'controller/clinics',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var tiposDato = Ext.create('Ext.data.Store', {
    fields: ['abbr', 'name'],
    data: [
        {"tipoDato": "Entero", "idTipoDato": 1},
        {"tipoDato": "Decimal", "idTipoDato": 2},
        {"tipoDato": "Texto", "idTipoDato": 3},
        {"tipoDato": "Fecha", "idTipoDato": 4}
    ]
});


var store_clinica_doctores = Ext.create('Ext.data.Store', {
    fields: ['id_clinica_doctor', 'nombre_completo', 'activo'],
    proxy: {
        type: 'ajax',
        //url: 'controller/users',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var store_clinica_medidas = Ext.create('Ext.data.Store', {
    fields: ['id_clinica_medida', 'nombre', 'tipo_dato', 'valor_minimo', 'valor_maximo', 'obligatorio', 'activo'],
    proxy: {
        type: 'ajax',
        //url: 'controller/users',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var store_clinica_acciones = Ext.create('Ext.data.Store', {
    fields: ['id_clinica_accion', 'nombre', 'activo'],
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
        url: 'controller/clinics/' + rec,

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
                            name: 'id_clinica',
                            value: resultado.data[0].id_clinica
                        }, {
                            xtype: 'textfield',
                            width: 300,
                            fieldLabel: 'Nombre',
                            name: 'nombre',
                            allowBlank: false,
                            maxLenght: 50,
                            enforceMaxLength: true,
                            value: resultado.data[0].nombre
                        }, {
                            xtype: 'textfield',
                            width: 300,
                            fieldLabel: 'Ubicación',
                            name: 'ubicacion',
                            allowBlank: false,
                            maxLenght: 50,
                            enforceMaxLength: true,
                            value: resultado.data[0].ubicacion
                        }, {
                            xtype: 'textareafield',
                            grow: true,
                            name: 'descripcion',
                            fieldLabel: 'Descripción',
                            maxLenght: 255,
                            enforceMaxLength: true,
                            value: resultado.data[0].descripcion
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
                                        url: 'controller/updateclinic',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            frmEdit.unmask();
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {
                                                vent.close();
                                                store_clinicas.load();
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
                    url: 'controller/deleteclinic',
                    method: 'POST',
                    jsonData: '{"id_clinica": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_clinicas.load();
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

    store_clinicas.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Clínica',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                items: [
                    {
                        xtype: 'textfield',
                        width: 300,
                        fieldLabel: 'Nombre',
                        name: 'nombre',
                        allowBlank: false,
                        maxLenght: 50,
                        enforceMaxLength: true
                    }, {
                        xtype: 'textfield',
                        width: 300,
                        fieldLabel: 'Ubicación',
                        name: 'ubicacion',
                        allowBlank: false,
                        maxLenght: 50,
                        enforceMaxLength: true
                    }, {
                        xtype: 'textareafield',
                        grow: true,
                        fieldLabel: 'Descripción',
                        name: 'descripcion',
                        maxLenght: 255,
                        enforceMaxLength: true
                    }, {
                        xtype: 'container',
                        width: 330,
                        pack: 'end',
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
                                        var data = form.getValues();
                                        //console.log(data);
                                        Ext.Ajax.request({
                                            url: 'controller/createclinic',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    store_clinicas.load();
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                }
                                            },
                                            failure: function (f, g) {
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
                title: 'Clínicas',
                items: [{
                        xtype: 'grid',
                        store: store_clinicas,

                        columns: [
                            {hidden: true, dataIndex: 'id_clinica'},
                            {text: 'Nombre', dataIndex: 'nombre', width: 100},
                            {text: 'Ubicación', dataIndex: 'ubicacion', width: 250},
                            {text: 'Descripción', dataIndex: 'descripcion', width: 220},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_clinica');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_clinica');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ],
                        maxHeight: 150
                    }]
            }, {
                xtype: 'fieldset',
                title: 'Medidas',
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: 'Clínica',
                        id: 'cmbClinicaMedida',
                        store: store_clinicas,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_clinica',
                        listeners: {
                            change: function (combo, newVal, oldVal, eOpts) {
                                Ext.Ajax.request({
                                    url: 'controller/clinicmeasurement/' + newVal,
                                    success: function (f, opts) {
                                        var resultado = eval('(' + f.responseText + ')');
                                        if (resultado.success) {
                                            store_clinica_medidas.loadData(resultado.data);
                                        } else {
                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            Ext.getCmp('cmbClinicaMedida').reset();
                                        }
                                    },
                                    failure: function (response, opts) {
                                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        Ext.getCmp('cmbClinicaMedida').reset();
                                    }
                                });

                            }
                        }
                    }, {
                        xtype: 'grid',
                        maxHeight: 150,
                        store: store_clinica_medidas,
                        columns: [
                            {hidden: true, dataIndex: 'id_clinica_medida'},
                            {
                                xtype: 'checkcolumn',
                                text: 'Seleccionar',
                                dataIndex: 'activo',
                                listeners: {
                                    checkchange: function (checkolumn, rowindex, checked, record, evnt, eOpts) {
                                        thisgrid = this.up('grid');
                                        thisgrid.mask('Trabajando...');
                                        Ext.Ajax.request({
                                            url: 'controller/updateclinicmeasurement/',
                                            method: 'POST',
                                            jsonData: record.data,

                                            success: function (f, opts) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    store_clinica_medidas.commitChanges();
                                                    thisgrid.unmask();
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});

                                                    store_clinica_medidas.rejectChanges();
                                                    Ext.getCmp('cmbClinicaDoctor').reset();
                                                    thisgrid.unmask();
                                                }
                                            },
                                            failure: function (response, opts) {
                                                Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                store_clinica_medidas.rejectChanges();
                                                Ext.getCmp('cmbClinicaMedida').reset();
                                                thisgrid.unmask();
                                            }
                                        });
                                    }
                                }
                            },
                            {text: 'Nombre', dataIndex: 'nombre', width: 175},
                            {text: 'Tipo Dato', dataIndex: 'tipo_dato', width: 100},
                            {text: 'Val Mín', dataIndex: 'valor_minimo', width: 100},
                            {text: 'Val Máx', dataIndex: 'valor_maximo', width: 100},
                            {text: 'Obligatorio', dataIndex: 'obligatorio', width: 100}
                        ]
                    }
                ]
            }, {
                xtype: 'fieldset',
                title: 'Doctores',
                items: [

                    {
                        xtype: 'combo',
                        fieldLabel: 'Clínica',
                        id: 'cmbClinicaDoctor',
                        store: store_clinicas,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_clinica',
                        listeners: {
                            change: function (combo, newVal, oldVal, eOpts) {
                                Ext.Ajax.request({
                                    url: 'controller/clinicdoctors/' + newVal,
                                    success: function (f, opts) {
                                        var resultado = eval('(' + f.responseText + ')');
                                        if (resultado.success) {
                                            store_clinica_doctores.loadData(resultado.data);
                                        } else {
                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            Ext.getCmp('cmbClinicaDoctor').reset();
                                        }
                                    },
                                    failure: function (response, opts) {
                                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        Ext.getCmp('cmbClinicaDoctor').reset();
                                    }
                                });

                            }
                        }
                    }, {
                        xtype: 'grid',
                        store: store_clinica_doctores,
                        maxHeight: 150,
                        columns: [
                            {hidden: true, dataIndex: 'id_clinica_doctor'},
                            {
                                xtype: 'checkcolumn',
                                text: 'Seleccionar',
                                dataIndex: 'activo',
                                listeners: {
                                    checkchange: function (checkolumn, rowindex, checked, record, evnt, eOpts) {
                                        thisgrid = this.up('grid');
                                        thisgrid.mask('Trabajando...');
                                        Ext.Ajax.request({
                                            url: 'controller/updateclinicdoctor/',
                                            method: 'POST',
                                            jsonData: record.data,

                                            success: function (f, opts) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    store_clinica_doctores.commitChanges();
                                                    thisgrid.unmask();
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});

                                                    store_clinica_doctores.rejectChanges();
                                                    Ext.getCmp('cmbClinicaDoctor').reset();
                                                    thisgrid.unmask();
                                                }
                                            },
                                            failure: function (response, opts) {
                                                Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                store_clinica_doctores.rejectChanges();
                                                Ext.getCmp('cmbClinicaDoctor').reset();
                                                thisgrid.unmask();
                                            }
                                        });
                                    }
                                }
                            },
                            {text: 'Nombre', dataIndex: 'nombre_completo', width: 250}
                        ]
                    }
                ]
            }
            ,
            {
                xtype: 'fieldset',
                title: 'Acciones',
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: 'Clínica',
                        id: 'cmbClinicaAccion',
                        store: store_clinicas,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_clinica',
                        listeners: {
                            change: function (combo, newVal, oldVal, eOpts) {
                                Ext.Ajax.request({
                                    url: 'controller/clinicactions/' + newVal,
                                    success: function (f, opts) {
                                        var resultado = eval('(' + f.responseText + ')');
                                        if (resultado.success) {
                                            store_clinica_acciones.loadData(resultado.data);
                                        } else {
                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            Ext.getCmp('cmbClinicaAccion').reset();
                                        }
                                    },
                                    failure: function (response, opts) {
                                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        Ext.getCmp('cmbClinicaAccion').reset();
                                    }
                                });

                            }
                        }
                    }, {
                        xtype: 'grid',
                        maxHeight: 150,
                        store: store_clinica_acciones,
                        columns: [
                            {hidden: true, dataIndex: 'id_clinica_accion'},
                            {
                                xtype: 'checkcolumn',
                                text: 'Seleccionar',
                                dataIndex: 'activo',
                                listeners: {
                                    checkchange: function (checkolumn, rowindex, checked, record, evnt, eOpts) {
                                        thisgrid = this.up('grid');
                                        thisgrid.mask('Trabajando...');
                                        Ext.Ajax.request({
                                            url: 'controller/updateclinicaction/',
                                            method: 'POST',
                                            jsonData: record.data,

                                            success: function (f, opts) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    store_clinica_acciones.commitChanges();
                                                    thisgrid.unmask();
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});

                                                    store_clinica_acciones.rejectChanges();
                                                    Ext.getCmp('cmbClinicaAccion').reset();
                                                    thisgrid.unmask();
                                                }
                                            },
                                            failure: function (response, opts) {
                                                Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                store_clinica_medidas.rejectChanges();
                                                Ext.getCmp('cmbClinicaAccion').reset();
                                                thisgrid.unmask();
                                            }
                                        });
                                    }
                                }
                            },
                            {text: 'Nombre', dataIndex: 'nombre', width: 450}
                        ]
                    }
                ]
            }
            //
        ]
    });
});


