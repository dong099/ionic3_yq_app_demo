
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import { AutoCompleteService } from '../components/auto-comp-util/auto-complete.service';


@Injectable()
export class AutoCompleteProvider implements AutoCompleteService {
  labelAttribute = "name";

  constructor(private http:Http) {

  }
  getResults(keyword:string) {
    //from server
    // return this.http.get("https://restcountries.eu/rest/v1/name/"+keyword)
    //   .map(
    //     result =>
    //     {
    //       return result.json()
    //         .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
    //     });

    //local json
    return this.http.get("assets/data/city.json")
        .map(
            result =>
            {
              return result.json()
                .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
            });



  }

}