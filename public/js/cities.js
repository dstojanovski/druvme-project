
export const getCities = async (country) => {
    var city = {
    si: [
        { id: 'optionId', value: 'ljubljana', text: 'Ljubljana' },
        { id: 'optionId', value: 'maribor', text: 'Maribor' },
        { id: 'optionId', value: 'nova-gorica', text: 'Nova Gorica' },
        { id: 'optionId', value: 'novo-mesto', text: 'Novo Mesto' },
        { id: 'optionId', value: 'koper', text: 'Koper' },
        { id: 'optionId', value: 'piran', text: 'Piran' },
        { id: 'optionId', value: 'izola', text: 'Izola' },
        { id: 'optionId', value: 'celje', text: 'Celje' },
        { id: 'optionId', value: 'velenje', text: 'Velenje' },
        { id: 'optionId', value: 'murska-subota', text: 'Murska Subota' },

    ],
    cro: [
        { id: 'optionId', value: 'zagreb', text: 'Zagreb' },
        { id: 'optionId', value: 'split', text: 'Split' },
        { id: 'optionId', value: 'rijeka', text: 'Rijeka' },
        { id: 'optionId', value: 'osijek', text: 'Osijek' },
        { id: 'optionId', value: 'zadar', text: 'Zadar' },
        { id: 'optionId', value: 'dubrovnik', text: 'Dubrovnik'},
    ],
    bih: [
        { id: 'optionId', value: 'Rijeka', text: 'South Atlantic' },
        { id: 'optionId', value: 'div-6', text: 'East South Central' },
        { id: 'optionId', value: 'div-7', text: 'West South Central' }
    ],
    mkd: [
        { id: 'optionId', value: 'div-8', text: 'Mountain' },
        { id: 'optionId', value: 'div-9', text: 'Pacific' }
    ]
}

return city[country];
}