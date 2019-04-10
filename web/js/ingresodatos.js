/* global store_citas_de_hoy, Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




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
    store_tipos_enfermedad.load();
    store_disciplinas_persona.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'index_ingresodatos',
        defaultButton: 'doCreate',
        referenceHolder: true,
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Ingreso de datos para personal docente y administrativo',
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15',
                    selectOnFocus: true,
                },
                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'CUI',
                        maxLength: 13,
                        enforceMaxLength: true,
                        allowBlank: false,
                        minLength: 13,
                        emptyText: 'CUI',
                        name: 'cui',
                        maskRe: /[0-9]/
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha nacimiento',
                        name: 'fecha_nacimiento',
                        emptyText: 'dd/mm/aaaa',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Teléfono',
                        name: 'telefono',
                        emptyText: 'Teléfono',
                        maxLength: 8,
                        enforceMaxLength: true,
                        allowBlank: false,
                        minLength: 8,
                        maskRe: /[0-9]/
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Teléfono de emergencia',
                        name: 'telefono_emergencia',
                        emptyText: 'Teléfono de emergencia',
                        maxLength: 8,
                        enforceMaxLength: true,
                        allowBlank: false,
                        minLength: 8,
                        maskRe: /[0-9]/
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Contacto de emergencia',
                        emptyText: 'Contacto de emergencia',
                        allowBlank: false,
                        width: 580,
                        colspan: 2,
                        name: 'contacto_emergencia'
                    }, {
                        xtype: 'numberfield',
                        allowDecimals: false,
                        allowBlank: false,
                        hideTrigger: true,
                        minValue: 1,
                        maxValue: 999,
                        emptyText: 'Peso en libras',
                        name: 'peso',
                        fieldLabel: 'Peso'
                    }, {
                        xtype: 'numberfield',
                        allowDecimals: true,
                        decimalSeparator: '.',
                        allowBlank: false,
                        hideTrigger: true,
                        minValue: 0.1,
                        name: 'estatura',
                        maxValue: 3,
                        step: 0.01,
                        emptyText: 'Estatura en metros',
                        fieldLabel: 'Estatura'
                    }, {
                        xtype: 'checkbox',
                        name: 'flag_tiene_discapacidad',
                        inputValue: '1',
                        fieldLabel: '¿Posee cualidades especiales?',
                        listeners: {
                            change: function (cbox, newValue, oldValue, eOpts) {
                                cbox.ownerCt.items.items[8].allowBlank = !newValue;
                                cbox.ownerCt.items.items[8].clearValue();
                                cbox.ownerCt.items.items[8].validate();
                                cbox.ownerCt.items.items[8].setDisabled(!newValue);
                            }
                        }
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Tipo',
                        store: store_capacidades_especiales,
                        disabled: true,
                        emptyText: 'Seleccione',
                        queryMode: 'local',
                        displayField: 'nombre',
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
                                text: 'Limpiar',
                                width: 75,
                                handler: function () {
                                    var form = this.up('form');
                                    form.reset();
                                    form.items.items[0].focus();
                                }
                            }, {
                                xtype: 'button',
                                text: 'Crear',
                                margin: '0 0 0 15',
                                width: 75,
                                reference: 'doCreate',
                                anchor: '-50%',
                                handler: function () {

                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        form.mask("Espere");
                                        var data = form.getValues();

                                        //setting id_persona
                                        //data.id_persona = form.items.items[0].items.items[2].items.items[0].value;


                                        if (!data.hasOwnProperty('flag_tiene_discapacidad')) {
                                            data.flag_tiene_discapacidad = '0';
                                        }

                                        Ext.Ajax.request({
                                            url: 'controller/saveemployeeextrainfo',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    form.unmask();
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    //store_usuarios.load();
                                                } else {
                                                    form.unmask();
                                                    if (resultado.message === 'No se encontraron registros') {

                                                        var frmCrear_datosPersonales = Ext.create({
                                                            xtype: 'fieldset',
                                                            title: 'Datos Personales',
                                                            padding: '5 5 5 5',
                                                            defaults: {
                                                                padding: '5 15 5 15',
                                                                selectOnFocus: true
                                                            },
                                                            layout: {
                                                                type: 'table',
                                                                columns: 2
                                                            },
                                                            items: [
                                                                {
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
                                                                    value: data.fecha_nacimiento,
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
                                                                    value: data.telefono,
                                                                    minLength: 8,
                                                                    maskRe: /[0-9]/
                                                                }
                                                            ]
                                                        });

                                                        var frmCrear_identificacion = Ext.create({
                                                            xtype: 'fieldset',
                                                            title: 'Identificaciones',
                                                            //collapsed: true,
                                                            //disabled: true,

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
                                                                            value: data.cui,
                                                                            minLength: 13,
                                                                            maskRe: /[0-9]/
                                                                        }, {
                                                                            xtype: 'textfield',
                                                                            fieldLabel: 'Registro Académico',
                                                                            name: 'carnet',
                                                                            maxLength: 9,
                                                                            minLengthText: 'Ingrese un registro académico válido',
                                                                            enforceMaxLength: true,
                                                                            minLength: 7,
                                                                            maskRe: /[0-9]/
                                                                        }, {
                                                                            xtype: 'textfield',
                                                                            fieldLabel: 'Número de Orientación Vocacional',
                                                                            name: 'nov',
                                                                            maxLength: 10,
                                                                            minLengthText: 'Ingrese un número de orientación vocacional válido',
                                                                            enforceMaxLength: true,
                                                                            minLength: 10,
                                                                            maskRe: /[0-9]/
                                                                        }, {
                                                                            xtype: 'textfield',
                                                                            fieldLabel: 'Registro Personal',
                                                                            minLengthText: 'Ingrese un número de registro de personal válido',
                                                                            name: 'regpersonal',
                                                                            maxLength: 9,
                                                                            enforceMaxLength: true,
                                                                            minLength: 9,
                                                                            maskRe: /[0-9]/
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        });



                                                        var frmCrear = Ext.create({
                                                            xtype: 'form',
                                                            padding: '10 10 10 10',
                                                            items: [
                                                                frmCrear_datosPersonales,
                                                                frmCrear_identificacion

                                                            ]
                                                        });

                                                        var vent = Ext.create('Ext.window.Window', {
                                                            title: 'Crear registro',
                                                            modal: true,
                                                            layout: 'fit',
                                                            width: 820,
                                                            height: 546,
                                                            closeAction: 'destroy',
                                                            buttons: [
                                                                {
                                                                    text: 'Aceptar',
                                                                    handler: function () {

                                                                        //console.log(activeTab);
                                                                        //var data = activeTab.getValues();
                                                                        //activeTab.mask("Espere");
                                                                        if (!frmCrear.isValid()) {
                                                                        } else {
                                                                            var data_per = frmCrear.getValues();
                                                                            Ext.Ajax.request({
                                                                                url: 'controller/createperson',
                                                                                method: 'POST',
                                                                                jsonData: data_per,
                                                                                success: function (f, g) {
                                                                                    var resultado = eval('(' + f.responseText + ')');

                                                                                    if (resultado.success) {
                                                                                        //activeTab.unmask();
                                                                                        vent.close();



                                                                                    } else {
                                                                                        //activeTab.unmask();
                                                                                        Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                                                    }
                                                                                },
                                                                                failure: function (f, g) {
                                                                                    //activeTab.unmask();
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
                                                            items: [
                                                                frmCrear
                                                            ]
                                                        }).show();



                                                    } else {

                                                        Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                    }
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
    });
});