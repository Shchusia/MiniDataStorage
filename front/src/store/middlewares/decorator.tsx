import {BaseRequest} from "../../types/apiTypes";
import {DataDecoratorRequest, ResponseBaseApi, RequestBaseApi} from "../apiFunctions/types";
import {StatusExecutionRequest} from "../../types/typesSystem";
import {refreshFunction} from "../apiFunctions/authFynctions";
import {getHeaders, update} from "../../utils/utils";




export async function decoratorAuth(
    data: DataDecoratorRequest
) : Promise<ResponseBaseApi> {
    //@ts-ignore
    const result: ResponseBaseApi = await data.functionToExecute(data.functionData)
    if (result.status === StatusExecutionRequest.REJECT
        && result?.error?.detail === "Signature verification failed") {
        const resultRefresh:ResponseBaseApi = await refreshFunction({headers: getHeaders(data.refreshToken)})
        if(resultRefresh.status === StatusExecutionRequest.REJECT){
            return resultRefresh
        }
        const newData:RequestBaseApi = {...data.functionData}
        const oldHeader: object = data.functionData?.headers || {}
        //@ts-ignore
        const newHeader =update(oldHeader, getHeaders(resultRefresh.authData?.accessToken as string))
        newData.headers = newHeader
        const result: ResponseBaseApi = await data.functionToExecute(newData)
        return result


    }
    return result


};

async function refresh() {

}