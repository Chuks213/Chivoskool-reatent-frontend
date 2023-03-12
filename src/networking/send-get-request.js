import {getUserToken} from '../components/host-master';

export default async function doGet(url, isFinalRespRaw){
    console.log("GET URL: " + url);
    const userToken = getUserToken();
    let headers = {}
    if(userToken) headers["Authorization"] = `Bearer ${userToken}`;
    try{
        let response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        if(response.status == 401) return {
            errorMessage: "Oops! You need to be logged in to perform this action"
        };
        let responseToJson = !isFinalRespRaw ? await response.json() : response;
        console.log("Response gotten (GET) is: ", responseToJson);
        return responseToJson;
    }catch(ex){
        console.log(ex);
        return null;
    }
}