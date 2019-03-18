/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var store_clinicas_usuario = Ext.create('Ext.data.Store', {
    fields: ["id_clinica", "nombre", "ubicacion", "descripcion"],
    proxy: {
        type: 'ajax',
        url: 'controller/userclinics',
        reader: {type: 'json',
            root: 'data'
        }
    }
});




var store_doctores_usuario = Ext.create('Ext.data.Store', {
    fields: ['id_doctor', 'nombre_completo'],
    proxy: {
        type: 'ajax',
        url: 'controller/userdoctors',
        reader: {type: 'json',
            root: 'data'
        }
    }
});



function createScheduleAppointmentPanel(conf) {

    if (conf===undefined){
        conf={afterSuccess: function(){}};
    }

    if(!conf.hasOwnProperty('collapsible')){
        conf.collapsible = false;
    }
    
    var scheduleappointment_panel = Ext.create({
        xtype: 'form',
        //renderTo: 'main-container',
        //width: 900,
        defaultButton: 'doCreate',
        referenceHolder: true,
        items: [
            {
                xtype: 'fieldset',
                title: 'Programar Cita',
                collapsible: conf.collapsible,
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                buttonAlign: 'right',
                items: [
                    getPersonTextBox({
                        panelConfig: {
                            colspan: 2,
                            width: 610
                        }
                    }),
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Correo',
                        vtype: 'email',
                        colspan: 2,
                        emptyText: 'Escriba una dirección correo si desea utilizar una diferente',
                        width: 580,
                        name: 'email',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Clínica',
                        store: store_clinicas_usuario,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_clinica',
                        allowBlank: false,
                        name: 'id_clinica'
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Doctor',
                        store: store_doctores_usuario,
                        queryMode: 'local',
                        displayField: 'nombre_completo',
                        valueField: 'id_doctor',
                        allowBlank: false,
                        name: 'id_doctor'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha',
                        minValue: new Date(),
                        allowBlank: false,
                        name: 'fecha'
                    }, {
                        xtype: 'timefield',
                        fieldLabel: 'Hora',
                        allowBlank: false,
                        format: 'H:i',
                        minValue: '06:00',
                        maxValue: '20:00',
                        increment: 30,
                        name: 'hora'
                    }, {
                        xtype: 'textarea',
                        colspan: 2,
                        fieldLabel: 'Síntoma',
                        width: 580,
                        allowBlank: false,
                        name: 'sintoma',
                        maxLength: 500,
                        enforceMaxLength: true
                    },
                    {
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
                                text: 'Crear',
                                reference: 'doCreate',
                                anchor: '-50%',
                                handler: function () {
                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        form.mask("Espere");
                                        var data = form.getValues();
                                        
                                        //adding hiddenfield value
                                        data.id_persona=form.items.items[0].items.items[0].items.items[0].value;
                                        
                                        Ext.Ajax.request({
                                            url: 'controller/createappointment',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                form.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.items.items[0].items.items[0].items.items[0].value=undefined;
                                                    form.reset();
                                                    conf.afterSuccess();
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
    });

    store_clinicas_usuario.load(function (records, operation, success) {
        //console.log('loaded records');
    });

    store_doctores_usuario.load(function (records, operation, success) {
        /*window.console.log(records);
         window.console.log(operation);
         window.console.log(success);*/
    });



    /*
     scheduleappointment_panel.items.items[0].items.items[0].items.items[1].getEl().on('change', function () {
     alert('foo');
     });*/

    scheduleappointment_panel.items.items[0].items.items[0].items.items[1].on('change', function (tfld, newValue, oldValue, eOpts) {
        //window.console.log(tfld.ownerCt.items.items[0]);
        if(newValue==='')return;
        data={};
        data.id_persona=tfld.ownerCt.items.items[0].value;
        if(data.id_persona!==+undefined || data.id_persona!==''){
            Ext.Ajax.request({
                url: 'controller/personemail',
                method: 'POST',
                jsonData: data,
                success: function (f, g) {
                    var resultado = eval('(' + f.responseText + ')');
                    if (resultado.success) {
                        scheduleappointment_panel.items.items[0].items.items[1].setValue(resultado.data[0].email);
                    } else {
                        //frmEdit.unmask();
                        Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                },
                failure: function (f, g) {
                    //frmEdit.unmask();
                    Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                }
            });
        }
    })





    return scheduleappointment_panel;
}
