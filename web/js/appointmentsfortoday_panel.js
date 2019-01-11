/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var appointmentsfortoday_panel = Ext.create({
    xtype: 'form',
    //renderTo: 'main-container',
    //width: 900,
    
    items: [
        {
            xtype: 'fieldset',
            title: 'Citas de Hoy',
            items: [{
                    xtype: 'grid',
                    store: appointment_store,
                    columns: [
                        {text: 'Hora', dataIndex: 'hora'},
                        {text: 'Tipo Paciente', dataIndex: 'tipoPersona'},
                        {text: 'Identificacion', dataIndex: 'idPersona'},
                        {text: 'Doctor', dataIndex: 'doctor'},
                        {text: 'Síntoma', dataIndex: 'sintoma'},
                        {
                            xtype: 'actioncolumn',
                            text: 'Acciones',
                            defaults: {padding: '5 15 5 15',cls:'margin-right: 8px;'},
                            width: 100,
                            items: [
                                {
                                    icon: 'images/icons/pill_go.png',
                                    tooltip: 'Atender cita',
                                    xtype: 'templatecolumn',
                                    tpl: '<a href="google.com" target="_blank">aaa</a>',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                        //editRec(rec);
                                    }
                                },{
                                    icon: 'images/icons/vcard.png',
                                    tooltip: 'Ver ficha del paciente',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                        //editRec(rec);
                                    }
                                },{
                                    icon: 'images/icons/page_edit.png',
                                    tooltip: 'Editar registro',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                        editRec(rec);
                                    }
                                }, {
                                    icon: 'images/icons/cross.png',
                                    tooltip: 'Eliminar registro',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                        deleteRec(rec);
                                    }
                                }]
                        }
                    ],
                    maxHeight: 250
                }
            ]
        }
    ]
});