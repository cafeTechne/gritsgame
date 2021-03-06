/*Copyright 2012 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/

EnergyCanisterClass = EntityClass.extend({
  physBody: null,
   init: function (x, y, settings) {
	this.parent(x, y, settings);
	var startPos = {x:x,y:y};
    var guid = newGuid_short();
    //create our physics body;
    var entityDef = {
      id: "EnergyCanister" + guid,
      type: 'static',
      x: startPos.x,
      y: startPos.y,
      halfHeight: 18 * 0.5,
      halfWidth: 19 * 0.5,
      damping: 0,
      angle: 0,
      categories: ['projectile'],
      collidesWith: ['player'],
      userData: {
        "id": "EnergyCanister" + guid,
        "ent": this
      }
    };
    this.physBody = gPhysicsEngine.addBody(entityDef);

    this.physBody.SetLinearVelocity(new Vec2(0, 0));
  },
  //-----------------------------------------
  kill: function () {
    //remove my physics body
    gPhysicsEngine.removeBodyAsObj(this.physBody);
    this.physBody = null;
    //destroy me as an ent.
    gGameEngine.removeEntity(this);
  },
  //-----------------------------------------
  onTouch: function (otherBody, point, impulse) {
    if (!this.physBody) return false;

    if (!otherBody.GetUserData()) return false; //invalid object??
    var physOwner = otherBody.GetUserData().ent;
    if (physOwner != null) {
      if (physOwner._killed) return false;
      if (physOwner.energy < physOwner.maxEnergy) 
        physOwner.energy = Math.min(physOwner.maxEnergy, physOwner.energy + 10);
      this.markForDeath = true;
      
    }

    return true; //return false if we don't validate the collision
  },

});

Factory.nameClassMap['EnergyCanister'] = EnergyCanisterClass;
