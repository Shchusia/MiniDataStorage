export const isTrue = (val: any): boolean => (val ? val.toString() === 'true' : false);


export const getHeaders = (token:string): object => ({"Authorization": `Bearer ${token}`})


//@ts-ignore
export function update(obj: object/*, …*/):object {
    for (var i=1; i<arguments.length; i++) {
        for (var prop in arguments[i]) {
            var val = arguments[i][prop];
            if (typeof val == "object") // this also applies to arrays or null!
                //@ts-ignore
                update(obj[prop], val);
            else
                //@ts-ignore
                obj[prop] = val;
        }
    }
    return obj;
}