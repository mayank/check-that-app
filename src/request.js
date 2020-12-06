import axios from 'axios';

const url = 'http://localhost:8000';

export const getServiceList = async () => {
    try {
        const response = await axios(url + '/service');
        return response.data;
    }
    catch(err) {
        
    }
};

export const getServiceMetrics = async (serviceId) => {
    try {
        const response = await axios.post(url + '/service/info', {
            serviceId,
        });
        return response.data;
    }
    catch(err) {
        
    }
};