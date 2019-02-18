/* global store_citas_de_hoy, Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            createAppointmentsForTodayPanel({}),
            createScheduleAppointmentPanel({
                afterSuccess: function(){
                    store_citas_de_hoy.load();
                }
            })
        ]
    });
});