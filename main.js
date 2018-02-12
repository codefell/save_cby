var b2Vec2 = Box2D.Common.Math.b2Vec2
,   b2_pi = Box2D.Common.b2Settings.b2_pi
,   b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
,   b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint
,   b2AABB = Box2D.Collision.b2AABB
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
,   b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
,   b2ContactListener = Box2D.Dynamics.b2ContactListener
;

function MyContactListener() {
    this.BeginContact = function(contact) {
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        var bodyA = fixtureA.GetBody();
        var bodyB = fixtureB.GetBody();
        if (bodyA.GetUserData() == "castle" 
            && bodyB.GetUserData() == "princess"
            || bodyA.GetUserData() == "princess"
            && bodyB.GetUserData() == "castle") {
            gameOver("success");
        }
    }
    this.EndContact = function(contact) {
    }
    this.PreSolve = function(contact, manifold) {
    }
    this.PostSolve = function(contact, manifold) {
    }
}

function MyContactFilter() {
    this.ShouldCollide = function (fixture1, fixture2) {
        return false;
    }
}

function makeBoundBox()
{
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.allowSleep = false;
    bodyDef.position.Set(0, 0);
    var body = global.world.CreateBody(bodyDef);
    var fixDef = new b2FixtureDef;
    fixDef.density = 1;
    fixDef.friction = 0.3;
    fixDef.restitution = 1;

    fixDef.shape = new b2PolygonShape;

    fixDef.shape.SetAsOrientedBox(5.5, 1, new b2Vec2(-6.5, -11), 0);
    var downBoundSpriteLeft = makeRect(-6.5, -11, 11, 2, "wood.png", true);
    body.CreateFixture(fixDef);

    fixDef.shape.SetAsOrientedBox(5.5, 1, new b2Vec2(6.5, -11), 0);
    var downBoundSpriteRight = makeRect(6.5, -11, 11, 2, "wood.png", true);
    body.CreateFixture(fixDef);

    fixDef.shape.SetAsOrientedBox(12, 1, new b2Vec2(11, 0), b2_pi / 2);
    var rightBoundSprite = makeRect(11, 0, 2, 24, "wood.png", true);
    body.CreateFixture(fixDef);

    fixDef.shape.SetAsOrientedBox(12, 1, new b2Vec2(0, 11), 0);
    var upBoundSprite = makeRect(0, 11, 24, 2, "wood.png", true);
    body.CreateFixture(fixDef);

    fixDef.shape.SetAsOrientedBox(12, 1, new b2Vec2(-11, 0), b2_pi / 2);
    body.CreateFixture(fixDef);
    var leftBoundSprite = makeRect(-11, 0, 2, 24, "wood.png", true);

    var boundObj3D = new THREE.Object3D();
    boundObj3D.add(downBoundSpriteLeft);
    boundObj3D.add(downBoundSpriteRight);
    boundObj3D.add(rightBoundSprite);
    boundObj3D.add(upBoundSprite);
    boundObj3D.add(leftBoundSprite);
    global.scene.add(boundObj3D);
    global.boundObj = {obj3D: boundObj3D, body2D: body};
    global.obj.push(global.boundObj);
}

function makeCenter() {
    var bodyDef = new b2BodyDef;
    bodyDef.position.Set(0, 0);
    var body = global.world.CreateBody(bodyDef);
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(0.2, 0.2);
    fixDef.density = 1;
    fixDef.friction = 0.3;
    fixDef.restitution = 0.5;
    body.CreateFixture(fixDef);
    var groundObj3D = makeRect(0, 0, 0.4, 0.4, "wood.png");
    global.groundObj = {obj3D: groundObj3D, body2D: body};
    global.obj.push(global.groundObj);
}

function makeGround(userData) {
    var bodyDef = new b2BodyDef;
    bodyDef.position.Set(0, 0);
    var body = global.world.CreateBody(bodyDef);
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(5, 0.5);
    fixDef.density = 1;
    fixDef.friction = 0.3;
    fixDef.restitution = 0.5;
    body.CreateFixture(fixDef);
    body.SetUserData(userData);
    var groundObj3D = makeRect(0, -5, 10, 1, "wood.png");
    global.groundObj = {obj3D: groundObj3D, body2D: body};
    global.obj.push(global.groundObj);
}

function makeRectObj(x, y, w, h, vx, vy, angle, tex, 
    isStatic, userData) {
    var bodyDef = new b2BodyDef;
    bodyDef.type = isStatic ? 
        b2Body.b2_staticBody : b2Body.b2_dynamicBody;
    bodyDef.position.Set(x, y);
    bodyDef.linearVelocity.Set(vx, vy);
    bodyDef.angle = angle;
    var body = global.world.CreateBody(bodyDef);
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(w/2, h/2);
    fixDef.density = 1;
    fixDef.friction = 0.3;
    fixDef.restitution = 0.5;
    body.CreateFixture(fixDef);
    body.ResetMassData();
    bodySprite = makeRect(x, y, w, h, tex);
    body.SetUserData(userData);
    var obj = {obj3D: bodySprite, body2D: body};
    global.obj.push(obj);
    return obj;
}

function makeCircleObj(x, y, r, vx, vy, tex, isStatic, userData) {
    var bodyDef = new b2BodyDef;
    bodyDef.type = isStatic ? 
        b2Body.b2_staticBody : b2Body.b2_dynamicBody;
    bodyDef.position.Set(x, y);
    bodyDef.linearVelocity.Set(vx, vy);
    var body = global.world.CreateBody(bodyDef);
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2CircleShape(r);
    fixDef.density = 1;
    fixDef.friction = 0.3;
    fixDef.restitution = 0.5;
    body.CreateFixture(fixDef);
    body.SetUserData(userData);
    bodySprite = makeCircle(x, y, r, tex);
    var obj = {obj3D: bodySprite, body2D: body};
    global.obj.push(obj);
    return obj;
}

function setJointMotor(factor) {
    global.joint.SetMotorSpeed(factor * b2_pi * 1.2);
}

function makeJoint() {
    var jointDef = new b2RevoluteJointDef;
    jointDef.enableMotor = true;
    jointDef.motorSpeed = b2_pi / 9;
    jointDef.maxMotorTorque = 100000;
    jointDef.bodyA = global.groundObj.body2D;
    jointDef.bodyB = global.boundObj.body2D;
    jointDef.anchorPoint = global.groundObj.body2D.GetWorldCenter();
    global.joint = global.world.CreateJoint(jointDef);
}

$(function () {
    initScene("WebGLoutput");
    initEvent(); var gravity = new b2Vec2(0, -9.8);
    var doSleep = true;
    global.world = new b2World(gravity, doSleep);
    global.contactListener = new MyContactListener();
    //global.contactFilter = new MyContactFilter();
    global.world.SetContactListener(global.contactListener);
    //global.world.SetContactFilter(global.contactFilter)

    //makeGround("ground");

    makeCenter();
    makeBoundBox();
    makeJoint();

    makeRectObj(0, 2, 4, 4, 0, 0, b2_pi / 3, "monster.png");
    makeRectObj(0, 2, 3, 3, 0, 0, b2_pi / 3, "monster.png");
    makeRectObj(0, 2, 2, 2, 0, 0, b2_pi / 3, "monster.png");
    makeRectObj(0, 2, 2, 2, 0, 0, b2_pi / 3, "monster.png");
    makeCircleObj(0, 2, 2, 0, 0, "monster.png");
    makeCircleObj(0, 2, 1, 0, 0, "monster.png");
    global.princess = makeCircleObj(0, 2, 0.9, 0, 0, "cby.png", false, "princess");
    global.castle = makeRectObj(0, -25.5, 40, 2, 0, 0, 0, "castle.png", true, "castle");
    global.background = makeRect(0, 0, global.camera.right-global.camera.left, 
        global.camera.top - global.camera.bottom, "sky.jpeg");
    console.log(global.camera);
    global.background.position.z = -10;
    global.background.position.y = global.camera.position.y;
    global.castle.obj3D.scale.y = 2;
    global.addScale = 10;
    global.princess.obj3D.position.z = 1;
    global.princess.obj3D.scale.x = 1 + global.addScale;
    global.princess.obj3D.scale.y = 1 + global.addScale;

    global.scaleHandle = function () {
        global.addScale *= 0.95;
        global.princess.obj3D.scale.x = 1 + global.addScale;
        global.princess.obj3D.scale.y = 1 + global.addScale;
        if (Math.abs(global.addScale) < 0.001) {
            global.princess.obj3D.scale.x = 1;
            global.princess.obj3D.scale.y = 1;
            UpdateHandles.delHandle(global.scaleHandle);
        }
    };

    global.motorHandle = function () {
        setJointMotor($("#slider").val() / 100)
    };

    global.totalTime = 45;
    global.startTime = UpdateHandles.time;
    global.countTimeHandler = function () {
        var leftTime = global.startTime + global.totalTime
            - UpdateHandles.time;
        if (leftTime <= 0) {
            gameOver("failed");
            $("#leftTime").text("0");
        }
        else {
            $("#leftTime").text(Math.floor(leftTime));
        }
    };

    global.checkMissHandler = function () {
        var x = global.princess.obj3D.position.x;
        var y = global.princess.obj3D.position.y;
        var cx = global.camera.position.x;
        var cy = global.camera.position.y;
        if (x < cx + global.camera.left || x > cx + global.camera.right
            || y < cy + global.camera.bottom) {
            gameOver("miss");
        }
    };
    
    UpdateHandles.addHandle(global.motorHandle);
    UpdateHandles.addHandle(global.scaleHandle);
    UpdateHandles.addHandle(global.countTimeHandler);
    UpdateHandles.addHandle(global.checkMissHandler);

    UpdateHandles.addHandle(function () {
        if (UpdateHandles.deltaTime <= 0) {
            return;
        }
        global.world.Step(1/60, 6, 2);

        for (var i in global.obj) {
            if (!global.obj[i]) {
                continue;
            }
            var body = global.obj[i].body2D;
            var bodySprite = global.obj[i].obj3D;
            var pos = body.GetPosition();
            var angle = body.GetAngle();
            bodySprite.position.x = pos.x;
            bodySprite.position.y = pos.y;
            bodySprite.rotation.z = angle;
        }
    });
});

function gameOver(reason) {
    if (global.gameOver) {
        return;
    }
    global.gameOver = true;
    UpdateHandles.delHandle(global.motorHandle);
    UpdateHandles.delHandle(global.countTimeHandler);
    UpdateHandles.delHandle(global.checkMissHandler);
    setJointMotor(0);
    if (reason == "success") {
        popupSuccess();
        if (global.princess) {
            deleteObj(global.princess);
            global.princess = null;
        }
    }
    else if (reason == "failed") {
        popupFailed();
        global.princess.obj3D.material.map = 
            THREE.ImageUtils.loadTexture("monster.png");
        global.princess.obj3D.material.color = 
            new THREE.Color(0xff0000);
    }
    else if (reason == "miss") {
        popupMiss();
    }
}

function deleteObj(obj) {
    for (var i in global.obj) {
        if (obj == global.obj[i]) {
            global.scene.remove(obj.obj3D);
            global.world.DestroyBody(obj.body2D);
            global.obj[i] = null;
        }
    }
}
