import {retriveItem, removeItem, storeItem} from "../data/custom-storage";
import getData from '../networking/send-get-request';
import {getUserDetailsUrl} from '../networking/external-url';

const tokenId = "reatent-auth-tk";

const getUserToken = () => {
    let userToken = retriveItem(tokenId);
    if(!userToken) userToken = retriveItem(tokenId, true);
    return !userToken ? null : userToken;
}

const storeUserToken = (userToken, temp) => {
    if(temp) removeItem(tokenId);
    removeItem(tokenId, temp);
    storeItem(tokenId, userToken, false, temp);
}

const fetchCurrentUser = async () => {
    let userResponse = await getData(getUserDetailsUrl);
    if(userResponse) {
        if(userResponse.responseCode == 99) return userResponse.responseData;
    }
    return null;
}

const logout = () => {
    removeItem(tokenId);
    removeItem(tokenId, true);
}

export {
    getUserToken, 
    storeUserToken,
    fetchCurrentUser,
    logout
};