var patienthistory_panel = Ext.create({
    xtype: 'form',
    //renderTo: 'main-container',
    //width: 900,
    padding: '5 5 5 5',
    defaults: {
        padding: '5 15 5 15'
    },
    items: [
        {
            xtype: 'fieldset',
            title: 'Historial',
            collapsible: true,
            //collapsed: true,
            padding: '5 5 5 5',
            defaults: {
                padding: '5 15 5 15'
            },
            items: [
                {
                    xtype: 'grid',
                    title: 'Historial de Medidas',
                    maxHeight: 250,
                    store: patientmeasurehistory_store,
                    columns: [
                        {text: 'Fecha', dataIndex: 'fecha'},
                        {text: 'Hora', dataIndex: 'hora'},
                        {text: 'Clínica', dataIndex: 'clinica'},
                        {text: 'Doctor', dataIndex: 'doctor'},
                        {text: 'Medida', dataIndex: 'medida'},
                        {text: 'Valor', dataIndex: 'valor'},
                        {text: 'Unidad', dataIndex: 'unidad'}
                    ]
                }, {
                    xtype: 'grid',
                    title: 'Historial de Citas',
                    maxHeight: 250,
                    store: patientdiagnostichistory_store,
                    columns: [
                        {text: 'Fecha', dataIndex: 'fecha'},
                        {text: 'Hora', dataIndex: 'hora'},
                        {text: 'Clínica', dataIndex: 'clinica'},
                        {text: 'Doctor', dataIndex: 'doctor'},
                        {text: 'Tipo', dataIndex: 'tipo'},
                        {text: 'Observaciones', dataIndex: 'observaciones'}
                    ]
                }
            ]
        }
    ]
});