import axios from '../utils/axiosCutomize';

const postCreateNewUser = (email, password, username, role, image) => {
    // FormData send file to server
    // submit data
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('username', username);
    data.append('role', role);
    data.append('userImage', image);
    return axios.post('api/v1/participant', data);
}

const getAllUsers = () => {
    return axios.get('api/v1/participant/all');
}

export { 
    postCreateNewUser,
    getAllUsers
};