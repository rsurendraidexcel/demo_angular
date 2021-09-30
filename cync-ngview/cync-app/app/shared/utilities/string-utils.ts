/**
 * 
 */
export class StringUtils {

    public static isEmptyOrNull(param: string): boolean {
        return !(param != undefined && param != null && param != '' && param.length > 0);
    }
}