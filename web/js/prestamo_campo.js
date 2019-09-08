Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();


var store_tipo_documento = Ext.create('Ext.data.Store', {
    fields: ['id_tipo_documento', 'nombre'],
    data: [{'id_tipo_documento': 1, 'nombre': 'Registro Academico'},
        {'id_tipo_documento': 2, 'nombre': 'DPI'}]});




var store_prestamoscampo = Ext.create('Ext.data.Store', {
    fields: ['id_prestamo_campo', 'id_persona', 'fecha_prestamo',  'observacion', 'telefono'],
    proxy: {
        type: 'ajax',
        url: 'controller/prestamo/prestamocampo',
        reader: {type: 'json',
            root: 'data'
        }
    }
});



function deleteRec(rec) {    
     Ext.Msg.confirm("Prestamo Campo", "Esta Seguro de Eliminar el Registro?", function (id, value) {
                                            if (id === 'yes') {
                                                               Ext.Ajax.request({
                                        url: 'controller/prestamo/delete_prestamocampo',
                                        method: 'POST',
                                        jsonData: '{"id_prestamo_campo": "' + rec + '"}',
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {                                                                                               
                                                store_prestamoscampo.load();
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
                                        })                                     
}


function editRec(rec) {
    var recordPrestamo = store_prestamos.findRecord('id_prestamo', rec);
    var dataPrestamo = recordPrestamo.data;
    
    var frmEdit = Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        width: 900,
        items: [{
                xtype: 'fieldset',
                layout: {type: 'table', columns: 2},
                padding: '5 5 5 5',
                defaults: {padding: '5 15 5 15'},
                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'hiddenfield',
                        fieldLabel: 'id_prestamo',
                        name: 'id_prestamo',
                        id: 'id_prestamo',
                        value: dataPrestamo.id_prestamo,
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },
                    {xtype: 'textfield',
                        fieldLabel: 'Nombre Estudiante',
                        name: 'nombre_persona',
                        maxLength: 50,
                        value: dataPrestamo.nombre_persona,
                        enforceMaxLength: 50,
                        allowBlank: false
                    }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha',
                            minValue: new Date(),
                            allowBlank: false,
                            name: 'fecha',
                            value: resultado.data[0].fecha
                        }, {
                            xtype: 'timefield',
                            fieldLabel: 'Hora',
                            allowBlank: false,
                            format: 'H:i',
                            minValue: '06:00',
                            maxValue: '20:00',
                            increment: 30,
                            name: 'hora',
                            value: resultado.data[0].hora
                        },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Observaciones',
                        name: 'observacion',
                        value: dataPrestamo.observacion,
                        maxlength: 4,
                        enforceMaxLength: 4,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Telefono',
                        name: 'telefono',
                        value: dataPrestamo.telefono,
                        maxlength: 4,
                        enforceMaxLength: 4,
                        allowBlank: false
                    }
                ]
            }]
    });

    var vent = Ext.create('Ext.window.Window', {
        id: 'ventDevolver',
        title: 'Devolver Implemento',
        modal: true,
        buttons: [{
                itemid: 'btnDevolver',
                text: 'Devolver',
                enabled: function(){ if (dataPrestamo.fecha_devolucion != null) { return true;} else {return false;}},
                handler: function () {
                    if (frmEdit.isValid()) {
                        var data = frmEdit.getValues();                                                       
                       Ext.Ajax.request({
                                                    url: 'controller/prestamo/devolver',
                                                    method: 'POST',
                                                    jsonData: data,
                                                    success: function (f, g) {
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {                                                                                                                    
                                                            Ext.Msg.show({title: "Guardado", msg: 'Devolucion Guardada', buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                            this.up('window').close();                                                                                                                        
                                                            store_prestamos.load();    
                                                        } else {
                                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                        }
                                                    },
                                                    failure: function (f, g) {
                                                        form.unmask();
                                                        Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                    }
                                                });                        
                                                this.up('window').close();
                    } else {
                        Ext.Msg.alert('Validar', 'Validar campos', Ext.emptyFn);
                    }
                        
                }
            },
            {text: 'Cancelar', handler: function () {
                    this.up('window').close();
                }}],
        items: frmEdit
    }).show();

}



Ext.onReady(function () {
    store_prestamoscampo.load();    
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        width: 900,
        id: 'MyForm',
        items: [{
                xtype: 'fieldset',
                title: 'Prestamo Campo de Futbol',
                layout: {type: 'table', columns: 2},
                padding: '5 5 5 5',
                defaults: {padding: '5 15 5 15'},
                buttonAlign: 'right',
                items: [
                    getPersonTextBox({panelConfig: {colspan: 2}}),
                    {
                        xtype: 'hiddenfield',
                        fieldLabel: 'Id Prestamo',
                        name: 'id_prestamo',
                        id: 'id_prestamo',
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },
                    {xtype: 'hiddenfield',
                        fieldLabel: 'id_persona',
                        name: 'id_persona',
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    }, {xtype: 'textfield',
                        fieldLabel: 'Observaciones: ',
                        name: 'observacion',
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    }
                    , {xtype: 'textfield',
                        fieldLabel: 'Telefono: ',
                        name: 'telefono',
                        maxLength: 12,
                        enforceMaxLength: 50,
                        allowBlank: false
                    }, {
                            xtype: 'datefield',
                            fieldLabel: 'Fecha',
                            minValue: new Date(),
                            allowBlank: false,
                            name: 'fecha_prestamo'                            
                        }, {
                            xtype: 'timefield',
                            fieldLabel: 'Hora',
                            allowBlank: false,
                            format: 'H:i',
                            minValue: '06:00',
                            maxValue: '20:00',
                            increment: 60,
                            name: 'hora'                            
                        },
                    {
                        xtype: 'container',
                        pack: 'end',
                        colspan: 2,
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [{
                                xtype: 'button',
                                text: 'Guardar',
                                anchor: '-50%',
                                handler: function () {
                                    //var form = Ext.getCmp('MyForm').getForm();
                                     var form = this.up('form');                                    
                                    //if (form.isValid()) {
                                    if (true) {

                                        Ext.Msg.confirm("Desea Guardar?", "Esta Seguro?", function (id, value) {
                                            if (id === 'yes') {
                                                var data = form.getValues();                                                 
                                                data.id_persona = form.items.items[0].items.items[0].items.items[0].value;
                                                Ext.Ajax.request({
                                                    url: 'controller/prestamo/create_prestamocampo',
                                                    method: 'POST',
                                                    jsonData: data,
                                                    success: function (f, g) {
                                                        var resultado = eval('(' + f.responseText + ')');
                                                        if (resultado.success) {
                                                            store_prestamoscampo.load();
                                                            form.reset();
                                                        } else {
                                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                        }
                                                    },
                                                    failure: function (f, g) {
                                                        form.unmask();
                                                        Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                    }
                                                });
                                                Ext.Msg.show({title: "Guardado", msg: 'Guardado Exitosamente', buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                            }
                                        })
                                    } else {
                                        Ext.Msg.alert('Validar', 'Validar campos', Ext.emptyFn);
                                    }
                                }
                            }, {
                                xtype: 'button',
                                text: 'Limpiar',
                                anchor: '-50%',
                                handler: function () {
                                    var form = this.up('form');
                                    form.reset();
                                }
                            }]
                    }, {
                        xtype: 'fieldset',
                        title: 'Prestamos Recientes',
                        colspan: 2,
                        items: [{
                                xtype: 'grid',
                                store: store_prestamoscampo,
                                maxHeight: 250,
                                columns: [
                                    {text: 'Id Prestamo', dataIndex: 'id_prestamo_campo', width: 100},                                    
                                    {text: 'Estudiante', dataIndex: 'nombre_persona', width: 150},
                                    {text: 'Fecha', dataIndex: 'fecha_prestamo', width: 150},                                   
                                    {text: 'Telefono', dataIndex: 'telefono', width: 150},                                   
                                    {text: 'Observacion', dataIndex: 'observacion', width: 150},                                                                       
                                    {
                                        xtype: 'actioncolumn',
                                        text: 'Acciones',
                                        width: 100,
                                        items: [{
                                                xtype: 'button',
                                                icon: 'images/icons/delete.png',
                                                tooltip: 'Eliminar',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_prestamo_campo');
                                                    deleteRec(rec);
                                                }
                                            }]
                                    }
                                ]
                            }]
                    }
                ]
            }]
    });
});