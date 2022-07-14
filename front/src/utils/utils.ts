export const isTrue = (val: any): boolean => (val ? val.toString() === 'true' : false);


export const getHeaders = (token:string) => ({"Authorization": `Bearer ${token}`})

