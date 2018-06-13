import { Observable } from 'rxjs';
import { Census } from '@weakenedplayer/census-api';
import { WebSocketClient } from '@weakenedplayer/websocket-wrapper';

export class NodeWebsocket implements Census.EventStreamWebsocket {
    private ws: WebSocketClient;
    private url: string;
    constructor( environment: string = 'ps2', serviceId: string = 'example' ) {
        this.url = 'wss://push.planetside2.com/streaming?environment=' + environment + '&service-id=s:' + serviceId;
        this.ws = new WebSocketClient();
    }

    get message$(): Observable<any>{
        return this.ws.json$;
    }
    
    send( data: any ): void {
        return this.ws.send( data );
    }
    
    connect(): Promise<void> {
        return this.ws.open( this.url );
    }
    
    disconnect(): Promise<void> {
        return this.ws.close();
    }
    
    get isConnected(): boolean {
        return this.ws.opened;
    }
}
