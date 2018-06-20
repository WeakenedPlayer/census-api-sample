import { Census } from '@weakenedplayer/census-api';
import { NodeHttp, NodeWebsocket } from './modules';

let api = new Census.RestApi( new NodeHttp() );
let query: Census.RestQuery = new Census.RestQuery( 'outfit' );
query.where( 'outfit_id', t => {
    t.contains( '37512998641471064' );
} );

// [1] Faction
query.join( 'character', factionJoin => {
    factionJoin.on( 'leader_character_id' );    
    factionJoin.to( 'character_id' );
    factionJoin.nest( 'faction' )
} );

//[2] World
query.join( 'characters_world', worldJoin =>{
    worldJoin.on( 'leader_character_id' );    
    worldJoin.to( 'character_id' );
    worldJoin.nest( 'world' );
} );

api.get( query )
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
