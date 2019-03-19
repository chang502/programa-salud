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
                        fieldLabel: '¿Padece de alguna enfermedar crónica?',
                        emptyText: 'Seleccione',
                        store: store_tipos_enfermedad,
                        matchFieldWidth: false,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_tipo_enfermedad',
                        name: 'id_tipo_enfermedad',
                        colspan: 2,
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
    });
});