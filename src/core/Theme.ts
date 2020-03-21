import { DynamicValue } from 'react-native-dark-mode'

export default {
    White: "#FFF",
    Black: "#000",
    Primary: "#003089",
    Border: new DynamicValue('#BBBBBB', '#666666'),

    Text: {
        Body: new DynamicValue('#000000', '#FFFFFF'),
        Placeholder: new DynamicValue('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.5)'),
    },

    Background: {
        Body: new DynamicValue('#FFFFFF', '#000000'),
    }
}