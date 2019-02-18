/* global Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        padding: '5 5 5 5',
        defaults: {
            padding: '5 15 5 15'
        },
        items: [
            createAppointmentsForTodayPanel({}),
            getAppointmentsForTheFuturePanel({})
        ]
    });
});

var store_clinicas_usuario = Ext.create('Ext.data.Store', {
    fields: ["id_clinica", "nombre", "ubicacion", "descripcion"],
    proxy: {
        type: 'ajax',
        url: 'controller/userclinics',
        reader: {type: 'json',
            root: 'data'
        }
    }
});




var store_doctores_usuario = Ext.create('Ext.data.Store', {
    fields: ['id_doctor', 'nombre_completo'],
    proxy: {
        type: 'ajax',
        url: 'controller/userdoctors',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

function editarCita(id_cita, functioncallback) {
    
    store_doctores_usuario.load();
    store_clinicas_usuario.load();

    Ext.Ajax.request({
        url: 'controller/appointments/' + id_cita,

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
                            name: 'id_cita',
                            value: resultado.data[0].id_cita
                        }, {
                            xtype: 'textfield',
                            colspan: 2,
                            width: 580,
                            fieldLabel: 'Paciente',
                            readOnly: true,
                            value: resultado.data[0].paciente
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Correo',
                            vtype: 'email',
                            colspan: 2,
                            emptyText: 'Escriba una dirección correo si desea utilizar una diferente',
                            width: 580,
                            name: 'email',
                            allowBlank: false,
                            maxLength: 50,
                            enforceMaxLength: true,
                            readOnly: true,
                            value: resultado.data[0].email
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Clínica',
                            store: store_clinicas_usuario,
                            queryMode: 'local',
                            displayField: 'nombre',
                            valueField: 'id_clinica',
                            allowBlank: false,
                            name: 'id_clinica',
                            value: resultado.data[0].id_clinica
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Doctor',
                            store: store_doctores_usuario,
                            queryMode: 'local',
                            displayField: 'nombre_completo',
                            valueField: 'id_doctor',
                            allowBlank: false,
                            name: 'id_doctor',
                            value: resultado.data[0].id_doctor
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha',
                            minValue: new Date(),
                            allowBlank: false,
                            name: 'fecha',
                            value: resultado.data[0].fecha
                        }, {
                            xtype: 'timefield',
                            fieldLabel: 'Hora',
                            allowBlank: false,
                            format: 'H:i',
                            minValue: '06:00',
                            maxValue: '20:00',
                            increment: 30,
                            name: 'hora',
                            value: resultado.data[0].hora
                        }, {
                            xtype: 'textarea',
                            colspan: 2,
                            fieldLabel: 'Síntoma',
                            width: 580,
                            allowBlank: false,
                            name: 'sintoma',
                            maxLength: 500,
                            enforceMaxLength: true,
                            value: resultado.data[0].sintoma
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
                                        url: 'controller/updateappointment',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                functioncallback();

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
            window.console.log("failure");
        }
    });

}





function borrarCita(rec, functioncallback) {
    Ext.Msg.show({
        title: 'Eliminar Registro',
        message: '¿Está seguro de eliminar el registro?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
                    url: 'controller/deleteappointment',
                    method: 'POST',
                    jsonData: '{"id_cita": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            functioncallback();
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

