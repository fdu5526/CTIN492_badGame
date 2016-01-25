/**
 * Created by stryker on 2014.03.05..
 * Player module
 */
define(['module/HUD'],function(HUD){

    //Private Variables
    var _game = null,
        _shootKey = null,
        _health = null,
        _lives = null,
        _score = null,
        _firingTime = null,
        _lastFireTime = null,
        _ship = null,
        _cursors = null,
        _bulletGroup = null,
        _bullet = null,
        _explosionGroup = null,
        _explosion = null,
        _alienGroup = null,
        _aliens = null,
        _shootingEvent = null,
        _canEscape = false,
        _soundGun = null,
        _soundHit = null,
        _bulletSpeed = null;

    var _fireBullet = function(){
        _bullet = _bulletGroup.getFirstExists(false);

        if(_bullet){
            _soundGun.play();

            //_bullet.lifespan = _game.height / (_bulletSpeed/1000);
            _bullet.checkWorldBounds = true;
            _bullet.reset(_ship.x,_ship.y+8);
            //_bullet.body.velocity.y = -_bulletSpeed;

            x = _game.input.mousePointer.x - _ship.x + _game.rnd.integerInRange(-30,30);
            y = _game.input.mousePointer.y - _ship.y + _game.rnd.integerInRange(-30,30);
            m = Math.sqrt(x * x + y * y);

            x = x / m * _bulletSpeed;
            y = y / m * _bulletSpeed;

            _bullet.body.velocity.x = x;
            _bullet.body.velocity.y = y;
            _bullet.angle = Math.atan2(y, x) * 180 / 3.14 + 90;
        }
    };

    var _collisionHandler = function(ship,bullet){

        ship.damage(bullet.bulletDamage);
        _soundHit.play();
        bullet.kill();
        HUD.updateHealthText(ship.health);
        
        //ship lose a life
        if(ship.health <= 0){            
            this.stopShooting();            
            _lives--;
            HUD.updateLivesText(_lives);
            
            //lose life
            if(_lives > 0){                
                ship.revive(_health);
                this.startShooting();
            //dead
            }else{
                _game.state.start('End');
            }
        }

    };

    return{
        init: function(game) {
            _game = game;            
        },
        preload: function() {
            _game.load.audio('music', 'assets/sounds/music.ogg');
            _game.load.image('ship', 'assets/img/player.png');
            _game.load.audio('gun', 'assets/sounds/gun.ogg');
            _game.load.audio('hitPlayer', 'assets/sounds/hitPlayer.ogg');
        },
        create: function(configuration) {
            _ship = _game.add.sprite(400,500,'ship');
            _ship.anchor.setTo(0.5,0.5);
            _game.physics.enable(_ship,Phaser.Physics.ARCADE);
            _ship.body.collideWorldBounds = true;
            _ship.health = configuration.health;
            _health = configuration.health;
            _lives = configuration.lives;
            _score = configuration.score;
            _firingTime = configuration.firingTime;
            _bulletSpeed = configuration.bulletSpeed;

            _soundGun = _game.add.audio('gun');
            _soundHit = _game.add.audio('hitPlayer');
            _music = _game.add.audio('music');
            _music.play();

            _cursors = _game.input.keyboard.createCursorKeys();
            _game.input.onDown.add(_fireBullet, this);
        },
        update: function() {
            _ship.body.velocity.setTo(0,0);

            if (_game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                _ship.body.velocity.x = -100;
            } else if (_game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                _ship.body.velocity.x = 100;
            }

            if (_game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                _ship.body.velocity.y = -100;
            }else if (_game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                _ship.body.velocity.y = 100;
            }   

            x = _ship.body.x;
            y = _ship.body.y;

            if (_canEscape && 
                290 < x && x < 500 &&
                0 < y && y < 150) {
                window.open('cutscene.html', '_self');
            }
        },
        setBulletGroup: function(bullets) {
            _bulletGroup = bullets.getBulletGroup();
        },
        getBulletGroup: function() {
            return _bulletGroup;
        },
        setExplosionGroup: function(explosions) {
            _explosionGroup = explosions.getExplosionGroup();
        },        
        startShooting: function() {
            //_shootingEvent = _game.time.events.loop(_firingTime,_fireBullet,this);
        },
        stopShooting: function() {
            _game.time.events.remove(_shootingEvent);
        },
        getPlayerShip: function() {
            return _ship;
        },
        canEscape: function () {
            if (!_canEscape) {
                _canEscape = true;
            }
        },
        createOverLap: function(bulletGroup) {
            _game.physics.arcade.overlap(_ship,bulletGroup,_collisionHandler,null,this);
        },
        setAliensAndAlienGroup: function(aliens) {
            _aliens = aliens;
            _alienGroup=aliens.getAlienGroup();
        }
    }
});