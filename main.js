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
,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
;

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

    fixDef.shape.SetAsOrientedBox(12, 1, new b2Vec2(0, -11), 0);
    var downBoundSprite = makeRect(0, -11, 24, 2, "wood.png", true);
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
    boundObj3D.add(downBoundSprite);
    boundObj3D.add(rightBoundSprite);
    boundObj3D.add(upBoundSprite);
    boundObj3D.add(leftBoundSprite);
    global.scene.add(boundObj3D);
    global.boundObj = {obj3D: boundObj3D, body2D: body};
    global.obj.push(global.boundObj);
}

function makeGround() {
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

function makeRectObj(x, y, w, h, vx, vy, angle, tex) {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
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
    global.obj.push({obj3D: bodySprite, body2D: body});
}

function makeCircleObj(x, y, r, vx, vy, color) {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.Set(x, y);
    bodyDef.linearVelocity.Set(vx, vy);
    var body = global.world.CreateBody(bodyDef);
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2CircleShape(r);
    fixDef.density = 1;
    fixDef.friction = 0.3;
    fixDef.restitution = 0.5;
    body.CreateFixture(fixDef);
    bodySprite = makeCircle(x, y, r, color);
    global.obj.push({obj3D: bodySprite, body2D: body});
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
    initEvent();

    var gravity = new b2Vec2(0, -9.8);
    var doSleep = true;
    global.world = new b2World(gravity, doSleep);

    makeGround();
    makeBoundBox();
    makeJoint();

    makeRectObj(0, 2, 4, 4, 0, 0, b2_pi / 3, "cby.png");
    makeRectObj(0, 2, 3, 3, 0, 0, b2_pi / 3, "cby.png");
    makeRectObj(0, 2, 2, 2, 0, 0, b2_pi / 3, "cby.png");
    makeRectObj(0, 2, 2, 2, 0, 0, b2_pi / 3, "cby.png");
    makeCircleObj(0, 2, 0.5, 0, 0, 0xff0000);
    makeCircleObj(0, 2, 1, 0, 0, 0xff0000);
    makeCircleObj(0, 2, 0.5, 0, 0, 0xff0000);
    makeCircleObj(0, 2, 1, 0, 0, 0xff0000);

    var stepNum = 1200;
    UpdateHandles.addHandle(function () {
        if (UpdateHandles.deltaTime <= 0) {
            return;
        }
        if (true) {
            global.world.Step(1/60, 6, 2);

            for (var i in global.obj) {
                var body = global.obj[i].body2D;
                var bodySprite = global.obj[i].obj3D;
                var pos = body.GetPosition();
                var angle = body.GetAngle();
                bodySprite.position.x = pos.x;
                bodySprite.position.y = pos.y;
                bodySprite.rotation.z = angle;
            }
        }
    });
});
