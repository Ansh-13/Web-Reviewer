export function isNULL(data:any) : boolean{
    if(data == null) return true;
    return false;
}

export function hasValue(data:string) : boolean{
    if(data == null || data === '') return false;
    return true;
}

export function appropiateLength(data:string,max:number,min:number) : boolean {
    if(data.length < min || data.length > max) return true;
    return false;
}