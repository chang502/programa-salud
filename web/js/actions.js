/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.require([
   'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var clinicas = Ext.create('Ext.data.Store', {
    fields: ['abbr', 'name'],
    data: [
        {"idUsuario": "clinica1", "nombre": "Clínica 1"},
        {"idUsuario": "clinica2", "nombre": "Clínica 2"},
        {"idUsuario": "clinica3", "nombre": "Clínica 3"},
        {"idUsuario": "clinica4", "nombre": "Clínica 4"}
    ]
});


var tiposDato = Ext.create('Ext.data.Store', {
    fields: ['abbr', 'name'],
    data: [
        {"tipoDato": "Entero", "idTipoDato": 1},
        {"tipoDato": "Decimal", "idTipoDato": 2},
        {"tipoDato": "Texto", "idTipoDato": 3},
        {"tipoDato": "Fecha", "idTipoDato": 4}
    ]
});



function editRec(rec) {
    Ext.create('Ext.window.Window', {
        title: 'Editar Registro',
        //height: 400,
        //width: 580,
        padding: '5 5 5 5',
        defaults: {
            padding: '5 15 5 15'
        },
        modal: true,
        buttons: [
            {text: 'Aceptar'},
            {text: 'Cancelar', handler: function () {
                    this.up('window').close();
                }}
        ],
        items: [
            {
                xtype: 'textfield',
                width: 300,
                fieldLabel: 'Nombre'
            }, {
                xtype: 'textfield',
                width: 300,
                fieldLabel: 'Ubicación'
            }, {
                xtype: 'textareafield',
                grow: true,
                name: 'descripcion',
                fieldLabel: 'Descripción'
            }
        ]
    }).show();
}


function deleteRec(rec) {
    Ext.Msg.show({
        title: 'Eliminar Registro',
        message: '¿Está seguro de eliminar el registro?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn === 'yes') {
                console.log('Yes pressed');
            } else if (btn === 'no') {
                console.log('No pressed');
            } else {
                console.log('Cancel pressed');
            }
        }
    });
}

Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Acción',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                items: [
                    {
                        xtype: 'textfield',
                        width: 300,
                        fieldLabel: 'Nombre'
                    }, {
                        xtype: 'container',
                        width: 330,
                        pack: 'end',
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Crear',
                                anchor: '-50%'
                            }
                        ]
                    }
                ]
            }, {
                xtype: 'fieldset',
                title: 'Acciones',
                items: [{
                        xtype: 'grid',
                        store: {
                            fields: ['nombre'],
                            data: [
                                {'nombre': 'Text'},
                                {'nombre': 'Text'},
                                {'nombre': 'Text'},
                                {'nombre': 'Text'}
                            ]
                        },

                        columns: [
                            {text: 'Nombre', dataIndex: 'nombre', width: 150},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('Nombre');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('Nombre');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ],
                        maxHeight: 150
                    }
                ]
            }
        ]
    });
});


