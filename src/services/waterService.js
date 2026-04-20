import moment from "moment-timezone";
import waterModel from '../model/waterModel.js';
import logger from "../config/logger.js";

const decodeStateBits = (state) => {
    const getBitEstate = (value, bit) => ((value >> bit) & 1) === 1;

    return {
        pump1: getBitEstate(state, 4),
        pump2: getBitEstate(state, 5),
        protect_pump1: getBitEstate(state, 6),
        protect_pump2: getBitEstate(state, 7),
        a1_contact_pump1: getBitEstate(state, 2),
        a1_contact_pump2: getBitEstate(state, 3),
    };
};

const waterService = {
    verificaWater: async ({ wlevel, state, pump_aux, wvol }) => {

        const hour = moment().tz("America/Sao_Paulo").format('YYYY-MM-DD HH:mm:ss');

        logger.debug({ state }, "Estado recebido para decodificação");

        // Obter os estados dos bits
        const {
            pump1,
            pump2,
            protect_pump1,
            protect_pump2,
            a1_contact_pump1,
            a1_contact_pump2,
        } = decodeStateBits(state);

        logger.debug(
            { hour, pump1, pump2, protect_pump1, a1_contact_pump2 },
            "Bits de estado decodificados"
        );

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
export { decodeStateBits };