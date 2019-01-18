/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var store_personas = Ext.create('Ext.data.Store', {
    fields: ['id_persona', 'nombre', 'fecha_nacimiento', 'telefono', 'email', 'identificacion'],
    proxy: {
        type: 'ajax',
        url: 'controller/searchpersons',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var store_tipos_documento = Ext.create('Ext.data.Store', {
    fields: ['id_tipo_documento', 'nombre'],
    proxy: {
        type: 'ajax',
        url: 'controller/documenttypes',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


function createTooltip(message, component, isField) {
    if (!isField) {
        component.clearTip();
    }

    var tip = window.Ext.create('Ext.tip.ToolTip', {
        // no target, no hover
        target: component,
        html: message,
        autoShow: true,
        autoScroll: true,
        dismissDelay: 10000,
        focusOnToFront: true,
        autoHide: true,
        //closable: true,
        stateful: false,
        listeners: {
            // the tip is hidden by default, not closed
            //beforeclose: function () {
            hide: function () {
                tip.destroy();
                tip = null;
            }
        }
    });

    // show immediately
    tip.show();
}

function getCreatePersonPanel() {
    store_tipos_documento.load();


    return Ext.create({
        xtype: 'form',
        layout: {
            type: 'table',
            columns: 2
        },
        /*padding: '5 5 5 5',*/
        defaults: {
            padding: '5 15 5 15'
        },
        items: [

            {
                xtype: 'textfield',
                fieldLabel: 'Primer nombre',
                name: 'primer_nombre',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: 'Segundo nombre',
                name: 'segundo_nombre'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Primer apellido',
                name: 'primer_apellido',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: 'Segundo apellido',
                name: 'segundo_apellido'
            }, {
                xtype: 'datefield',
                fieldLabel: 'Fecha nacimiento',
                name: 'fecha_nacimiento',
                emptyText: 'dd/mm/aaaa',
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
                minLength: 8,
                maskRe: /[0-9]/
            }
        ]
    });
}




function getCreatePerson() {



    return [

        {
            xtype: 'textfield',
            fieldLabel: 'Primer nombre',
            name: 'primer_nombre',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: 'Segundo nombre',
            name: 'segundo_nombre'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Primer apellido',
            name: 'primer_apellido',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: 'Segundo apellido',
            name: 'segundo_apellido'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Fecha nacimiento',
            name: 'fecha_nacimiento',
            emptyText: 'dd/mm/aaaa',
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
            minLength: 8,
            maskRe: /[0-9]/
        }
    ];
}


function getPersonTextBox(conf) {
    var panel = Ext.create({
        xtype: 'panel',
        layout: 'hbox',
        items: [
            {
                xtpye: 'hidden',
                name: 'id_persona'
            }, {
                xtype: 'textfield',
                fieldLabel: conf.hasOwnProperty('fieldLabel') ? conf['fieldLabel'] : 'Persona',
                readOnly: true,
                listeners: {
                    specialkey: function (f, e, eopts) {
                        if (e.getKey() == e.ENTER) {
                            //mostrarVentanaSeleciconMedico(f.ownerCt.items.items[1],f.ownerCt.items.items[2]);
                            showPersonaDialog(f.ownerCt.items.items[0], f.ownerCt.items.items[1]);
                        }
                    }
                }
            }, {
                xtype: 'button',
                cls: 'plainButtonCls',
                icon: 'images/icons/user_go.png',
                tooltip: 'Seleccionar persona',
                focusable: false,
                tabIndex: -1,
                handler: function (button, e) {
                    //mostrarVentanaSeleciconMedico(button.ownerCt.items.items[1], button.ownerCt.items.items[2]);
                    showPersonaDialog(button.ownerCt.items.items[0], button.ownerCt.items.items[1]);
                }
            }
        ]
    });
    return panel;
}

function showPersonaDialog(hiddenfield, textfield) {
    if (hiddenfield.value !== undefined) {

    } else {


        var frmBuscaRegistro = Ext.create({
            xtype: 'form',
            title: 'Buscar Persona',
            padding: '5 5 5 5',
            defaults: {
                padding: '5 15 5 15'
            },
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
                            xtype: 'textfield',
                            fieldLabel: 'Identificación',
                            name: 'identificacion'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Nombres o apellidos',
                            name: 'nombre_completo',
                            maxLength: 203,
                            enforceMaxLength: true
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Teléfono, correo',
                            name: 'telefono_correo',
                            maxLength: 50,
                            enforceMaxLength: true
                        }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha nacimiento',
                            name: 'fecha_nacimiento',
                            emptyText: 'dd/mm/aaaa'
                        }
                        ,

                        {
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
                                    //form.mask("Espere");
                                    var data = form.getValues();
                                    console.log(data);
                                    
                                    store_personas.load({
                                        params: data,
                                        callback: function(records, operation, success){
                                            //form.unmask();
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
                    items: [
                        {
                            xtype: 'grid',
                            store: store_personas,
                            height: 250,
                            width: '100%',
                            columns: [
                                {hidden: true, dataIndex: 'id_persona'},
                                {text: 'Nombre', dataIndex: 'nombre'},
                                {text: 'Fecha Nac', dataIndex: 'fecha_nacimiento'},
                                {text: 'Teléfono', dataIndex: 'telefono'},
                                {text: 'Correo', dataIndex: 'email'}  //, ------------------
                                //{text: 'Identificación', dataIndex: 'identificacion'},
                                /*{
                                    xtype: 'actioncolumn',
                                    text: 'Acciones',
                                    width: 100,
                                    items: [{
                                            icon: 'images/icons/page_edit.png',
                                            tooltip: 'Editar registro',
                                            handler: function (grid, rowIndex, colIndex) {
                                                var rec = grid.getStore().getAt(rowIndex).get('id_bebedero');
                                                editRec(rec);
                                            }
                                        }, {
                                            icon: 'images/icons/cross.png',
                                            tooltip: 'Eliminar registro',
                                            handler: function (grid, rowIndex, colIndex) {
                                                var rec = grid.getStore().getAt(rowIndex).get('id_bebedero');
                                                deleteRec(rec);
                                            }
                                        }]
                                }*/
                            ]
                        }
                    ]
                }
            ]

        });




        var frmCrear_datosPersonales = Ext.create({
            xtype: 'fieldset',
            title: 'Datos Personales',
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
                    xtype: 'textfield',
                    fieldLabel: 'Primer nombre',
                    name: 'primer_nombre',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Segundo nombre',
                    name: 'segundo_nombre'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Primer apellido',
                    name: 'primer_apellido',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Segundo apellido',
                    name: 'segundo_apellido'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Fecha nacimiento',
                    name: 'fecha_nacimiento',
                    emptyText: 'dd/mm/aaaa',
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
                    minLength: 8,
                    maskRe: /[0-9]/
                }
            ]
        });

        var frmCrear_identificacion = Ext.create({
            xtype: 'fieldset',
            title: 'Identificación',
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
                        columns: 3
                    }, items: [
                        {
                            xtype: 'combo',
                            fieldLabel: 'Tipo Id',
                            store: store_tipos_documento,
                            queryMode: 'local',
                            displayField: 'nombre',
                            editable: false,
                            forceSelection: true,
                            valueField: 'id_tipo_documento',
                            listeners: {
                                change: function (cbox, newValue, oldValue, eOpts) {
                                    cbox.allowBlank = false;
                                    cbox.validate();
                                    cbox.ownerCt.items.items[1].allowBlank = false;
                                    cbox.ownerCt.items.items[1].validate();
                                    if (cbox.ownerCt.items.items[1].getValue() != "" && frmCrear_identificacion.items.indexOf(cbox.ownerCt) + 1 == frmCrear_identificacion.items.length) {
                                        add_id();
                                    }
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            colspan: 2,
                            fieldLabel: 'Número',
                            listeners: {
                                change: function (tfield, newValue, oldValue, eOpts) {
                                    if (tfield.getValue() != "") {
                                        tfield.allowBlank = false;
                                        tfield.validate();
                                        tfield.ownerCt.items.items[0].allowBlank = false;
                                        tfield.ownerCt.items.items[0].validate();
                                        if (frmCrear_identificacion.items.indexOf(tfield.ownerCt) + 1 == frmCrear_identificacion.items.length && tfield.ownerCt.items.items[0].isValid()) {
                                            add_id();
                                        }

                                    } else {
                                        tfield.allowBlank = true;
                                        tfield.validate();
                                        tfield.ownerCt.items.items[0].clearValue();
                                        tfield.ownerCt.items.items[0].allowBlank = true;
                                        tfield.ownerCt.items.items[0].validate();
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        });

        function add_id() {
            frmCrear_identificacion.add({
                xtype: 'panel',
                //padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                layout: {
                    type: 'table',
                    columns: 3
                }, items: [
                    {
                        xtype: 'combo',
                        fieldLabel: 'Tipo Id',
                        store: store_tipos_documento,
                        queryMode: 'local',
                        forceSelection: true,
                        disableKeyFilter: true,
                        displayField: 'nombre',
                        valueField: 'id_tipo_documento',
                        listeners: {
                            change: function (cbox, newValue, oldValue, eOpts) {
                                console.log('combo change event');
                                console.log(cbox.getValue());
                                console.log(cbox.getValue() === null);

                                if (cbox.getValue() !== null) {
                                    cbox.allowBlank = false;
                                    cbox.ownerCt.items.items[1].allowBlank = false;
                                    cbox.ownerCt.items.items[1].validate();
                                    if (frmCrear_identificacion.items.indexOf(cbox.ownerCt) + 1 == frmCrear_identificacion.items.length && cbox.ownerCt.items.items[1].getValue() != "") {
                                        add_id();
                                    }
                                } else if (frmCrear_identificacion.items.indexOf(cbox.ownerCt) + 1 == frmCrear_identificacion.items.length) {

                                    if (cbox.ownerCt.items.items[1].getValue() === "") {
                                        cbox.allowBlank = true;
                                    }
                                    cbox.validate();
                                }

                                /*
                                 cbox.allowBlank = !(cbox.getValue() === null && !(cbox.ownerCt.items.items[1].getValue() != "" && frmCrear_identificacion.items.indexOf(cbox.ownerCt) + 1 == frmCrear_identificacion.items.length));
                                 cbox.validate();
                                 cbox.ownerCt.items.items[1].allowBlank = !(cbox.getValue() === null && !(cbox.ownerCt.items.items[1].getValue() != "" && frmCrear_identificacion.items.indexOf(cbox.ownerCt) + 1 == frmCrear_identificacion.items.length));
                                 cbox.ownerCt.items.items[1].validate();
                                 if (cbox.ownerCt.items.items[1].getValue() != "" && frmCrear_identificacion.items.indexOf(cbox.ownerCt) + 1 == frmCrear_identificacion.items.length) {
                                 add_id();
                                 }*/
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Número',
                        listeners: {
                            change: function (tfield, newValue, oldValue, eOpts) {
                                if (tfield.getValue() != "") {
                                    tfield.allowBlank = false;
                                    tfield.validate();
                                    tfield.ownerCt.items.items[0].allowBlank = false;
                                    tfield.ownerCt.items.items[0].validate();
                                    if (frmCrear_identificacion.items.indexOf(tfield.ownerCt) + 1 == frmCrear_identificacion.items.length && tfield.ownerCt.items.items[0].isValid()) {
                                        if (frmCrear_identificacion.items.length == store_tipos_documento.getCount()) {
                                            createTooltip('Ha alcanzado el número máximo de documentos de identificación', tfield.getEl(), true);
                                        } else
                                            add_id();
                                    }

                                } else {
                                    console.log('textfield is empty')
                                    console.log(store_tipos_documento.getCount());
                                    console.log(frmCrear_identificacion.items.indexOf(tfield.ownerCt) + 1 == frmCrear_identificacion.items.length);
                                    tfield.allowBlank = (frmCrear_identificacion.items.indexOf(tfield.ownerCt) + 1 == frmCrear_identificacion.items.length /*&& tfield.ownerCt.items.items[0].isValid()*/);
                                    tfield.clearInvalid();
                                    tfield.reset();
                                    //tfield.ownerCt.items.items[1].validateValue(tfield.ownerCt.items.items[1].getValue());
                                    tfield.ownerCt.items.items[0].clearValue();
                                    //tfield.ownerCt.items.items[0].allowBlank=(frmCrear_identificacion.items.indexOf(tfield.ownerCt)+1 == frmCrear_identificacion.items.length /*&& tfield.ownerCt.items.items[0].isValid()*/);
                                    //tfield.ownerCt.items.items[0].validate();
                                }
                            }
                        }
                    }, {
                        xtype: 'button',
                        //cls: 'plainButtonCls',
                        icon: 'images/icons/delete.png',
                        width: 18,
                        heigth: 18,
                        margin: '0 0 5 0',
                        padding: '0 0 5 0',
                        tooltip: 'Agregar',
                        style: 'background-color:transparent;display:inline !important; border: 1px black;',
                        handler: function (button, event, eOpts) {
                            button.ownerCt.ownerCt.remove(button.ownerCt);
                        }
                    }
                ]
            })
        }




        var frmCrear = Ext.create({
            xtype: 'form',
            title: 'Crear registro',
            padding: '10 10 10 10',
            items: [
                frmCrear_datosPersonales,
                frmCrear_identificacion

            ]
        });

        var tabPanel = Ext.create({
            xtype: 'tabpanel',
            items: [
                frmBuscaRegistro,
                frmCrear

            ]
        });

        var vent = Ext.create('Ext.window.Window', {
            title: 'Seleccionar Persona',
            modal: true,
            buttons: [
                {
                    text: 'Aceptar',
                    handler: function () {
                        /*console.log(tabPanel.getActiveTab());
                        if (!tabPanel.getActiveTab().isValid()) {

                        } else {
                            var data = frmEdit.getValues();
                            frmEdit.mask("Espere");
                            Ext.Ajax.request({
                                url: 'controller/sdsdsdsdsds',
                                method: 'POST',
                                jsonData: data,
                                success: function (f, g) {
                                    var resultado = eval('(' + f.responseText + ')');
                                    if (resultado.success) {
                                        frmEdit.unmask();
                                        vent.close();
                                        store_usuarios.load();
                                        Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                                    } else {
                                        frmEdit.unmask();
                                        Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                    }
                                },
                                failure: function (f, g) {
                                    frmEdit.unmask();
                                    Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                }
                            });
                        }*/
                    }
                },
                {text: 'Cancelar', handler: function () {
                        this.up('window').close();
                    }}
            ],
            items: [
                tabPanel

            ]
        }).show();



    }

}