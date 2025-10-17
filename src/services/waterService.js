import pool from "../../config/db.js";
import moment from "moment-timezone";
import waterModel from '../model/waterModel.js';

const waterService = {
    verificaWater: async ({ wlevel, state, pump_aux, wvol }) => {

        const hour = moment().tz("America/Sao_Paulo").format('YYYY-MM-DD HH:mm:ss');

        function getBitEstate(value, bit) {
            return ((value >> bit) & 1) === 1;
        }

        console.log(state);

        // Obter os estados dos bits
        const pump1 = getBitEstate(state, 4);
        const pump2 = getBitEstate(state, 5);
        const protect_pump1 = getBitEstate(state, 6);
        const protect_pump2 = getBitEstate(state, 7);
        const a1_contact_pump1 = getBitEstate(state, 2);
        const a1_contact_pump2 = getBitEstate(state, 3);

        console.log({ hour, pump1, pump2, protect_pump1, a1_contact_pump2 });

        // Campos opcionais com valores padrão
        const computedPumpAux = typeof pump_aux === 'boolean' ? pump_aux : false;
        const computedWvol = typeof wvol === 'number' ? wvol : null;

        const water = await waterModel.createWater({
            hour,
            wlevel,
            pump1,
            pump2,
            protect_pump1,
            protect_pump2,
            a1_contact_pump1,
            a1_contact_pump2,
            pump_aux: computedPumpAux,
            wvol: computedWvol,
            state
        });

        return water;
    }
};

export default waterService;