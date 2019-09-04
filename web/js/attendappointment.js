/* global Ext, patienthistory_panel */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();


var store_medicamento = Ext.create('Ext.data.Store', {
    fields: ['id_medicamento', 'nombre', 'presentacion', 'activo', 'existencia'],
    proxy: {
        type: 'ajax',
        url: 'controller/medicaments',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_cita_medicamento = Ext.create('Ext.data.Store', {
    fields: ['id_cita', 'id', 'nombre', 'presentacion', 'cantidad', 'observaciones'],
    proxy: {
        type: 'ajax',
        url: 'controller/inventory',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_materiales = Ext.create('Ext.data.Store', {
    fields: ['id_material', 'nombre', 'descripcion', 'activo', 'existencia'],
    proxy: {
        type: 'ajax',
        url: 'controller/materials',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_cita_materiales = Ext.create('Ext.data.Store', {
    fields: ['id_cita', 'id', 'nombre', 'descripcion','observaciones'],
    proxy: {
        type: 'ajax',
        url: 'controller/inventory',
        reader: {type: 'json',
            root: 'data'
        }
    }
});





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



var store_disciplinas_persona = Ext.create('Ext.data.Store', {
    fields: ['id_disciplina_persona', 'nombre'],
    proxy: {
        type: 'ajax',
        url: 'controller/persondisciplines',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_tipos_enfermedad = Ext.create('Ext.data.Store', {
    fields: ['id_tipo_enfermedad', 'nombre'],
    proxy: {
        type: 'ajax',
        url: 'controller/diseasetypes',
        reader: {type: 'json',
            root: 'data'
        }
    }
});



Ext.onReady(function () {

    store_capacidades_especiales.load();
    store_tipos_enfermedad.load();
    store_disciplinas_persona.load();

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
                        url: 'controller/clinicactionsactionsappt/' + urlparams.cita,
                        reader: {type: 'json',
                            root: 'data'
                        }
                    }
                });

                store_historial_medidas.load();
                store_historial_acciones.load({params: {id_cita: urlparams.cita}});
                store_historial_citas.load({params: {id_cita: urlparams.cita}});
                store_acciones.load({params: {id_cita: urlparams.cita}});

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
                                                    allowBlank: false,
                                                    maxLength: 8,
                                                    enforceMaxLength: true,
                                                    minLength: 8,
                                                    maskRe: /[0-9]/
                                                }, {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Contacto de emergencia',
                                                    allowBlank: false,
                                                    maxLength: 255,
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
                                                    disabled: true,
                                                    valueField: 'id_tipo_discapacidad',
                                                    name: 'id_tipo_discapacidad',
                                                    allowBlank: false
                                                }, {
                                                    xtype: 'combo',
                                                    fieldLabel: '¿Pertenece a alguna federación o asociación deportiva?',
                                                    emptyText: 'Seleccione',
                                                    store: store_disciplinas_persona,
                                                    matchFieldWidth: false,
                                                    queryMode: 'local',
                                                    displayField: 'nombre',
                                                    valueField: 'id_disciplina_persona',
                                                    name: 'id_disciplina_persona',
                                                    //colspan: 2,
                                                    allowBlank: false
                                                }, {
                                                    xtype: 'combo',
                                                    fieldLabel: '¿Padece de alguna enfermedar crónica?',
                                                    emptyText: 'Seleccione',
                                                    store: store_tipos_enfermedad,
                                                    matchFieldWidth: false,
                                                    queryMode: 'local',
                                                    displayField: 'nombre',
                                                    valueField: 'id_tipo_enfermedad',
                                                    name: 'id_tipo_enfermedad',
                                                    //colspan: 2,
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

                                                                    data.id_persona = panelInfoAdicional.items.items[7].value;



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
                                                                                    jsonData: '{"id_persona": "' + data.id_persona + '"}',
                                                                                    success: function (f, opts) {
                                                                                        var resultado_moreinfo2 = eval('(' + f.responseText + ')');
                                                                                        if (resultado_moreinfo2.success) {
                                                                                            panelInfoAdicional.items.items[0].setValue(resultado_moreinfo2.data[0].telefono_emergencia);
                                                                                            panelInfoAdicional.items.items[1].setValue(resultado_moreinfo2.data[0].contacto_emergencia);
                                                                                            panelInfoAdicional.items.items[2].setValue(resultado_moreinfo2.data[0].flag_tiene_discapacidad);
                                                                                            panelInfoAdicional.items.items[3].setValue(resultado_moreinfo2.data[0].id_tipo_discapacidad);
                                                                                            panelInfoAdicional.items.items[4].setValue(resultado_moreinfo2.data[0].id_disciplina_persona);
                                                                                            panelInfoAdicional.items.items[5].setValue(resultado_moreinfo2.data[0].id_tipo_enfermedad);
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
                                                    if (resultado_moreinfo.data.length > 0) {
                                                        panelInfoAdicional.items.items[0].setValue(resultado_moreinfo.data[0].telefono_emergencia);
                                                        panelInfoAdicional.items.items[1].setValue(resultado_moreinfo.data[0].contacto_emergencia);
                                                        panelInfoAdicional.items.items[2].setValue(resultado_moreinfo.data[0].flag_tiene_discapacidad);
                                                        panelInfoAdicional.items.items[3].setValue(resultado_moreinfo.data[0].id_tipo_discapacidad);
                                                        panelInfoAdicional.items.items[4].setValue(resultado_moreinfo.data[0].id_disciplina_persona);
                                                        panelInfoAdicional.items.items[5].setValue(resultado_moreinfo.data[0].id_tipo_enfermedad);
                                                    }

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
                                                    allowBlank: linea.obligatorio !== 'true',
                                                    name: 'valor'
                                                });
                                            } else if (linea.tipo_dato === 'Entero') {
                                                panelMedidas.add({
                                                    xtype: 'numberfield',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio !== 'true',
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
                                                    allowBlank: linea.obligatorio !== 'true',
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
                                                    allowBlank: linea.obligatorio !== 'true',
                                                    name: 'valor'
                                                });
                                            } else if (linea.tipo_dato === 'Sí/No') {
                                                //window.console.log(linea.obligatorio !== 'true');
                                                panelMedidas.add({
                                                    xtype: 'checkbox',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio !== 'true',
                                                    name: 'valor'
                                                });
                                            } else if (linea.tipo_dato === 'Lista') {
                                                var itemlist = linea.unidad_medida.split(',');
                                                var storedata = [];
                                                for (var j = 0; j < itemlist.length; j++) {
                                                    storedata.push({id: itemlist[j], nombre: itemlist[j]});
                                                }

                                                panelMedidas.add({
                                                    xtype: 'combo',
                                                    fieldLabel: linea.fieldLabel,
                                                    allowBlank: linea.obligatorio !== 'true',
                                                    store: Ext.create('Ext.data.Store', {
                                                        fields: ['id', 'nombre'],
                                                        data: storedata
                                                    }),
                                                    name: 'valor',
                                                    displayField: 'id',
                                                    valueField: 'nombre',
                                                    forceSelection: true
                                                });
                                            }

                                            panelMedidas.add({
                                                xtype: 'label',
                                                text: linea.tipo_dato === 'Lista' ? '' : linea.unidad_medida
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
                                                },
                                                //FISH MEDICAMENTOS
                                                {
                                                    xtype: 'form',
                                                    id: 'formMedicamentos',
                                                    items: [

                                                        {
                                                            xtype: 'fieldset',
                                                            title: 'Medicamentos',
                                                            id: 'fieldsetMedicamentos',
                                                            colspan: 2,
                                                            items: [{
                                                                    xtype: 'combo',
                                                                    fieldLabel: 'Medicamento',
                                                                    id: 'cmbMedicamento',
                                                                    store: store_medicamento,
                                                                    enableKeyEvents: true,
                                                                    displayField: 'nombre',
                                                                    valueField: 'id_medicamento',
                                                                    typeAhead: true,
                                                                    typeAheadDelay: 100,
                                                                    triggerAction: 'all',
                                                                    mode: 'local',
                                                                    minChars: 3,
                                                                    width: 500,
                                                                    selectOnFocus: true,
                                                                    applyTo: 'search',
                                                                    tpl: Ext.create('Ext.XTemplate',
                                                                            '<ul class="x-list-plain"><tpl for=".">',
                                                                            '<li role="option" class="x-boundlist-item">{nombre} - {presentacion}</li>',
                                                                            '</tpl></ul>'
                                                                            ),
                                                                    // template for the content inside text field
                                                                    displayTpl: Ext.create('Ext.XTemplate',
                                                                            '<tpl for=".">',
                                                                            '{nombre} - {presentacion}',
                                                                            '</tpl>'
                                                                            ),
                                                                    listeners: {
                                                                        keyup: function (el, type) {
                                                                            store_medicamento.filter('nombre', el.getValue(), true, false, false);
                                                                        }
                                                                    }
                                                                },
                                                                {xtype: 'textfield',
                                                                    fieldLabel: 'Cantidad',
                                                                    name: 'cantidad',
                                                                    id: 'cantidadMedicamento',
                                                                    maxLength: 3,
                                                                    enforceMaxLength: 3,
                                                                    allowBlank: false
                                                                },
                                                                {xtype: 'textfield',
                                                                    fieldLabel: 'Observaciones',
                                                                    name: 'observaciones',
                                                                    id: 'observacionesMedicamento',
                                                                    allowBlank: false
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    name: 'btnAgregarMedicamento',
                                                                    text: 'Agregar',
                                                                    handler: function () {
                                                                        //var myForm2 = Ext.getCmp('MyForm').getForm();
                                                                        //var myForm2 = this.up('form');                              
                                                                        var myForm2 = Ext.getCmp('formMedicamentos').getForm();
                                                                        var data = myForm2.getValues();
                                                                        var id_medicamento = myForm2.findField('cmbMedicamento').getValue();
                                                                        var medicamentoSelected = store_medicamento.findRecord('id_medicamento', id_medicamento);
                                                                        var nombre_medicamento = medicamentoSelected.data.nombre;
                                                                        var presentacion = medicamentoSelected.data.presentacion;
                                                                        var cantidad = myForm2.findField('cantidadMedicamento').getValue();
                                                                        var observaciones = myForm2.findField('observacionesMedicamento').getValue();
                                                                        var existencia  = medicamentoSelected.data.existencia;
                                                                        if (cantidad > existencia){
                                                                            alert('Cantidad excede a existencia.');
                                                                            return false;
                                                                        }
                                                                        var dataAgregar = {
                                                                            'id_cita': urlparams.cita,
                                                                            'id': id_medicamento,
                                                                            'nombre': nombre_medicamento,
                                                                            'presentacion': presentacion,
                                                                            'cantidad': cantidad,
                                                                            'observaciones': observaciones
                                                                        };
                                                                        var dataAgregarPost = {
                                                                            'id_cita': urlparams.cita,
                                                                            'id_medicamento': id_medicamento,
                                                                            'cantidad': cantidad,
                                                                            'observaciones': observaciones
                                                                        };


                                                                        Ext.Ajax.request({
                                                                            url: 'controller/appointment/addmedicamento',
                                                                            method: 'POST',
                                                                            jsonData: dataAgregarPost,
                                                                            success: function (f, g) {
                                                                                var resultado = eval('(' + f.responseText + ')');
                                                                                if (resultado.message === 'Registro ingresado correctamente') {


                                                                                } else {
                                                                                    Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                }
                                                                            },
                                                                            failure: function (f, g) {
                                                                                form.unmask();
                                                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                            }
                                                                        });

                                                                        store_cita_medicamento.add(dataAgregar);
                                                                        myForm2.reset();

                                                                    }
                                                                },
                                                                {
                                                                    xtype: 'fieldset',
                                                                    id: 'fieldsetGrid',
                                                                    title: 'Detalle Medicamentos',
                                                                    colspan: 2,
                                                                    items: [{
                                                                            xtype: 'grid',
                                                                            id: 'gridDetalle',
                                                                            store: store_cita_medicamento,
                                                                            maxHeight: 250,
                                                                            columns: [
                                                                                {text: 'Id', dataIndex: 'id', width: 100},
                                                                                {text: 'Nombre', dataIndex: 'nombre', width: 150},
                                                                                {text: 'Presentacion', dataIndex: 'presentacion', width: 150},
                                                                                {text: 'Cantidad', dataIndex: 'cantidad', width: 150},
                                                                                {text: 'Observaciones', dataIndex: 'observaciones', width: 150},
                                                                                {
                                                                                    xtype: 'actioncolumn',
                                                                                    text: 'Acciones',
                                                                                    width: 100,
                                                                                    items: [{
                                                                                            icon: 'images/icons/cross.png',
                                                                                            tooltip: 'Eliminar registro',
                                                                                            handler: function (grid, rowIndex, colIndex) {
                                                                                                var rec = grid.getStore().getAt(rowIndex).get('id');

                                                                                                Ext.Ajax.request({
                                                                                                    url: 'controller/appointment/deletemedicamento',
                                                                                                    method: 'POST',
                                                                                                    jsonData: '{"id_cita": "' + urlparams.cita + '", "id_medicamento": "' + rec + '"}',
                                                                                                    success: function (f, g) {
                                                                                                        var resultado = eval('(' + f.responseText + ')');
                                                                                                        if (resultado.success) {
                                                                                                            store_cita_medicamento.remove(store_cita_medicamento.findRecord('id', rec));
                                                                                                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                                                                                                        } else {
                                                                                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                        }
                                                                                                    },
                                                                                                    failure: function (f, g) {
                                                                                                        Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                    }
                                                                                                });

                                                                                            }
                                                                                        }]
                                                                                }
                                                                            ]
                                                                        }]
                                                                }
                                                            ], },
                                                    ]
                                                },

                                                //FISH  MEDICAMENTOS

                                                //FISH MATERIALES
                                                {
                                                 xtype: 'form',
                                                    id: 'formMateriales',
                                                    items: [
                                                
                                                {
                        xtype: 'fieldset',
                        title: 'Material',
                        id: 'fieldsetMateriales',
                        colspan: 2,
                        items: [{
                                xtype: 'combo',
                                fieldLabel: 'Material',
                                id: 'cmbMaterial',
                                store: store_materiales,
                                enableKeyEvents: true,
                                displayField: 'nombre',
                                valueField: 'id_material',
                                typeAhead: true,
                                typeAheadDelay: 100,
                                triggerAction: 'all',
                                mode: 'local',
                                minChars: 3,
                                width: 300,
                                selectOnFocus: true,
                                applyTo: 'search',
                                listeners: {
                                    keyup: function (el, type) {
                                        store_materiales.filter('nombre', el.getValue(), true, false, false);
                                    }
                                }
                            },
                            {xtype: 'textfield',
                                fieldLabel: 'Cantidad',
                                name: 'cantidad',
                                id: 'cantidadMaterial',
                                maxLength: 3,
                                enforceMaxLength: 3,
                                allowBlank: false
                            },
                            {xtype: 'textfield',
                                                                    fieldLabel: 'Observaciones',
                                                                    name: 'observaciones',
                                                                    id: 'observacionesMaterial',
                                                                    allowBlank: false
                                                                },
                            {
                                xtype: 'button',
                                name: 'btnAgregarMaterial',
                                text: 'Agregar',
                                handler: function () {
                                    //var myForm2 = Ext.getCmp('MyForm').getForm();
                                    //var myForm2 = this.up('form');                              
                                    var myForm2 = Ext.getCmp('formMateriales').getForm();
                                    var data = myForm2.getValues();
                                    var id_material = myForm2.findField('cmbMaterial').getValue();
                                    var nombre_material = myForm2.findField('cmbMaterial').getRawValue();
                                    var cantidad = myForm2.findField('cantidadMaterial').getValue();
                                    var observaciones = myForm2.findField('observacionesMaterial').getValue();
                                    var materialSelected = store_materiales.findRecord('id_material', id_material);
                                    var existencia  = materialSelected.data.existencia;
                                                                        if (cantidad > existencia){
                                                                            alert('Cantidad excede a existencia.');
                                                                            return false;
                                                                        }
                                    var dataAgregar = {
                                       'id_cita': urlparams.cita,
                                        'id': id_material,
                                        'nombre': nombre_material,
                                        'cantidad': cantidad,
                                        'tipo_inventario' : 1,
                                        'observaciones': observaciones
                                    };
                                     var dataAgregarPost = {
                                        'id_cita': urlparams.cita,
                                        'id_material': id_material,                                        
                                        'cantidad': cantidad,
                                        'observaciones': observaciones
                                    };
                                    
                                    
                                             Ext.Ajax.request({
                                        url: 'controller/appointment/addmaterial',
                                        method: 'POST',
                                        jsonData: dataAgregarPost,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');                                                                                       
                                            if (resultado.message    === 'Registro ingresado correctamente') { 
                                                
                                              
                                            } else {                                                
                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {
                                            form.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                        });
                                    store_cita_materiales.add(dataAgregar);
                                    /* myForm2.findField('cmbMaterial').setValue('');
                                   myForm2.findField('cantidadMaterial').setValue('');                                   */
                                    myForm2.reset();

                                }
                            },
                            {
                                                                    xtype: 'fieldset',
                                                                    id: 'fieldsetGridMateriales',
                                                                    title: 'Detalle Materiales',
                                                                    colspan: 2,
                                                                    items: [{
                                                                            xtype: 'grid',
                                                                            id: 'gridDetalleMateriales',
                                                                            store: store_cita_materiales,
                                                                            maxHeight: 250,
                                                                            columns: [
                                                                                {text: 'Id', dataIndex: 'id', width: 100},
                                                                                {text: 'Nombre', dataIndex: 'nombre', width: 150},                                                                                
                                                                                {text: 'Cantidad', dataIndex: 'cantidad', width: 150},
                                                                                {text: 'Observaciones', dataIndex: 'observaciones', width: 150},
                                                                                {
                                                                                    xtype: 'actioncolumn',
                                                                                    text: 'Acciones',
                                                                                    width: 100,
                                                                                    items: [{
                                                                                            icon: 'images/icons/cross.png',
                                                                                            tooltip: 'Eliminar registro',
                                                                                            handler: function (grid, rowIndex, colIndex) {
                                                                                                var rec = grid.getStore().getAt(rowIndex).get('id');

                                                                                                Ext.Ajax.request({
                                                                                                    url: 'controller/appointment/deletematerial',
                                                                                                    method: 'POST',
                                                                                                    jsonData: '{"id_cita": "' + urlparams.cita + '", "id_material": "' + rec + '"}',
                                                                                                    success: function (f, g) {
                                                                                                        var resultado = eval('(' + f.responseText + ')');
                                                                                                        if (resultado.success) {
                                                                                                            store_cita_materiales.remove(store_cita_materiales.findRecord('id', rec));
                                                                                                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                                                                                                        } else {
                                                                                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                        }
                                                                                                    },
                                                                                                    failure: function (f, g) {
                                                                                                        Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                                    }
                                                                                                });

                                                                                            }
                                                                                        }]
                                                                                }
                                                                            ]
                                                                        }]
                                                                }
                        ], },
                    
                     ]
                                                },

                                                //FISH MATERIALES



                                                , {
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
                                                                                                store_historial_acciones.load({params: {id_cita: urlparams.cita}});
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
                                                            handler: function () {
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
                                                        }, {
                                                            xtype: 'button',
                                                            margin: '0 0 0 15',
                                                            text: 'Cancelar Cita',
                                                            anchor: '-50%',
                                                            handler: function () {
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
                                                                                                        jsonData: '{"id_persona_medida": "' + rec + '","id_cita": "' + urlparams.cita + '"}',
                                                                                                        success: function (f, opts) {
                                                                                                            var resultadoEliminaReg = eval('(' + f.responseText + ')');
                                                                                                            if (resultadoEliminaReg.success) {
                                                                                                                Ext.Msg.show({title: "Operación exitosa", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                                                store_historial_medidas.load({params: {id_cita: urlparams.cita}});
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
                                                                                                        jsonData: '{"id_cita_accion": "' + rec + '","id_cita": "' + urlparams.cita + '"}',
                                                                                                        success: function (f, opts) {
                                                                                                            var resultadoEliminaReg = eval('(' + f.responseText + ')');
                                                                                                            if (resultadoEliminaReg.success) {
                                                                                                                Ext.Msg.show({title: "Operación exitosa", msg: resultadoEliminaReg.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                                                                                store_historial_acciones.load({params: {id_cita: urlparams.cita}});
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