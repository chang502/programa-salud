/* global Ext, patienthistory_panel */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();






Ext.onReady(function () {



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

                                        var panelMedidas = Ext.create({
                                            xtype: 'fieldset',
                                            title: 'Toma de Medidas',
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
                                                            text: 'Paciente:'
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
                                                            text: 'Hora inicio:'
                                                        }, {
                                                            html: '<h3>' + resultado.data[0].hora + '</h3>'
                                                        }

                                                    ]
                                                }
                                                , {
                                                    xtype: 'form',
                                                    items: [panelMedidas]
                                                }, {
                                                    xtype: 'fieldset',
                                                    title: 'Diagnóstico y Acciones',
                                                    padding: '5 5 5 5',
                                                    defaults: {
                                                        padding: '5 15 5 15'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'textarea',
                                                            fieldLabel: 'Diagnóstico',
                                                            width: 700,
                                                            minHeight: 100,
                                                            height: 100,
                                                            grow: true,
                                                            minGrow: 200
                                                        }, {
                                                            xtype: 'combo',
                                                            fieldLabel: 'Acción',
                                                            store: store_acciones,
                                                            queryMode: 'local',
                                                            displayField: 'nombre',
                                                            valueField: 'id_accion'
                                                        },
                                                        {
                                                            xtype: 'textarea',
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


                                                                            Ext.Ajax.request({
                                                                                url: 'controller/asdffffsdf',
                                                                                method: 'POST',
                                                                                jsonData: data,
                                                                                success: function (f, g) {
                                                                                    form.unmask();
                                                                                    var resultado = eval('(' + f.responseText + ')');
                                                                                    if (resultado.success) {
                                                                                        Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                        form.reset();
                                                                                        /*store_capacitaciones.load();
                                                                                         store_capacitacion_personas.load();*/
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
                                                            anchor: '-50%'
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
                                                                    title: 'Historial de Medidas',
                                                                    maxHeight: 250,
                                                                    store: store_historial_medidas,
                                                                    columns: [
                                                                        {text: 'Fecha', dataIndex: 'fecha'},
                                                                        {text: 'Hora', dataIndex: 'hora'},
                                                                        {text: 'Clínica', dataIndex: 'clinica'},
                                                                        {text: 'Atiende', dataIndex: 'atiende'},
                                                                        {text: 'Medida', dataIndex: 'medida'},
                                                                        {text: 'Valor', dataIndex: 'valor'},
                                                                        {text: 'Unidad', dataIndex: 'unidad'}
                                                                    ]
                                                                }/*, {
                                                                 xtype: 'grid',
                                                                 title: 'Historial de Citas',
                                                                 maxHeight: 250,
                                                                 store: patientdiagnostichistory_store,
                                                                 columns: [
                                                                 {text: 'Fecha', dataIndex: 'fecha'},
                                                                 {text: 'Hora', dataIndex: 'hora'},
                                                                 {text: 'Clínica', dataIndex: 'clinica'},
                                                                 {text: 'Doctor', dataIndex: 'doctor'},
                                                                 {text: 'Tipo', dataIndex: 'tipo'},
                                                                 {text: 'Observaciones', dataIndex: 'observaciones'}
                                                                 ]
                                                                 }*/
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