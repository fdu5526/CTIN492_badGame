define(function(){
    var _game = null;
    
    var _explosions = function(quantity,type){
        var _explosions = _game.add.group();
        _explosions.createMultiple(quantity,type);
        _explosions.forEach(setupexplosions,this);
        
        var _type = type;
        
        function setupexplosions(explosion){
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add(type);
        }
        
        return{
            getExplosionGroup: function(){
                return _explosions;
            }
        }
        
    }
    
    return{
        init: function(game){
            _game = game;
        },
        preload: function(){
            _game.load.spritesheet('kaboom','assets/img/explode.png',128,128);
        },
        create: function(quantity,type){
            return( new _explosions(quantity,type));
        }
    }
});