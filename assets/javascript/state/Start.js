/**
 * Created by stryker on 2014.03.22..
 */
define(['module/HUD'],function(HUD){
    var _game = null,
        _nextState = null,
        _activationKey = null;
    
    //Start State
    var _Start = {                    
        create: function(){
            //creating the titel screen
            HUD.createTitle('Last of Us \nWASD & Left Mouse\nClick to Start');
            
            //Seeting up the Physics for the game
            _game.physics.startSystem(Phaser.Physics.ARCADE); 
            
            //Starting the next state(Play) after the spacebar is down
            _game.input.onDown.addOnce(function(){
                _game.state.start(_nextState);
            });
        }            
    }

    return{
        init: function(game,nextState){
            _game = game;
            _nextState = nextState;
        },
        getStartState: function(){
            return(_Start);
        }

    }
})