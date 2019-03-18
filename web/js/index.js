/* global store_citas_de_hoy, Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'index_clinica',
        //width: 900,
        items: [
            createAppointmentsForTodayPanel({collapsible:true}),
            createScheduleAppointmentPanel({
                collapsible: true,
                afterSuccess: function(){
                    store_citas_de_hoy.load();
                }
            })
        ]
    });
});