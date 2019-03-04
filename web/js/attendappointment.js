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
            if (urlparams.cita !== undefined || urlparams.cita !== '') {

                var store_historial_medidas = Ext.create('Ext.data.Store', {
                    fields: ['fecha', 'hora', 'clinica', 'atiende', 'medida', 'valor', 'unidad'],
                    proxy: {
                        type: 'ajax',
                        url: 'controller/measurementhistory/' + urlparams.cita,
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
                        url: 'controller/appointmentactions',
                        jsonData: '{"id_cita": "' + urlparams.cita + '"}',
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
                        url: 'controller/appointmenthistory',
                        jsonData: '{"id_cita": "' + urlparams.cita + '"}',
                        reader: {type: 'json',
                            root: 'data'
                        }
                    }
                });

                var store_acciones = Ext.create('Ext.data.Store', {
                    fields: ['id_accion', 'nombre'],
                    proxy: {
                        type: 'ajax',
                        url: 'controller/actions',
                        reader: {type: 'json',
                            root: 'data'
                        }
                    }
                });

                store_historial_medidas.load();
                store_historial_acciones.load({params:{id_cita:urlparams.cita}});
                store_historial_citas.load({params:{id_cita:urlparams.cita}});
                store_acciones.load();

                Ext.Ajax.request({
                    url: 'controller/attendappointment',
                    method: 'POST',
                    jsonData: '{"id_cita": "' + urlparams.cita + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {

                            Ext.Ajax.request({
                                url: 'controller/appointmentmeasurements/' + urlparams.cita,
                                success: function (f, opts) {
                                    var resultado2 = eval('(' + f.responseText + ')');
                                    if (resultado2.success) {




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
                                                    maxLength: 8,
                                                    enforceMaxLength: true,
                                                    minLength: 8,
                                                    maskRe: /[0-9]/
                                                }, {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Contacto de emergencia',
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
                                                            if (newValue) {

                                                            }
                                                        }
                                                    }
                                                }, {
                                                    xtype: 'combo',
                                                    fieldLabel: 'Tipo',
                                                    store: store_capacidades_especiales,
                                                    queryMode: 'local',
                                                    displayField: 'nombre',
                                                    valueField: 'id_tipo_discapacidad',
                                                    name: 'id_tipo_discapacidad',
                                                    allowBlank: false
                                                }, {
                                                    xtpye: 'hiddenfield',
                                                    name: 'id_cita',
                                                    value: resultado.data[0].id_cita
                                                }, {
                                                    xtpye: 'hiddenfield',
                                                    name: 'id_persona',
                                                    value: resultado.data[0].id_paciente
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
                                                            text: 'Actualizar datos',
                                                            anchor: '-50%',
                                                            reference: 'doCreate',
                                                            handler: function () {

                                                                var form = this.up('form');
                                                                if (!form.isValid()) {
                                                                } else {
                                                                    form.mask("Espere");
                                                                    var data = form.getValues();

                                                                    data.id_persona = panelInfoAdicional.items.items[5].value;

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
                                                                                    jsonData: '{"id_persona": "' + data.id_persona + '"}',
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
                                            jsonData: '{"id_persona": "' + resultado.data[0].id_paciente + '"}',
                                            success: function (f, opts) {
                                                var resultado_moreinfo = eval('(' + f.responseText + ')');
                                                if (resultado_moreinfo.success) {
                                                    panelInfoAdicional.items.items[0].setValue(resultado_moreinfo.data[0].telefono_emergencia);
                                                    panelInfoAdicional.items.items[1].setValue(resultado_moreinfo.data[0].contacto_emergencia);
                                                    panelInfoAdicional.items.items[2].setValue(resultado_moreinfo.data[0].flag_tiene_discapacidad);
                                                    panelInfoAdicional.items.items[3].setValue(resultado_moreinfo.data[0].id_tipo_discapacidad);
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado_moreinfo.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                }
                                            }, failure: function (response, opts) {}
                                        });








                                        var panelMedidas = Ext.create({
                                            xtype: 'fieldset',
                                            title: 'Toma de Medidas',
                                            collapsible: true,
                                            padding: '5 0 5 5',
                                            layout: {
                                                type: 'table',
                                                columns: 2
                                            },
                                            defaults: {
                                                padding: '5 0 5 15'
                                            },
                                            items: [
                                                {
                                                    xtpye: 'hiddenfield',
                                                    name: 'id_cita',
                                                    value: resultado.data[0].id_cita
                                                }, {
                                                    xtpye: 'hiddenfield',
                                                    name: 'id_persona',
                                                    value: resultado.data[0].id_paciente
                                                }
                                            ]
                                        });
                                        /*
                                         * 
                                         * Entero
                                         Decimal
                                         Texto
                                         Fecha
                                         Sí/No
                                         
                                         */
                                        for (var i = 0; i < resultado2.data.length; i++) {
                                            var linea = resultado2.data[i];

                                            panelMedidas.add({
                                                xtype: 'hiddenfield',
                                                name: 'id_medida',
                                                value: linea.id_medida
                                            })

                                            if (linea.tipo_dato === 'Texto') {
                                                panelMedidas.add({
                                                    xtype: 'textfield',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true',
                                                    name: 'valor'
                                                });
                                            } else if (linea.tipo_dato === 'Entero') {
                                                panelMedidas.add({
                                                    xtype: 'numberfield',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true',
                                                    minValue: linea.valor_minimo,
                                                    maxValue: linea.valor_maximo,
                                                    hideTrigger: true,
                                                    mouseWheelEnabled: false,
                                                    allowDecimals: false,
                                                    name: 'valor'
                                                });
                                            } else if (linea.tipo_dato === 'Decimal') {
                                                panelMedidas.add({
                                                    xtype: 'numberfield',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true',
                                                    minValue: linea.valor_minimo,
                                                    maxValue: linea.valor_maximo,
                                                    hideTrigger: true,
                                                    mouseWheelEnabled: false,
                                                    allowDecimals: true,
                                                    decimalSeparator: '.',
                                                    step: 0.01,
                                                    name: 'valor'
                                                });
                                            } else if (linea.tipo_dato === 'Fecha') {
                                                panelMedidas.add({
                                                    xtype: 'datefield',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true',
                                                    name: 'valor'
                                                });
                                            } else if (linea.tipo_dato === 'Sí/No') {
                                                panelMedidas.add({
                                                    xtype: 'checkbox',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true',
                                                    name: 'valor'
                                                });
                                            }

                                            panelMedidas.add({
                                                xtype: 'label',
                                                text: linea.unidad_medida
                                            });
                                        }
                                        panelMedidas.add({
                                            xtype: 'container',
                                            pack: 'end',
                                            width: 305,
                                            colspan: 2,
                                            layout: {
                                                type: 'hbox',
                                                pack: 'end'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: 'Guardar Medidas',
                                                    anchor: '-50%',
                                                    reference: 'doCreate',
                                                    handler: function () {

                                                        var form = this.up('form');
                                                        if (!form.isValid()) {
                                                        } else {
                                                            form.mask("Espere");
                                                            var data = form.getValues();


                                                            data.id_cita = form.items.items[0].items.items[0].value;
                                                            data.id_persona = form.items.items[0].items.items[1].value;
                                                            window.console.log(data);

                                                            Ext.Ajax.request({
                                                                url: 'controller/savemeasures',
                                                                method: 'POST',
                                                                jsonData: data,
                                                                success: function (f, g) {
                                                                    form.unmask();
                                                                    var resultado = eval('(' + f.responseText + ')');
                                                                    if (resultado.success) {
                                                                        Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                        form.reset();
                                                                        //////////////////////////////////////////////////store_acciones.load();
                                                                        store_historial_medidas.load();
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
                                        });
                                        /*
                                         * 
                                         */

                                        Ext.create({
                                            xtype: 'form',
                                            renderTo: 'main-container',
                                            //width: 900,
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    title: 'Paciente',
                                                    padding: '5 5 5 5',
                                                    layout: {
                                                        type: 'table',
                                                        columns: 4
                                                    },
                                                    defaults: {
                                                        padding: '5 15 5 15'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'label',
                                                            text: 'Nombre:'
                                                        }, {
                                                            html: '<h2>' + resultado.data[0].paciente + '</h2>'
                                                        }, {
                                                            xtype: 'label',
                                                            text: 'Síntoma:'
                                                        }, {
                                                            html: '<h2>' + resultado.data[0].sintoma + '</h2>'
                                                        }
                                                        ,
                                                        {
                                                            xtype: 'label',
                                                            text: 'Hora programada:'
                                                        }, {
                                                            html: '<h3>' + resultado.data[0].hora + '</h3>'
                                                        },
                                                        {
                                                            xtype: 'label',
                                                            text: 'Hora inicio:'
                                                        }, {
                                                            html: '<h3>' + resultado.data[0].hora_inicio + '</h3>'
                                                        }

                                                    ]
                                                }, {
                                                    xtype: 'form',
                                                    defaultButton: 'doCreate',
                                                    referenceHolder: true,
                                                    items: [panelInfoAdicional]
                                                }
                                                , {
                                                    xtype: 'form',
                                                    items: [panelMedidas]
                                                }, {
                                                    xtype: 'form',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            title: 'Acciones',
                                                            collapsible: false,
                                                            padding: '5 5 5 5',
                                                            defaults: {
                                                                padding: '5 15 5 15'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'combo',
                                                                    fieldLabel: 'Acción',
                                                                    store: store_acciones,
                                                                    name: 'id_accion',
                                                                    queryMode: 'local',
                                                                    displayField: 'nombre',
                                                                    valueField: 'id_accion',
                                                                    allowBlank: false
                                                                },
                                                                {
                                                                    xtype: 'textarea',
                                                                    name: 'observaciones',
                                                                    maxLength: 500,
                                                                    allowBlank: false,
                                                                    enforceMaxLength: true,
                                                                    fieldLabel: 'Observaciones'
                                                                },
                                                                {
                                                                    xtype: 'container',
                                                                    pack: 'end',
                                                                    width: 305,
                                                                    colspan: 2,
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

                                                                                var form = this.up('form');
                                                                                if (!form.isValid()) {
                                                                                } else {
                                                                                    form.mask("Espere");
                                                                                    var data = form.getValues();
                                                                                    
                                                                                    data.id_cita = urlparams.cita;
                                                                                    
                                                                                    Ext.Ajax.request({
                                                                                        url: 'controller/saveappointmentaction',
                                                                                        method: 'POST',
                                                                                        jsonData: data,
                                                                                        success: function (f, g) {
                                                                                            form.unmask();
                                                                                            var resultado = eval('(' + f.responseText + ')');
                                                                                            if (resultado.success) {
                                                                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                                form.reset();
                                                                                                store_historial_acciones.load({params:{id_cita:urlparams.cita}});
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
                                                }
                                                , {
                                                    xtype: 'container',
                                                    pack: 'end',
                                                    width: 305,
                                                    colspan: 2,
                                                    layout: {
                                                        type: 'hbox',
                                                        pack: 'end'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            text: 'Finalizar Cita',
                                                            anchor: '-50%',
                                                            handler: function(){
                                                                Ext.Msg.show({
                                                                    title: 'Finalizar Cita',
                                                                    message: 'Al finalizar la cita, ya no podrá agregar acciones<br>ni tomar medidas. ¿Desea continuar?',
                                                                    buttons: Ext.Msg.YESNO,
                                                                    icon: Ext.Msg.QUESTION,
                                                                    fn: function (btn) {
                                                                        if (btn === 'yes') {
                                                                            Ext.Ajax.request({
                                                                                url: 'controller/finishappointment',
                                                                                method: 'POST',
                                                                                jsonData: '{"id_cita": "' + urlparams.cita + '"}',
                                                                                success: function (f, opts) {
                                                                                    var resultadoEliminaReg = eval('(' + f.responseText + ')');
                                                                                    if (resultadoEliminaReg.success) {
                                                                                        Ext.Msg.show({title: "Operación exitosa", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                        location.href = 'appointments.jsp'
                                                                                    } else {
                                                                                        Ext.Msg.show({title: "Error", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                    }
                                                                                },
                                                                                failure: function (response, opts) {
                                                                                    Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                                
                                                                
                                                            }
                                                        },{
                                                            xtype: 'button',
                                                            margin: '0 0 0 15',
                                                            text: 'Cancelar Cita',
                                                            anchor: '-50%',
                                                            handler: function(){
                                                                Ext.Msg.show({
                                                                    title: 'Cancelar Cita',
                                                                    message: '¿Desea cancelar la cita?',
                                                                    buttons: Ext.Msg.YESNO,
                                                                    icon: Ext.Msg.QUESTION,
                                                                    fn: function (btn) {
                                                                        if (btn === 'yes') {
                                                                            Ext.Ajax.request({
                                                                                url: 'controller/cancelappointment',
                                                                                method: 'POST',
                                                                                jsonData: '{"id_cita": "' + urlparams.cita + '"}',
                                                                                success: function (f, opts) {
                                                                                    var resultadoEliminaReg = eval('(' + f.responseText + ')');
                                                                                    if (resultadoEliminaReg.success) {
                                                                                        Ext.Msg.show({title: "Operación exitosa", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                        location.href = 'appointments.jsp'
                                                                                    } else {
                                                                                        Ext.Msg.show({title: "Error", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                    }
                                                                                },
                                                                                failure: function (response, opts) {
                                                                                    Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                                
                                                                
                                                            }
                                                        }
                                                    ]
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
                                                                        {text: 'Unidad', dataIndex: 'unidad', width: 80},
                                                                        {
                                                                            xtype: 'actioncolumn',
                                                                            text: 'Eliminar',
                                                                            width: 40,
                                                                            items: [
                                                                                {
                                                                                    icon: 'images/icons/cross.png',
                                                                                    tooltip: 'Eliminar registro',
                                                                                    handler: function (grid, rowIndex, colIndex) {
                                                                                        var rec = grid.getStore().getAt(rowIndex).get('id_persona_medida');
                                                                                        
                                                                                            Ext.Msg.show({
                                                                                                title: 'Eliminar Registro',
                                                                                                message: '¿Está seguro de eliminar el registro?',
                                                                                                buttons: Ext.Msg.YESNO,
                                                                                                icon: Ext.Msg.QUESTION,
                                                                                                fn: function (btn) {
                                                                                                    if (btn === 'yes') {
                                                                                                        Ext.Ajax.request({
                                                                                                            url: 'controller/deletepersonmeasurement',
                                                                                                            method: 'POST',
                                                                                                            jsonData: '{"id_persona_medida": "' + rec + '","id_cita": "'+urlparams.cita+'"}',
                                                                                                            success: function (f, opts) {
                                                                                                                var resultadoEliminaReg = eval('(' + f.responseText + ')');
                                                                                                                if (resultadoEliminaReg.success) {
                                                                                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                                                    store_historial_medidas.load({params:{id_cita:urlparams.cita}});
                                                                                                                } else {
                                                                                                                    Ext.Msg.show({title: "Error", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                                }
                                                                                                            },
                                                                                                            failure: function (response, opts) {
                                                                                                                Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                    }
                                                                                }]
                                                                        }
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
                                                                        {text: 'Obs.', dataIndex: 'observaciones', width: 180},
                                                                        {
                                                                            xtype: 'actioncolumn',
                                                                            text: 'Eliminar',
                                                                            width: 40,
                                                                            items: [
                                                                                {
                                                                                    icon: 'images/icons/cross.png',
                                                                                    tooltip: 'Eliminar registro',
                                                                                    handler: function (grid, rowIndex, colIndex) {
                                                                                        var rec = grid.getStore().getAt(rowIndex).get('id_cita_accion');
                                                                                        
                                                                                            Ext.Msg.show({
                                                                                                title: 'Eliminar Registro',
                                                                                                message: '¿Está seguro de eliminar el registro?',
                                                                                                buttons: Ext.Msg.YESNO,
                                                                                                icon: Ext.Msg.QUESTION,
                                                                                                fn: function (btn) {
                                                                                                    if (btn === 'yes') {
                                                                                                        Ext.Ajax.request({
                                                                                                            url: 'controller/deleteappointmentaction',
                                                                                                            method: 'POST',
                                                                                                            jsonData: '{"id_cita_accion": "' + rec + '","id_cita": "'+urlparams.cita+'"}',
                                                                                                            success: function (f, opts) {
                                                                                                                var resultadoEliminaReg = eval('(' + f.responseText + ')');
                                                                                                                if (resultadoEliminaReg.success) {
                                                                                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                                                    store_historial_acciones.load({params:{id_cita:urlparams.cita}});
                                                                                                                } else {
                                                                                                                    Ext.Msg.show({title: "Error", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                                }
                                                                                                            },
                                                                                                            failure: function (response, opts) {
                                                                                                                Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                    }
                                                                                }]
                                                                        }
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
                                        Ext.Msg.show({title: "Error", msg: resultado2.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                    }
                                }, failure: function (response, opts) {
                                    //
                                }
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
                        location.href = 'appointments.jsp'
                    }});
            }



        } else {
            Ext.Msg.show({title: "Error", msg: 'Así no es como se usa esta página', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR,
                fn: function (btn) {
                    location.href = 'appointments.jsp'
                }});
        }
    } catch (err) {

    }
    //location.href = url_to_redirect;



    // patienthistory_panel.collapse();

});