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
        method: 'POST',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_tipo_persona = Ext.create('Ext.data.Store', {
    fields: ['id', 'value'],
    data: [
        {"id": 'ESTUDIANTE', "value": "Estudiante"},
        {"id": 'TRABAJADOR', "value": "Personal"},
        {"id": 'TODOS', "value": "Todo"}
    ]
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
    if (conf===undefined){
        conf={};
    }
    var panel = Ext.create({
        xtype: 'panel',
        //border: 1,
        layout: 'hbox',
        //margin: '0 -5 0 -5',
       // padding: '0 10 0 10',
        items: [
            {
                xtpye: 'hiddenfield',
                name: 'id_persona'
            }, {
                xtype: 'textfield',
                name: 'nombre_completo',
                fieldLabel: conf.hasOwnProperty('fieldLabel') ? conf['fieldLabel'] : 'Persona',
                readOnly: true,
                allowBlank: conf.hasOwnProperty('allowBlank') ? conf['fieldLabel'] : false,
                listeners: {
                    specialkey: function (f, e, eopts) {
                        if (e.getKey() == e.ENTER) {
                            //mostrarVentanaSeleciconMedico(f.ownerCt.items.items[1],f.ownerCt.items.items[2]);
                            showPersonaDialog(f.ownerCt.items.items[0], f.ownerCt.items.items[1]);
                        }
                    },
                    afterRender: function(comp, eOpts){
                        window.console.log(comp.getWidth()+" "+comp.ownerCt.getWidth()+" ");
                        //comp.setWidth(comp.ownerCt.getWidth()-25);
                        comp.inputEl.on('dblclick', function() {
                            showPersonaDialog(comp.ownerCt.items.items[0], comp.ownerCt.items.items[1]);
                        });
                    }
                }
            }, {
                xtype: 'button',
                cls: 'plainButtonCls',
                icon: 'images/icons/user_go.png',
                tooltip: 'Seleccionar persona',
                focusable: false,
                tabIndex: -1,
                listeners: {
                    afterRender: function(comp, eOpts){
                        comp.ownerCt.items.items[1].setWidth(comp.ownerCt.getWidth()-comp.getWidth()-10);
                        window.console.log("btn "+comp.getWidth());
                    }
                },
                handler: function (button, e) {
                    //mostrarVentanaSeleciconMedico(button.ownerCt.items.items[1], button.ownerCt.items.items[2]);
                    showPersonaDialog(button.ownerCt.items.items[0], button.ownerCt.items.items[1]);
                }
            }
        ]
    });
    if(conf.hasOwnProperty('panelConfig')){
        Ext.apply(panel, conf.panelConfig);
    }
    
    return panel;
}

function showPersonaDialog(hiddenfield, textfield) {

    //store_personas.load();


    //if (hiddenfield.value !== undefined) {

    //} else {


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
                            afterrender: function(comp, eOpts){
                                comp.focus();
                            },
                            focus: function(){
                                this.expand();
                            },
                            validate : function(){
                                if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
                                    this.clearInvalid();
                                    window.console.log('validating!');
                                    return true;
                                }
                                return false;
                            },
                            select: function(comp, eOpts){
                                comp.ownerCt.items.items[1].focus();
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Identificación',
                        emptyText: 'CUI o Carnet',
                        submitEmptyText: false,
                        name: 'identificacion',
                        allowBlank: false,
                        listeners: {
                            specialkey: function(f,e){
                                if(e.getKey() === e.ENTER){
                                    f.ownerCt.items.items[2].click();
                                }
                            }
                        }
                    },{
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
                                form.ownerCt.mask("Espere");
                                var data = form.getValues();

                                store_personas.load({
                                    params: data,
                                    method: 'POST',
                                    callback: function (records, operation, success) {
                                        form.ownerCt.unmask();
                                        var responseText=JSON.parse(operation._response.responseText);
                                        if(responseText.rows>0){
                                            
                                            var grid=form.ownerCt.items.items[0].items.items[1].items.items[0];
                                            grid.focus();
                                            if (grid.getSelectionModel().hasSelection()) {
                                                var row = grid.getSelectionModel().select(0);
                                                
                                                row.highlight();
                                            }
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
                        maxHeight: 270,
                        selModel: {
                            selType: 'rowmodel', // rowmodel is the default selection model
                            mode: 'SINGLE' // Allows selection of multiple rows
                        },
                        listeners: {
                            rowbodykeyup: function(view, rowBodyEl, e, eOpts){
                                window.console.log(vent);
                                if(e.getKey() === e.ENTER){
                                    window.console.log(vent);
                                }
                            }
                        },
                        columns: [
                            {hidden: true, dataIndex: 'id_persona'},
                            {text: 'Nombre', dataIndex: 'nombre_completo', width: 320},
                            {text: 'Fecha Nac', dataIndex: 'fecha_nacimiento', width: 95},
                            {text: 'Correo', dataIndex: 'email', width: 270}  //, ------------------
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
                        enforceMaxLength: true,
                        minLength: 13,
                        maskRe: /[0-9]/
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Registro Académico',
                        name: 'carnet',
                        maxLength: 9,
                        enforceMaxLength: true,
                        minLength: 7,
                        maskRe: /[0-9]/
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Número de Orientación Vocacional',
                        name: 'nov',
                        maxLength: 10,
                        enforceMaxLength: true,
                        minLength: 10,
                        maskRe: /[0-9]/
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Registro Personal',
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
        title: 'Crear Registro',
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
        layout: 'fit',
        width: 820,
        height: 546,
        closeAction: 'destroy',
        buttons: [
            {
                text: 'Aceptar',
                handler: function () {
                    var activeTab = tabPanel.getActiveTab();
                    if (activeTab.title === 'Buscar Persona') {
                        var grid = activeTab.items.items[1].items.items[0];
                        if (grid.getSelectionModel().hasSelection()) {
                            var row = grid.getSelectionModel().getSelection()[0];
                            //console.log(row.get('id_persona') + ' - ' + row.get('nombre'));
                            hiddenfield.value = row.get('id_persona');
                            textfield.setValue(row.get('nombre_completo'));
                            this.up('window').close();
                        }
                    } else if (activeTab.title === 'Crear Registro') {
                        //console.log(activeTab);
                        var data = activeTab.getValues();
                        activeTab.mask("Espere");
                        Ext.Ajax.request({
                            url: 'controller/createperson',
                            method: 'POST',
                            jsonData: data,
                            success: function (f, g) {
                                var resultado = eval('(' + f.responseText + ')');
                                
                                if (resultado.success) {
                                    activeTab.unmask();
                                    vent.close();
                                    
                                    hiddenfield.value = resultado.payload.id_persona;
                                    textfield.setValue(resultado.payload.nombre_completo);
                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                       
                                } else {
                                    activeTab.unmask();
                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                }
                            },
                            failure: function (f, g) {
                                activeTab.unmask();
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
            tabPanel
//frmBuscaRegistro
        ]
    }).show();



    //}

}