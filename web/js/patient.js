/* global Ext, patienthistory_panel */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();


var store_capacidades_especiales = Ext.create('Ext.data.Store', {
    fields: ['id_tipo_discapacidad', 'nombre'],
    proxy: {
        type: 'ajax',
        url: 'controller/disabilitytypes',
        reader: {type: 'json',
            root: 'data'
        }
    }
});





Ext.onReady(function () {

    store_capacidades_especiales.load();

    try {
        var txtparams = location.search.substring(1);
        if (txtparams.length > 2) {
            var urlparams = Ext.Object.fromQueryString(txtparams);
            if (urlparams.paciente !== undefined || urlparams.paciente !== '') {

                var store_historial_medidas = Ext.create('Ext.data.Store', {
                    fields: ['fecha', 'hora', 'clinica', 'atiende', 'medida', 'valor', 'unidad'],
                    proxy: {
                        type: 'ajax',
                        method: 'POST',
                        actionMethods: {
                            create: 'POST',
                            read: 'POST',
                            update: 'PUT',
                            destroy: 'DELETE'
                        },
                        paramsAsJson: true,
                        url: 'controller/measurementhistoryperson',
                        jsonData: '{"id_persona": "' + urlparams.paciente + '"}',
                        reader: {type: 'json',
                            root: 'data'
                        }
                    }
                });

                var store_historial_acciones = Ext.create('Ext.data.Store', {
                    fields: ['fecha', 'hora', 'clinica', 'atiende', 'accion', 'observaciones'],
                    proxy: {
                        type: 'ajax',
                        method: 'POST',
                        actionMethods: {
                            create: 'POST',
                            read: 'POST',
                            update: 'PUT',
                            destroy: 'DELETE'
                        },
                        paramsAsJson: true,
                        url: 'controller/actionshistoryperson',
                        jsonData: '{"id_persona": "' + urlparams.paciente + '"}',
                        reader: {type: 'json',
                            root: 'data'
                        }
                    }
                });

                var store_historial_citas = Ext.create('Ext.data.Store', {
                    fields: ['fecha', 'hora', 'clinica', 'atiende', 'sintoma'],
                    proxy: {
                        type: 'ajax',
                        method: 'POST',
                        actionMethods: {
                            create: 'POST',
                            read: 'POST',
                            update: 'PUT',
                            destroy: 'DELETE'
                        },
                        paramsAsJson: true,
                        url: 'controller/appointmenthistoryperson',
                        jsonData: '{"id_persona": "' + urlparams.paciente + '"}',
                        reader: {type: 'json',
                            root: 'data'
                        }
                    }
                });
                
                 store_historial_medidas.load({params:{id_persona:urlparams.paciente}});
                 store_historial_acciones.load({params:{id_persona:urlparams.paciente}});
                 store_historial_citas.load({params:{id_persona:urlparams.paciente}});
                 
                Ext.Ajax.request({
                    url: 'controller/patient',
                    method: 'POST',
                    jsonData: '{"id_persona": "' + urlparams.paciente + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {

                            var panelInfoAdicional = Ext.create({
                                xtype: 'fieldset',
                                collapsible: true,
                                title: 'Información Adicional',
                                padding: '5 0 5 5',
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                defaults: {
                                    padding: '5 0 5 15',
                                    selectOnFocus: true
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Teléfono de emergencia',
                                        name: 'telefono_emergencia',
                                        allowBlank: false,
                                        maxLength: 8,
                                        enforceMaxLength: true,
                                        minLength: 8,
                                        maskRe: /[0-9]/
                                    }, {
                                        xtype: 'textfield',
                                        fieldLabel: 'Contacto de emergencia',
                                        allowBlank: false,
                                        maxLength: 150,
                                        enforceMaxLength: true,
                                        name: 'contacto_emergencia'
                                    }, {
                                        xtype: 'checkbox',
                                        name: 'flag_tiene_discapacidad',
                                        inputValue: '1',
                                        fieldLabel: '¿Posee cualidades especiales?',
                                        listeners: {
                                            change: function (cbox, newValue, oldValue, eOpts) {
                                                panelInfoAdicional.items.items[3].allowBlank = !newValue;
                                                panelInfoAdicional.items.items[3].clearValue();
                                                panelInfoAdicional.items.items[3].validate();
                                                panelInfoAdicional.items.items[3].setDisabled(!newValue);
                                            }
                                        }
                                    }, {
                                        xtype: 'combo',
                                        fieldLabel: 'Tipo',
                                        store: store_capacidades_especiales,
                                        queryMode: 'local',
                                        displayField: 'nombre',
                                        disabled: true,
                                        valueField: 'id_tipo_discapacidad',
                                        name: 'id_tipo_discapacidad',
                                        allowBlank: false
                                    }, {
                                        xtpye: 'hiddenfield',
                                        name: 'id_persona',
                                        value: urlparams.paciente
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
                                                text: 'Actualizar Información',
                                                anchor: '-50%',
                                                reference: 'doCreate',
                                                handler: function () {

                                                    var form = this.up('form');
                                                    if (!form.isValid()) {
                                                    } else {
                                                        form.mask("Espere");
                                                        var data = form.getValues();

                                                        data.id_persona = panelInfoAdicional.items.items[4].value;

                                                        if (!data.hasOwnProperty('flag_tiene_discapacidad')) {
                                                            data.flag_tiene_discapacidad = '0';
                                                        }

                                                        Ext.Ajax.request({
                                                            url: 'controller/savepersonmoreinfo',
                                                            method: 'POST',
                                                            jsonData: data,
                                                            success: function (f, g) {
                                                                form.unmask();
                                                                var resultadoSaveMoreInfo = eval('(' + f.responseText + ')');
                                                                if (resultadoSaveMoreInfo.success) {
                                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultadoSaveMoreInfo.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                    form.reset();
                                                                    Ext.Ajax.request({
                                                                        url: 'controller/personmoreinfo/',
                                                                        method: 'POST',
                                                                        jsonData: '{"id_persona": "' + urlparams.paciente + '"}',
                                                                        success: function (f, opts) {
                                                                            var resultado_moreinfo2 = eval('(' + f.responseText + ')');
                                                                            if (resultado_moreinfo2.success) {
                                                                                panelInfoAdicional.items.items[0].setValue(resultado_moreinfo2.data[0].telefono_emergencia);
                                                                                panelInfoAdicional.items.items[1].setValue(resultado_moreinfo2.data[0].contacto_emergencia);
                                                                                panelInfoAdicional.items.items[2].setValue(resultado_moreinfo2.data[0].flag_tiene_discapacidad);
                                                                                panelInfoAdicional.items.items[3].setValue(resultado_moreinfo2.data[0].id_tipo_discapacidad);
                                                                            } else {
                                                                                Ext.Msg.show({title: "Error", msg: resultado_moreinfo.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                            }
                                                                        }, failure: function (response, opts) {}
                                                                    });
                                                                } else {
                                                                    Ext.Msg.show({title: "Error", msg: resultadoSaveMoreInfo.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
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
                            });

                            Ext.Ajax.request({
                                url: 'controller/personmoreinfo/',
                                method: 'POST',
                                jsonData: '{"id_persona": "' + urlparams.paciente + '"}',
                                success: function (f, opts) {
                                    var resultado_moreinfo = eval('(' + f.responseText + ')');
                                    if (resultado_moreinfo.success) {
                                        if (resultado_moreinfo.rows > 0) {
                                            var flg_discap = resultado_moreinfo.data[0].flag_tiene_discapacidad;

                                            panelInfoAdicional.items.items[3].allowBlank = !flg_discap;
                                            panelInfoAdicional.items.items[3].clearValue();
                                            panelInfoAdicional.items.items[3].validate();
                                            panelInfoAdicional.items.items[3].setDisabled(!flg_discap);
                                            panelInfoAdicional.items.items[0].setValue(resultado_moreinfo.data[0].telefono_emergencia);
                                            panelInfoAdicional.items.items[1].setValue(resultado_moreinfo.data[0].contacto_emergencia);
                                            panelInfoAdicional.items.items[2].setValue(resultado_moreinfo.data[0].flag_tiene_discapacidad);
                                            panelInfoAdicional.items.items[3].setValue(resultado_moreinfo.data[0].id_tipo_discapacidad);
                                            //panelInfoAdicional.items.items[2].checkChange();

                                        }

                                    } else {
                                        Ext.Msg.show({title: "Error", msg: resultado_moreinfo.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                    }
                                }, failure: function (response, opts) {}
                            });






                            Ext.create({
                                xtype: 'form',
                                renderTo: 'main-container',
                                //width: 900,
                                items: [

                                    {
                                        xtype: 'form',
                                        defaultButton: 'doCreate',
                                        referenceHolder: true,
                                        items: [

                                            {
                                                xtype: 'fieldset',
                                                title: 'Datos Personales',
                                                padding: '5 5 5 5',
                                                layout: {
                                                    type: 'table',
                                                    columns: 2
                                                },
                                                defaults: {
                                                    padding: '5 15 5 15',
                                                    selectOnFocus: true
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        fieldLabel: 'Nombres',
                                                        name: 'nombre',
                                                        allowBlank: false,
                                                        value: resultado.data[0].nombre
                                                    }, {
                                                        xtype: 'textfield',
                                                        fieldLabel: 'Apellidos',
                                                        name: 'apellido',
                                                        allowBlank: false,
                                                        value: resultado.data[0].apellido
                                                    }, {
                                                        xtype: 'datefield',
                                                        fieldLabel: 'Fecha nacimiento',
                                                        name: 'fecha_nacimiento',
                                                        emptyText: 'dd/mm/aaaa',
                                                        allowBlank: false,
                                                        value: resultado.data[0].fecha_nacimiento
                                                    }, {
                                                        xtype: 'combo',
                                                        fieldLabel: 'Sexo',
                                                        name: 'sexo',
                                                        allowBlank: false,
                                                        value: resultado.data[0].sexo,
                                                        store: {
                                                            fields: ['id', 'value'],
                                                            data: [
                                                                {"id": 'M', "value": "Masculino"},
                                                                {"id": 'F', "value": "Femenino"}
                                                            ]
                                                        },
                                                        //queryMode: 'local',
                                                        displayField: 'value',
                                                        valueField: 'id'
                                                    }, {
                                                        xtype: 'textfield',
                                                        fieldLabel: 'Correo',
                                                        name: 'email',
                                                        vtype: 'email',
                                                        value: resultado.data[0].email
                                                    }, {
                                                        xtype: 'textfield',
                                                        fieldLabel: 'Teléfono',
                                                        name: 'telefono',
                                                        maxLength: 8,
                                                        enforceMaxLength: true,
                                                        minLength: 8,
                                                        value: resultado.data[0].telefono,
                                                        maskRe: /[0-9]/
                                                    },
                                                    {
                                                        xtype: 'fieldset',
                                                        title: 'Identificaciones',
                                                        //collapsed: true,
                                                        //disabled: true,
                                                        colspan: 2,
                                                        items: [
                                                            {
                                                                xtype: 'panel',
                                                                //padding: '5 5 5 5',
                                                                defaults: {
                                                                    padding: '5 15 5 15'
                                                                },
                                                                layout: {
                                                                    type: 'table',
                                                                    columns: 2
                                                                }, items: [
                                                                    {
                                                                        xtype: 'textfield',
                                                                        fieldLabel: 'CUI',
                                                                        name: 'cui',
                                                                        maxLength: 13,
                                                                        minLengthText: 'Ingrese un CUI válido',
                                                                        enforceMaxLength: true,
                                                                        minLength: 13,
                                                                        value: resultado.data[0].cui,
                                                                        maskRe: /[0-9]/
                                                                    }, {
                                                                        xtype: 'textfield',
                                                                        fieldLabel: 'Registro Académico',
                                                                        name: 'carnet',
                                                                        maxLength: 9,
                                                                        minLengthText: 'Ingrese un registro académico válido',
                                                                        enforceMaxLength: true,
                                                                        minLength: 7,
                                                                        value: resultado.data[0].carnet,
                                                                        maskRe: /[0-9]/
                                                                    }, {
                                                                        xtype: 'textfield',
                                                                        fieldLabel: 'Número de Orientación Vocacional',
                                                                        name: 'nov',
                                                                        maxLength: 10,
                                                                        minLengthText: 'Ingrese un número de orientación vocacional válido',
                                                                        enforceMaxLength: true,
                                                                        minLength: 10,
                                                                        value: resultado.data[0].nov,
                                                                        maskRe: /[0-9]/
                                                                    }, {
                                                                        xtype: 'textfield',
                                                                        fieldLabel: 'Registro Personal',
                                                                        minLengthText: 'Ingrese un número de registro de personal válido',
                                                                        name: 'regpersonal',
                                                                        maxLength: 9,
                                                                        enforceMaxLength: true,
                                                                        minLength: 9,
                                                                        value: resultado.data[0].regpersonal,
                                                                        maskRe: /[0-9]/
                                                                    }
                                                                ]
                                                            }
                                                        ]
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
                                                                text: 'Actualizar datos',
                                                                anchor: '-50%',
                                                                reference: 'doCreate',
                                                                handler: function () {

                                                                    var form = this.up('form');
                                                                    if (!form.isValid()) {
                                                                    } else {
                                                                        form.mask("Espere");
                                                                        var data = form.getValues();

                                                                        data.id_persona = panelInfoAdicional.items.items[4].value;

                                                                        if (!data.hasOwnProperty('flag_tiene_discapacidad')) {
                                                                            data.flag_tiene_discapacidad = '0';
                                                                        }

                                                                        Ext.Ajax.request({
                                                                            url: 'controller/updatepersoninfo',
                                                                            method: 'POST',
                                                                            jsonData: data,
                                                                            success: function (f, g) {
                                                                                form.unmask();
                                                                                var resultadoSaveMoreInfo = eval('(' + f.responseText + ')');
                                                                                if (resultadoSaveMoreInfo.success) {
                                                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultadoSaveMoreInfo.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                    location.href = 'patient.jsp?paciente='+urlparams.paciente;
                                                                                } else {
                                                                                    Ext.Msg.show({title: "Error", msg: resultadoSaveMoreInfo.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
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
                                    },

                                    {
                                        xtype: 'form',
                                        defaultButton: 'doCreate',
                                        referenceHolder: true,
                                        items: [panelInfoAdicional]
                                    }, {
                                        xtype: 'form',
                                        //renderTo: 'main-container',
                                        //width: 900,
                                        padding: '5 5 5 5',
                                        defaults: {
                                            padding: '5 15 5 15'
                                        },
                                        items: [
                                            {
                                                xtype: 'fieldset',
                                                title: 'Historial',
                                                collapsible: true,
                                                //collapsed: true,
                                                padding: '5 5 5 5',
                                                defaults: {
                                                    padding: '5 15 5 15'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'grid',
                                                        //title: 'Historial de Medidas',
                                                        title: 'Medidas',
                                                        maxHeight: 250,
                                                        store: store_historial_medidas,
                                                        columns: [
                                                            {hidden: true, dataIndex: 'id_persona_medida'},
                                                            {text: 'Fecha', dataIndex: 'fecha', width: 90},
                                                            {text: 'Hora', dataIndex: 'hora', width: 60},
                                                            {text: 'Clínica', dataIndex: 'clinica'},
                                                            {text: 'Atiende', dataIndex: 'atiende', width: 220},
                                                            {text: 'Medida', dataIndex: 'medida', width: 110},
                                                            {text: 'Valor', dataIndex: 'valor', width: 100},
                                                            {text: 'Unidad', dataIndex: 'unidad', width: 80}
                                                        ]
                                                    }, {
                                                        xtype: 'grid',
                                                        //title: 'Historial de Acciones',
                                                        title: 'Acciones',
                                                        maxHeight: 250,
                                                        store: store_historial_acciones,
                                                        columns: [
                                                            {hidden: true, dataIndex: 'id_cita_accion'},
                                                            {text: 'Fecha', dataIndex: 'fecha', width: 90},
                                                            {text: 'Hora', dataIndex: 'hora', width: 60},
                                                            {text: 'Clínica', dataIndex: 'clinica'},
                                                            {text: 'Atiende', dataIndex: 'atiende', width: 220},
                                                            {text: 'Acción', dataIndex: 'accion', width: 110},
                                                            {text: 'Obs.', dataIndex: 'observaciones', width: 180}
                                                        ]
                                                    }, {
                                                        xtype: 'grid',
                                                        title: 'Historial de Citas',
                                                        maxHeight: 250,
                                                        store: store_historial_citas,
                                                        columns: [
                                                            {text: 'Programada', dataIndex: 'programada'},
                                                            {text: 'Iniciada', dataIndex: 'inicio'},
                                                            {text: 'Finalizada', dataIndex: 'fin'},
                                                            {text: 'Clínica', dataIndex: 'clinica'},
                                                            {text: 'Doctor', dataIndex: 'atiende'},
                                                            {text: 'Síntoma', dataIndex: 'sintoma'}
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
















                                ]
                            });




                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    }, failure: function (response, opts) {
                        //
                    }
                });





            } else {
                Ext.Msg.show({title: "Error", msg: 'Así no es como se usa esta página', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR,
                    fn: function (btn) {
                        location.href = 'patients.jsp'
                    }});
            }



        } else {
            Ext.Msg.show({title: "Error", msg: 'Así no es como se usa esta página', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR,
                fn: function (btn) {
                    location.href = 'patients.jsp'
                }});
        }
    } catch (err) {

    }
    //location.href = url_to_redirect;



    // patienthistory_panel.collapse();

});