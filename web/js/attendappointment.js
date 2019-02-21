/* global Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




Ext.onReady(function () {


    var url_to_redirect = "index.jsp";
    try {
        var txtparams = location.search.substring(1);
        if (txtparams.length > 2) {
            var urlparams = Ext.Object.fromQueryString(txtparams);
            url_to_redirect = urlparams.cita;



            if (urlparams.cita !== undefined || urlparams.cita !== '') {


/////////////





//////////
                /*Ext.Ajax.request({
                 url: 'controller/appointments/' + urlparams.cita,
                 success: function (f, opts) {
                 var resultado = eval('(' + f.responseText + ')');
                 if (resultado.success) {*/
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
                                            }
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

                                            if (linea.tipo_dato === 'Texto') {
                                                panelMedidas.add({
                                                    xtype: 'textfield',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true'
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
                                                    allowDecimals: false
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
                                                    step: 0.01
                                                });
                                            } else if (linea.tipo_dato === 'Fecha') {
                                                panelMedidas.add({
                                                    xtype: 'datefield',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true'
                                                });
                                            } else if (linea.tipo_dato === 'Sí/No') {
                                                panelMedidas.add({
                                                    xtype: 'checkbox',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio === 'true'
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
                                                    anchor: '-50%'
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
                                                ,
                                                panelMedidas
                                                        ,
                                                {
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
                                                            minHeight: 200,
                                                            height: 200,
                                                            grow: true,
                                                            minGrow: 200
                                                        }, {
                                                            xtype: 'combo',
                                                            fieldLabel: 'Acción',
                                                            store: {
                                                                fields: ['id', 'nombre'],
                                                                data: [
                                                                    {"id": "tipo1", "nombre": "Laboratorios"},
                                                                    {"id": "tipo2", "nombre": "Medicamentos"},
                                                                    {"id": "tipo3", "nombre": "Acción 3"}
                                                                ]
                                                            },
                                                            queryMode: 'local',
                                                            displayField: 'nombre',
                                                            valueField: 'id'
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
                                                                    anchor: '-50%'
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
                                                },
                                                patienthistory_panel
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