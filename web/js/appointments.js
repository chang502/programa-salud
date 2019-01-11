Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();


Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        padding: '5 5 5 5',
        defaults: {
            padding: '5 15 5 15'
        },
        items: [
            appointmentsfortoday_panel,
            appointmentsforthefuture_panel
        ]
    });
});