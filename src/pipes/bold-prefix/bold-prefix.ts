// import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the BoldPrefixPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
 

import { PipeTransform, Pipe } from '@angular/core';

/**
 * bolds the beggining of the matching string in the item
 */
@Pipe({
    name: 'boldprefix'
})
// @Injectable()
export class BoldPrefix implements PipeTransform {
    transform(value: string, keyword: string): any {
        if (!keyword) return value;
        let escaped_keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return value.replace(new RegExp(escaped_keyword, 'gi'), function(str) { return str.bold(); });
    }
}
