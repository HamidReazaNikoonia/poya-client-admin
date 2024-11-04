import axios from "axios";
const BASE_URL = 'http://localhost:9000/v1'

export const getTimeSlots = async ({date}) => {
    const res = await axios.get(`${BASE_URL}/admin/time-slot?date=${date}`)
    return res
}

export const updateTimeSlot = async (bodtYequest) => {
    const res = await axios.put(`${BASE_URL}/admin/time-slot`, bodtYequest)
    return res
}
