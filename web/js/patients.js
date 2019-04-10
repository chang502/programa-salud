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




var store_personas = Ext.create('Ext.data.Store', {
    fields: ['id_persona', 'nombre', 'fecha_nacimiento', 'telefono', 'email', 'identificacion'],
    proxy: {
        type: 'ajax',
        enablePaging: true,
        url: 'controller/searchpersons',
        method: 'POST',
        pageSize: 10,
        reader: {type: 'json',
            root: 'data',
            totalProperty: 'rows'
        }

    }
});


var store_tipo_persona = Ext.create('Ext.data.Store', {
    fields: ['id', 'value'],
    data: [
        {"id": 'ESTUDIANTE', "value": "Estudiante"},
        {"id": 'TRABAJADOR', "value": "Trajabador"},
        {"id": 'TODOS', "value": "Todo"}
    ]
});










Ext.onReady(function () {
    var frmPpal = Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [

            {
                xtype: 'fieldset',
                title: 'Parámetros de Búsqueda',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: 'Tipo Persona',
                        store: store_tipo_persona,
                        queryMode: 'local',
                        displayField: 'value',
                        //forceSelection: true,
                        validateOnChange: true,
                        valueField: 'id',
                        name: 'tipo_persona',
                        allowBlank: false,
                        listeners: {
                            /*afterrender: function(comp, eOpts){
                             comp.focus();
                             },*/
                            /*focus: function () {
                                this.expand();
                            },*/
                            validate: function () {
                                if (this.disabled || this.validateValue(this.processValue(this.getRawValue()))) {
                                    this.clearInvalid();
                                    window.console.log('validating!');
                                    return true;
                                }
                                return false;
                            },
                            select: function (comp, eOpts) {
                                var emptytext = comp.getValue();
                                if (emptytext === 'ESTUDIANTE') {
                                    comp.ownerCt.items.items[1].setEmptyText('Carnet');
                                } else if (emptytext === 'TRABAJADOR') {
                                    comp.ownerCt.items.items[1].setEmptyText('CUI');
                                }
                                if (emptytext === 'TODOS') {
                                    comp.ownerCt.items.items[1].setEmptyText('Nombre o ID');
                                }
                                //comp.ownerCt.items.items[1].focus();
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Identificación',
                        emptyText: 'Identificación',
                        submitEmptyText: false,
                        name: 'identificacion',
                        maxLength: 13,
                        selectOnFocus: true,
                        enforceMaxLength: true,
                        allowBlank: false,
                        listeners: {
                            specialkey: function (f, e) {
                                if (e.getKey() === e.ENTER) {
                                    f.ownerCt.items.items[2].click();
                                }
                            }
                        }
                    }, {
                        xtype: 'button',
                        colspan: 2,
                        margin: '0 15 5 0',
                        style: {
                            "float": "right"
                        },
                        text: 'Buscar',
                        //reference: 'doCreate',
                        anchor: '-50%',
                        handler: function () {



                            var form = this.up('form');

                            if (!form.isValid()) {
                            } else {
                                form.mask("Espere");
                                var data = form.getValues();
                                store_personas.load({
                                    params: data,
                                    method: 'POST',
                                    callback: function (records, operation, success) {
                                        form.unmask();
                                        var responseText = JSON.parse(operation._response.responseText);
                                        if (responseText.rows > 0) {

                                            /*var grid=form.items.items[0].items.items[1].items.items[0];
                                             grid.focus();
                                             if (grid.getSelectionModel().hasSelection()) {
                                             var row = grid.getSelectionModel().select(0);
                                             
                                             row.highlight();
                                             }*/
                                        }
                                    }
                                });
                            }
                        }
                    }
                ]
            }
            ,
            {
                xtype: 'fieldset',
                title: 'Resultados de la Búsqueda',
                layout: 'fit',
                height: 290,
                items: [
                    {
                        xtype: 'grid',
                        store: store_personas,
                        maxHeight: 300,
                        bbar: [
                            '-'
                        ],
                        selModel: {
                            selType: 'rowmodel', // rowmodel is the default selection model
                            mode: 'SINGLE' // Allows selection of multiple rows
                        },
                        listeners: {
                            rowbodykeyup: function (view, rowBodyEl, e, eOpts) {
                                //window.console.log(vent);
                                if (e.getKey() === e.ENTER) {
                                    //window.console.log(vent);
                                }
                            }
                        },
                        columns: [
                            {hidden: true, dataIndex: 'id_persona'},
                            {text: 'Nombre', dataIndex: 'nombre_completo', width: 320},
                            {text: 'Fecha Nac', dataIndex: 'fecha_nacimiento', width: 95},
                            {text: 'Correo', dataIndex: 'email', width: 270},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/vcard.png',
                                        tooltip: 'Ver ficha del paciente',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_persona');
                                            location.href = 'patient.jsp?paciente=' + rec;
                                        }
                                    }]
                            }
                        ]
                    }
                ]
            }

        ]
    });
});