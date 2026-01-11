import axios from "axios";
const BACKEND_URL ='https://githubtrendingrepos.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:3000'
export async function getBackendURL(): Promise<string> {
    const deployed = BACKEND_URL;
    if (deployed) {
        try {
            await axios.get(`${deployed}/health`, { timeout: 3000 })
            return deployed
        } catch {
            // silently fall through
        }
    }

    const local = LOCAL_BACKEND_URL;
    return local;
}