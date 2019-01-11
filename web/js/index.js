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
            appointmentsfortoday_panel,
            scheduleappointment_panel
        ]
    });
});