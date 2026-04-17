/**
 * Sensor Service
 * Wrapper for the Ayurvedic Plant Model backend sensor endpoints
 */

const BASE_URL = "/api";

export const sensorService = {
    /**
     * Fetch latest herb-drying chamber data (NPK)
     */
    async getHerbqData() {
        try {
            const response = await fetch(`${BASE_URL}/herbq/sensordata`);
            if (response.status === 404) return { ok: false, pending: true };
            if (!response.ok) throw new Error("Sensor disconnected");
            const json = await response.json();
            const payload = json.data || json; // Handle both nested and flat responses
            return {
                ok: true,
                data: {
                    nitrogen: payload.nitrogen,
                    phosphorus: payload.phosphorus,
                    potassium: payload.potassium,
                    moisture: payload.moisture,
                    timestamp: payload.timestamp
                }
            };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    },

    /**
     * Fetch latest dry-storage room data (Temp, Humidity, Light)
     */
    async getDryStorageData() {
        try {
            const response = await fetch(`${BASE_URL}/drystore/sensordata`);
            if (response.status === 404) return { ok: false, pending: true };
            if (!response.ok) throw new Error("Sensor disconnected");
            const json = await response.json();
            const payload = json.data || json; // Handle both nested and flat responses
            return {
                ok: true,
                data: {
                    interiorTemperature: payload.interiorTemperature,
                    interiorHumidity: payload.interiorHumidity,
                    exteriorTemperature: payload.exteriorTemperature,
                    exteriorHumidity: payload.exteriorHumidity,
                    isSufficientLight: payload.isSufficientLight,
                    timestamp: payload.timestamp
                }
            };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    },

    /**
     * Check connection to the main backend
     */
    async checkBackend() {
        try {
            const res = await fetch(`${BASE_URL}/routes`);
            return res.ok;
        } catch {
            return false;
        }
    }
};
