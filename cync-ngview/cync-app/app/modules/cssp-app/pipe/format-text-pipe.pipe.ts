import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTextPipe'
})
export class FormatTextPipePipe implements PipeTransform {

  transform(val:string, params:string[]): string {
    var splitVal:string[];   
    var username:string[];  
    
    //Removing image/file path from comments
    //val = val.replace(/\[(.*?)\]/, "");  //Removing between [] value  
    val = val.replace(/\[\^(.*?)\]/, "");  //Removing between [] value starting with '[^' 
    val = val.replace(/\!(.*?)\!/, "");  //Removing between () value

    if(val != undefined) { 
    username = val.split(' (Cync user) added a comment - ');     
    if(username[1] != undefined) {
      splitVal = username[1].split('\n');
    } else {
      splitVal = val.split('\n');
    }
    //splitVal = val.split('\n');          
    if(val[0] == '!' || val[0] == '[') {
        return null;
    } else {          
    if(splitVal[splitVal.length - 1][0] == '!' || splitVal[splitVal.length - 1][0] == '[' || splitVal[splitVal.length - 1][0] == ' '){
        splitVal.pop();
    }              
        return splitVal.join('\n');        
    } 
   }
  }

}
