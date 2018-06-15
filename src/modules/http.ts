import * as request from 'request';
import { Census } from '@weakenedplayer/census-api';

export class NodeHttp implements Census.RestApiHttp {
    get( url: string ): Promise<any> {
        return new Promise( ( resolve, reject ) => { 
            request( url, ( error, res, body ) => {
                if( error ) {
                    reject( error );
                } 
                resolve( JSON.parse( body ) );
            } );
        } );
    }
}
