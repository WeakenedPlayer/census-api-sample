import { Census } from '@weakenedplayer/census-api';
import { NodeHttp, NodeWebsocket } from './modules';
import {  } from 'rxjs';
import { tap } from 'rxjs/operators';

// Rest API Query
let outfit: Census.RestQuery = new Census.RestQuery( 'outfit' );
outfit.where( 'outfit_id', t => {
    t.equals( '37512998641471064' );
} )
.join( 'character', ( join ) =>{
    join.on( 'leader_character_id' );
    join.to( 'character_id' );
    join.nest( 'faction' );
    join.nest( 'characters_world', ( join ) => {
        join.nest( 'world' );
    } );
});

let api = new Census.RestApi( new NodeHttp() );
api.get( outfit )
.then( res => {
    console.log( '########################################');
    console.log('REST APIテスト: Outfit情報取得');
    console.log( '########################################');
    console.log( res );
} );

let websocket = new NodeWebsocket();
let eventStream = new Census.EventStream( websocket );
let filter = Census.EventFilter.filterByWorld( Census.EventConstant.convertWorldName2Id( [ 'connery' ] ) );

eventStream.connect().then( () => {
    console.log( '########################################');
    console.log( 'Event Streamテスト: Conneryログインモニタ' );
    console.log( '########################################');
    
    return eventStream.addEvent( [ Census.EventConstant.PlayerLogin ], filter );
} ).then( res => {
    console.log( res );
    eventStream.playerLogin$.subscribe( event => {
        console.log( event.character_id + ' がログインしました。' );
    } );    
} );
