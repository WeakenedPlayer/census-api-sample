import { Census } from '@weakenedplayer/census-api';
import { NodeHttp, NodeWebsocket } from './modules';
import {  } from 'rxjs';
import { tap } from 'rxjs/operators';

// Rest API Query
let outfit: Census.RestQuery = new Census.RestQuery( 'outfit' );

outfit.where( 'outfit_id', t => {
    t.contains( '37512998641471064' );
} )
.join( 'character', ( join ) =>{
    join.on( 'leader_character_id' );
    join.to( 'character_id' );
    join.nest( 'faction' );
    join.nest( 'characters_world', ( join ) => {
        join.nest( 'world' );
    } );
});

// display query
console.log( outfit.toString() );

let api = new Census.RestApi( new NodeHttp() );
api.get( outfit )
.pipe( tap( res => {
    console.log( res );
} ) )
.subscribe();



let websocket = new NodeWebsocket();
let eventStream = new Census.EventStream( websocket );

websocket.connect().then( () => {
    eventStream.addEvent( [ Census.EventConstant.PlayerLogin ],
            Census.EventFilter.filterByWorld( Census.EventConstant.convertWorldName2Id( [ 'Connery' ] ) ) );    
    eventStream.playerLogin$.subscribe( event => {
        console.log( 'ID: ' + event.character_id + ' has been logged in.' );
    } );
} );

