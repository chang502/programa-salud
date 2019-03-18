
/* global store_citas_futuras, Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var store_citas_de_hoy = Ext.create('Ext.data.Store', {
    fields: ["id_cita", "id_persona", "id_doctor", "id_clinica", 'fecha', 'hora', 'paciente', 'atiende', 'clinica', 'sintoma', 'paso'],
    proxy: {
        type: 'ajax',
        url: 'controller/todaysappointments',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


function createAppointmentsForTodayPanel(conf) {

    store_citas_de_hoy.load();
    if (conf === undefined) {
        
        conf = {afterSuccess: function () {}};
    }

    if(!conf.hasOwnProperty('collapsible')){
        conf.collapsible = false;
    }
    var appointmentsfortoday_panel = Ext.create({
        xtype: 'panel',
        items: [
            {
                xtype: 'fieldset',
                title: 'Citas de Hoy',
                collapsible: conf.collapsible,
                items: [{
                        xtype: 'grid',
                        store: store_citas_de_hoy,
                        height: 250,
                        columns: [
                            {hidden: true, dataIndex: 'id_cita'},
                            {hidden: true, dataIndex: 'id_persona'},
                            {hidden: true, dataIndex: 'id_doctor'},
                            {hidden: true, dataIndex: 'id_clinica'},
                            {hidden: true, dataIndex: 'paso'},
                            /*{text: 'Fecha', dataIndex: 'fecha'},*/
                            {text: 'Hora', dataIndex: 'hora', width: 60},
                            {text: 'Paciente', dataIndex: 'paciente', width: 185},
                            {text: 'Atiende', dataIndex: 'atiende', width: 185},
                            {text: 'Clínica', dataIndex: 'clinica'},
                            {text: 'Síntoma', dataIndex: 'sintoma', width: 205},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                defaults: {padding: '5 15 5 15', cls: 'margin-right: 8px;'},
                                width: 100,
                                items: [
                                    {
                                        icon: 'images/icons/pill_go.png',
                                        tooltip: 'Atender cita',
                                        xtype: 'templatecolumn',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_cita');
                                            var paso = grid.getStore().getAt(rowIndex).get('paso');
                                            if (paso === 'ATENDIENDO') {
                                                location.href = 'attendappointment.jsp?cita=' + rec;
                                            } else {
                                                Ext.Msg.show({
                                                    title: 'Atender Cita',
                                                    message: 'Al atender la cita, quedará registrada la hora de inicio de la misma ¿Desea continuar?',
                                                    buttons: Ext.Msg.YESNO,
                                                    icon: Ext.Msg.QUESTION,
                                                    fn: function (btn) {
                                                        if (btn === 'yes') {
                                                            Ext.Ajax.request({
                                                                url: 'controller/startappointment',
                                                                method: 'POST',
                                                                jsonData: '{"id_cita": "' + rec + '"}',
                                                                success: function (f, opts) {
                                                                    var resultado = eval('(' + f.responseText + ')');
                                                                    if (resultado.success) {
                                                                        location.href = 'attendappointment.jsp?cita=' + rec;
                                                                    } else {
                                                                        Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
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
                                    }, {
                                        icon: 'images/icons/vcard.png',
                                        tooltip: 'Ver ficha del paciente',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_paciente');
                                            location.href = 'patient.jsp?paciente='+rec;
                                        }
                                    }, {
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_cita');
                                            editarCita(rec, function () {
                                                store_citas_futuras.load();
                                                store_citas_de_hoy.load();
                                            });
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_cita');
                                            borrarCita(rec, function () {
                                                store_citas_futuras.load();
                                                store_citas_de_hoy.load();
                                            });
                                        }
                                    }]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    //Ext.apply(appointmentsfortoday_panel,conf);


    return appointmentsfortoday_panel;
}
