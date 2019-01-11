
var patientmeasurehistory_store = Ext.create('Ext.data.Store', {
    fields: ['fecha','hora','clinica','doctor','medida','valor','unidad'],
    data: [
        {'fecha':'28/07/2018', 'hora': '11:15', 'clinica': 'Clínica 1', 'doctor': 'Doctor 1', 'medida': 'Peso', 'valor': 160, 'unidad': 'Libras'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'medida': 'Text', 'valor': 'Text', 'unidad': 'Text'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'medida': 'Text', 'valor': 'Text', 'unidad': 'Text'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'medida': 'Text', 'valor': 'Text', 'unidad': 'Text'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'medida': 'Text', 'valor': 'Text', 'unidad': 'Text'}
    ]
});


var patientdiagnostichistory_store = Ext.create('Ext.data.Store', {
    fields: ['fecha','hora','clinica','doctor','tipo','observaciones'],
    data: [
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'tipo': 'Text', 'observaciones': 'Text'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'tipo': 'Text', 'observaciones': 'Text'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'tipo': 'Text', 'observaciones': 'Text'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'tipo': 'Text', 'observaciones': 'Text'},
        {'fecha':'Text', 'hora': 'Text', 'clinica': 'Text', 'doctor': 'Text', 'tipo': 'Text', 'observaciones': 'Text'}
    ]
});
